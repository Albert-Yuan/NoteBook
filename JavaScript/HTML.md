# HTML
- 超文本标记语言 HyperText Markup Language Html5

```html
<!DOCTYPE html>
<head>
    <title>我的页面标题</title>
    <meta charset="utf-8">
</head>
<body>
<h1>标题</h1>
<hr width=50% align=left size=2>
<abbr titl='中华人民共和国'>PRC</abbr>
<bdo dir=rtl>部分效果在不同<bdi>浏览器</bdi>的表现会不同</bdo>
<p>
    段落1
    <br>段内分行
</p>
<hgroup>
<h2>标题</h2>
<h2>标题</h2>
</hgroup>
<P id=here>
<a href="http://www.baidu.com" target="_blank">页面显示的链接</a>
<a href="test.html">页面显示的链接</a>
<a href="test.html#here">页面显示的链接</a>
<a href="#here">页面显示的链接</a>
    段落2<b>段落2段落2<i>段落2</i></b>段落2<tt>段落2</tt>段落2
</P>
<p>
<ul>
    <li>aaa</li>
    <li>bbb</li>
    <li>ccc</li>
</ul>
<ol start=-2>
    <li>1111</li>
    <li>2222</li>
    <li>3333</li>
</ol>
<dl>
    <dt>数字</dt>
    <dd>包括1,2,3,4</dd>
</dl>
<img src="a.jpg" width=10% height="200" alt="图片" usemap="#map1">
<map name="map1">
    <area shape="rect" coords="0,0,50,50" href="http:www.123.com" alter="news">
    <area shape="circle" coords="75,75,75" href="http:www.456.com" alter="home">
</map>
<iframe src="www.baidu.com"></iframe>
</p>
<p>
    <table border="1">
    <thead>
        <tr>
            <th>表头1</th>
            <th>表头2</th>
            <th>表头3</th>
        </tr>
    </thead>
        <tr>
            <td>格子1</td>
            <td>格子2</td>
            <td>格子3</td>
        </tr>
        <tr>
            <td colspan="2">格子1</td>
            <td></td>
        </tr>
    </table>
</p>
</body>
```

### html代表内容 CSS代表样式
- 最好使用CCS 部分效果在不同浏览器的表现会不同

### 文字格式 标记
- p paragraph || br break ||
- 最好使用CCS
- b Bold 加粗
- i Italic 斜体
- tt 等宽西文字体
- small 字体变小
- del 删除线
- ins 下划线
- s 过时的、不被推荐的 类del
- sup 上标 sub下标
- mark 重要 高亮
- em 敲掉
- abbr 缩写
- bdo 有排序功能的标记 bdi在排序中再次逆序的标记

### 段语格式 标记
- strong 着重
- fn definition 定义
- code 代码 行级别
- samp 例子代码
- kbd 用户输入
- var 变量

### 其他格式 标记
- cite 引用
- address 地址
- blockquote 缩进 可以嵌套
- q 引用
- pre 预格式化 不会再进行格式化操作
- hr 水平线 无结束
- img 图片 无结束 注意：html将图片视为一个字符 jpg gif png
- iframe 取链接网址的内容
- a 超链接 属性：target="_blank" 新的窗口打开 _top _self
- table 表格 tr 行 td 格子 th 表头 thead 冻结表头 tbody 冻结内容 tfoot 冻结脚注 注意：html将table视为一个字符

### 属性
- rtl 逆向展示 bdo的属性
- alt 图片加载时或失败的文字说明
- id p h1 等均可用

### 其他
- &lt; &gt; &amp; &nbsp;
- &uuml; &Uuml;

### html多行表格排版
``` html
<div style="height: 20px;clear: both;">
        <div id="resultDiv">
            <div> <span>111111111111</span><span>2</span></div>
            <div> 3</div>
            <div> 4</div>
        </div>

        <div style="overflow: hidden;background: #f00;">
            <div style="float: left;width: 20px;background: #ccc;">1</div>
            <div style="float: left;width: 20px;background: #333;">
                <div style="width: 10px;background: #666;">2</div>
                <div style="width: 10px;background: #666;">3</div>
            </div>
        </div>

        <div style="overflow: hidden;">
            <div style="float: left;width: 20px;background: #ccc;">1</div>
            <div style="float: left;width: 200px;background: #333;">
                <div style="width: 200px;background: #666;">
                    <span style="float: left;width: 100px;">2</span>
                    <span style="float: left;width: 100px;">3</span>
                </div>
                <div style="width: 200px;background: #666;">
                    <span style="float: left;width: 100px;">4</span>
                    <span style="float: left;width: 100px;">5</span>
                </div>
            </div>
        </div>

        <div id="resultDiv">
            <div> 11</div>
            <div> 22</div>
            <div> 33</div>
            <div> 44</div>
        </div>
    </div>
```
