// usage
// date -v-1m +%s | node src/blockcount_by_date.js| jq .
// gives you the blockcount exactly one month ago

var readline = require('readline')
var async = require('async')
var bitcoin = require('bitcoin')

var client = new bitcoin.Client({
  host: '127.0.0.1',
  // dev creds, must move to config file prior to production.'
  user: 'RIPPLE',
  pass: 'r1pp1e',
  timeout: 30000
});

function getlatestblockcount( callback ) {
    setTimeout(function () {
        client.getBlockCount( function(err, blockcount, resHeaders) {
            callback(null, blockcount)
        })
    }, 0)
}

function getblockhash( blockcount, callback) {
    setTimeout(function () {
        client.getBlockHash( blockcount, function(err, blockhash, resHeaders) {
            callback(null, blockhash)
        })
    }, 0)
}

function getblocktime( blockcount, callback) {
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

function getblock( blockhash, callback) {
    setTimeout(function () {
        client.getBlock( blockhash, function(err, block, resHeaders) {
            callback(null, block)
        })
    }, 0)
}

function parseblocktime( block, callback) {
    setTimeout(function () {
        callback(null, block.time)
    }, 0)
}

var latestblocktime = async.compose(parseblocktime, getblock, getblockhash, getlatestblockcount);

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', function(line){
    async.series(
        {
            latestblocktime: function(callback){
                setTimeout(function(){
                    latestblocktime( function (err, result) {
                       callback(null, result)
                    });
                }, 0);
            },
            latestblockcount: function(callback){
                setTimeout(function(){
                    getlatestblockcount( function (err, result) {
                       callback(null, result)
                    });
                }, 0);
            }
        }
        , function (err, startingpoint) {
            guess = {}
            if (parseInt(line) >= startingpoint.latestblocktime) {
                guess.blockcount = startingpoint.latestblockcount
            }
            else
            {
                var low = 1
                var high = startingpoint.latestblockcount
                async.whilst(
                    function () {
                        return low < (high - 1)
                    },
                    function (callback) {
                        halfdistance = parseInt(( high - low ) / 2)
                        midpoint = halfdistance + low
                        getblocktime( parseInt(low + ((high - low) / 2)), function (err, blocktime) {
                            if (blocktime > parseInt(line)) {
                                high = parseInt(low + ((high - low) / 2))
                                setTimeout(callback, 0)
                            }                            
                            else{
                                low = parseInt(low + ((high - low) / 2))
                                setTimeout(callback, 0)
                            }
                        })
                    },
                    function (err, guess) {
                        getblocktime( parseInt(low) , function (err, blocktime) {
                            if ( blocktime <= line ) {
                                console.log(JSON.stringify(low))
                            }
                        })
                    } //
                )     //  *   *  *  **  * * *    *
            }         //  ** ** * * * * * * *   * *
        }             //  * * * * * * * * * *   * *
    )                 //  *   *  *  **  *** ***  *
})                    //
