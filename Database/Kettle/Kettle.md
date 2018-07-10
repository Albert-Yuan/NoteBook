# Kettle

### kettle.properties
#### 路径：C:\Users\cnbjpuhui-384\.kettle
#### 空字符串释成''(默认解释成null)
```sh
KETTLE_EMPTY_STRING_DIFFERS_FROM_NULL=Y
```

#### 明文密码加密
```sh
D:\Program Files\Kettle\data-integration\Encr.bat -kettle password
```

#### 直接执行JOB
```sh
sh /data/cloud/deploy/src/pdi-ce-5.3.0.0/kitchen.sh -rep PUHUI_TEST -dir /JOB_File -job JOB_NAME -level=Detailed > 1.log
```

#### 直接执行trans
```sh
sh /data/cloud/deploy/src/pdi-ce-5.3.0.0/pan.sh -rep PUHUI_BI -dir /trans_file -trans trans_name -level=Detailed -param:tx_date='20170118'
```

####行级日志 个别需要注意大小写
```
Nothing 没有日志 不显示任何输出
Error 错误日志 仅仅显示错误信息
Minimal 最小日志 使用最小的日志
Basic 基本日志 缺省的日志级别
Detailed详细日志 给出日志输出的细节
Debug 调试日志 调试目的，调试输出
Rowlevel行级日志 打印出每一行记录的信息
```

#####使用Mongo组件：java.lang.NoClassDefFoundError: javax/crypto/spec/PBEKeySpec
```
目录：data-integration\system\karaf\etc\config.properties
文件中下部有一行 org.osgi.framework.bootdelegation=（一堆参数）
在末尾处加上  ,javax.crypto,javax.crypto.*
Mongo就可以正常连接读取数据了。
```

#####使用Mongo组件时Detail日志会把读到的详细数据也打印出来

#####kettle mongodb 问题与解决 使用更新更稳定的版本会更好地解决问题
```
使用MongoDB Input时，在linux环境遇到问题，组件位置不报错，但是无法获取数据，经过排查，推测和下面的ERROR有关
21:09:22,952 ERROR [KarafLifecycleListener] The Kettle Karaf Lifycycle Listener failed to execute properly. Releasing lifecycle hold, but some services may be unavailable.

Karaf即Apache Karaf

#报错下的配置信息
#版本其实是6.0.1没改目录名
Karaf Instance Number: 2 at /home/dataDir/cloud/deploy/src/pdi-ce-5.3.0.0/./system/karaf//data2
解决方法：/home/dataDir/cloud/deploy/src/pdi-ce-5.3.0.0/./system/karaf/ 目录修改为其他名字，新建空的karaf目录，执行脚本，有报错信息（因为包括重要文件）
          切回原来的karaf目录，再次执行，不在报错，数据正常获取和写入
问题原理：推测由于在windows使用过，Karaf使用了windows的方式记录了缓存，不知道自身切换了环境，在linux下无法正常继续运行，切换时重新检查了环境

#修复后的配置信息
Karaf Instance Number: 1 at /home/dataDir/cloud/deploy/src/pdi-ce-5.3.0.0/./system/karaf//data1

#后续又发现当时用data2还是会报错
老套路，新建一个空的karaf//data2，补充了从其他data复制的txlog目录，发现其他脚本向这里写了缓存，成功替换

#log4j本来是WARN,现在成了ERROR
log4j:ERROR Could not parse url [file:/home/dataDir/cloud/deploy/src/pdi-ce-5.3.0.0/./system/osgi/log4j.xml].

事实上/home/dataDir/cloud/deploy/src/pdi-ce-5.3.0.0/./system下并没有osgi目录（.代表当前目录，在这里没有含义）

log4j猜测是Karaf的组件

只有jar和zip
grep 'log4j\\.xml' -rl /home/dataDir/cloud/deploy/src/pdi-ce-5.3.0.0/

没有结果
grep 'osgi\\/log4j\\.xml' -rl /home/dataDir/cloud/deploy/src/pdi-ce-5.3.0.0/

最终我伪造了osgi目录，并把从/home/dataDir/cloud/deploy/src/pdi-ce-5.3.0.0/classes搜到的log4j.xml复制到目录，不再报错


#偶尔出现，该Error并不影响正常跑批执行从观察来看是大数据相关的几个引用load失败
#也有人说这是一个已发现的bug，会在7.0中修复https://stackoverflow.com/questions/46360955/spoon-takes-insanely-long-time-to-start

17:58:32,695 ERROR [KarafLifecycleListener] Error in Blueprint Watcher
org.pentaho.osgi.api.IKarafBlueprintWatcher$BlueprintWatcherException: Unknown error in KarafBlueprintWatcher
    at org.pentaho.osgi.impl.KarafBlueprintWatcherImpl.waitForBlueprint(KarafBlueprintWatcherImpl.java:89)
    at org.pentaho.di.osgi.KarafLifecycleListener$2.run(KarafLifecycleListener.java:112)
    at java.lang.Thread.run(Thread.java:745)
Caused by: org.pentaho.osgi.api.IKarafBlueprintWatcher$BlueprintWatcherException: Timed out waiting for blueprints to load: pentaho-big-data-api-hdfs,pentaho-big-data-impl-vfs-hdfs,pentaho-big-data-impl-clusterTests
    at org.pentaho.osgi.impl.KarafBlueprintWatcherImpl.waitForBlueprint(KarafBlueprintWatcherImpl.java:77)
    ... 2 more

由于找不到相关资料，我尝试找到包含pentaho-big-data-api-hdfs的配置文件
grep "pentaho-big-data-impl-vfs-hdfs" -rl ./
/home/dataDir/cloud/deploy/src/pdi-ce-5.3.0.0/system/karaf/system/pentaho-karaf-features/pentaho-big-data-plugin-osgi/6.0.1.0-386/pentaho-big-data-plugin-osgi-6.0.1.0-386-features.xml
删除了错误提示中的未能正确load的项目配置信息，跑一个脚本测试未发现问题，待后续观察日志

周末过后检查发现仍然报改错，因为包含信息的只有cache目录，尝试删除/system/karaf/data1/cache目录，待后续观察日志

修改后观察到出现了新的错误，继续删除配置文件其他组件，pentaho-big-data-impl-shim-hdfs,pentaho-big-data-impl-shim-shimTests等
之后未再次出现该问题
#根据网上相关资料，配置文件是大数据插件的一部分，可以通过移除pentaho-big-data-plugin来解决，未实践
/home/dataDir/cloud/deploy/src/pdi-ce-5.3.0.0/plugins/pentaho-big-data-plugin

#网上提到比较多的解决方案
#虽我是6.0.1的版本，但是第一种方法导致出现了更多的报错，而且用了不太好对的移除方法；第二种方法我已经是目标状态

1、(6.0版本)修改 <pdi_home>/classes目录下kettle-lifecycle-listeners.xml和kettle-registry-extensions.xml两个文件成下面这样:
kettle-lifecycle-listeners.xml
<listeners>
</listeners>
kettle-registry-extensions.xml
<registry-extensions>
</registry-extensions>

2、(6.1版本)修改<pdi_home>/system/karaf/etc/org.apache.karaf.features.cfg
把featuresBoot=config,pentaho-client,pentaho-metaverse,pdi-dataservice,pdi-data-refinery
改成featuresBoot=config,pentaho-client,pentaho-metaverse,pdi-dataservice
然后删除 <pdi_home>/system/karaf/caches目录

cfgbuilder - Warning: The configuration parameter [org] is not supported by the default configuration builder for scheme: sftp
#想把这个Warning也处理掉
#有人解释说这是一个bug，将会在7.0中得到解决 It is listed as a bug which indicates it will be resolved in v7.0.


#虽然最终解决了问题，而且有些插件和功能是不使用的，但是资料太少，没能从原理上解决，还是很遗憾
```
