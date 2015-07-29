# usage:  sh time_trials/test_daterange_to_rawtransactions.sh

echo "node version"
starttime=`date +%s`;node src/daterange_to_rawtransactions.js --startdate=`date -j -f %Y%m%d%H%M%S 20150715000000 +%s` --enddate=`date -j -f %Y%m%d%H%M%S 20150716000000 +%s`| jq -c '.txid'|wc -l; endtime=`date +%s`; echo "seconds "`expr $endtime - $starttime`;

echo "trainwreck version"
starttime=`date +%s`; ./list_blockhash_between_dates.sh "2015-07-15 00:00:00 -0700" "2015-07-16 00:00:00 -0700"|./list_blockhash_txid.sh| ./raw_transaction_multi.sh| jq -c . |wc -l; endtime=`date +%s`; echo "seconds "`expr $endtime - $starttime`;