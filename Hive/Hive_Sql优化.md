#Hive_Sql优化
#整理

##### Hive架构

<http://www.cnblogs.com/shishanyuan/p/4721403.html>

```
两大类组件
客户端组件：Hive CLI、Beeline CLI、JDBC/ODBC、Web GUI
服务端组件：Driver（含Complier、Optimizer、Executor）
             Metastore，一般为独立的Mysql
             Thrift Server
```

```
优点：
1.Hive 使用类SQL 查询语法, 最大限度的实现了和SQL标准的兼容，大大降低了传统数据分析人员学习的曲线；
2.使用JDBC 接口/ODBC接口，开发人员更易开发应用；
3.以MR作为计算引擎、HDFS 作为存储系统，为超大数据集设计的计算/ 扩展能力；
4.统一的元数据管理（Derby、MySql等），并可与Pig 、Presto 等共享；

缺点：
1.Hive 的HQL 表达的能力有限，有些复杂运算用HQL 不易表达；
2.由于Hive自动生成MapReduce 作业， HQL 调优困难；
3.粒度较粗，可控性差
```

##### Hive SQL执行步骤：

- 语法解析            sql文本  ->  Unresolved LogicalPlan
- 语义解析            Unresolved LogicalPlan  ->  resolved LogicalPlan
- 优化                resolved LogicalPlan  ->  optimized LogicalPlan
- 产生物理计划        LogicalPlan  ->  PhysicalPlan
- 产生可执行物理计划  PhysicalPlan  ->  可执行PhysicalPlan
- execute


##### 设计原则
```
1.hive适合大吞吐量的操作，不适合细粒度、状态更新的操作
  考虑系统是否使用hive？
  Hive处理数据时需要数据不可变，不支持事务。后续版本：有限的事务支持。
2.合适的数据类型
  适合tinyint（1字节）的字段不要设计成int（4字节），大数据量上，存储消耗和内存消耗就很明显。
3.合适的数据存储格式
  textFiile，默认格式，数据不做压缩，磁盘开销大，数据解析开销大。
  可结合Gzip、Bzip2使用（系统自动检查，执行查询时自动解压），但使用这种方式，hive不会对数据进行切分，从而无法对数据进行并行操作。
  SequenceFile，是Hadoop API提供的一种二进制文件支持，其具有使用方便、可分割、可压缩的特点。
  SequenceFile支持三种压缩选择：NONE, RECORD, BLOCK。 Record压缩率低，一般建议使用BLOCK压缩。
  AvroFile，一种高效序列化文件；
  ParquetFile，列式存储，语言无关性，对象模型；
  jsonFile，一般做数据交换使用；
  RCFile，是一种行列存储相结合的存储方式。首先，其将数据按行分块，保证同一个record在一个块上，避免读一个记录需要读取多个block。其次，块数据列式存储，有利于数据压缩和快速的列存取。
  ORCFile，优化的RCFile
    和RCFile格式相比，ORC File格式有以下优点：
    (1)每个task只输出单个文件，这样可以减少NameNode的负载；
    (2)支持各种复杂的数据类型，比如： datetime, decimal, 以及一些复杂类型(struct, list, map, and union)；
    (3)在文件中存储了一些轻量级的索引数据；
    (4)基于数据类型的块模式压缩：a、integer类型的列用行程长度编码(run-length encoding);
                                b、String类型的列用字典编码(dictionary encoding)；
    (5)用多个互相独立的RecordReaders并行读相同的文件；
    (6)无需扫描markers就可以分割文件；
    (7)绑定读写所需要的内存；
    (8)metadata的存储是用 Protocol Buffers的，所以它支持添加和删除一些列。
4.适当的基于业务场景的宽表
  Join的关联会增加执行时的job数量，应将常用的、公共的join操作进行预处理。
  需要与中间层设计区分开。
```

##### SQL优化原则
- 适当的task数量（map和reduce）
- 减少job数量
- 避免数据倾斜
- 不追求局部最优，要全局较优

```
注意：
SQL的消耗指标主要有内存、CPU、IO、网络。
集群资源管理器为YARN，使用container作为资源容器，会将上述指标打包。
调度策略为 Fair Scheduler。
CPU累计运行时长为单核累计的计算时间。
内存和CPU在container未释放时一直占用，重点考虑内存使用率和CPU使用率。
一条SQL，可分成多个job执行，每个job独立申请资源。
查询的结果都会写入临时表中，待move进入目标表或者查询工具访问。
```

##### 优化方法
```
#控制mapper和reducer的数量
1、确定合适的map数
map个数的主要的决定因素有： input的文件总个数，input的文件大小，集群设置的文件块数量限制。举例：
a)假设input目录下有1个文件a,大小为780M,那么hadoop会将该文件a分隔成7个块（6个128m的块和1个12m的块），从而产生7个map数。
b)假设input目录下有3个文件a,b,c,大小分别为10m，20m，130m，那么hadoop会分隔成4个块（10m,20m,128m,2m）,从而产生4个map数。即，如果文件大于块大小(128m),那么会拆分，如果小于块大小，则把该文件当成一个块。
map执行时间：map任务启动和初始化的时间+逻辑处理的时间。

1）减少map数
若有大量小文件（小于128M），会产生多个map，处理方法是：100M
set mapred.max.split.size=100000000;
set mapred.min.split.size.per.node=100000000;
set mapred.min.split.size.per.rack=100000000;
set hive.input.format=org.apache.hadoop.hive.ql.io.CombineHiveInputFormat; -执行前进行小文件合并
2）增加map数
当input的文件都很大，任务逻辑复杂，map执行非常慢的时候，可以考虑增加Map数，来使得每个map处理的数据量减少，从而提高任务的执行效率

2、确定合适的Reduce数
mapred.reduce.tasks #本地默认每个job的reduce数量
    Default Value: -1
The default number of reduce tasks per job. Typically set to a prime close to the number of available hosts. Ignored when mapred.job.tracker is "local". Hadoop set this to 1 by default, whereas Hive uses -1 as its default value. By setting this property to -1, Hive will automatically figure out what should be the number of reducers.

hive.exec.reducers.bytes.per.reducer #默认每个reduce处理数据的大小
    Default Value: 1,000,000,000 prior to Hive 0.14.0; 256 MB (256,000,000) in Hive 0.14.0 and later
Size per reducer. The default in Hive 0.14.0 and earlier is 1 GB, that is, if the input size is 10 GB then 10 reducers will be used. In Hive 0.14.0 and later the default is 256 MB, that is, if the input size is 1 GB then 4 reducers will be used.

hive.exec.reducers.max #默认最大的reduce数量
    Default Value: 999 prior to Hive 0.14.0; 1009 in Hive 0.14.0 and later
Maximum number of reducers that will be used. If the one specified in the configuration property mapred.reduce.tasks is negative, Hive will use this as the maximum number of reducers when automatically determining the number of reducers.


一般根据输入文件的总大小,用它的estimation函数来自动计算reduce的个数：
reduce个数 = InputFileSize / bytes per reducer

在 Spark SQL中有时会因为数据倾斜影响节点间数据处理速度，可在SQL中添加distribute by rand()来防止数据倾斜

#列裁剪和分区裁剪
hive.optimize.cp
    Default Value: true
    Removed In: Hive 0.13.0 with HIVE-4113
Whether to enable column pruner. (This configuration property was removed in release 0.13.0.)
hive.optimize.prunner = true   也已经废弃了

裁剪已经固化在hive内核中了，不需要参数来设置。
使用*或过多未使用的字段，会占用更多的内存和CPU，复杂SQL可能裁剪会不到位，应主动确定需要使用的字段范围。

#动态分区
hive.exec.dynamic.partition #是否允许动态分区
    Default Value: false prior to Hive 0.9.0; true in Hive 0.9.0 and later (HIVE-2835)
Whether or not to allow dynamic partitions in DML/DDL.

hive.exec.dynamic.partition.mode #在严格的模式，用户必须指定至少一个静态分区，在非严格模式允许动态分区。
    Default Value: strict
In strict mode, the user must specify at least one static partition in case the user accidentally overwrites all partitions. In nonstrict mode all partitions are allowed to be dynamic.

Set to nonstrict to support INSERT ... VALUES, UPDATE, and DELETE transactions (Hive 0.14.0 and later). For a complete list of parameters required for turning on Hive transactions, see hive.txn.manager.

hive.exec.max.dynamic.partitions #最大动态分区数量
    Default Value: 1000
Maximum number of dynamic partitions allowed to be created in total.

hive.exec.max.dynamic.partitions.pernode #允许在每个node的最大动态分区数量
    Default Value: 100
Maximum number of dynamic partitions allowed to be created in each mapper/reducer node.

dfs.datanode.max.xceivers=8192; 允许DATANODE打开多少个文件

#多表插入
from (select … from …)
insert into
insert into
insert into

#谓词下推
原则是在一个查询树中，对于任何选择都尽量早做选择，然后进行一步的处理，如join中的filter
如果使用外连接，则谓词下推会失效

hive.optimize.ppd #是否启用谓词下推
    Default Value: true
Whether to enable predicate pushdown (PPD).

hive.optimize.ppd.storage #是否将谓词向下推到存储处理程序中（存储handler）
    Default Value: true
Whether to push predicates down into storage handlers. Ignored when hive.optimize.ppd is false.

hive.ppd.remove.duplicatefilters #
    Default Value: true
During query optimization, filters may be pushed down in the operator tree. If this config is true, only pushed down filters remain in the operator tree, and the original filter is removed. If this config is false, the original filter is also left in the operator tree at the original place.
在查询优化期间，可以在树中下推。如果这个配置是true，下推过滤器保留在树，并删除原来的过滤器。如果此配置为false，则原始筛选器也留在原始位置的运算符树中。

hive.ppd.recognizetransivity #是否可复制的谓词过滤超过等值连接条件
    Default Value: true
Whether to transitively replicate predicate filters over equijoin conditions.

#Map端聚合
hive.map.aggr #Group By时是否使用Map端聚合
    Default Value: true in Hive 0.3 and later; false in Hive 0.2
Whether to use map-side aggregation in Hive Group By queries.

hive.groupby.mapaggr.checkinterval #在Map端进行聚合操作的条目数目
    Default Value: 100000
Number of rows after which size of the grouping keys/aggregation classes is performed.

#倾斜优化
hive.optimize.skewjoin #数据倾斜负载均衡是否开启
    Default Value: false
Whether to enable skew join optimization.  (Also see hive.optimize.skewjoin.compiletime.)

hive.skewjoin.key #数据倾斜判定行数依据
    Default Value: 100000
Determine if we get a skew key in join. If we see more than the specified number of rows with the same key in join operator, we think the key as a skew join key.

数据倾斜时负载均衡，当选项设定为true，生成的查询计划会有两个MRJob。第一个MRJob 中，Map的输出结果集合会随机分布到Reduce中，每个Reduce做部分聚合操作，并输出结果，这样处理的结果是相同的GroupBy Key有可能被分发到不同的Reduce中，从而达到负载均衡的目的；第二个MRJob再根据预处理的数据结果按照GroupBy Key分布到
Reduce中（这个过程可以保证相同的GroupBy Key被分布到同一个Reduce中），最后完成最终的聚合操作。

#多个join使用相同的key
hive.multigroupby.singlereducer #是否优化相同key生成一个M/R
    Default Value: true
Whether to optimize multi group by query to generate a single M/R  job plan. If the multi group by query has common group by keys, it will be optimized to generate a single M/R job.

#join小表在前、大表在后
驱动表：使用大表做驱动表，以防止内存溢出；Join最右边的表是驱动表；Mapjoin无视join顺序，用大表做驱动表；StreamTable。
In every map/reduce stage of the join, the last table in the sequence is streamed through the reducers where as the others are buffered. Therefore, it helps to reduce the memory needed in the reducer for buffering the rows for a particular value of the join key by organizing the tables such that the largest tables appear last in the sequence. e.g. in
    SELECT a.val, b.val, c.val FROM a JOIN b ON (a.key = b.key1) JOIN c ON (c.key = b.key1)
all the three tables are joined in a single map/reduce job and the values for a particular value of the key for tables a and b are buffered in the memory in the reducers. Then for each row retrieved from c, the join is computed with the buffered rows. Similarly for
    SELECT a.val, b.val, c.val FROM a JOIN b ON (a.key = b.key1) JOIN c ON (c.key = b.key2)
there are two map/reduce jobs involved in computing the join. The first of these joins a with b and buffers the values of a while streaming the values of b in the reducers. The second of one of these jobs buffers the results of the first join while streaming the values of c through the reducers.

#join指定驱动表
指定A表作为最后计算的流数据表
In every map/reduce stage of the join, the table to be streamed can be specified via a hint. e.g. in

    SELECT /*+ STREAMTABLE(a) */ a.val, b.val, c.val FROM a JOIN b ON (a.key = b.key1) JOIN c ON (c.key = b.key1)

all the three tables are joined in a single map/reduce job and the values for a particular value of the key for tables b and c are buffered in the memory in the reducers. Then for each row retrieved from a, the join is computed with the buffered rows. If the STREAMTABLE hint is omitted, Hive streams the rightmost table in the join.

#mapjoin
可以通过设定阈值控制自动使用MAPJOIN，把两张表都放到内存中处理，只限join
If all but one of the tables being joined are small, the join can be performed as a map only job. The query

    SELECT /*+ MAPJOIN(b) */ a.key, a.value
    FROM a JOIN b ON a.key = b.key

does not need a reducer. For every mapper of A, B is read completely. The restriction is that a FULL/RIGHT OUTER JOIN b cannot be performed.

#星型连接mapjoin
对于小表使用
The following query will produce two separate map-only jobs when executed:

select /*+ MAPJOIN(time_dim, date_dim) */ count(*) from
store_sales
join time_dim on (ss_sold_time_sk = t_time_sk)
join date_dim on (ss_sold_date_sk = d_date_sk)
where t_hour = 8 and d_year = 2002

It is likely, though, that for small dimension tables the parts of both tables needed would fit into memory at the same time. This reduces the time needed to execute this query dramatically, as the fact table is only read once instead of reading it twice and writing it to HDFS to communicate between the jobs.

或者

set hive.auto.convert.join.noconditionaltask = true;
set hive.auto.convert.join.noconditionaltask.size = 10000000;

For example, the previous query just becomes:

select count(*) from
store_sales
join time_dim on (ss_sold_time_sk = t_time_sk)
join date_dim on (ss_sold_date_sk = d_date_sk)
where t_hour = 8 and d_year = 2002

If time_dim and date_dim fit in the size configuration provided, the respective joins are converted to map-joins. If the sum of the sizes of the tables can fit in the configured size, then the two map-joins are combined resulting in a single map-join. This reduces the number of MR-jobs required and significantly boosts the speed of execution of this query. This example can be easily extended for multi-way joins as well and will work as expected.

Outer joins offer more challenges. Since a map-join operator can only stream one table, the streamed table needs to be the one from which all of the rows are required. For the left outer join, this is the table on the left side of the join; for the right outer join, the table on the right side, etc. This means that even though an inner join can be converted to a map-join, an outer join cannot be converted. An outer join can only be converted if the table(s) apart from the one that needs to be streamed can be fit in the size configuration. A full outer join cannot be converted to a map-join at all since both tables need to be streamed.

Auto join conversion also affects the sort-merge-bucket joins.

left join选定左表为驱动表，right join选右表为驱动表，只有非驱动表为小表且满足配置要求时，才能使用mapjoin。原理：mapjoin中流式处理的表，会需要每一行数据，left join的左表和right join的右表，才可能满足条件。

#IN/EXISTS子查询改写
LEFT SEMI JOIN implements the uncorrelated IN/EXISTS subquery semantics in an efficient way. As of Hive 0.13 the IN/NOT IN/EXISTS/NOT EXISTS operators are supported using subqueries so most of these JOINs don't have to be performed manually anymore. The restrictions of using LEFT SEMI JOIN are that the right-hand-side table should only be referenced in the join condition (ON-clause), but not in WHERE- or SELECT-clauses etc.

SELECT a.key, a.value
FROM a
WHERE a.key in
 (SELECT b.key
  FROM B);

SELECT a.key, a.val
FROM a LEFT SEMI JOIN b ON (a.key = b.key)

semi join最主要的使用场景就是解决exist in，与普通join的区别在于semi-join时，第一个表里的记录最多只返回一次，不会笛卡尔
而anti-join则与semi-join相反，即当在第二张表没有发现匹配记录时，才会返回第一张表里的记录；
当使用not exists/not in的时候会用到，两者在处理null值的时候会有所区别

no in(select col from 小表)，是可以的。
当表数据量比较大时，需转成
from a
left join b
on a.key = b.key
where b.key is null

bucket mapjoin
对于map端连接的情况，两个表以相同方式划分桶。处理左边表内某个桶的 mapper知道右边表内相匹配的行在对应的桶内。因此，mapper只需要获取那个桶 (这只是右边表内存储数据的一小部分)即可进行连接。这一优化方法并不一定要求 两个表必须桶的个数相同，两个表的桶个数是倍数关系也可
If the tables being joined are bucketized on the join columns, and the number of buckets in one table is a multiple of the number of buckets in the other table, the buckets can be joined with each other. If table A has 4 buckets and table B has 4 buckets, the following join

SELECT /*+ MAPJOIN(b) */ a.key, a.value
FROM a JOIN b ON a.key = b.key

can be done on the mapper only. Instead of fetching B completely for each mapper of A, only the required buckets are fetched. For the query above, the mapper processing bucket 1 for A will only fetch bucket 1 of B. It is not the default behavior, and is governed by the following parameter

set hive.optimize.bucketmapjoin = true

sort-merge join
If the tables being joined are sorted and bucketized on the join columns, and they have the same number of buckets, a sort-merge join can be performed. The corresponding buckets are joined with each other at the mapper. If both A and B have 4 buckets,

SELECT /*+ MAPJOIN(b) */ a.key, a.value
FROM A a JOIN B b ON a.key = b.key

can be done on the mapper only. The mapper for the bucket for A will traverse the corresponding bucket for B. This is not the default behavior, and the following parameters need to be set:

set hive.auto.convert.sortmerge.join=true;
set hive.input.format=org.apache.hadoop.hive.ql.io.BucketizedHiveInputFormat;
set hive.optimize.bucketmapjoin = true;
set hive.optimize.bucketmapjoin.sortedmerge = true;

#jobs并行执行
hive.exec.parallel
    Default Value: false
Whether to execute jobs in parallel.  Applies to MapReduce jobs that can run in parallel, for example jobs processing different source tables before a join.  As of Hive 0.14, also applies to move tasks that can run in parallel, for example moving files to insert targets during multi-insert.

hive.exec.parallel.thread.number
    Default Value: 8
How many jobs at most can be executed in parallel.

#本地模式执行小任务
相关的参数
hive.exec.mode.local.auto
    Default Value: false
Lets Hive determine whether to run in local mode automatically.

hive.exec.mode.local.auto.inputbytes.max
    Default Value: 134217728
When hive.exec.mode.local.auto is true, input bytes should be less than this for local mode.

hive.exec.mode.local.auto.tasks.max
    Default Value: 4
    Removed In: Hive 0.9.0 with HIVE-2651
When hive.exec.mode.local.auto is true, the number of tasks should be less than this for local mode. Replaced in Hive 0.9.0 by hive.exec.mode.local.auto.input.files.max.

hive.exec.mode.local.auto.input.files.max
    Default Value: 4
When hive.exec.mode.local.auto is true, the number of tasks should be less than this for local mode.

job的reduce数必须为0或者1，需满足这个条件才能启动。

#Strict Mode
hive.mapred.mode
    Default Value:
        Hive 0.x: nonstrict
        Hive 1.x: nonstrict
        Hive 2.x: strict (HIVE-12413)
The mode in which the Hive operations are being performed. In strict mode, some risky queries are not allowed to run. For example, full table scans are prevented (see HIVE-10454) and ORDER BY requires a LIMIT clause.

严格模式不允许执行以下查询：
分区表上没有指定了分区
没有limit限制的order by语句
笛卡尔积：JOIN时没有ON语句

#JVM重用
mapred.job.reuse.jvm.num.tasks（mapreduce.job.jvm.numtasks）：
    默认值： 1
说明：一个jvm可连续启动多个同类型任务，默认值1，若为-1表示不受限制。

JVM重用是Hadoop调优参数的内容，对Hive的性能具有非常大的影响，特别是对于很难避免小文件的场景或者task特别多的场景，这类场景大多数执行时间都很短。hadoop默认配置是使用派生JVM来执行map和reduce任务的，这是jvm的启动过程可能会造成相当大的开销，尤其是执行的job包含有成千上万个task任务的情况。

JVM重用可以使得JVM实例在同一个JOB中重新使用N次，N的值可以在Hadoop的mapre-site.xml文件中进行设置
mapred.job.reuse.jvm.num.tasks
 也可在hive的执行设置：
set  mapred.job.reuse.jvm.num.tasks=10;
JVM的一个缺点是，开启JVM重用将会一直占用使用到的task插槽，以便进行重用，直到任务完成后才能释放。如果某个“不平衡“的job中有几个reduce task 执行的时间要比其他reduce task消耗的时间多得多的话，那么保留的插槽就会一直空闲着却无法被其他的job使用，直到所有的task都结束了才会释放。

#简单limit使用fetch task
开启fetch task来不启用mapred执行一些语句 SELECT <col> from <table> LIMIT n
永久设定：${HIVE_HOME}/conf/hive-site.xml
hive.fetch.task.conversion
    Default Value: minimal in Hive 0.10.0 through 0.13.1, more in Hive 0.14.0 and later
Some select queries can be converted to a single FETCH task, minimizing latency. Currently the query should be single sourced not having any subquery and should not have any aggregations or distincts (which incur RS – ReduceSinkOperator, requiring a MapReduce task), lateral views and joins.

Supported values are none, minimal and more.

0. none:  Disable hive.fetch.task.conversion (value added in Hive 0.14.0 with HIVE-8389)
1. minimal:  SELECT *, FILTER on partition columns (WHERE and HAVING clauses), LIMIT only
2. more:  SELECT, FILTER, LIMIT only (including TABLESAMPLE, virtual columns)

"more" can take any kind of expressions in the SELECT clause, including UDFs.
(UDTFs and lateral views are not yet supported – see HIVE-5718.)

参考  https://www.iteblog.com/archives/831.html

#limit限制调整
hive.limit.optimize.enable
    Default Value: false
Whether to enable to optimization to trying a smaller subset of data for simple LIMIT first.

hive.limit.row.max.size #数据的大小
    Default Value: 100000
When trying a smaller subset of data for simple LIMIT, how much size we need to guarantee each row to have at least.

hive.limit.optimize.limit.file
    Default Value: 10
When trying a smaller subset of data for simple LIMIT, maximum number of files we can sample.

hive.limit.optimize.fetch.max #数据的行数
    Default Value: 50000
Maximum number of rows allowed for a smaller subset of data for simple LIMIT, if it is a fetch query. Insert queries are not restricted by this limit.

#推测执行
指在集群环境下运行MapReduce，可能是程序Bug，负载不均或者其他的一些问题，导致在一个JOB下的多个TASK速度不一致，这些任务将成为整个JOB的短板，如果集群启动了推测执行，这时为了最大限度的提高短板，Hadoop会为该task启动备份任务，让speculative task与原始task同时处理一份数据，哪个先运行完，则将谁的结果作为最终结果，并且在运行完成后Kill掉另外一个任务。
hive.mapred.reduce.tasks.speculative.execution
hive.mapred.reduce.tasks.speculative.execution
    Default Value: true
Whether speculative execution for reducers should be turned on.

mapred.map.tasks.speculative.execution=true
mapred.reduce.tasks.speculative.execution=true

#Sort/Distribute/Cluster/Order By
Hive排序问题
order by
Hive中的order by和数据库中的order by 功能一致，按照某一项或者几项排序输出，可以指定是升序或者是降序排序。它保证全局有序，但是进行order by的时候是将所有的数据全部发送到一个Reduce中，所以在大数据量的情况下可能不能接受，最后这个操作将会产生一个文件。
sort by
sort by只能保证在同一个reduce中的数据可以按指定字段排序。使用sort by 你可以指定执行的reduce个数 （set mapreduce.job.reduce=） 这样可以输出更多的数据。对输出的数据再执行归并排序，即可以得到全部结果。需要注意的是，N个Reduce处理的数据范围是可以重叠的，所以最后排序完的N个文件之间数据范围是有重叠的。
distribute by
按照指定的字段将数据划分到不同的输出reduce中，这可以保证每个Reduce处理的数据范围不重叠，每个分区内的数据是没有排序的。
cluster by
cluster by 除了具有 distribute by 的功能外还兼具 sort by 的功能。 所以最终的结果是每个Reduce处理的数据范围不重叠，而且每个Reduce内的数据是排序的，而且可以达到全局有序的结果。

参考  https://www.iteblog.com/archives/1534.html

#合并MR中小文件
hive.merge.mapfiles
    Default Value: true
Merge small files at the end of a map-only job.

hive.merge.mapredfiles
    Default Value: false
Merge small files at the end of a map-reduce job.

hive.merge.size.per.task
    Default Value: 256000000
Size of merged files at the end of the job.

hive.merge.smallfiles.avgsize
    Default Value: 16000000
When the average output file size of a job is less than this number, Hive will start an additional map-reduce job to merge the output files into bigger files. This is only done for map-only jobs if hive.merge.mapfiles is true, and for map-reduce jobs if hive.merge.mapredfiles is true.


hive.merge.mapfiles  true  是否合并Map输出文件
hive.merge.mapredfiles  false  是否合并Reduce输出文件
hive.merge.size.per.task  256M  合并文件的大小
hive.merge.smallfiles.avgsize 16M 启用合并平均文件大小的临界值

#避免创建文件数过多

hive.exec.max.created.files  100000  对创建文件的总数有限制
hive.exec.reducers.bytes.per.reducer  256M  每个Reduce处理数据大小
DISTRIBUTE BY rand();  把数据均匀分布给Reduce

hive> set hive.exec.reducers.bytes.per.reducer=5120000000;
hive> insert overwrite table test partition(dt)
    > select * from iteblog_tmp
    > DISTRIBUTE BY rand();

参考：https://www.iteblog.com/archives/1533.html

#使用索引
hive.optimize.index.filter
    Default Value: false
Whether to enable automatic use of indexes.

hive.optimize.index.groupby
    Default Value: false

hive.optimize.index.filter：自动使用索引
hive.optimize.index.groupby：使用聚合索引优化GROUP BY操作

#内置虚拟列
hive.exec.rowoffset
    Default Value: false
Whether to provide the row offset virtual column.

--当hive产生了非预期的或null的时候，可以通过虚拟列进行诊断，判断哪行数据出现问题
INPUT__FILE__NAME  （输入文件名）
BLOCK__OFFSET__INSIDE__FILE  （块内偏移量）
ROW__OFFSET__INSIDE__BLOCK  (行偏移量，需要设置hive.exec.rowoffset=true;启用) 废弃了

#count(distinct())优化
认清mapreduce的内部机制
hive.optimize.distinct.rewrite
    Default Value: true
When applicable, this optimization rewrites distinct aggregates from a single-stage to multi-stage aggregation. This may not be optimal in all cases. Ideally, whether to trigger it or not should be a cost-based decision. Until Hive formalizes the cost model for this, this is config driven.

SELECT COUNT( DISTINCT id ) FROM TABLE_NAME WHERE ...;
改成
SELECT COUNT(*) FROM (SELECT DISTINCT id FROM TABLE_NAME WHERE … ) t;

参考  http://blog.csdn.net/xiewenbo/article/details/29559075

#大数据量order by优化
使用多个reduce的机制：利用统计信息取到order by字段的最小、最大值，及各分位数，或通过采样（10%）得到数据分布。再每个分位段内的数据，分到一个reduce，最后按顺序出来就可以了。
也可以手动作这个操作：自己对数据分布范围应该更了解，主动探测数据分布，自己添加一个字段，比如员工年龄的：0-20岁、21-25岁、26-30岁、30-35岁、35-100岁。再按这个字段distribute by并sort年龄字段。
或者自己：按数据分布，写多条SQL来，用过滤来划分order by 字段的范围，再拼在一起。

insert into t2 as
select * from t where age between 0 and 20 order by age
union all
select * from t where age between 21 and 25 order by age
union all
select * from t where age between 26 and 30 order by age
...

#f*d1*d2*d3变成f*(d1*d2*d3)
如果维度d1、d2、d3之间有层级关系，比如：国家、省、市、县等维度，可以以最复杂的维度为基础，将各汇总维度上的数据加截过来。再与事实表做一次关联。

优点：
维度表之间先做关联，减少了运算时的数据量。而且可以存储起来，被其他应用场景所引用。
减少了大表参与的job数量。


#A1*B+A2*B+A3*B变成(A1+A2+A3)*B
+号表示union all
SQL中A1*B+A2*B+A3*B，一般需要三个job，改写之后的SQL：
如果A1、A2、A3是简单的表，则需要一个job即可。
如果A1、A2、A3较复杂些，则union all操作需要单独一个job来完成，加上后来的join操作，一共需要两个job。

复杂的SQL：A1*B1+A2*B2+A3*B3，也可改写成(A1+A2+A3)*(B1+B2+B3)，关联时确保A1仅会与B1匹配，每份数据都跟相应的数据匹配，不串行。
当后面的B表都比较小时，可写成(A1+A2+A3)*B1*B2*B3，同样保证不串行。


#窗口函数中job数量计算规则
partition by、order by 及order by中排序方向的组合数，构成job的数量
潜在引起job数量增加的操作：join, group by, distinct , order by, distribute by, cluster by,聚合中的distinct,窗口函数等

#job的结果在hdfs中
hdfs://nebula/user/hive/warehouse/app/.hive/ext-10001
insert into语句中的查询结果先在hdfs的临时文件中，再加载进目标表。
insert overwrite语句在查询结果出来后，先删除目标表中的文件，再将结果加载进目标表。最后一步的加载，仅是文件的改名。
动态分区操作中，插入数据前，有一步按分区关键字划分数据的步骤。

```



##### 执行计划

- Hive SQL执行计划深度解析  http://blog.csdn.net/moon_yang_bj/article/details/31744381

```
执行中的细节：
1) SQL文本提交给hive时，有三个队列：
   hive的SQL响应队列，HADOOP的MR处理队列，hive的结果输出队列。
2) Total jobs = 16，是预计的job数量，随着mapjoin、简单的union all及一些其他的合并处理，真实的job数量可能会比这低些。
   Stage-9 is filtered out by condition resolver.
3) 所有的job消耗，会在最后集中写一次（在ok前面）。
   关注资源的使用效率。total CPU累计时长/sum(资源分配额*占用时长)
   数据不均匀，存在mapper和reducer阶段。
4) join时，mapers数量通常是两张表数据块数量的和。合并与拆分的情况，参考第一个优化方法。对于两张表的扫描是在一个stage中。
5) jobs开启并行执行，可并行扫描一个join中的多张表；也可并行执行union all前后的任务；也可以并行move file的任务。
6) 数据参与量小的SQL，大部分时间消耗在资源分配上面。通常6-10秒。
7) 查询中简单的嵌套查询中的mapper会合并处理。常量会直接计算好，表达式则会叠加好。
```

##### 自动执行操作
```
1) inner join会自动过滤join key中的null值
因为on中等号不识别null值。
null = null 是不对。应主动做nvl(null,’##’) = nvl(null,’##’)。
2) join中针对join key的过滤条件会传递到其他表
a join b on a.key = b.key where a.key = ‘c’
优化成
a join b on a.key = b.key where a.key = ‘c’ and b.key = ‘c’

a left join b on a.key = b.key where b.key = ‘c’
优化成：join时进行过滤，不会下推至两表扫描时进行过滤。
a join b on a.key = b.key and b.key=’c’(仅关联时过滤)where a.key = ‘c’(仅关联时过滤)
结果集相当于：a inner join b on a.key = b.key where a.key = ‘c’ and b.key = ‘c’

3) where等式过滤条件会固定在select中
select t.contract_no,t.* from dw.tcsv_contract_info t where t.contract_no = ‘123’
优化成
select ‘123’ contract_no,t.* from dw.tcsv_contract_info t where t.contract_no = ‘123’
4) inner join、left join、right join、full join过滤条件适用范围
inner join中，on和where中的过滤条件，作用一样，会对两表都扫描时过滤。
left join中，on中左表的过滤条件，不会在扫描时进行过滤；
                 右表的过滤条件，会在扫描时进行过滤。
           where中左表的过滤条件，会在扫描时进行过滤；
                  右表的过滤条件，不会在扫描时进行过滤。
right join，同理，左右的概念反一下就可以了。
full join，左右两表，都相当于left join中的左表，
         on中的过滤条件，都不会在扫描时进行过滤；
         where中的过滤条件，都会在扫描时进行过滤。
参考  https://cwiki.apache.org/confluence/display/Hive/OuterJoinBehavior
```

##### SQL应用场景
```
数据仓库中，数据表达的问题，尽量使用SQL来解决，UDF(user-defined function)是最后的办法
分析函数和窗口函数是好工具
count  sum  min  max  avg
rank  row_number  dense_rank  cume_dist  percent_rank  ntile
lead  lag  first_value  last_value

参考  https://cwiki.apache.org/confluence/display/Hive/LanguageManual+WindowingAndAnalytics
      https://cwiki.apache.org/confluence/display/Hive/LanguageManual+UDF
```

```
1) 多行转多列
1．  max(case when type = ‘1’ then col else null end) col_1
2．  max(if(type = ‘1’, col, null)) col_1     -- 相当于decode

参考 oracle的解决方案  http://www.cnblogs.com/liunanjava/p/4961923.html

2) 多行转一列，即分组合并数据
类似oracle中wm_concat和listagg，新特性pivot

SELECT ID,NAME,
wmsys.wm_concat(course || ':'||score) over(order by course) course_1,
listagg(course || ':'||score, ’,’) within group(order by course) course_2
FROM kecheng
GROUP BY ID ,NAME;

hive中
with tmp as(
select 'A' a, '1' b
union all
select 'A' a, '3' b
union all
select 'A' a, '3' b
union all
select 'B' a, '1' b
union all
select 'B' a, '2' b
)
select a,
concat_ws(',', collect_set(b)) as b_merge1,
concat_ws(',', collect_list(b)) as b_merge2
from tmp
group by a;

结果：
A       1,3     1,3,3
B       1,2     1,2

3) 一列转多行
oracle使用regexp_replace()按序解析

An example table with two rows:

front_page  [1, 2, 3]
contact_page  [3, 4, 5]
and the user would like to count the total number of times an ad appears across all pages.
A lateral view with explode() can be used to convert adid_list into separate rows using the query:

SELECT pageid, adid
FROM pageAds LATERAL VIEW explode(adid_list) adTable AS adid;
The resulting output will be

"front_page"  1
"front_page"  2
"front_page"  3
"contact_page"  3
"contact_page"  4
"contact_page"  5

参考  https://cwiki.apache.org/confluence/display/Hive/LanguageManual+LateralView

4) 多列转多行，多列的笛卡尔积

LATERAL VIEW clauses are applied in the order that they appear. For example with the following base table: Array<int>
col1 Array<string> col2 [1, 2]  [a", "b", "c"] [3, 4]  [d", "e", "f"] The query: SELECT myCol1, col2 FROM baseTable
LATERAL VIEW explode(col1) myTable1 AS myCol1;
Lateral View 首先将UDTF应用于基表的每一行，然后将结果输出行连接到输入行，以形成具有提供的表别名的虚拟表

Will produce:
int mycol1  Array<string> col2
1 [a", "b", "c"]
2 [a", "b", "c"]
3 [d", "e", "f"]
4 [d", "e", "f"]
A query that adds an additional LATERAL VIEW:
SELECT myCol1, myCol2 FROM baseTable
LATERAL VIEW explode(col1) myTable1 AS myCol1
LATERAL VIEW explode(col2) myTable2 AS myCol2;
Will produce:
int myCol1  string myCol2
1 "a"
1 "b"
1 "c"
2 "a"
2 "b"
2 "c"
3 "d"
3 "e"
3 "f"
4 "d"
4 "e"
4 "f"

如果是待拆分的字段为字符串，就自己解析成一个ARRAY对象。

select * from tb_split;
date_id    des    type
20141018  aa|bb  7|9|0|3
20141019  cc|dd  6|1|8|5

使用方式：select datenu,des,type from tb_split
lateral view explode(split(des,"//|")) tb1 as des
lateral view explode(split(type,"//|")) tb2 as type
执行过程是先执行from到 as cloumn的列过程，在执行select 和where后边的语句；

参考  https://cwiki.apache.org/confluence/display/Hive/LanguageManual+LateralView

5) 产生1到n的连续数字
类似oracle：
  select level orders from dual connect by level <= 10;

依赖于某表的行数。
select row_number() over() orders from table_name limit 10;

不依赖于某表的行数。
select row_number() over() orders from (select split(space(10-1),' ') a) t
lateral view explode(a) tmp as col1;

select col1+1 orders from (select split(space(10-1),' ') a) t
lateral view posexplode(a) tmp as col1,col2;
posexplode会返回两个参数，位置和值col1,col2
6) 模拟connect by

ORACLE：SELECT LEVEL FROM DUAL CONNECT BY  LEVEL < 10
待解决

7) 非连续日期求余额
当月剩余本金余额，如果月份超过应收和实收月份所属的范围，应主动补充没有数据的月份，才能计算正确
日期不用到事实表中distinct计算出，可直接使用下面类似的SQL：
select col1+1 orders, date_add('2017-09-16',col1) cur_date
from (select split(space(datediff('2017-10-02','2017-09-16')),' ') a) t
lateral view posexplode(a) tmp as col1,col2;

8) select中循环操作
如果某个字段需要进行循环的操作，可以通过将数据行进行扩充，再进行操作，最后聚合结果。

示例：将000000111010中的1的位置提取出来：7,8,9,11
select code,
     concat_ws(',',collect_list(cast(col1+1 as string))) result
from (select '000000111010' code ) t
lateral view posexplode(split(code,'')) tmp as col1,col2
where col2 = '1'
group by code;

000000111010  7,8,9,11
[(1,0), (2,0),  …  (7,1),(8,1),(9,1),(10,0),(11,1),(12,0)]

9) 构造日期
如果结果集之间有逻辑关系，通常可以使用SQL实现。
select col1+1 orders,  -- 不需要的字段
       date_add('2017-09-20',col1) date,
 from (select split(space(datediff(to_date('2017-11-03'),'2017-09-20')),' ') a) t
 lateral view posexplode(a) tmp as col1,col2;

10) 构造累积日期
select date_add(min_date,col3) cur_date,
       date_add(min_psc_m_start,col1) inner_cur_date
 from (select split(space(datediff('2017-09-25',(case when day('2017-08-20') >= 26
                                                          then date_add(trunc('2017-08-20','MM'),26-1)
                                                  else date_add(add_months(trunc('2017-08-20','MM'),-1),26-1) end))),' ') a,
              split(space(datediff('2017-09-25','2017-08-20')),' ') b    ) t
 lateral view posexplode(a) tmp as col1,col2
 lateral view posexplode(b) tmp as col3,col4
 ;

2017-08-26  2017-08-26
2017-08-27  2017-08-26
2017-08-27  2017-08-27
2017-08-28  2017-08-26
2017-08-28  2017-08-27
2017-08-28  2017-08-28

11) 分页查询
select *
 from(select row_number()
          over(order by contract_no asc) orders,
           -- order by中一定要是主键:单个字段或多个字段联合的主键
           c.*
       from xx.xxx c) t
 where orders between 101 and 110;

小数据量，是能够承受单个reducer处理排序的。
窗口函数中，如果没有partition by，基本上就在一个reduce中。大数据量，是不适合做分页的。
大数据量的分页接口，应该做成按分区+分页提取数据。不允许全表分页获取数据。

12) 构造"OR"的去重数据
表t:
   a     b     c     d
  2014  2016  2014   A
  2014  2015  2015   B
结果：
  2014  A
  2016  A
  2014  B
  2015  B

先collect_set 再 explode
```


