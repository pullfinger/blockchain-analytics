# option 1: by number of blocks starting with blockheight
# ./list_blockhash.sh 2 355000 | ./list_blockhash_txid.sh| ./raw_transaction_multi.sh | jq -c -f ./detail_transaction_input.jq | ./decode_hexscript.sh| jq -c -f detail_transaction_input_decode.jq | ./get_transaction_input_content.sh|jq -c -f detail_transaction_input_logic.jq| jq -s -c -f summary_transaction_input.jq
# option 2: by start date, end date
# ./list_blockhash_between_dates.sh "2015-06-01 00:00:00 -0000" "2015-06-02 00:00:00 -0000" | ./list_blockhash_txid.sh| ./raw_transaction_multi.sh | jq -c -f ./detail_transaction_input.jq | ./decode_hexscript.sh| jq -c -f detail_transaction_input_decode.jq | ./get_transaction_input_content.sh|jq -c -f detail_transaction_input_logic.jq| jq -s -c -f summary_transaction_input.jq

{
    "bitcoin": map( .vin_satoshi / 100000000 ) | add
    , "block_count": map(.blockhash) | unique | length
    , "transaction_count": map(.txid) | unique | length 
    , "inputtransaction_count": map(.vin_txid) | unique | length 
    , "input_count": . | length
    , "min_time": min .time
    , "max_time": max .time
    , "days_destroyed": map(.days_destroyed / 100000000 ) | add
}

