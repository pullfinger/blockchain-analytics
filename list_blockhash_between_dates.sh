# usage: ./list_blockhash_between_dates.sh "2015-03-01 00:00:00 -0800" "2015-03-02 00:00:00 -0800"
start_date=$1
end_date=$2
block_height_low=`echo $start_date | ./get_blockheight_by_date.sh`
block_height_hi=`echo $end_date | ./get_blockheight_by_date.sh`
num_blocks=`expr $block_height_hi - $block_height_low`
./list_blockhash.sh $num_blocks $block_height_low