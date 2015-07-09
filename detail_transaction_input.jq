#usage: ./list_blockhash.sh 2 355000 | ./list_blockhash_txid.sh| ./raw_transaction_multi.sh | jq -c -f ./detail_transaction_input.jq
{
    "blockhash": .blockhash
    , "time": .time
    , "blocktime": .blocktime
    , "txid": .txid
    , "vout_count": .vout[] | length
    , "vin": .vin[]
}
|
{
    "blockhash": .blockhash
    , "time": .time
    , "blocktime": .blocktime
    , "txid": .txid
    , "vout_count": .vout_count
    , "coinbase": .vin.coinbase
    , "vin_txid": .vin.txid
    , "vin_vout": .vin.vout
    , "sequence": .vin.sequence
    , "hex": .vin.scriptSig.hex
}