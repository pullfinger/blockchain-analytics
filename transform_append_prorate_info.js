// usage: ./list_blockhash_between_dates.sh "2015-03-01 00:00:00 -0800" "2015-03-01 01:00:00 -0800" | ./list_blockhash_txid.sh| ./raw_transaction_multi.sh | jq -c -f ./detail_transaction_output.jq | node transform_prorate.js [days|months|years|hours|blocks] (what) ### (how many) 'en|fr' (locale)
// example: ... | jq -c -f ./detail_transaction_output.jq | ./node.js transform_prorate_satoshi.js months 

var moment = require('moment')

// currently runs in local time only
// need a parameter for timezone offset
function appendProrateInfo (line) {
    lineitem = {}
    lineitem = JSON.parse(line)
    lineitem.ltz_fact_time = moment.unix(lineitem.time)
    lineitem.ltz_end_of_p0 = moment.unix(lineitem.time).endOf(process.argv[2]).toString()
    lineitem.ltz_end_of_pn = 
    
    lineitem.periodicity = process.argv[2]
    lineitem.num_periods = process.argv[3]
    lineitem.p0_timeshare = 0.0
    lineitem.px_timeshare = 0.0
    lineitem.pn_timeshare = 0.0
    process.stdout.write(JSON.stringify(lineitem));
}
process.stdin
.pipe(require('split')())
.on('data', appendProrateInfo)

    // day / days
    // week / weeks
    // month / months
    // year / years
