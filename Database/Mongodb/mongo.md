#Mongo

#####工具Studio-3T（可以使用邮箱获得社区权限）

#####java.lang.NoClassDefFoundError: javax/crypto/spec/PBEKeySpec
```
目录：data-integration\system\karaf\etc\config.properties
文件中下部有一行 org.osgi.framework.bootdelegation=（一堆参数）
在末尾处加上  ,javax.crypto,javax.crypto.*
Mongo就可以正常连接读取数据了。
```

#####使用Mongo组件时Detail日志会把读到的详细数据也打印出来

#####Studio-3T导出csv乱码
```
当mongdb的字符集是utf8时，因为csv的默认字符集是gbk
导出数据后为乱码，可用utf8的编辑器打开，再粘贴到新的csv文件中，会得到一次默认字符集转换
```
