# MySql

## Navicate

#### 不使用索引的情况
- 查询的数量是大表的大部分，应该是30％以上（使用的资源超过全表）
- 数据类型不同，隐式转换，包括某些长度不一样
- 组合索引最左原则
- 负向查询（not  , not in, not like, <>, != ,!>,!<  ）
- 用or分割开的条件，or前条件有索引，or后的列没有索引
- 索引是表达式的一部分，函数
- 两张表的数据类型或排序规则不同 例COLLATE=utf8_bin左连接utf8_general_ci无效，右连接有效（同varchar） 右表是int时可以

```sql
MYSQL手册原文：
To retrieve rows from other tables when performing joins. MySQL can use indexes on columns more
efficiently if they are declared as the same type and size. In this context, VARCHARand CHARare
considered the same if they are declared as the same size. For example, VARCHAR(10)and CHAR(10)
are the same size, but VARCHAR(10)and CHAR(15)are not.
```

#### 查询直接导出到文件
```sql
select * from op_mobile_backflow_20170223
where mobile  like '13%'
into outfile 'd:\yuan.txt' fields terminated by '|' enclosed by '"'
```

## 创建用户
```sh
GRANT SELECT ON *.* TO 'xx'@'%' IDENTIFIED BY 'xx@201707'; #创建用户并赋予权限 ALL是所有权限

CREATE USER 'xx'@'%' IDENTIFIED BY 'xx@201707'; #创建用户

GRANT SELECT ON bi.* TO lujihui; #为用户赋予权限

#mysql数据库中的3个权限表：user 、db、 host
SELECT DISTINCT CONCAT('User: ''',user,'''@''',host,''';') AS query FROM mysql.user ; #从用户表中查看用户相关信息

grant select on testdb.* to dba@localhost with grant option; #该用户可以授权给其他用户 “grant option“
grant select,update,delete,insert  on dmc_db.*  to  zx_root;

set password for zx_root =password('xxxxxx');
update  mysql.user  set  password=password('xxxx')  where user='otheruser'


flush privileges; //刷新系统权限表
show grants for lujihui; #查看用户的权限
show grants; #查看当前用户的权限
```

#### Linux下MySql连接
```sh
mysql -h xx.xx.xx.xx -u xxx -pxx.xxxxx
```

#### 数据库超时时间检查
```sh
show variables like '%timeout';
```

#### 数据库进程检查
```sh
show full PROCESSLIST;
```

#### 数据表内容检查
```sh
show full COLUMNS from table;
```

#### 锁表进阶检查
```sh
show full processlist;
kill 66863419;

#线程ID（trx_mysql_thread_id）
SELECT * FROM information_schema.INNODB_TRX

#查看正在锁的事务
SELECT * FROM INFORMATION_SCHEMA.INNODB_LOCKS;

#查看等待锁的事务
SELECT * FROM INFORMATION_SCHEMA.INNODB_LOCK_WAITS;

#查询mysql数据库中存在的进程
select  *  from information_schema.`PROCESSLIST`; #show processlist;
```

#### 不同字段类型关联 索引
```
SELECT count(1) FROM `table_a` a LEFT JOIN table_b b ON a.code = cast(b.code as char);

结论：当表联接的字段类型不匹配时会因为数据类型丢失索，建议用cast或convert函数将类型严格的一方转换为类型松散的一方的类型，这样也能避免精度丢失。比如，可以将数值型向字符串类型转。
PS：这种方法其实就是对b.code使用函数导致其索引不能是使用，而强制使用了a表的索引，当然也可以强制驱动表或强制索引
```

### in和exists
```
如果查询的两个表大小相当，那么用in和exists差别不大。
如果两个表中一个较小，一个是大表，则子查询表大的用exists，子查询表小的用in：
例如：表A（小表），表B（大表）
1：
select * from A where cc in (select cc from B) 效率低，用到了A表上cc列的索引；
select * from A where exists(select cc from B where cc=A.cc) 效率高，用到了B表上cc列的索引。
相反的
2：
select * from B where cc in (select cc from A) 效率高，用到了B表上cc列的索引；
select * from B where exists(select cc from A where cc=B.cc) 效率低，用到了A表上cc列的索引。

not in 和not exists如果查询语句使用了not in 那么内外表都进行全表扫描，没有用到索引；而not extsts 的子查询依然能用到表上的索引。所以无论那个表大，用not exists都比not in要快。
```

### in和join
```
个人经验
理论上当A的数据过大（无法使用索引过滤或过滤较少），B是join结果集且数据量极小(和其中一个表的rows大于1有一定关系)
这时多次join的效率因内部计算方式而降低，而使用直接in，会比拆开结果集的效率高
```


## SQL

#### 数据和页面对照关系表
```sql
CREATE TABLE `xxx` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `schema` varchar(20) DEFAULT NULL COMMENT '数据库',
  `table_name` varchar(50) DEFAULT NULL COMMENT '关联表名称',
  `table_comment` varchar(50) DEFAULT NULL COMMENT '表注释名',
  `report_name` varchar(50) DEFAULT NULL COMMENT '日报名称',
  `table_author` varchar(20) DEFAULT NULL COMMENT '表开发者名称',
  `report_developer` varchar(20) DEFAULT NULL COMMENT '日报前端开发名称',
  `kettle_job` varchar(50) DEFAULT NULL COMMENT 'kettle 作业名称',
  `kettle_time` varchar(10) DEFAULT NULL COMMENT 'kettle执行时间',
  `send_time` varchar(50) DEFAULT NULL COMMENT '报表发送时间',
  `report_build_time` varchar(10) DEFAULT NULL COMMENT '报表生成时间',
  `report_type` varchar(20) DEFAULT NULL COMMENT '类型 1-cel 2-support',
  `report_status` enum('N','Y') DEFAULT 'Y' COMMENT '报表状态 Y使用 N废弃',
  `table_status` enum('N','Y') DEFAULT 'Y' COMMENT '表状态 Y存在 N删除',
  `online_date` date DEFAULT NULL COMMENT '上线日期',
  `business_side` varchar(20) DEFAULT NULL COMMENT '需求方',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=547 DEFAULT CHARSET=utf8 COMMENT='表和页面对照关系表';
```

#### 数据库统计信息视图
```sql
select `t`.`TABLE_SCHEMA` AS `TABLE_SCHEMA`
        ,`t`.`TABLE_NAME` AS `TABLE_NAME`
        ,`t2`.`TABLE_COMMENT` AS `TABLE_COMMENT`
        ,`t`.`COLUMN_NAME` AS `COLUMN_NAME`
        ,`t`.`COLUMN_TYPE` AS `COLUMN_TYPE`
        ,if((`t`.`COLUMN_KEY` = 'PRI'),'Y','N') AS `primary_key`
        ,`t`.`COLUMN_DEFAULT` AS `COLUMN_DEFAULT`
        ,`t`.`COLUMN_COMMENT` AS `COLUMN_COMMENT`
        ,`t2`.`CREATE_TIME` AS `update_time`
from (`information_schema`.`columns` `t` join `information_schema`.`tables` `t2`)
where (`t`.`TABLE_NAME` = `t2`.`TABLE_NAME`)
```

#### 固定参数计算排名和累计样例
```sql
SELECT
shop_name
,@curank := if(@prerank = PASS_AMOUNT,@curank,@inrank) as rank
,@inrank := @inrank +1
,@prerank := PASS_AMOUNT
,PASS_AMOUNT
FROM (
select
b.shop_name,#营业部
sum(a.amount)/10000 AS PASS_AMOUNT#放款金额
from xx.xxx a
group by a.shop
) a,(select @curank := 0,@prerank := null,@inrank := 1) b
ORDER BY PASS_AMOUNT DESC;

#阶段性累计样例
select a.statistic_dt,a.loanout_amt
       ,a.loanout_amt + @amt + @amt2
       ,@amt2 := @amt  #前天
       ,@amt := a.loanout_amt  #昨天
 from
(select date(open_time) statistic_dt
       ,sum(amount) loanout_amt
from xx.xxx
where open_time >= '20171001'
and `status` in (10,11,12)
group by statistic_dt
order by statistic_dt) a,(select @amt := 0,@amt2 := 0) b
where 1=1;
```

#### FEDERATED 远程链接

```sql
CREATE SERVER xxx FOREIGN DATA WRAPPER mysql OPTIONS (USER 'prod_dbi', PASSWORD 'xxxxx', HOST 'xxxxx', PORT 3306, DATABASE 'puhui')
```

#varchar text
```
从官方文档中我们可以得知当varchar大于某些数值的时候，其会自动转换为text，大概规则如下：
大于varchar（255）变为 tinytext
大于varchar（500）变为 text
大于varchar（20000）变为 mediumtext
```
