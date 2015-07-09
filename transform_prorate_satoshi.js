// usage: ./list_blockhash_between_dates.sh "2015-03-01 00:00:00 -0800" "2015-03-01 01:00:00 -0800" | ./list_blockhash_txid.sh| ./raw_transaction_multi.sh | jq -c -f ./detail_transaction_output.jq | node transform_prorate.js [days|months|years|hours|blocks] (what) ### (how many)
// example: ... | jq -c -f ./detail_transaction_output.jq | ./node.js transform_prorate_satoshi.js months 


var moment = require('moment')

// currently runs in local time only
// need a parameter for timezone offset
function appendProrateInfoSatoshi (line) {
    lineitem = {}
    lineitem = JSON.parse(line)
    process.stdout.write(JSON.stringify(lineitem));
}
process.stdin
.pipe(require('split')())
.on('data', prorateSatoshi)