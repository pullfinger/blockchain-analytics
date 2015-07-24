#!/usr/bin/env node

//usage: node src/list_blockhash_between_dates --startdate=`date -j -f %Y%m%d%H%M%S 20150701000000 +%s` --enddate=`date -j -f %Y%m%d%H%M%S 20150702000000 +%s`
// 2 months ago to 1 month ago
// july 1 2015 local time
// date -j -f %Y%m%d%H%M%S 20150701000000

var argv = require('yargs').argv
var bulkchain = require('../lib/bulkchain.js')

list_blockhash_between_dates(argv.startdate, argv.enddate, function(blockhash) {
    setTimeout(function() {
        console.log(blockhash)
    })
    
})


