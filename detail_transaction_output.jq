{
    "blockhash": .blockhash
    , "time": .time
    , "blocktime": .blocktime
    , "txid": .txid
    , "vout": .vout[]
}
|
{
    "blockhash": .blockhash
    , "time": .time
    , "blocktime": .blocktime
    , "txid": .txid
    , "vout_n": .vout.n
    , "satoshi": ((.vout.value * 100000000) + .5) | floor
}