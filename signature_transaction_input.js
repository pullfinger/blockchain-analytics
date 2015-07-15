// // echo 7275eb1918dcf95d73937511373b49de60381f2a4f2f5fa0ea166e8c1e9b3f3c | ./raw_transaction_multi.sh |jq -c -f ./detail_transaction_input.jq | ./decode_input_hexscript.sh| jq -c -f detail_transaction_input_decode.jq | ./get_transaction_input_content.sh | jq -c -f detail_transaction_input_logic.jq |  jq -c -f signature_transaction.jq | node signature_transaction.js

var ss = require('simple-statistics');

function calculateStats (line) {
    transaction = {}
    lineitem = JSON.parse(line)
    transaction.txid = lineitem.txid
    transaction.time = lineitem.time
    transaction.type = lineitem.type
    transaction.satoshi_sum = parseInt(ss.sum(lineitem.satoshi))
    transaction.satoshi_count = parseInt(lineitem.satoshi.length)
    transaction.satoshi_mean = parseInt(ss.mean(lineitem.satoshi) + .5)
    transaction.satoshi_median = parseInt(ss.median(lineitem.satoshi))
    transaction.satoshi_mode = parseInt(ss.mode(lineitem.satoshi))
    transaction.vin_txid_count = lineitem.vin_txid.length
    transaction.satoshi_count = lineitem.satoshi.length
    process.stdout.write(JSON.stringify(transaction));
    //process.stdout.write(JSON.stringify(lineitem));
}

process.stdin
.pipe(require('split')())
.on('data', calculateStats)

//https://www.npmjs.com/package/simple-statistics
