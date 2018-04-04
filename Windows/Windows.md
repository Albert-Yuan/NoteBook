# Windows

####修改配置路由表
```
route -p add 0.0.0.0 mask 0.0.0.0 192.168.0.1 metric 1
route -p add 0.0.0.0 mask 0.0.0.0 192.168.0.115 metric 20
route -p add 0.0.0.0 mask 0.0.0.0 30.16.201.107 metric 300

route -p add 0.0.0.0 mask 0.0.0.0 192.168.0.1

route delete 0.0.0.0

route -p add 10.18.20.0 mask 255.255.255.0 30.16.201.107 metric 10
route -p add 30.16.3.0 mask 255.255.255.0 30.16.201.107 metric 10
route -p add 10.18.10.0 mask 255.255.255.0 30.16.201.107 metric 10
route -p add 172.16.241.0 mask 255.255.255.0 30.16.201.107 metric 10
route -p add 172.16.1.0 mask 255.255.255.0 30.16.201.107 metric 10

route delete 10.18.20.0
route delete 30.16.3.0
route delete 10.18.10.0
route delete 176.16.55.0
route delete 172.16.241.0
route delete 172.16.1.0
```
