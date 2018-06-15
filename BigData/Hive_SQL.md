#Hive_Sql

##### 修改列的名字、类型、位置、注释：
- ALTER TABLE table_name CHANGE [COLUMN] col_old_name col_new_name column_type [COMMENT col_comment] [FIRST|AFTER column_name]

##### 建表
```
CREATE [TEMPORARY] [EXTERNAL] TABLE [IF NOT EXISTS] [db_name.]table_name    -- (Note: TEMPORARY available in Hive 0.14.0 and later)
  [(col_name data_type [COMMENT col_comment], ... [constraint_specification])]
  [COMMENT table_comment]
  [PARTITIONED BY (col_name data_type [COMMENT col_comment], ...)]
  [CLUSTERED BY (col_name, col_name, ...) [SORTED BY (col_name [ASC|DESC], ...)] INTO num_buckets BUCKETS]
  [SKEWED BY (col_name, col_name, ...)                  -- (Note: Available in Hive 0.10.0 and later)]
     ON ((col_value, col_value, ...), (col_value, col_value, ...), ...)
     [STORED AS DIRECTORIES]
  [
   [ROW FORMAT row_format]
   [STORED AS file_format]
     | STORED BY 'storage.handler.class.name' [WITH SERDEPROPERTIES (...)]  -- (Note: Available in Hive 0.6.0 and later)
  ]
  [LOCATION hdfs_path]
  [TBLPROPERTIES (property_name=property_value, ...)]   -- (Note: Available in Hive 0.6.0 and later)
  [AS select_statement];   -- (Note: Available in Hive 0.5.0 and later; not supported for external tables)
```

##### sqoop
```
MySql加载代码
sqoop eval --connect "jdbc:mysql://192.168.1.1:3306/xxx" --username "xxx" --password "xxx" --query "TRUNCATE TABLE TABLE_NAME";

sqoop export -D mapred.child.java.opts="-Djava.security.egd=file:/dev/../dev/urandom" \
  --connect "jdbc:mysql://192.168.1.1:3306/xxx?useUnicode=true&characterEncoding=utf8" \
  --username "xxx" \
  --password "xxx" \
  --input-null-string '\\N'  --input-null-non-string '\\N' \
  --table xxx \
  --export-dir /user/hive/warehouse/xxx/xxx \
  --input-fields-terminated-by '\001';

MySql==>Hive
sqoop import \
--connect "jdbc:mysql://xxx:3306/xxx?useUnicode=true&characterEncoding=utf8" \
--username "xxx" \
--password "xxx" \
--table xxx \
--where "xxx='2018-04' and 1=1" \
--delete-target-dir \
--hive-import \
--hive-database xxx \
--hive-table xxx \
--hive-partition-key xxx \
--hive-partition-value '2018-04' \
--null-string '\\N' \
--null-non-string '\\N' \
--m 1

MySql==>HDFS 在hive中查看需要load data (local) inpath 'xxx' into table xxx
sqoop import \
--connect "jdbc:mysql://xxx:3306/xxx?useUnicode=true&characterEncoding=utf8" \
--username "xx" \
--password "xxx" \
--table xxx \
--where "data_month='2018-05' and 1=1" \
--target-dir '/xxx/xxx/xxx=2018-04' \
--delete-target-dir \
--null-string '\\N' \
--null-non-string '\\N' \
--m 1

--query "select * from xxx where xxx" \  #table|query二选一
--delete-target-dir xxx 删除目标目录
--append 追加
--m 1 map数量控制 必须指定split-by的列才能用多个map
--split-by "mod(cast(substr(reverse(contractno),1,1) as int),10)" 尽量均匀分布保证多map时的均衡
--hive-drop-import-delims  导入到hive时删除 \n, \r, and \01
```

- No primary key could be found for table xxx. Please specify one with --split-by or perform a sequential import with '-m 1'
- 1.将你的map个数设置为1（Sqoop默认是4）
- 2.使用--split-by，后面跟上表的最后一列名字,从而能够对数据进行分行

#####sqoop优化
表大的时候需要设置多个mapper，并设置分片字段。
1、如果分片字段是连续增加的主键，数据是相对会均匀的。
2、如果分片字段的最大值和最小值偏离绝大部分的数据，会导致数据不均匀。可以将分片字段设置成一个表达式。

下面的举例：分10个mapper，分片字段取为合同号最后一位的整型值，每个mapper的数据量是相当均匀的。

sqoop import --connect 'jdbc:oracle:thin:@xx.xx.xx.xx:1521/xxx' \
--username 'xxx' \
--password 'xxx' \
--target-dir '/user/xxx/xxx' \
--delete-target-dir \
--null-string '\\\\N' \
--null-non-string '\\\\N' \
--split-by "mod(cast(substr(reverse(contractno),1,1) as int),10)" \
--m 10 \
--query "select * from xxx" \


##### SMBJoin
- smb是sort merge bucket操作，首先进行排序，继而合并，然后放到所对应的bucket中去，bucket是hive中和分区表类似的技术，就按照key进行hash，相同的hash值都放到相同的buck中去

##### hive月处理
- select add_months('2017-01-01',1);
- hive2.0 months_betweeen

##### show
- show tables like *xxx*
- show partitions xx.xxx

##### 开窗求累计
- 默认省略的字句BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
- select shop_id, stat_date, ordamt, sum(ordamt) over(partition by shop_id order by stat_date)
- 先按stat_date排序，窗口就是比当前stat_date小的行到当前stat_date的行。

#####ROW_NUMBER()
- ROW_NUMBER() OVER(PARTITION BY COLUMN ORDER BY COLUMN)

#### Select
```
SELECT [ALL | DISTINCT] select_expr, select_expr, ...
FROM table_reference
[WHERE where_condition]
[GROUP BY col_list [HAVING condition]]
[   CLUSTER BY col_list | [DISTRIBUTE BY col_list] [SORT BY| ORDER BY col_list] ]
[LIMIT number]
```

##### ORDER BY与SORT BY的不同
- ORDER BY 全局排序，只有一个Reduce任务
- SORT BY 只在本机做排序


##### 不支持EXIST
- 不支持EXIST ,NOT EXIST

##### HAVING
必须在group by后面使用

##### 开窗函数的sum
```
SELECT cookieid,
createtime,
pv,
SUM(pv) OVER(PARTITION BY cookieid ORDER BY createtime) AS pv1, -- 默认为从起点到当前行
SUM(pv) OVER(PARTITION BY cookieid ORDER BY createtime ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS pv2, --从起点到当前行，结果同pv1
SUM(pv) OVER(PARTITION BY cookieid) AS pv3,        --分组内所有行
SUM(pv) OVER(PARTITION BY cookieid ORDER BY createtime ROWS BETWEEN 3 PRECEDING AND CURRENT ROW) AS pv4, --当前行+往前3行
SUM(pv) OVER(PARTITION BY cookieid ORDER BY createtime ROWS BETWEEN 3 PRECEDING AND 1 FOLLOWING) AS pv5, --当前行+往前3行+往后1行
SUM(pv) OVER(PARTITION BY cookieid ORDER BY createtime ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING) AS pv6 ---当前行+往后所有行
FROM xxx;

PRECEDING：往前
FOLLOWING：往后
CURRENT ROW：当前行
UNBOUNDED：起点，UNBOUNDED PRECEDING 表示从前面的起点， UNBOUNDED FOLLOWING：表示到后面的终点
```

##### 开窗函数
```
出现窗口子句,必须指定Order By子句, 如:
last_value(sal) over
(partition by deptno order by sal rows between unbounded preceding and unbounded following)
以上示例指定窗口为整个分组.

当省略窗口子句时:
a) 如果存在Order By则默认的窗口是unbounded preceding and current row
b) 如果同时省略Order By则默认的窗口是unbounded preceding and unbounded following

如果省略分组,则把全部记录当成一个组:
a) 如果存在Order By则默认窗口是unbounded preceding and current row
b) 如果这时省略Order By则窗口默认为unbounded preceding and unbounded following
```

- LAG | LEAD
( <col>, <line_num>, <DEFAULT> )
OVER ( [ PARTITION BY ] [ ORDER BY ] )
FIRST_VALUE | LAST_VALUE 语法

- FIRST_VALUE | LAST_VALUE
( <col>,<ignore nulls as boolean> ) OVER
( [ PARTITION BY ] [ ORDER BY ][ window_clause ] )

- RANK() OVER (ORDER BY column_name DESC ignore NULLS LAST) 失败
- ignore nulls as boolean  ignore nulls as true 失败

##### Tab字符问题
- -file命令支持执行的文件里有Tab字符
- 标准的sql里面不支持有Tab字符
