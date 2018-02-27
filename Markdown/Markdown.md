# Markodwn
- 标记语言

## 标题(6级)
# 这是 H1
## 这是 H2
###### 这是 H6

## 引用
> ## 这是一个标题。
>
> 1.   这是第一行列表项。
> 2.   这是第二行列表项。
>
> 给出一些例子代码：
>
> return shell_exec("echo $input | $markdown_script");

## 列表

##### 无序列表 >>星号||加号||减号
- RED
+ GREEN
* Blue

##### 有序列表 >>数字加英文句点 前面的数字不会影响输出的HTML结果，系统会自动指定编号
1. Bird
2. McHale
3. Parish

```
HTML 标记
<ol>
<li>Bird</li>
<li>McHale</li>
<li>Parish</li>
</ol>
```

##### 注意事项
- 列表项目标记通常是放在最左边，也可以3个空格缩进，项目标记后面一定要接着至少一个空格或制表符
- 列表项目可以包含多个段落，每个项目下的段落都必须缩进4个空格或是1个制表符
- 如果要在列表项目内放进引用,那>就需要缩进
- 如果要放代码区块的话，该区块就需要缩进两次，也就是8个空格或是2个制表符
- 行首出现数字-句点-空白会误产生列表，可以在句点前面加上反斜杠规避

## 代码区块
    这是一个通过4个空格缩进形成的代码区块
- 在代码区块里面， & 、 < 和 > 会自动转成 HTML 实体

## 分隔线
- 三个以上星号||减号||底线

* * *

***

- - -

---

___

## 区块元素
- [链接名称](链接内容) 行内式
- [链接名称] [链接内容标记] 参考式
[链接内容标记]:链接内容

    This is [an example](http://example.com/ "Title") inline link.

    [This link](http://example.net/) has no title attribute

    This is [an example][foo] reference-style link.
[foo]: http://example.com/  "Optional Title Here"
[foo]: http://example.com/  'Optional Title Here'
[foo]: http://example.com/
    (Optional Title Here)

    [Google][]
[Google]: http://google.com/

##### 注意事项
- 链接中可以使用相对路径进行引用
- 链接辨别标签可以有字母、数字、空白和标点符号，但是并不区分大小写
- 隐式链接标记:省略链接标记，链接文字会被视为链接标记
- 链接定义可以放在文件中的任何地方，可以把它放在文件最后面，就像是注解一样

## 强调
*single asterisks*

_single underscores_

**double asterisks**

__double underscores__

un*frigging*believable

- 如果 * 或 _ 两边都有空白的话，它们就只会被当成普通的符号
- 用反斜线可以在文字前后直接插入普通的星号或底线

## 代码
Use the `printf()` function.

``There is a literal backtick (`) here.`

A single backtick in a code span: `` ` ``

Please don't use any `<blink>` tags.

`&#8212;` is the decimal-encoded equivalent of `&mdash;`.

## 图片

![行内式](/path/to/img.jpg "Optional title")

![参考式][id]
[id]: url/to/image  "Optional title attribute"

## 自动链接
<http://example.com/>

<a href="http://example.com/">http://example.com/</a>

## 反斜杠
    \   反斜线
    `   反引号
    *   星号
    _   底线
    {}  花括号
    []  方括号
    ()  括弧
    #   井字号
    +   加号
    -   减号
    .   英文句点
    !   惊叹号

## 删除线
~~删除内容~~

## 注脚 未实现

这是一个注脚[^标记]的样例

[^标记]: 这是一个 *注脚* 的 ***文本***

## LaTeX 公式 未实现

$ 表示行内公式

$E=mc^2$

$$ 表示整行公式：

$$\sum_{i=1}^n a_i=0$$

## 代码块
```python
print('Hello World!')
```

## 绘制图形

## 表格

| 项目        | 价格   |  数量  |
| --------   | -----:  | :----:  |
| 计算机     | 1600 |   5     |
| 手机        |   12   |   12   |
| 管线        |    1    |  234  |

## Html标签
<table>
    <tr>
        <th rowspan="2">值班人员</th>
        <th>星期一</th>
        <th>星期二</th>
        <th>星期三</th>
    </tr>
    <tr>
        <td>李强</td>
        <td>张明</td>
        <td>王平</td>
    </tr>
</table>

## 待办列表 部分实现
- [ ] **Cmd Markdown 开发**
    - [ ] 改进 Cmd 渲染算法，使用局部渲染技术提高渲染效率
    - [ ] 支持以 PDF 格式导出文稿
    - [x] 新增Todo列表功能
    - [x] 改进 LaTex 功能
        - [x] 修复 LaTex 公式渲染问题
        - [x] 新增 LaTex 公式编号功能
