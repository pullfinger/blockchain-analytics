while read jsonwithhex; do
hexscript="null"
hexscript=`echo $jsonwithhex|jq -c '{ hex }'|awk -F: '{ print($2)}'|sed 's/[\"\}]//g'`
if [ "$hexscript" != "null" ];
then
    decodedscript=`bitcoin-cli decodescript "$hexscript"`;
    combinedjson=`echo $jsonwithhex $decodedscript`
else
    decodedscript="{\"asm\":null,\"type\":null,\"p2sh\":null} "
    combinedjson=`echo $jsonwithhex $decodedscript`
fi

echo $combinedjson|sed 's/} {/\,/g'
done;

