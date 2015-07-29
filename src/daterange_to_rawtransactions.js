var argv = require('yargs').argv
var bulkchain = require('../lib/bulkchain.js')
var async = require('async')

daterange_to_rawtransactions(argv.startdate, argv.enddate, function (rawtransactions) {
    async.map(rawtransactions, function (rawtransaction) {
        console.log(JSON.stringify(rawtransaction))
    })
    
})