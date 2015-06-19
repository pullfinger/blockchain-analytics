# usage: bitcoin-cli getblock "$blockhash" | jq -f detail_block.jq
{
    "hash": .hash
    ,"size": .size
    ,"height": .height
    ,"version": .version
    ,"merkleroot": .merkleroot
    ,"tx_count": [.tx[]] | length
    ,"time": .time
    ,"nonce": .nonce
    ,"bits": .bits
    ,"difficulty": .difficulty
    ,"chainwork": .chainwork
    ,"previousblockhash": .previousblockhash
}