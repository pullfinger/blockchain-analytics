# usage: bitcoin-cli getrawtransaction "reallylongtxid" 1 | jq -f detail_transaction.jq

def sum(f): reduce .[] as $row (0; . + ($row|f) );

{
    "bitcoin": (sum(.satoshi) / 100000000)
    , "output_count": sum(.output_count)
    , "min_time": min .time
    , "max_time": max .time
}