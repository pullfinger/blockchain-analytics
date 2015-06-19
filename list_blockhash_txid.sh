# usage: echo (reallyblockhash) | ./list_blockhash_txid.sh
# then pipe results (example gets latest block):
# ./list_blockhash.sh | ./list_blockhash_txid.sh | detail_transaction_multi.sh

while read blockhash ; do
    bitcoin-cli getblock "$blockhash" | \
    jq '.tx' | \
        sed 's/[, \"]//g' | \
        sed 's/\[//g'|sed 's/\]//g'| \
        grep --line-buffered .
done;

# DRY this should really accept input from raw_block_multi.sh