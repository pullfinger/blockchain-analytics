// usage: ./list_blockhash_between_dates.sh "2015-03-01 00:00:00 -0800" "2015-03-01 01:00:00 -0800" | ./list_blockhash_txid.sh| ./raw_transaction_multi.sh | jq -c -f ./detail_transaction_output.jq | node append_timeinfo.js
// 0800 is pacific time zone.


var moment = require('moment')

// currently runs in local time only
// need a parameter for timezone offset
function appendLocalTime (line) {
    lineitem = {}
    lineitem = JSON.parse(line)
    ltz_time = moment.unix(lineitem.time)
    lineitem.ltz_time = ltz_time.toString()
    lineitem.timezone_offset_hours = lineitem.time_second= ltz_time.format("ZZ")
    lineitem.ltz_year = ltz_time.format("YYYY")
    lineitem.ltz_quarter = ltz_time.format("Q")
    lineitem.ltz_month = ltz_time.format("MM")
    lineitem.ltz_day_of_month = ltz_time.format("DD")
    lineitem.ltz_day_of_year = ltz_time.format("DDDD")
    lineitem.ltz_day_of_week = ltz_time.format("d")
    lineitem.ltz_week_of_year = ltz_time.format("ww")
    lineitem.ltz_year_of_week = ltz_time.format("gggg")
    lineitem.ltz_hour = ltz_time.format("HH")
    lineitem.time_minute = ltz_time.format("mm")
    lineitem.time_second = ltz_time.format("ss")
    process.stdout.write(JSON.stringify(lineitem));
}
process.stdin
.pipe(require('split')())
.on('data', appendLocalTime)