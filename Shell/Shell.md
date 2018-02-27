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

####
```sh

```


#### Kettle自动补数脚本
- eg:sh yuan_ktr.sh 20160519 20160519 bi_trans bi_gd_sell_day.ktr

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