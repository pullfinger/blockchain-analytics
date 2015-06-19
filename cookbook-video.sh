
echo "**********  what is the latest blockhash?  **************"
./list_blockhash.sh 

echo "**********  how about the latest 12 blockhash?  **************"
./list_blockhash.sh 12

echo "**********  what is the latest block header?  **************"
./list_blockhash.sh | ./raw_block_multi.sh

echo "**********  how about a twelver of block headers?  **************"
./list_blockhash.sh 12 | ./raw_block_multi.sh

echo "**********  same twelver through our jq transform  **************"
./list_blockhash.sh 12 | ./raw_block_multi.sh | jq -f detail_block.jq

echo "**********  same twelver with the -c for compact  **************"
./list_blockhash.sh 12 | ./raw_block_multi.sh | jq -c -f detail_block.jq

echo "**********  latest block worth of transaction ids?  **************"
./list_blockhash.sh | ./list_blockhash_txid.sh

echo "**********  latest 12 blocks worth of transaction ids?  **************"
./list_blockhash.sh 12 | ./list_blockhash_txid.sh

echo "**********  first 100 blocks worth of transaction ids?  **************"
./list_blockhash.sh 100 0 | ./list_blockhash_txid.sh

echo "**********  first 100 blocks worth of actual transactions headers  ******"
./list_blockhash.sh 100 0 | \
    ./list_blockhash_txid.sh | \
    ./raw_transaction_multi.sh
sleep 1
echo '********** those were the days...'

echo "**********  first 100 blocks worth of actual transaction headers "
echo "**********- with logic  **************"
./list_blockhash.sh 100 0 | \
    ./list_blockhash_txid.sh | \
    ./raw_transaction_multi.sh | \
    jq -c -f detail_transaction.jq

echo "**********  latest 2 blocks worth of actual transaction headers"
echo "**********  - with logic  **************"

./list_blockhash.sh 2 | \
    ./list_blockhash_txid.sh | \
    ./raw_transaction_multi.sh | \
    jq -c -f detail_transaction.jq

