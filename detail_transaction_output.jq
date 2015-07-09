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
    , "vout_scriptPubKey_asm": .vout.scriptPubKey.asm
    , "vout_scriptPubKey_reqsigs": .vout.scriptPubKey.reqSigs
    , "vout_scriptPubKey_type": .vout.scriptPubKey.type
    , "vout_scriptPubKey_address_count": [ .vout.scriptPubKey.addresses[] ] | length
    , "vout_scriptPubKey_addresses": [ .vout.scriptPubKey.addresses[] ]
}
