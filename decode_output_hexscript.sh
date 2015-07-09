# ./list_blockhash.sh 2 355000 | ./list_blockhash_txid.sh| ./raw_transaction_multi.sh | jq -c -f ./detail_transaction_output.jq | ./decode_output_hexscript.sh | jq .
# this script seem to represent only information that is also found elswhere in the output.  thus probably worthless.

while read jsonwithhex; do
    hexscript="null"
    hexscript=`echo $jsonwithhex|jq -c '{ vout_scriptPubKey_hex }'|awk -F: '{ print($2)}'|sed 's/[\"\}]//g'`
    if [ "$hexscript" != "null" ];
    then
        decodedscript=`bitcoin-cli decodescript "$hexscript"`;
        combinedjson=`echo $jsonwithhex $decodedscript`
    else
        decodedscript=""
        combinedjson=`echo $jsonwithhex $decodedscript`
    fi
    echo $combinedjson|sed 's/} {/\,/g'
done;

