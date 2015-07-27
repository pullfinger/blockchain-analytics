#!/usr/bin/env node

//usage: node src/list_txid_between_dates --startdate=`date -j -f %Y%m%d%H%M%S 20150701000000 +%s` --enddate=`date -j -f %Y%m%d%H%M%S 20150702000000 +%s`
// 2 months ago to 1 month ago
// july 1 2015 local time
// date -j -f %Y%m%d%H%M%S 20150701000000

var argv = require('yargs').argv
var bulkchain = require('../lib/bulkchain.js')

list_txid_between_dates(argv.startdate, argv.enddate, function(txidlist) {
    setTimeout(function() {
        console.log(JSON.stringify(txidlist))
    })
})


//TEST results
// polkstreet:blockchain-analytics cole$ starttime=`date +%s`;./list_blockhash_between_dates.sh "2015-06-01 00:00:00 -0700" "2015-06-30 00:00:00 -0700"| ./list_blockhash_txid.sh|wc -l; endtime=`date +%s`; expr $endtime - $starttime
//  3359369
// seconds 291
// polkstreet:blockchain-analytics cole$ starttime=`date +%s`;node src/list_txid_between_dates.js --startdate=`date -j -f %Y%m%d%H%M%S 20150601000000 +%s` --enddate=`date -j -f %Y%m%d%H%M%S 20150630000000 +%s`|jq -r .|grep \"|sed 's/"//'|sed 's/ //g'|sed 's/\"//g'|sed 's/,//g'|wc -l;endtime=`date +%s`; expr $endtime - $starttime
//  3359369
// seconds 182
