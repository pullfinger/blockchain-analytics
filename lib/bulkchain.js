var config = require(__dirname + '/../config/options.js');

var async = require('async')
var bitcoin = require('bitcoin')

var client = new bitcoin.Client({
  host: config.bitcoind_host,
  user: config.bitcoind_rpc_user,
  pass: config.bitcoind_rpc_pass,
  timeout: 30000
});

module.exports = getlatestblockcount = function getlatestblockcount( callback ) {
    client.getBlockCount( function(err, blockcount, resHeaders) {
        callback(null, blockcount)
    })
}

module.exports = getblockhash = function getblockhash( blockcount, callback) {
    setTimeout(
        client.getBlockHash( blockcount, function(err, blockhash, resHeaders) {
            callback(null, blockhash)
        })
    , 0)
}

module.exports = getblocktime = function getblocktime( blockcount, callback) {
    setTimeout(function () {
        client.getBlockHash( blockcount, function(err, blockhash, resHeaders) {
            client.getBlock( blockhash, function(err, block, resHeaders) {
                parseblocktime( block, function(err, blocktime, resHeaders) {
                    callback(null, blocktime)
                })
            })
        })
    }, 0)
}

module.exports = getblock = function getblock( blockhash, callback) {
    setTimeout(function () {
        client.getBlock( blockhash, function(err, block, resHeaders) {
            callback(null, block)
        })
    }, 0)
}

module.exports = parseblocktime = function parseblocktime( block, callback) {
    setTimeout(function () {
        callback(null, block.time)
    }, 0)
}

module.exports = blockcount_by_date = function blockcount_by_date( unixtime, callback) {
    setTimeout(function () {
        async.series(
            {
                latestblocktime: latestblocktime,
                latestblockcount: getlatestblockcount
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
                        function while_test() {
                            return low < high - 1
                        },
                        function narrow_search_boundary(callback) {
                            halfdistance = parseInt(( high - low ) / 2)
                            midpoint = halfdistance + low
                            getblocktime( parseInt(low + ((high - low) / 2)), function (err, blocktime) {
                                if (blocktime > unixtime) {
                                    high = parseInt(low + ((high - low) / 2))
                                    setTimeout(callback, 0)
                                }                            
                                else{
                                    low = parseInt(low + ((high - low) / 2))
                                    setTimeout(callback, 0)
                                }
                            })
                        },
                        function search_ended(err, guess) {
                            getblocktime( parseInt(low) , function (err, blocktime) {
                                if (blocktime <= unixtime) {
                                    callback(low)
                                }
                            })
                        }
                    )
                }
            }
        )
    }, 0)
}

var latestblocktime = async.compose(parseblocktime, getblock, getblockhash, getlatestblockcount);

module.exports = list_blockhash_between_dates = function list_blockhash_between_dates( startdate, enddate, callback) {
    hasharr = []
    setTimeout(function () {
        async.series({
            startblock: function(callback){
                setTimeout(function(){
                    blockcount_by_date( startdate , function (blockcount) {
                        callback(null, blockcount)
                    })
                }, 0)
            },
            endblock: function(callback){
                setTimeout(function(){
                    blockcount_by_date( enddate , function (blockcount) {
                        callback(null, blockcount)
                    })
                }, 0)
            },
        },
        function (err, blockcountrange) {
            var blockcount = blockcountrange.startblock
            async.whilst(
                function () {
                    return blockcount <= blockcountrange.endblock
                },
                function (callback) {
                    getblockhash( blockcount , function (err, blockhash) {
                        hasharr.push(blockhash)
                        blockcount++
                        setTimeout(callback, 0)
                    })
                }
                ,
                function () {
                    callback(hasharr)
                }
            )
        }
    )},0)
}

module.exports = list_txid_by_blockhash = function list_txid_by_blockhash( blockhash, callback) {
    setTimeout( function() {
    getblock( blockhash, function(err, blockcontent) {
        callback(blockcontent.tx)
        })
    }, 0)
}

module.exports = list_txid_between_dates = function list_txid_between_dates( startdate, enddate, callback) {
    txidarr = []
    setTimeout(function () {
        async.series({
            startblock: function(callback){
                setTimeout(function(){
                    blockcount_by_date( startdate , function (blockcount) {
                        callback(null, blockcount)
                    })
                }, 0)
            },
            endblock: function(callback){
                setTimeout(function(){
                    blockcount_by_date( enddate , function (blockcount) {
                        callback(null, blockcount)
                    })
                }, 0)
            },
        },
        function (err, blockcountrange) {
            var blockcount = blockcountrange.startblock
            async.whilst(
                function () {
                    return blockcount <= blockcountrange.endblock
                },
                function (callback) {
                    getblockhash( blockcount , function (err, blockhash) {
                        list_txid_by_blockhash(blockhash, function(txidlist) {
                            blockcount++
                            async.map(txidlist, function(txid) {
                                txidarr.push(txid)
                            }) 
                            setTimeout(callback, 0)
                        })
                    })
                }
                ,
                function () {
                    callback(txidarr)
                }
            )
        }
    )},0)
}

module.exports = raw_tx_between_dates = function raw_tx_between_dates( startdate, enddate, callback) {
    txidarr = []
    setTimeout(function () {
        async.series({
            startblock: function(callback){
                setTimeout(function(){
                    blockcount_by_date( startdate , function (blockcount) {
                        callback(null, blockcount)
                    })
                }, 0)
            },
            endblock: function(callback){
                setTimeout(function(){
                    blockcount_by_date( enddate , function (blockcount) {
                        callback(null, blockcount)
                    })
                }, 0)
            },
        },
        function (err, blockcountrange) {
            var blockcount = blockcountrange.startblock
            async.whilst(
                function () {
                    return blockcount <= blockcountrange.endblock
                },
                function (callback) {
                    getblockhash( blockcount , function (err, blockhash) {
                        list_txid_by_blockhash(blockhash, function(txidlist) {
                            blockcount++
                            async.map(txidlist, function(txid) {
                                txidarr.push(txid)
                            }) 
                            setTimeout(callback, 0)
                        })
                    })
                }
                ,
                function () {
                    callback(txidarr)
                }
            )
        }
    )},0)
}
