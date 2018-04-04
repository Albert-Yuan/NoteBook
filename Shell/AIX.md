#### 压缩与解压缩

```
1、tar命令：可以为文件和目录创建档案。通俗的讲就是tar命令负责将文件或文件夹打包，但是并不提供压缩。通常情况下，压缩工具不能直接对文件夹压缩，因此对文件夹压缩时，先执行打包，再与其他工具配合执行压缩。
命令格式：
#tar -cvf (或xvf)+文件名+设备
C：是本地到其他设备
x：是其他设备到本地
r：是追加，比如打包时，将其他文件追加进来使用该参数。
t：显示tar包里的内容，但还原文件。
例如：
# tar –cvf bak.tar /test/bak      ---将/test/bak下所有文件及文件夹打包到bak.tar 文件中
# tar –rvf bak.tar /test/bak/1.txt  --将/test/bak/1.tx追加到bak.tar 文件中
# tar –xvf bak.tar              ---恢复bak.tar 包中的文件。
# tar –tvf bak.tar              ---显示bak.tar文件中的内容。

2、 gzip 命令：对文件进行压缩或者解压缩，执行压缩时生成后缀为gz的压缩文件，执行解压时可以用gzip –d 或者gunzip解压后缀为.gz的文件
例如：
# gzip bak.tar       -----对bak.tar进行压缩，同时生成bak.tar.gz文件
# gzip -d bak.tar.gz   -----将bak.tar.gz文件解压成tar包，需要再用tar命令恢复成文件。
# gzip -dc bak.tar.gz  |tar  xvf - ---调用tar命令，将后缀为tar.gz的文件直接解压成文件。

3、compress命令：对文件进行压缩，并生成一个后缀为.Z的压缩文件
   例如：
 # compress  test.log    ---将test.log文件压缩成test.log.Z文件
  如果用compress对一个文件夹进行压缩，首先调用tar将该文件夹打包，然后再进行压缩
可用compress -d或者uncompress解压后缀为.Z的文件
   若压缩的文件是文本文件，可用zcat直接查看压缩文件（不需要先解压，再用cat）
  # zcat  test.log.Z      ---直接查看test.log.Z文件的内容
 # uncompress -c bak.tar.Z |tar xvf -     ----直接解压后缀为tar.Z的文件

4、bzip2命令：压缩或者解压文件，压缩时会生成一个后缀为.bz2的压缩文件
   可用bzip2 -d或者gunzip2解压后缀为.bz2的文件
 # bzip2 bak.tar          ----用bzip2工具压缩bak.tar文件
 # bzip2 –d bak.tar.bz2 或者 gunzip2 bak.tar.bz2 ----解压后缀为bz2的文件
```

#### 查看进程

```
ps -ef|grep 1111
```
