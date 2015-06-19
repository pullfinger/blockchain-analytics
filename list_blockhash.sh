# usage: ./list_blockhash.sh [howmanyblocks] [startblockheight]
# then pipe results example: ./list_blockhash.sh 100| ./list_blockhash_txid.sh

howmanyblocks=$1
startblockheight=$2
currentblockheight=`bitcoin-cli getblockcount`

if [ "$howmanyblocks" == "" ];
then
    howmanyblocks=1
fi

if [ "$startblockheight" == "" ];
then
    startblockheight=`expr $currentblockheight - $howmanyblocks`
fi

endblockheight=`expr $startblockheight - 1 + $howmanyblocks`

if [ $endblockheight -gt $currentblockheight ]; then
    endblockheight=$currentblockheight
fi

workingblockheight=$startblockheight

while [ $workingblockheight -le $endblockheight ]; do
    bitcoin-cli getblockhash $workingblockheight
    workingblockheight=`expr $workingblockheight + 1`
done
