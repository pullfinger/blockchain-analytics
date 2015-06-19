# usage: ./list_blockhash.sh | ./list_block_txid.sh | ./detail_transaction_some.sh
while read txid ; do
    bitcoin-cli getrawtransaction "$txid" 1
done;
