read read_date;
# usage: echo "2015-01-01 00:00:00 -0700" | ./get_blockheight_by_date.sh
# alt usage:  date +%Y-%m-%d" "%H:%M:%S" "%z | ./get_blockheight_by_date.sh 
# -0800 means Pacific time zone.
target_date=`date -jf "%Y-%m-%d %H:%M:%S %z" "$read_date"`
if [ "$target_date" == "" ]; then
     echo "error:  try this -> echo 2011-01-01 00:00:00 -0700 | ./get_blockheight_by_date.sh"
fi

target_timestamp=`date -jf "%Y-%m-%d %H:%M:%S %z" "$read_date" +%s`
latest_blockheight=`bitcoin-cli getblockcount`
latest_blockhash=`bitcoin-cli getblockhash $latest_blockheight`
latest_block_timestamp=`bitcoin-cli getblock $latest_blockhash | jq '.time'`
if [ $latest_block_timestamp -lt $target_timestamp ]; then
    echo $latest_blockhash
else
    upper_boundary_block_height=`expr $latest_blockheight`
    lower_boundary_block_height=1
    half_the_distance=-1
    while [ $half_the_distance != 0 ]
    do 
        the_distance=`expr $upper_boundary_block_height - $lower_boundary_block_height`
        half_the_distance=`expr $the_distance / 2`
        midpoint_block_height=`expr $lower_boundary_block_height + $half_the_distance`
        midpoint_blockhash=`bitcoin-cli getblockhash $midpoint_block_height`
        midpoint_block_timestamp=`bitcoin-cli getblock $midpoint_blockhash | jq '.time'`
        if [ $midpoint_block_timestamp -lt $target_timestamp ]
        then 
            lower_boundary_block_height=$midpoint_block_height
            lower_boundary_blockhash=`bitcoin-cli getblockhash $lower_boundary_block_height`
        else
            upper_boundary_block_height=$midpoint_block_height
            upper_boundary_blockhash=`bitcoin-cli getblockhash $upper_boundary_block_height`
        fi
    done
    echo $upper_boundary_block_height
fi