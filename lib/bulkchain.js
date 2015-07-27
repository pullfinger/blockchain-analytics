var config = require(__dirname + '/../config/options.js');

var async = require('async')
var bitcoin = require('bitcoin')

var client = new bitcoin.Client({
  host: config.bitcoind_host,
  user: config.bitcoind_rpc_user,
  pass: config.bitcoind_rpc_pass,
  timeout: 30000
});

module.exports = getblockcount = function getblockcount( callback ) {
    client.getBlockCount( function client_getblockcount (err, blockcount) {
        callback(null, blockcount)
    })
}

module.exports = getblockhash = function getblockhash( blockcount, callback) {
    client.getBlockHash( blockcount, function client_getblockhash(err, blockhash) {
        callback(null, blockhash)
    })
}

module.exports = getblock = function getblock( blockhash, callback) {
    client.getBlock( blockhash, function client_getblock(err, block) {
        callback(null, block)
    })
}

module.exports = getblocktime = function blockcount_to_blocktime( blockcount, callback) {
    getblockhash(blockcount, function blockcount_to_blockhash(err, blockhash) {
        getblock(blockhash, function blockhash_to_block(err, block) {
            callback(null, block.time)
        })
    })
}

module.exports = date_to_blockcount = function date_to_blockcount( unixtime, callback) {
    async.series(
        {
            latestblocktime: latestblocktime,
            latestblockcount: getblockcount
        }
        , function narrowing_search(err, startingpoint) {
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
                    function divide_search_area(callback) {
                        halfdistance = parseInt(( high - low ) / 2)
                        midpoint = halfdistance + low
                        getblocktime( parseInt(low + ((high - low) / 2)), 
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
                    function search_ended(err, guess) {
                        getblocktime( parseInt(low) , 
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

var latestblocktime = async.compose(getblocktime, getblockcount)

module.exports = blockhash_to_txid = function blockhash_to_txid( blockhash, callback) {
    getblock( blockhash, function blockhash_to_block(err, blockcontent) {
        callback(blockcontent.tx)
    })
}

module.exports = list_txid_between_dates = function list_txid_between_dates( startdate, enddate, callback) {
    txidarr = []
    async.series({
        startblock: function startblock(callback){
                date_to_blockcount( startdate , function ship_blockcount(blockcount) {
                    callback(null, blockcount)
                })
        },
        endblock: function endblock(callback){
                date_to_blockcount( enddate , function ship_blockcount(blockcount) {
                    callback(null, blockcount)
                })
        },
    },
    function many_blockcount_to_txid(err, blockcountrange) {
        var blockcount = blockcountrange.startblock
        async.whilst(
            function check_if_done () {
                return blockcount <= blockcountrange.endblock
            },
            function many_blockhash_to_txid (callback) {
                getblockhash( blockcount , function blockcount_to_blockhash (err, blockhash) {
                    blockhash_to_txid(blockhash, function fill_txid_array (txidlist) {
                        blockcount++
                        async.map(txidlist, function push_txid(txid) {
                            txidarr.push(txid)
                        }) 
                        setTimeout(callback, 0)
                    })
                })
            }
            ,
            function ship_txids() {
                callback(txidarr)
            }
        )
    })
}
