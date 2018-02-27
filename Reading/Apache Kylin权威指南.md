#Kylin
Apache Kylin是Hadoop大数据平台上的一个开源OLAP引擎

维度（Dimension）和度量（Measure）
Cube（或Data Cube），即数据立方体，是一种常用于数据分析与索引的技术；它可以对原始数据建立多维度索引
Cuboid在Kylin中特指在某一种维度组合下所计算的数据。
Cube Segment是指针对源数据中的某一个片段，计算出来的Cube数据。

星型模型 雪花模型 星座模型
基数
超高基维度
基数计算 HuperLogLog 近似算法

Mandatory维度指的是那些总是会出现在Where条件或Group By语句里的维度；通过将某个维度指定为Mandatory，Kylin就可以不用预计算那些不包含此维度的Cuboid，从而减少计算量
Hierarchy是一组有层级关系的维度，例如“国家”“省”“市”，这里的“国家”是高级别的维度，“省”“市”依次是低级别的维度。通过指定Hierarchy，Kylin可以省略不满足此模式的Cuboid
Joint是将多个维度组合成一个维度，其通常适用于：总是会在一起查询的维度；基数很低的维度
增量构建抽取数据的范围，采用了前包后闭的原则，即包含了开始时间，但不包含结束时间，从而保证上一个Segment的结束时间与下一个Segment的起始时间相同，但数据不会重复

注意：1.Kylin作为OLAP引擎，只支持查询，而不支持其他操作，如插入、更新等
2.查询Kylin中SQL语句的表名、列名、度量、连接关系时，需要至少跟一个Cube的模型相匹配
3.Kylin使用Apache Calcite做SQL语法分析

暂不支持linux长整数时间作为分割时间列

构建-补充时间列：date和time

Kylin查询页面主要是基于一个查询Rest API
Rest API可以自动化发出增量构建

查询API的Body部分要求发送一个JSON对象
·sql：必填，字符串类型，请求的SQL
·offset：可选，整型，可以设置该参数以决定返回数据从哪一行开始往后返回
·limit：可选，整型，加上limit参数后会从offset开始返回对应的行数
·acceptPartial：可选，布尔类型，默认是“true”，如果为true，那么实际上最多会返回一百万行数据
·project：可选，字符串类型，默认为“DEFAULT”，在实际使用时，如果对应查询的项目不是“DEFAULT”，那就需要设置为自己的项目。

查询结果返回的也是一个JSON对象
·columnMetas：每个列的元数据信息
·results：返回的结果集
·cube：这个查询对应使用的CUBE
·affectedRowCount：这个查询关系到的总行数
·isException：这个查询的返回是否异常
·exceptionMessage：如果查询返回异常，则给出对应的内容
·duration：查询消耗的时间，单位为毫秒
·partial：这个查询结果是否仅为部分结果，这取决于请求参数中的？acceptPartial？为true还是false

Segment自动合并
保留时长设置：Retention Threshold 365
Segment刷新数据解决：使用N天作为单位创建Segment，任意时间内同时刷新近两个

由于实时数据更新频繁，流式构建不再要求数据必须提前落地到Hive之中，那样做开销过大。
Kylin假设在流式构建中，数据是以消息流的形式传递给流式构建引擎的，包含所有的维度信息、所有的度量信息、业务时间戳（精度可选）。

消息队列一般使用Kafka
Timeout：可配置的，Kafka客户端读取超时时间。
Buffer Size：可配置的，Kafka客户端读取缓冲区大小。
Margin：可配置的，代表消息可能延迟的程度

配置时间的单位大部分都是毫秒ms

一个Cube同时只允许有一个未完成的构建操作

增量构建是由MapReduce作业来产生Cube的HDFS数据文件的，它会使用MapReduce将HDFS数据文件转化为符合存储引擎（HBase）的数据格式（HFile），然而在流式构建中，HDFS数据文件并不是由MapReduce产生的，而是由一个单进程的流式构建引擎独立完成的

Apache Kylin的Insight页面即为查询页面

JDBC访问Kylin对应的URL格式为“jdbc：kylin：//<hostname>：<port>/<kylin_project_name>”
如果JDBC连接属性对应的“ssl”设置为true，那么端口将对应为Kylin服务器的HTTPS端口，一般为443；默认的HTTP服务端口是7070；“kylin_project_name”是Apache Kylin服务端的项目名称，该项目必须存在

Tableau是一款应用比较广泛的商业智能工具软件，有着很好的交互体验，可基于拖曳式生成各种可视化图表

Apache Zeppelin是一个开源的数据分析平台，是Apache的顶级项目。Zeppelin后端以插件形式支持多种数据处理引擎，如Spark、Flink、Lens等，同时还提供了Notebook式的UI进行可视化相关的操作在Zeppelin0.5.6及后续版本中都可以对接使用Kylin，从而实现通过Zeppelin访问Kylin的数据
对于Zeppelin中的任何一个查询，你都可以创建一个链接，并且将该链接分享给其他人，从而分享你的分析工作成果


一般来说，Cube的膨胀率应该在0%~1000%之间，如果一个Cube的膨胀率超过1000%，那么Cube管理员应当开始挖掘其中的原因

Cube中的维度数量较多、存在较高基数的维度、存在比较占用空间的度量：如Count Distinct

Kylin的核心优势在于使用额外的空间存储预计算的结果，以换取查询时间的缩减

Cuboid剪枝优化
衍生维度用于在有效维度内将维度表上的非主键维度排除掉，并使用维度表的主键（其实是事实表上相应的外键）来替代它们 日周月 只使用日 周月通过上卷获得
聚合组（Aggregation Group），假设一个Cube的所有维度均可以根据业务需求划分成若干组，由于同一个组内的维度更可能同时被同一个查询用到，因此会表现出更加紧密的内在关联

如果从维度表主键到某个维度表维度所需要的聚合工作量非常大，例如从CAT_DT到YEAR_BEG_DT基本上需要365∶1的聚合量，那么将YERR_BEG_DT作为一个普通的维度

并发粒度优化

Rowkeys优化

编码（Encoding）代表了该维度的值应使用何种方式进行编码，合适的编码能够减少维度对空间的占用
Date编码 支持从0000-01-01到9999-01-01中的每一个日期
Time编码 支持表示从1970-01-01 00：00：00到2038-01-19 03：14：07的时间
Integer编码 Integer编码需要提供一个额外的参数“Length”来代表需要多少个字节。
Length的长度为1~8 如果用来编码int32类型的整数，可以将Length设为4；如果用来编码int64类型的整数，可以将Length设为8
Dict编码 每个Segment在构建的时候都会为这个维度所有可能的值创建一个字典，然后使用字典中每个值的编号来编码
Fixed_length编 需要提供一个额外的参数“Length”来代表需要多少个字节，可以看作Dict编码的一种补充

默认情况下Cuboid的分片策略是随机的，按维度分片（Shard by Dimension）提供了一种更加高效的分片策略，那就是按照某个特定维度进行分片。如果Cuboid中某两个行的Shard by Dimension的值相同，这两行数据必然会被分配到同一个分片中

在Cube Designer→Advanced Setting→Rowkeys，可以上下拖动维度调节维度在Rowkeys中的顺序。Kylin会把所有的维度按照顺序黏合成一个完整的Rowkeys，并且按照这个Rowkeys升序排列Cuboid中所有的行

默认情况下Cuboid的分片策略是随机的，按维度分片（Shard by Dimension）提供了一种更加高效的分片策略，那就是按照某个特定维度进行分片。如果Cuboid中某两个行的Shard by Dimension的值相同，这两行数据必然会被分配到同一个分片中

在查询中被用作过滤条件的维度有可能放在其他维度的前面。
将经常出现在查询中的维度放在不经常出现的维度的前面。
对于基数较高的维度，如果查询会有这个维度上的过滤条件，那将它往前调整；如果没有，则向后调整

第七章 应用案例分析




