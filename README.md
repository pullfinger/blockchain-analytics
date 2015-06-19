# blockchain-analytics
bitcoin-cli versus jq for fast streaming bulk analysis of fhe bitcoin blockchain

OSX Safari owners, here's a 3 minute MOV screencast (200MB) showing above commands in action:
http://fa213cf3b0655b019941-5d6bc35513629a60cc1bfa251350258f.r59.cf2.rackcdn.com/bitcoinclivsjq.mov

### installation
```git clone https://github.com/pullfinger/blockchain-analytics.git```

install jq https://github.com/stedolan/jq/releases
(tested on jq 1.5)

other things you may need:  
awk
sed
grep 
bitcoind andbitcoin-cli

### usage:
start your bitcoind: ``` bitcoind --txindex -daemon```

from the blockchain-analytics folder run these commands to gain fu:


The latest blockhash

```./list_blockhash.sh ```

list the latest 12 blockhashes

```./list_blockhash.sh 12```

The latest raw block header

```./list_blockhash.sh | ./raw_block_multi.sh```

The latest twelver of block headers

```./list_blockhash.sh 12 | ./raw_block_multi.sh```

piped through our jq transform (aka raison d'etre)

```./list_blockhash.sh 12 |./raw_block_multi.sh | jq -f detail_block.jq```

same twelver with the -c for compact 
```./list_blockhash.sh 12 | ./raw_block_multi.sh | jq -c -f detail_block.jq```

latest block worth of transaction ids
```./list_blockhash.sh | ./list_blockhash_txid.sh```

latest 12 blocks worth of transaction ids
```./list_blockhash.sh 12 | ./list_blockhash_txid.sh```

first 100 blocks worth of transaction ids
```./list_blockhash.sh 100 0 | ./list_blockhash_txid.sh```

first 100 blocks worth of raw transaction headers

```./list_blockhash.sh 100 0 |
    ./list_blockhash_txid.sh |
    ./raw_transaction_multi.sh ```

lets pipe it through some logic
```
./list_blockhash.sh 100 0 |
    ./list_blockhash_txid.sh |
    ./raw_transaction_multi.sh |
    jq -c -f detail_transaction.jq
```
