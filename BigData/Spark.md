# Spark

##### Spark与Hadoop差异
```
Spark把中间数据放到内存中，迭代运算效率高。
MapReduce中计算结果需要落地，保存到磁盘上，这样势必会影响整体速度，而Spark支持DAG图的分布式并行计算的编程框架，减少了迭代过程中数据的落地，提高了处理效率。

Spark容错性高。
Spark引进了弹性分布式数据集RDD (Resilient Distributed Dataset) 的抽象，它是分布在一组节点中的只读对象集合，这些集合是弹性的，如果数据集一部分丢失，则可以根据“血统”（即充许基于数据衍生过程）对它们进行重建。
另外在RDD计算时可以通过CheckPoint来实现容错，而CheckPoint有两种方式：CheckPoint Data，和Logging The Updates，用户可以控制采用哪种方式来实现容错。

Spark更加通用。
不像Hadoop只提供了Map和Reduce两种操作，Spark提供的数据集操作类型有很多种，大致分为：Transformations和Actions两大类。Transformations包括Map、Filter、FlatMap、Sample、GroupByKey、ReduceByKey、Union、Join、Cogroup、MapValues、Sort和PartionBy等多种操作类型，同时还提供Count, Actions包括Collect、Reduce、Lookup和Save等操作。
另外各个处理节点之间的通信模型不再像Hadoop只有Shuffle一种模式，用户可以命名、物化，控制中间结果的存储、分区等。
```
