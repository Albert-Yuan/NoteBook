#Shell

####列出目录下包含内容的文件
```sh
grep puhui\\.  -rl ./repository_bi
l:查询多文件时只输出包含匹配字符的文件名
r:递归查询子目录
```

#### 列出目录下包含内容的文件和相关内容
```sh
find ./repository_bi -type f -name "*.ktr" | xargs grep "dw\\."
find ./repository_bi -type f  | xargs grep "query_word"
find ./ -mtime -2 |xargs grep 'Blueprint'

-name   filename             #查找名为filename的文件
-perm                        #按执行权限来查找
-user    username             #按文件属主来查找
-group groupname            #按组来查找
-mtime   -n +n                #按文件更改时间来查找文件，-n指n天以内，+n指n天以前
-atime    -n +n               #按文件访问时间来查GIN: 0px">
-ctime    -n +n              #按文件创建时间来查找文件，-n指n天以内，+n指n天以前
-nogroup                     #查无有效属组的文件，即文件的属组在/etc/groups中不存在
-nouser                     #查无有效属主的文件，即文件的属主在/etc/passwd中不存
-newer   f1 !f2              找文件，-n指n天以内，+n指n天以前
-ctime    -n +n               #按文件创建时间来查找文件，-n指n天以内，+n指n天以前
-nogroup                     #查无有效属组的文件，即文件的属组在/etc/groups中不存在
-nouser                      #查无有效属主的文件，即文件的属主在/etc/passwd中不存
-newer   f1 !f2               #查更改时间比f1新但比f2旧的文件
-type    b/d/c/p/l/f         #查是块设备、目录、字符设备、管道、符号链接、普通文件
-size      n[c]               #查长度为n块[或n字节]的文件
-depth                       #使查找在进入子目录前先行查找完本目录
-fstype                     #查更改时间比f1新但比f2旧的文件
-type    b/d/c/p/l/f         #查是块设备、目录、字符设备、管道、符号链接、普通文件
-size      n[c]               #查长度为n块[或n字节]的文件
-depth                       #使查找在进入子目录前先行查找完本目录
-fstype                      #查位于某一类型文件系统中的文件，这些文件系统类型通常可 在/etc/fstab中找到
-mount                       #查文件时不跨越文件系统mount点
-follow                      #如果遇到符号链接文件，就跟踪链接所指的文件
-cpio                %;      #查位于某一类型文件系统中的文件，这些文件系统类型通常可 在/etc/fstab中找到
-mount                       #查文件时不跨越文件系统mount点
-follow                      #如果遇到符号链接文件，就跟踪链接所指的文件
-cpio                        #对匹配的文件使用cpio命令，将他们备份到磁带设备中
-prune                       #忽略某个目录
```

#### 替换目录下的查找结果
```sh
sed -i "s/puhui.decision_score_tcard/puhui_decision.decision_score_tcard/g" `grep puhui.decision_score_tcard -rl ./repository_bi`
```


#### Kettle自动补数脚本
- eg:sh yuan_ktr.sh 20160519 20160519 bi_trans xxx.ktr

```sh
#!/bin/sh
JAVA_HOME=/usr/local/java/default
KETTLE_HOME=/data/cloud/deploy/confs/kettle/home
PATH=$JAVA_HOME/bin:$PATH
CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
export JAVA_HOME
export KETTLE_HOME
export PATH
export CLASSPATH
export LANG="en_US.UTF-8"
date=$(date +%Y%m%d)
cd /data/cloud/deploy/src/pdi-ce-5.3.0.0

start=$1
end=$2
dir=$3
work=$4

#echo 'Give me startday'
#read startday
#echo 'Give me endday'
#read endday

while [[ $start -le $end ]];do

len=`expr length $work - 4`
name=${work:0:$len}

if [[ ${work:0-4} == ".ktr" ]];then
./pan.sh -rep PUHUI_BI -dir /$dir -trans $name -level=Detailed -param:tx_date=$start >>/data/cloud/deploy/confs/kettle/run_bi/log/data_add_$date.log
fi

if [[ ${work:0-4} == ".kjb" ]];then
./kitchen.sh -rep PUHUI_BI -dir /$dir -job $name -level=Detailed -param:tx_date=$start >>/data/cloud/deploy/confs/kettle/run_bi/log/data_add_$date.log
echo "zz"
fi

echo $start "IS OVER!" >>/data/cloud/deploy/confs/kettle/run_bi/log/data_add_$date.log
echo $start "IS OVER!"

start=`date -d "$start +1 day" +%Y%m%d`

done
```

#### scp传输
```
scp /home/daisy/full.tar.gz root@192.168.1.1:/home/root
-a 尽可能将档案状态、权限等资料都照原状予以复制。
-r 若 source 中含有目录名，则将目录下之档案亦皆依序拷贝至目的地。
-f 若目的地已经有相同档名的档案存在，则在复制前先予以删除再行复制。
```

#### 后台命令执行
```
Linux
当在系统上执行下面的命令，将test.sh脚本放到后台执行
/location/test.sh &
此时，分两种情况考虑问题，
一：继续执行exit命令退出当前session, 则 test.sh这个脚本仍然在Linux系统里面运行，
二：不执行exit命令退出，而直接断开当前连接，则 test.sh脚本会立即退出
如果使用下面命令，将test.sh脚本放到后台执行
nohup /location/test.sh &
上面的两种情况，test.sh脚本都会继续在系统上运行，尽量同时使用nohup和&命令

AIX
当在系统上执行下面的命令，将test.sh脚本放到后台执行
/location/test.sh &
此时，按照上面Linux系统下的两种情况来看
一：继续执行exit命令退出当前session, 第一次会提示"You have running jobs", 再次执行exit后，test.sh脚本也将停止运行
二：不执行exit命令退出，而直接断开当前连接，则 test.sh脚本会立即退出
如果使用下面命令，将test.sh脚本放到后台执行
nohup /location/test.sh &
则，针对上面的两种情况来说，test.sh脚本都会继续在系统上运行。
```

####空操作
```
:
```


####日起计算
```
date -d "1 month -1 day 2018-05-01" +%Y-%m-%d

a=`date -d "\`date -d 2018-05-01 +%Y%m01\` last day" +%Y-%m-%d` --该写法必须有赋值
```


####捕获异常
```
echo $? #捕获上一条命令的输出 (if 0 正常 else 错误)
set -e 当命令以非零状态退出时，则退出shell，立即退出，避免错误被忽略，
1. 当命令的返回值为非零状态时，则立即退出脚本的执行。
2. 作用范围只限于脚本执行的当前进行，不作用于其创建的子进程。
3. 另外，当想根据命令执行的返回值，输出对应的log时，最好不要采用set -e选项，而是通过配合exit 命令来达到输出log并退出执行的目的。
```


###其他异常
```
trap [COMMAND] [SIGNAL] 只能够针对简单命令
代表trap会捕获信号[SIGNAL]后运行[COMMAND]
#!/bin/bash
trap “echo Fail unexpectedly on line \$FILENAME:\$LINENO!” ERR mkdir xxxx rm xxx
```


###字符集
- linux下vi查看gbk文件正常显示（默认字符集utf-8）":e ++enc=cp936"
- 字符集转换
```
iconv -f UTF-8 -t GBK 1.txt -o 2.txt
iconv -f GBK -t UTF-8 2.txt -o 3.txt
```


###不同系统间的行尾表示
- UNIX格式，每行的行尾都是用一个0x0a字符（换行字符LF）表示的，
- WINDOWS/DOS下每行的行尾都是用0x0d 0x0a两个字符（回车字符CR，换行字符LF）表示的，
- MAC机，每行的行尾都是0x0d字符表示，即回车字符CR。
