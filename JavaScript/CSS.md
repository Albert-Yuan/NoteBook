# CSS
- 层叠样式表 控制 html的样式 CSS3



```html
<DOCTYPE=html>
<!DOCTYPE html>
<html>
<head>
    <title>我的页面</title>
    <meta charset="utf-8">
    <style type="text/css">
        p {background-color: gray;}
    </style>
</head>
<body style="background-color: transparent;">
<p style="background-color:#FF0000;">
    段落1
</p>
<p style="background-color:rgb(255,255,0);background-attachment: fixed;">
    段落2
</p>
<p style="background-image: url(1.jpg);background-repeat:no-repeat;background-position:top right">
    段落3
</p>
<p style="corlor:red;text-indent:-2em;padding:2em;line-height:2;derection:rtl;">
    段落4<br>
    段落4<br>
    段落4<br>
    段落4<br>
</p>
<p style="text-align=left;word-spacing: 10px;text-transform: capitalize;text-decoration:underline overline;">
    段落5<br>
    段落5<br>
    段落5<br>
</p>
<p style="white-space: pre-wrap;font-family: serif;">
    段落6    段落6
    段落6段落6段落6
</p>
<p style="white-space: pre-wrap;font-family: serif;font-style:italic;font-variant: small-caps;font-weight: bold;">
    段落7
    段落7
</p>
<p style="font-size: 2em;text-shadow: 3px 5px 5px rgba(0,255,0,0.5),0px 1px 3px #606060;color: #606060">
    段落8
    段落8
</p>
<p style="outline-color: red;outline-style: solid;outline-width: 5;">
    段落9
    段落9
</p>
</body>
</html>
```


- transparent 透明颜色
- rgb red green blue #rrggbb rgb(255,255,255)
- rgba 增加透明度属性 rgba(255,0,0,0.5)
- background-repeat 图片重复 值：repeat-x repeat-y
- background-position 图片位置 值：top right left bottom center
- background-attachment 上下滚送 值：fixed 锁定
- background 固定顺序录入多个参数 color image repeat attachment position
- text-indent 缩进 em 当前字体的倍数 %页面的宽度 in 英寸 mm cm px pt 磅(1/72英寸) 可以为负
- padding 内边距 和整体布局相关
- line-height 行间距
- text-align 对齐方式 left right justify(中间对齐)
- word-spacing 词间距 针对空格分隔 letter-spacing 字符间距
- text-transform 变形 属性：uppercase lowercase 大小写 capitalize 首字母大写
- text-decoration 文字装饰 underline overline line-through brink(闪烁，不一定支持)
- white-space 空格回车处理 pre(不再格式化) pre-wrap(自动换行) nowrap pre-line(合并空格保持换行)
- derection 文字顺序 希伯来文 阿拉伯人  注意：中英文只有最后一行的符号会提到最前
- font-family 字体系列 serif 大多数英文字体 sans-serif monospace 等宽 cursive fatasy 注意：依次寻找‘,’分隔的多个字体
- font-style 倾斜 italic 字体里的斜体 obique 浏览器计算的斜体 normal
- font-weight 加粗
- text-shadow 文字阴影 1.X轴距文字延伸 2.Y轴距文字延伸 3.阴影范围 4.颜色 *多个阴影可组成特殊的光影效果
- outline-xxx 外边框 style:solid 线 dotted 点线 dashed 划线 double 双线 groove 凹槽 ridge 凸槽 inset 凹边 outset 凸边
