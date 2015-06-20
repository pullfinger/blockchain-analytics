# ./list_blockhash_between_dates.sh "2015-03-01 00:00:00 -0800" "2015-03-01 01:00:00 -0800"|./list_blockhash_txid.sh| ./raw_transaction_multi.sh | jq -f detail_transaction.jq|jq -s -f summary_transaction.jq
{
    "blockhash": .blockhash
    , "time" : .time
    , "blocktime" : .blocktime
    , "txid": .txid
    , "satoshi": [((.vout[].value * 100000000) + .5) | floor] | add
    , "output_count": [.vout[].value] | length
    , "avg_satoshi_per_output": [((.vout[].value * 100000000) + .5) | floor] | ((add / length) + .5 ) | floor
}