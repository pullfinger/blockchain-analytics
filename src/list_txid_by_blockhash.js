//usage: date -v-1m +%s | node src/blockcount_by_date.js
//        block height exactly one month ago
//  date -j -f "%Y-%m-%d" "2010-10-02" "+%s" | node src/blockcount_by_date.js
//        any date converted to unix time

var readline = require('readline')
var bulkchain = require('../lib/bulkchain.js')

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', function(line){
    list_txid_by_blockhash(line, function(txidlist) {
        setTimeout(console.log(JSON.stringify([].concat.apply(txidlist))), 0)
    })
})