// echo 7275eb1918dcf95d73937511373b49de60381f2a4f2f5fa0ea166e8c1e9b3f3c | ./raw_transaction_multi.sh |jq -c -f ./detail_transaction_input.jq | ./decode_input_hexscript.sh| jq -c -f detail_transaction_input_decode.jq | ./get_transaction_input_content.sh | jq -c -f detail_transaction_input_logic.jq |  jq -c -f signature_transaction.jq | node signature_transaction.js
var JSONStream = require('JSONStream')
var es = require('event-stream')
var crypto = require('crypto');
var arrTxid = new Array()
var arrTxInputDedup = new Array()
//var ss = require('simple-statistics');

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function arrangeListsPerTxid (line) {
    if ( line )
    {
        lineobj = {}
        lineobj = JSON.parse(line)
        txid = lineobj.txid
        if ( lineobj.txid ) 
        {
        inputid = JSON.stringify(txid).concat(JSON.stringify(lineobj.vin_txid), JSON.stringify(lineobj.vin_vout)).replace(/\"/g, "")
            if(!(txid in arrTxid)) {
                if (arrTxid[0])
                {
                    oldtxid = arrTxid[0].txid
                    console.log(JSON.stringify(arrTxid[oldtxid]))
                    arrTxid = []
                }
                arrTxInputDedup = []
                 // THIS ASSUMES ORDER BY TXID!!!!
                arrTxid.push( arrTxid[txid] = {} )
                arrTxid[txid].txid = txid
                arrTxid[txid].vin_txid = []
                arrTxid[txid].vin_vout = []
                arrTxid[txid].satoshi = []
                arrTxid[txid].time = lineobj.time
                arrTxid[txid].type = lineobj.type
                arrTxid[txid].vout_count = lineobj.vout_count
            }
            if(!(inputid in arrTxInputDedup)) {
                arrTxInputDedup.push( arrTxInputDedup[inputid] = {})
                arrTxInputDedup[inputid].inputid = inputid;
                arrTxid[txid].vin_txid.push(lineobj.vin_txid)
                arrTxid[txid].vin_vout.push(lineobj.vin_vout)
                arrTxid[txid].satoshi.push(lineobj.satoshi)
            }
        }
    }
    else
    {    
        console.log(JSON.stringify(arrTxid[txid]))
    }
}

process.stdin
.pipe(require('split')())
.on('data', arrangeListsPerTxid)

//https://www.npmjs.com/package/simple-statistics
