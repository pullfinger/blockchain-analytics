# usage: bitcoin-cli getrawtransaction "reallylongtxid" 1 | jq -f detail_transaction.jq
# ir this: ./list_blockhash_between_dates.sh "2015-03-01 00:00:00 -0800" "2015-03-01 01:00:00 -0800" | ./list_blockhash_txid.sh| ./raw_transaction_multi.sh | jq -c -f ./detail_transaction.jq | jq -s -f ./summary_transaction.jq

{
    "bitcoin": map(.satoshi / 100000000) | add
    , "transaction_count": . | length
    , "block_count": map(.blockhash) | unique | length
    , "output_count": map(.output_count) | add
    , "min_time": min .time
    , "max_time": max .time
}