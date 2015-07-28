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

module.exports = txid_to_rawtransaction = function txid_to_rawtransaction( txid, callback) {
    client.getRawTransaction( txid, 1, function client_txid_to_rawtransaction(err, transactionjson) {
        if (transactionjson) {
            setTimeout( function() {
                console.log(JSON.stringify(transactionjson))
            })
        }
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
                                    txid_to_rawtransaction(txid)
                                })
                                setTimeout(callback, 0)
                            })
                        }
                    )
                }
                // ,
                // function ship_txid() {
                //     callback(txidarr)
                // }
            )
        }
    )
}
