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

#### 存储过程-统计记录数DEMO
```
CREATE OR REPLACE PROCEDURE count_all(var_user in varchar2)
AS
   CURSOR c_tab
   IS
      SELECT   table_name
          FROM user_all_tables
      ORDER BY 1;

   v_count        NUMBER;
   v_insert_sql   VARCHAR2 (200);
   v_select_sql   VARCHAR2 (200);
   tem_tab        VARCHAR2 (50);
--counters number := 0;
BEGIN
   DBMS_OUTPUT.put_line ('====Begin here!====');
   OPEN c_tab;
   DBMS_OUTPUT.put_line (   'Begin ==> ' || TO_CHAR (SYSDATE, 'yyyy-mm-dd hh24:mi:ss'));

   LOOP
      FETCH c_tab
       INTO tem_tab;
      IF c_tab%NOTFOUND
      THEN
         EXIT;
      END IF;
      IF tem_tab IS NOT NULL
      THEN
         --counters := counters + 1;
         v_select_sql := 'select count(*)from ';
         v_select_sql := v_select_sql || tem_tab;
         EXECUTE IMMEDIATE v_select_sql  INTO v_count;
         DBMS_OUTPUT.put_line(tem_tab ||'    '|| v_count);
      END IF;
   END LOOP;

   CLOSE c_tab;
   COMMIT;
   DBMS_OUTPUT.put_line (TO_CHAR (SYSDATE, 'yyyy-mm-dd hh24:mi:ss'));
END;
```

#### 调整数据文件大小（水线）
```
ALTER DATABASE TEMPFILE '/crmdat1/CRM/datafile/o1_mf_undotbs1_bnpvdw2g_.dbf' RESIZE 10G;--DATABASE
ALTER TABLESPACE TEMP ADD TEMPFILE '/crmdat1/CRM/datafile/TEMP2.dbf' SIZE 1G;
```

#### 导入导出
```
exp xxx/xxx@xxx file=/xxx.dmp log=/xxx.log rows=y FEEDBACK=10000000 tables=xxx  query =\"where xxx \> date\'2015-09-30\' -400\" compress=n
imp xxx/xxx@xxx  fromuser=xxx touser=xxx file=/xxx.dmp log=/xxx.log commit=y FEEDBACK=10000000 tables=xxx rows=y

expdp xxx/xxx@xxx directory=expdir dumpfile=xxx.dmp tables=xxx job_name=xxx logfile=exp.log content=all status=10000
impdp xxx/xxx@xxx directory=expdir dumpfile=xxx.dmp tables=xxx logfile=imp.log TABLE_EXISTS_ACTION=append

expdp xxx/xxx@xxx parfile=/exp.par
impdp xxx/xxx@xxx parfile=/imp.par

exp.par
query ="where etl_date > date'2015-09-30' -400"
content=all
directory=expdir
logfile=exp.log
dumpfile=xxx.dmp
tables=xxx
job_name=xxx
status=1000

imp.par
content=all
directory=expdir
logfile=imp.log
dumpfile=xxx.dmp
tables=xxx
job_name=xxx
status=1000

REMAP_TABLE=xxxa:xxxb
create or replace directory expdir as '/expdir';
grant read,write on directory expdir to lfcrm_gdm;
Query=Where id <5
Query=table_A:”Where id<5″,table_B:”Where name=’a’”
```

#### 索引信息查询
```
select * from user_indexes
```

#### 主键查询
```
select distinct cu.CONSTRAINT_NAME,cu.TABLE_NAME from user_cons_columns cu, user_constraints au where cu.constraint_name = au.constraint_name and au.constraint_type = 'P'
```

#### 手动创建实例
```
1、首先设置Oracle_SID=manual
2、创建密码文件
进入/u01/app/oracle/product/10.2.0/db_1/dbs目录下，执行命令创建数据库密码文件
[oracle@myorcl dbs]$ orapwd file=orapmanual password=oracle
3、创建所需的目录结构
[oracle@myorcl dbs]$ cd /u01/app/oracle/admin/
[oracle@myorcl admin]$ mkdir manual
然后进入manual目录创建一下文件
[oracle@myorcl manual]$ ls
adumpbdumpcdumppfileudump
4、创建所需的参数文件
[oracle@myorcl ~]$ cd /u01/app/oracle/admin/manual/pfile/
[oracle@myorcl pfile]$ vi init.ora
db_name=manual
db_domain=""
sga_target=285212672
pga_aggregate_target=94371840
db_block_size=8192
db_file_multiblock_read_count=16
open_cursors=300
processes=150
background_dump_dest=/u01/app/oracle/admin/manual/bdump
core_dump_dest=/u01/app/oracle/admin/manual/cdump
user_dump_dest=/u01/app/oracle/admin/manual/udump
audit_file_dest=/u01/app/oracle/admin/manual/adump
control_files=("/u01/app/oracle/oradata/manual/control01.ctl",/u01/app/oracle/oradata/manual/control02.ctl)
db_recovery_file_dest=/u01/app/oracle/flash_recovery_area/manual/
db_recovery_file_dest_size=2147483648
log_archive_format=%t_%s_%r.dbf
compatible=10.2.0.1.0
remote_login_passwordfile=EXCLUSIVE
undo_management=AUTO
undo_tablespace=UNDOTBS1
5、使用已创建的参数文件启动数据库实例到nomount状态
SQL>startup nomount pfile=/u01/app/oracle/admin/manual/pfile/init.ora
ORACLE instance started.
Total System Global Area285212672 bytes
Fixed Size1218992 bytes
Variable Size92276304 bytes
Database Buffers188743680 bytes
Redo Buffers2973696 bytes
6、然后执行SQL语句创建数据库
SQL> create database manual
2datafile '/u01/app/oracle/oradata/manual/system01.dbf' size 300m reuse
3autoextend on next 10240K maxsize unlimited
4extent management local
5sysaux datafile '/u01/app/oracle/oradata/manual/sysaux01.dbf' size 120m reuse
6autoextend on next 1024k maxsize unlimited
7smallfile default temporary tablespace
8temp tempfile '/u01/app/oracle/oradata/manual/temp01.dbf' size 20m reuse
9autoextend on next 640k maxsize unlimited
smallfile undo tablespace "UNDOTBS1"datafile '/u01/app/oracle/oradata/manual/undotbs01.dbf' size 200m reuse autoextend on next 5120k maxsize unlimited
11character set ZHS16GBK
12NATIONAL CHARACTER SET AL16UTF16
13logfile group 1('/u01/app/oracle/oradata/manual/redo01.log') size 51200k,
14group 2('/u01/app/oracle/oradata/manual/redo02.log') size 51200k,
15group 3('/u01/app/oracle/oradata/manual/redo03.log') size 51200k
16user sys identified by oracle
17user system identified by oracle;
Database created.
7、创建用户默认表空间users
SQL> create smallfile tablespace users logging datafile '/u01/app/oracle/oradata/manual/user01.dbf' size 5M reuse autoextend on next 1280K maxsize unlimited extent management local segment space management auto;
8、指定用户默认表空间为users
SQL> alter database default tablespace users;
9、安装数据字典
SQL> @/u01/app/oracle/product/10.2.0/db_1/rdbms/admin/catalog.sql
SQL> @/u01/app/oracle/product/10.2.0/db_1/rdbms/admin/catproc.sql
10、以system用户创建PL/SQL资源集
SQL> connect system/oracle
Connected.
SQL> @/u01/app/oracle/product/10.2.0/db_1/sqlplus/admin/pupbld.sql
SQL> @/u01/app/oracle/product/10.2.0/db_1/sqlplus/admin/help/hlpbld.sql helpus.sql
一个简化版的数据库创建完成
SQL> select status from v$instance;
```

#### 重建索引
```
alter index xxx rebuild online;
```

#### 查看表空间的使用情况
```
select file_name,TABLESPACE_NAME,
       ceil( (nvl(hwm,1)*8192)/1024/1024 ) smallest,
       ceil( blocks*8192/1024/1024) currsize,
       ceil( blocks*8192/1024/1024) -
       ceil( (nvl(hwm,1)*8192)/1024/1024 ) savings
from dba_data_files a,
     ( select file_id, max(block_id+blocks-1) hwm
         from dba_extents
        group by file_id ) b
where a.file_id = b.file_id(+);

SELECT SUM(bytes) / (1024 * 1024) AS free_space, tablespace_name
FROM dba_free_space
GROUP BY tablespace_name;

SELECT a.tablespace_name,
a.bytes/(1024 * 1024*1024) total,
b.bytes used,
c.bytes free,
(b.bytes * 100) / a.bytes "% USED ",
(c.bytes * 100) / a.bytes "% FREE "
FROM sys.sm$ts_avail a, sys.sm$ts_used b, sys.sm$ts_free c
WHERE a.tablespace_name = b.tablespace_name
AND a.tablespace_name = c.tablespace_name;

select
b.file_id 文件ID号,
b.tablespace_name 表空间名,
b.bytes/1024/1024||'M'字节数,
(b.bytes-sum(nvl(a.bytes,0)))/1024/1024||'M' 已使用,
sum(nvl(a.bytes,0))/1024/1024||'M' 剩余空间,
100 - sum(nvl(a.bytes,0))/(b.bytes)*100 占用百分比
from dba_free_space a,dba_data_files b
where a.file_id=b.file_id
group by b.tablespace_name,b.file_id,b.bytes
order by b.file_id;
```

#### 查看表空间物理文件的名称及大小
```
SELECT tablespace_name,
file_id,
file_name,
round(bytes / (1024 * 1024), 0) total_space
FROM dba_data_files
ORDER BY tablespace_name;
```

#### 查看回滚段名称及大小
```
SELECT segment_name,
tablespace_name,
r.status,
(initial_extent / 1024) initialextent,
(next_extent / 1024) nextextent,
max_extents,
v.curext curextent
FROM dba_rollback_segs r, v$rollstat v
WHERE r.segment_id = v.usn(+)
ORDER BY segment_name;
```

#### 查看控制文件
```
SELECT NAME FROM v$controlfile;
```

#### 查看日志文件

```
SELECT MEMBER FROM v$logfile;
```

#### 查看数据库库对象
```
SELECT owner, object_type, status, COUNT(*) count#
FROM all_objects
GROUP BY owner, object_type, status;
```

#### 查看数据库的版本
```
SELECT version
FROM product_component_version
WHERE substr(product, 1, 6) = 'Oracle';
```

#### 查看数据库的创建日期和归档方式
```
SELECT created, log_mode, log_mode FROM v$database;
```

#### 临时表空间使用情况
```
select 'the ' || name || ' temp tablespaces ' || tablespace_name ||
       ' idle ' ||
       round(100 - (s.tot_used_blocks / s.total_blocks) * 100, 3) ||
       '% at ' || to_char(sysdate, 'yyyymmddhh24miss')
  from (select d.tablespace_name tablespace_name,
               nvl(sum(used_blocks), 0) tot_used_blocks,
               sum(blocks) total_blocks
          from v$sort_segment v, dba_temp_files d
         where d.tablespace_name = v.tablespace_name(+)
         group by d.tablespace_name) s,
       v$database;
```

#### 清理归档
```
rman target sys/pass@prjdb
crosscheck archivelog all;
delete archivelog until time 'sysdate';
delete expired archivelog all;--删除过期日志
```

#### 查找备份
```
Crosscheck backup;
```

#### 数据库启动
```
oracle启动分为三步：
nomount --根据参数文件启动实例（instance）
mount --加载控制文件，让实例和数据库相关联
open --根据控制文件找到并打开数据文件和日志文件，从而打开数据库
```

#### RMAN恢复
<http://ylw6006.blog.51cto.com/470441/659104/>

<http://blog.sina.com.cn/s/blog_95b5eb8c0101cvvz.html>

不完全恢复 <http://blog.chinaunix.net/uid-363820-id-3228590.html>

部分原理 <http://blog.chinaunix.net/uid-20274021-id-1969571.html>

```
RMAN> set dbid 1287906064;       //指定DBID，需要和源服务器的DBID一致

RMAN> startup nomount force;                                       //重启实例到nomout状态
RMAN> startup mount force;
RMAN> startup open force;

RMAN> restore spfile to 'D:\oracle\product\10.2.0\admin\crm\pfile\init.ora.328201583534' from 'D:\a\06QHNCNK_1_1';       //恢复参数文件
RMAN> restore controlfile from 'D:\a\06QHNCNK_1_1';

RMAN> restore database;         //还原数据库文件
RMAN> recover database;         //恢复数据库文件，这里将报错

RMAN> recover database until time 'sysdate-1';

RMAN> alter database open resetlogs;
```

#### RMAN中format的参数含义
```
format 的替换变量，注意大小写！
%d　　--数据库的db_name
%n　　--数据库的8位长度的db_name，不足部分用“x”后面填充
%N　　--数据库表空间的name
%I　　 --数据库的dbid
%T　　--年月日（YYYYMMDD） == %Y%M%D
%t　　 --9位字符的timestamp
%s　　 --备份集序号
%p　　 --备份片序号
%c　　 --备份片的多个copy的序号
%e　　 --archived redo file 的序列号，只能用在archived redo 上
%f　　 --datafile filenmuber，只能用在备份datafile、tablespace上，否则没有意义
%F　　--复合format == c-IIIIIIIIII-YYYYMMDD-QQ，其中IIIIIIIIII为dbid，YYYYMMDD为年月日，QQ为十六进制的备份片的多个copy的序号（00-ff）。
%u　　--8为字母唯一串
%U　　--复合format ==
backupset：%u_%p_%c
copy of datafile：data-D-%d_id-%I_TS-%N_FNO-%f_%u
copy of archived log：arch-D_%d-id-%I_S-%e_T-%h_A-%a_%u
copy of controlfile：cf-D_%d-id-%I_%u
```

#### mount下做的全备份
```
1、如果先恢复控制文件，再恢复数据文件，必须resetlogs；
2、如果控制文件不需要恢复，只恢复数据文件：
2.1、如果redo丢失，则recover database noredo，再resetlogs；
2.2、如果redo没丢失，则recover database，再直接open，不需resetlogs
```

#### 删除表空间
```
正常情况下，删除表空间的正确方法为：
DROP TABLESPACE tablespace_name INCLUDING CONTENTS AND DATAFILES;
如果没有通过以上命令删除而直接删除了数据文件，将导致数据库无法打开

Oracle 10G R2开始 Alter tablespace tablespace_name drop datafile file_name;课题删除一个空数据文件，并且相应的数据字典信息也会清
oracle 10g可以删除临时表空间的文件
```


#### 开关归档模式
<http://www.cnblogs.com/xwdreamer/p/3793792.html>
```
shutdown immediate
startup mount;
alter database archivelog;
alter database noarchivelog;
alter database open;
```

#### 表重建
```
执行表重建指令 alter table table_name move;
       在线转移表空间ALTER TABLE ... MOVE TABLESPACE ..
当你创建了一个对象如表以后,不管你有没有插入数据,它都会占用一些块,ORACLE也会给它分配必要的空间.同样,用ALTER TABLE MOVE释放自由空间后,还是保留了一些空间给这个表.
ALTER TABLE ...  MOVE 后面不跟参数也行，不跟参数表还是在原来的表空间，Move后记住重建索引. 如果以后还要继续向这个表增加数据，没有必要move， 只是释放出来的空间，只能这个表用，其他的表或者segment无法使用该空间。
```

#### 创建用户
```
create user dataplant identified by dataplant;
grant connect,resource to dataplant;
create tablespace dataplant datafile '/crmdat1/CRM/datafile/dataplant.dbf' size 10G;
alter user dataplant default tablespace dataplant;
```

#### 删除用户及表空间
```
drop tablespace tablespace_name including contents and datafiles;
drop user xxxx;
```

#### 临时表
```
create global temporary table
```

#### 表文件大小
```
select sum(bytes/1024/1024/1024) from user_segments where segment_name='xxx'
```

#### 并行创建索引
```
create index ETL_DATE_IDX on  xxx(ETL_DATE) tablespace xxx parallel 8;
ALTER TABLE xxx DROP CONSTRAINT SYS_C005449;
ALTER TABLE xxx ADD PRIMARY KEY(ETL_DATE, PRIM_ACCT_NUM, SUB_ACCT_NUM) parallel 8;
```

#### 跳过索引
```
select /*+full(CRM_G_CUST_INDEX)*/
```

#### 数据文件创建时间
```
$datafile.CREATION_TIME和v$datafile_header.CREATION_TIME这两个列都是表示数据文件的创建时间
1.当v$datafile.CREATION_TIME与v$datafile_header.CREATION_TIME不一致时数据库不能正常启动
2.v$datafile.CREATION_TIME的值来源于v$datafile_header.CREATION_TIME
3.而v$datafile_header.CREATION_TIME的值来源于数据文件头的块中的信息
```

#### 分区表（10g开始有）
<http://www.cnblogs.com/flowerszhong/p/4535206.html>
```
create table xxx
(xxx
)
partition by range (ETL_DATE)
(
  partition P201207 values less than (TO_DATE(' 2012-08-01 00:00:00', 'SYYYY-MM-DD HH24:MI:SS', 'NLS_CALENDAR=GREGORIAN')),
  partition P201212 values less than (TO_DATE(' 2013-01-01 00:00:00', 'SYYYY-MM-DD HH24:MI:SS', 'NLS_CALENDAR=GREGORIAN')),
  partition PMAX values less than (MAXVALUE)
);

alter table XXX add partition p*** values less than(***);
```
```
分区提供以下优点：
（1）由于将数据分散到各个分区中，减少了数据损坏的可能性；
（2）可以对单独的分区进行备份和恢复；
（3）可以将分区映射到不同的物理磁盘上，来分散IO；
（4）提高可管理性、可用性和性能。

Oracle 10g提供了以下几种分区类型：
（1）范围分区（range）；
（2）哈希分区（hash）；
（3）列表分区（list）；
（4）范围－哈希复合分区（range-hash）；
（5）范围－列表复合分区（range-list）。
```


#### 归档恢复
```
一、完全恢复：
1．使用命令“svrmgrl”调用行方式服务器管理；
2．输入命令“connect internal”，然后输入命令“startup mount’；
3．输入命令“recover database;”
4．按下ENTER，接受默认值。
5．然后输入命令“alter database open;”完成数据库恢复。

二、不完全恢复
警告：
应用不完成恢复前，必须将数据库做一次完全冷备份，因为应用不完全恢复后，联机重演日志将重置，以前的所有日志不可用。
如果恢复不成功，数据库就不能使用了。再次强调，做完全冷备份后再应用不完全恢复。

1）.基于变化的恢复(change-based recovery)
    要执行基于变化的恢复，需要知道丢失日志之前的系统写入归档重演日志的最大的变化号(SCN)，然后可以启动恢复语句恢复数据库直到改变scn_number，其中比scn_number是写到已归档重演日志文件顺序号386的SCN(即，小于丢失日志顺序号387的SCN)。可以从V$log_history视图中得到SCN信息。

select first_change# from v$log_history where sequence#=387;

其中387为最后一个有效的日志文件号加1,该例是查找386.
知道了SCN后，使用下述步骤完成恢复
1．使用命令“svrmgrl”调用行方式服务器管理；
2．输入命令“connect internal”，然后输入命令“startup mount’；
3．输入命令“recover database until change 9999;”
4．在回答Oracle第一个归档重演日志建议信息时，输入“auto”,Oracle在找到第387号重演日志之前停止恢复。
5．用命令“alter database open resetlogs;”打开数据库。(应用该命令前请确认数据库已备份，如打开失败，日志将不可用)

2).基于停止恢复(cancel-based recovery)
1．使用命令“svrmgrl”调用行方式服务器管理；
2．输入命令“connect internal”，然后输入命令“startup mount’；
3．输入命令“recover database until cancel;”,Oracle提示需要的第一个归档重演日志文件名．按下ENTER键接受缺省文件名，并且—路ENTER直到询问顺序号387的日志。输入“cancel”，停止恢复操作。
4．用命令“alter database open resetlogs;”打开数据库。(应用该命令前请确认数据库已备份，如打开失败，日志将不可用)

3).基于时间的恢复(time-based recovery)
为使用基于时间的恢复，必须知道记录在V$log_history归档重演日志序号387（丢失重演日志）的时间，通过执行查询语句“select time from v$log_history where sequence#=387;”得到。本例得到的时间是：2002-06-23 14：42：04

现在开始实施恢复。
1．使用命令“svrmgrl”调用行方式服务器管理；
2．输入命令“connect internal”，然后输入命令“startup mount’；
3．输入命令“recover database until time '2002/06/23 14:42:04';”,Oracle提示需要的第一个归档重演日志文件名，输入“auto”，Oracle恢复归档重演日志直到序号为387的日志，停止恢复操作。
4．用命令“alter database open resetlogs;”打开数据库。(应用该命令前请确认已数据库已备份，如打开失败，日志将不可用)

提示： 使用基于时间的恢复，时间的格式是YYYY/MM/DD HH24:MI:SS,并且用单引号括起。
```

#### 启用Oracle的归档方式
```
1.参照以下内容编辑init.ora文件：
log_archive_start = true
log_archive_dest_1 = " LOCATION=D:\Oracle\oradata\ORCL\archive "
og_archive_format = %%ORACLE_SID%%T%TS%S.ARC
2.关闭数据库
svrmgrl> connect internal
svrmgrl> shutdown normal
3.然后启动实例并安装该数据库，但不打开数据库。
svrmgrl> startup mount
4.接着，发布下列更改数据库的命令。
Svrmgrl> alter database archivelog;
5.现在，数据库已经更改为归档方式，您可以打开数据库。
svrmgrl> alter database open;

提示：也可以使用DBA studio工具启用数据库的归档方式，操作很简单
```

#### 字段级修改
```
create table TEST
(
  ID   NUMBER not null,
  NAME VARCHAR2(20)
)
ALTER TABLE SCOTT.TEST RENAME TO TEST1--修改表名
ALTER TABLE SCOTT.TEST RENAME COLUMN NAME TO NAME1 --修改表列名
ALTER TABLE SCOTT.TEST MODIFY NAME1 NUMBER(20)  --修改字段类型
ALTER TABLE SCOTT.TEST ADD ADDRESS VARCHAR2(40) --添加表列
ALTER TABLE SCOTT.TEST DROP COLUMN ADDRESS --删除表列
```
