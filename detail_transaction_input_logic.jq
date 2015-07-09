# ./list_blockhash.sh 2 355000 | ./list_blockhash_txid.sh| ./raw_transaction_multi.sh | jq -c -f ./detail_transaction_input.jq | ./decode_hexscript.sh| jq -f detail_transaction_input_decode.jq | jq -f detail_transaction_input_decode.jq

{
    "blockhash": .blockhash
    , "time": .time
    , "blocktime": .blocktime
    , "txid": .txid
    , "vout_count": .vout_count
    , "coinbase": .coinbase
    , "vin_txid": .vin_txid
    , "vin_vout": .vin_vout
    , "sequence": .sequence
    , "hex": .hex
    , "asm": .asm
    , "p2sh": .p2sh
    , "type": .type
    , "vin_blockhash": .vin_blockhash
    , "vin_time": .vin_time
    , "vin_blocktime": .vin_blocktime
    , "satoshi": .satoshi
    , "days_destroyed": (if .vin_time > 0 then (.time - .vin_time) * .satoshi / ( 60 * 60 * 24 ) else 0 end)
}