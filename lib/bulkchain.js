var config = require(__dirname + '/../config/options.js');
var async = require('async')
var bitcoin = require('bitcoin')

var client = new bitcoin.Client({
  host: config.bitcoind_host,
  user: config.bitcoind_rpc_user,
  pass: config.bitcoind_rpc_pass,
  timeout: 30000
});

var getblockcount = function getblockcount( callback ) {
    client.getBlockCount( function client_getblockcount (err, blockcount) {
        callback(null, blockcount)
    })
}

var blockcount_to_blockhash = function blockcount_to_blockhash( blockcount, callback) {
    client.getBlockHash( blockcount, function client_blockcount_to_blockhash(err, blockhash) {
        callback(null, blockhash)
    })
}

var blockcount_to_blocktime = function blockcount_to_blocktime( blockcount, callback) {
    blockcount_to_blockhash(blockcount, function blockcount_to_blockhash(err, blockhash) {
        blockhash_to_block(blockhash, function blockhash_to_block(err, block) {
            callback(err, block.time)
        })
    })
}

var date_to_blockcount = function date_to_blockcount( unixtime, callback) {
    async.series(
        {
            latestblocktime: latestblocktime,
            latestblockcount: getblockcount
        }
        , function search_for_blockcount(err, startingpoint) {
            guess = {}
            if (unixtime >= startingpoint.latestblocktime) {
                guess.blockcount = startingpoint.latestblockcount
            }
            else
            {
                var low = 1
                var high = startingpoint.latestblockcount
                async.whilst(
                    function check_if_done() {
                        return low < high - 1
                    },
                    function bifurcate(callback) {
                        halfdistance = parseInt(( high - low ) / 2)
                        midpoint = halfdistance + low
                        blockcount_to_blocktime( parseInt(low + ((high - low) / 2)),
                            function drop_half(err, blocktime) {
                                if (blocktime > unixtime) {
                                    high = parseInt(low + ((high - low) / 2))
                                    setTimeout(callback, 0)
                                }
                                else{
                                    low = parseInt(low + ((high - low) / 2))
                                    setTimeout(callback, 0)
                                }
                            }
                        )
                    },
                    function bullseye_blockcount(err, guess) {
                        blockcount_to_blocktime( parseInt(low) ,
                            function ship_guarded_result(err, blocktime) {
                            if (blocktime <= unixtime) {
                                callback(low)
                            }
                        })
                    }
                )
            }
        }
    )
}

var latestblocktime = async.compose(blockcount_to_blocktime, getblockcount)

var blockhash_to_txid = function blockhash_to_txid( blockhash, callback) {
    blockhash_to_block( blockhash, function blockhash_to_block(err, blockcontent) {
        if (blockcontent) {
            callback(blockcontent.tx)
        }
        else {
            callback()
        }
        
    })
}

var blockhash_to_block = function blockhash_to_block( blockhash, callback) {
    client.getBlock( blockhash, function client_getblock(err, block) {
        callback(null, block)
    })
}

module.exports = daterange_to_txidlist = function daterange_to_txidlist( startdate, enddate, callback) {
    txidarr = []
    async.series(
        {
            startblock: function startblock(callback){
                    date_to_blockcount( startdate ,
                        function blockcount(blockcount) {
                            callback(null, blockcount)
                        }
                )
            },
            endblock: function endblock(callback){
                date_to_blockcount( enddate , 
                    function blockcount(blockcount) {
                        callback(null, blockcount)
                    }
                )
            }
        }
        ,
        function blockcount_range_to_txid(err, blockcountrange) {
            var blockcount = blockcountrange.startblock
            async.whilst(
                function check_if_done () {
                    return blockcount <= blockcountrange.endblock
                },
                function blockcount_to_txid (callback) {
                    blockcount_to_blockhash( blockcount ,
                        function x_blockhash_to_txid (err, blockhash) {
                            blockhash_to_txid(blockhash, function fill_txid_array (txidlist) {
                                blockcount++
                                async.map(txidlist, function push_txid(txid) {
                                    txidarr.push(txid)
                                })
                                setTimeout(callback, 0)
                            })
                        }
                    )
                }
                ,
                function ship_txid() {
                    callback(txidarr)
                }
            )
        }
    )
}

module.exports = daterange_to_rawtransactions = function daterange_to_rawtransactions( startdate, enddate, callback) {
    rawtransactions = []
    
    var q_rawtransactions = async.queue(function (task, callback) {
        client.getRawTransaction( task.txid, 1, function (err, rawtransaction) {
            if (rawtransaction !== undefined) {
                rawtransactions.push(rawtransaction)
            }
            else
            {
                //bitcoind probably too busy, so requeue with preference
                q_rawtransactions.unshift({txid: task.txid}, function (err) {});
            }
            callback(rawtransactions);
        })
    }, 5);
    
    
    async.series(
        {
            startblock: function startblock(callback){
                    date_to_blockcount( startdate ,
                        function blockcount(blockcount) {
                            callback(null, blockcount)
                        }
                )
            },
            endblock: function endblock(callback){
                date_to_blockcount( enddate , 
                    function blockcount(blockcount) {
                        callback(null, blockcount)
                    }
                )
            }
        }
        ,
        function blockcount_range_to_txid(err, blockcountrange) {
            var blockcount = blockcountrange.startblock
            async.whilst(
                function check_if_done () {
                    return blockcount <= blockcountrange.endblock
                },
                function blockcount_to_txid (callback) {
                    blockcount_to_blockhash( blockcount ,
                        function x_blockhash_to_txid (err, blockhash) {
                            blockhash_to_txid(blockhash, function fill_txid_array (txidlist) {
                                blockcount++
                                async.map(txidlist, function queue_txid(txid) {
                                    q_rawtransactions.push({txid: txid}, function (err) {
                                    });
                                })
                                setTimeout(callback, 0)
                            })
                        }
                    )
                }
                ,
                function ship_rawtransactions() {
                    q_rawtransactions.drain = function() {
                        callback(rawtransactions)
                    }
                }
            )
        }
    )
}
