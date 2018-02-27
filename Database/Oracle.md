# Oracle

### sqlldr
#### .ctl控制文件格式
```sql
LOAD DATA LOCAl INFILE '/home/cloud/kettle/cust.csv'
INTO TABLE op_mobile_backflow_20170223
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
ignore 1 lines
(mobile);
```
