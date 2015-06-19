# usage: echo (reallylongblockhash) | .detail_block_multi.sh
# example latest 100 blocks:
# then pipe results example: ./list_blockhash.sh 100| ./detail_block_multi.sh
while read blockhash ; do
    bitcoin-cli getblock "$blockhash"
done;
