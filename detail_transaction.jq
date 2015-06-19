# usage: bitcoin-cli getrawtransaction "reallylongtxid" 1 | jq -f detail_transaction.jq
{
    "blockhash": .blockhash
    , "txid": .txid
    , "satoshi": [((.vout[].value * 100000000) + .5) | floor] | add
    , "output_count": [.vout[].value] | length
    , "avg_satoshi_per_output": [((.vout[].value * 100000000) + .5) | floor] | ((add / length) + .5 ) | floor
}