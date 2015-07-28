var argv = require('yargs').argv
var bulkchain = require('../lib/bulkchain.js')

// daterange_to_blockcountrange(argv.startdate, argv.enddate, function(txidlist) {
//     setTimeout(function() {
//         console.log(JSON.stringify(txidlist))
//     })
// })

daterange_to_txidlist(argv.startdate, argv.enddate, function(txidlist) {
    setTimeout(function() {
        console.log(JSON.stringify(txidlist))
    })
})



// var daterange_to_blockrange = function daterange_to_blockrange( startdate, enddate, callback) {
//     blockrange = {}
//     date_to_blockcount( startdate , function(blockcount) {
//         blockrange.startblock = blockcount
//         date_to_blockcount( enddate, function(blockcount) {
//             blockrange.endblock = blockcount
//             callback(blockrange)
//         })
//     })
// }