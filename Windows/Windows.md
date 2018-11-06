# Windows

####修改配置路由表
```
route print: 打印当前的路由表

route delete：删除一条路由

route add: 增加一条路由, 如果最后加上 –p 选项，表示永久增加静态路由，重启后不会失效

route change: 更改一条路由

ping www.baidu.com:获得IP

route print
删除默认设置
route delete 0.0.0.0
普通路由，全走有线
route -p add 0.0.0.0 mask 0.0.0.0 10.100.129.73
0.0.0.0          0.0.0.0     10.100.129.1    10.100.129.73     10
0.0.0.0          0.0.0.0      10.10.180.1     10.10.180.70     30
route delete 0.0.0.0  #缺省路由
公司外网全部在10.121.0.0网段，增加此路由
ping www.baidu.com:获得IP
route -p add 10.121.0.0 mask 255.255.0.0 10.10.180.70
route delete 10.121.0.0
route -p add 10.121.0.211 mask 255.255.255.0 10.10.180.70
route delete 10.121.0.211

如果网关是在链路上，而目标网关是路由地址，应该在网络属性中定义IP配置
```
