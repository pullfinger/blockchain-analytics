var bitcoin = require('bitcoin')
var async = require('async')

var client = new bitcoin.Client({
  host: '127.0.0.1',
  port: 8332,
  // dev creds, must move to config file prior to production.'
  user: 'bitcoinrpc',
  pass: '9XtkJR1yyjn4iXwxCZLypdW75E5FG3mjNH4RZXVoWCLx',
  timeout: 30000
});

function getblockcount( target_unix_time, callback ) {
    setTimeout(function () {
        console.log("target_unix_time: ", parseInt(target_unix_time))
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
        console.log("block.time:       ", block.time)
        callback(null, block.time)
    }, 0)
}

function getlatestblocktime (current_unix_time ) {
    return async.compose(
        parseblocktime,
        getblock,
        getblockhash,
        getblockcount
    )
}

var getmostrecentblocktime = getlatestblocktime()

process.stdin
.on('data', getmostrecentblocktime)

