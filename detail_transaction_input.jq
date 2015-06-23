{
    "blockhash": .blockhash
    , "time": .time
    , "blocktime": .blocktime
    , "txid": .txid
    , "vin": .vin[]
}
|
{
    "blockhash": .blockhash
    , "time": .time
    , "blocktime": .blocktime
    , "txid": .txid
    , "coinbase": .vin.coinbase
    , "vin_txid": .vin.txid
    , "vin_vout": .vin.vout
    , "sequence": .vin.sequence
    , "hex": .vin.scriptSig.hex
}