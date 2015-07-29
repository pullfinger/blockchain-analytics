var argv = require('yargs').argv
var bulkchain = require('../lib/bulkchain.js')

daterange_to_txidlist(argv.startdate, argv.enddate, function(txidlist) {
    setTimeout(function() {
        console.log(txidlist)
    })
})