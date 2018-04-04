# DB2

#### 安装

```sh
./db2_install -b /home/db2 -p client db2level
```

#### 编目  gbk

```sh
db2set db2codepage=1386
S0621BA6

db2 catalog tcpip node HX01 remote 30.16.3.6 server 446
db2 terminate
db2 catalog database S10EB123 as NHX01 at node HX01
db2 terminate
db2 connect to NHX01 user COMM using COMM

db2 catalog tcpip node HX02 remote 30.16.3.6 server 446
db2 terminate
db2 catalog database S10EB133 as NHX02 at node HX02
db2 terminate
db2 connect to NHX02 user COMM using COMM

db2 catalog tcpip node HX03 remote 30.16.3.6 server 446
db2 terminate
db2 catalog database S0621BA6 as HX03 at node HX03
db2 terminate
db2 connect to HX03 user COMM using COMM

db2 bind /opt/IBM/db2/V9.7/bnd/@db2cli.lst blocking all grant public

db2 bind /opt/IBM/db2/V9.7/bnd/@db2ubind.lst blocking all grant public
```


#### 数据库节点编目
```sh
 db2 catalog tcpip node test remote 172.16.3.8 server 446
 db2 terminate
 db2 catalog database 服务器名称 as 别名 at node node名
 db2 terminate
 连接数据库:
 db2 connect to node名称 user COMM using COMM
 验证真实性
 db2 connect to HT02 user COMM using COMM(正确)
```

#### 删除数据库节点编目，数据库编目db删除
```sh
 db2 uncatalog db 数据库别名
 db2 uncatalog node 节点名称
```

#### 列出所有的编目目录以及节点
```sh
db2 list database directory
db2 list node directory
DB2CODEPAGE=1386
```
