# usage: bitcoin-cli getrawtransaction "reallylongtxid" 1 | jq -f detail_transaction.jq

# or this ./list_blockhash_between_dates.sh "2015-03-01 00:00:00 -0700" "2015-03-01 01:00:00 -0700" | ./list_blockhash_txid.sh| ./raw_transaction_multi.sh | jq -c -f ./detail_transaction_output.jq| jq -s -f ./summary_transaction_output.jq

# ./raw_transaction_multi.sh | jq -c -f ./detail_transaction_output.jq| jq -s -f ./summary_transaction_output.jq
{
    "bitcoin": map( .satoshi / 100000000 ) | add
    , "transaction_count": map(.txid) | unique | length 
    , "block_count": map(.blockhash) | unique | length
    , "output_count": . | length
    , "min_time": min .time
    , "max_time": max .time
}