# HDFS
##### hadoop官方文档
<http://hadoop.apache.org/docs/r2.6.4/hadoop-project-dist/hadoop-common/FileSystemShell.html>

##### 查看数据文件
- hdfs dfs -ls /xxx

#####   HDFS中常用到的命令
```
lhadoop fs
hadoop fs -ls /
hadoop fs -lsr
hadoop fs -mkdir /user/hadoop
hadoop fs -put a.txt /user/hadoop/
hadoop fs -get /user/hadoop/a.txt /
hadoop fs -cp src dst
hadoop fs -mv src dst
hadoop fs -cat /user/hadoop/a.txt
hadoop fs -rm /user/hadoop/a.txt
hadoop fs -rmr /user/hadoop/a.txt
hadoop fs -text /user/hadoop/a.txt
hadoop fs -copyFromLocal localsrc dst 与hadoop fs -put功能类似。
hadoop fs -moveFromLocal localsrc dst 将本地文件上传到hdfs，同时删除本地文件。
lhadoop fsadmin
hadoop dfsadmin -report
hadoop dfsadmin -safemode enter | leave | get | wait
hadoop dfsadmin -setBalancerBandwidth 1000
lhadoop fsck
lstart-balancer.sh
```




