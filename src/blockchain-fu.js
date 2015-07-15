var readline = require('readline');
var async = require('async')
var bitcoin = require('bitcoin')

var client = new bitcoin.Client({
  host: '127.0.0.1',
  // dev creds, must move to config file prior to production.'
  user: 'RIPPLE',
  pass: 'r1pp1e',
  timeout: 30000
});

function getblockcount( callback ) {
    setTimeout(function () {
        client.getBlockCount( function(err, blockcount, resHeaders) {
            callback(null, parseInt(blockcount))
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

var latestblocktime = async.compose(parseblocktime, getblock, getblockhash, getblockcount);

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', function(line){
    async.series(
        {
            targetunixtime: function(callback){
                setTimeout(function(){
                    callback(null, line);
                }, 0);
            },
            latestblocktime: function(callback){
                setTimeout(function(){
                    latestblocktime( function (err, result) {
                       callback(null, result)
                    });
                }, 0);
            }
        }
        , function (err, results) {
            console.log(results)
    })
})