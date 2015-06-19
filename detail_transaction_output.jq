# okay ladies, do like this:
# bitcoin-cli getrawtransaction "reallylongtxid" 1 | jq -f detail_transaction_output.jq
{ 
    "time": .["time"]
    , "txid": .["txid"]
    , "vout": .vout[]
    , "blockhash"
    , "blocktime"
} | 
{ 
    "time": .time
    , "txid": .txid
    , "vout_n": .vout.n
    , "vout_satoshi": ((.vout.value * 100000000) + .5) | floor
}

