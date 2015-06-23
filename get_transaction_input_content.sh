#usage: ./list_blockhash.sh 2 355000 | ./list_blockhash_txid.sh| ./raw_transaction_multi.sh | jq -c -f ./detail_transaction_input.jq | ./decode_hexscript.sh| jq -c -f detail_transaction_input_decode.jq | ./get_transaction_input_content.sh|jq -c .

while read detail_transaction_input_decode; do
    raw_prevout=""
    n=`echo $detail_transaction_input_decode|jq -c .vin_vout|sed 's/\"//g'`
    vin_txid=`echo $detail_transaction_input_decode|jq -c '.vin_txid'|sed 's/\"//g'`
    if [ $n != 'null' ];
    then
        raw_prevout=`bitcoin-cli getrawtransaction $vin_txid 1 | jq -c -f detail_transaction_output.jq | \
            jq -c --arg n $n 'if .vout_n == ($n | tonumber) then . else empty end' | \
            jq -c '{"vin_blockhash":.blockhash ,"vin_time":.time,"vin_blocktime":.blocktime,"vin_satoshi":.satoshi }'`
    else
        raw_prevout="{\"vin_blockhash\":null,\"vin_time\":null,\"vin_blocktime\":null,\"vin_satoshi\":null}"
    fi
    combined_json=`echo $detail_transaction_input_decode $raw_prevout`
    echo $combined_json|sed 's/} {/\,/g'
done;
