# SQL正则

```
%代表任意多个字符  _代表一个字符 在 MySQL中，SQL的模式缺省是忽略大小写的
正则模式使用REGEXP和NOT REGEXP操作符。
“.”匹配任何单个的字符。一个字符类
“［...］”匹配在方括号内的任意单个字符
“ * ”匹配零个或多个在它前面的东西
正则表达式是区分大小写的，但是如果你希望，你能使用一个字符类匹配两种写法。例如，“［aA］”匹配小写或大写的“a”而“［a-zA-Z］”匹配两种写法的任何字母。
在模式开始处使用“^”或在模式的结尾用“$”。
为了找出以“三”开头的名字，使用“^”匹配名字的开始。
FROM ［user］ WHERE u_name REGEXP ‘^三’;
将会把u_name为 “三脚猫”等等以“三”开头的记录全找出来。
为了找出以“三”结尾的名字，使用“$”匹配名字的结尾。
FROM ［user］ WHERE u_name REGEXP ‘三$’;
将会把u_name为“张三”，“张猫三”等等以“三”结尾的记录全找出来。
你也可以使用“{n}”“重复n次”操作符重写先前的查询：
FROM ［user］ WHERE u_name REGEXP ‘b{2}$’;



MySql的like语句中的通配符：百分号、下划线和escape

%：表示任意个或多个字符。可匹配任意类型和长度的字符。
Sql代码
select * from user where username like '%huxiao';

select * from user where username like 'huxiao%';

select * from user where username like '%huxiao%';
另外，如果需要找出u_name中既有“三”又有“猫”的记录，请使用and条件
SELECT * FROM ［user］ WHERE u_name LIKE ‘%三%’ AND u_name LIKE ‘%猫%’
若使用 SELECT * FROM ［user］ WHERE u_name LIKE ‘%三%猫%’
虽然能搜索出“三脚猫”，但不能搜索出符合条件的“张猫三”。

_：表示任意单个字符。匹配单个任意字符，它常用来限制表达式的字符长度语句：（可以代表一个中文字符）

Sql代码
select * from user where username like '_';

select * from user where username like 'huxia_';

select * from user where username like 'h_xiao';

 如果我就真的要查%或者_，怎么办呢？使用escape，转义字符后面的%或_就不作为通配符了，注意前面没有转义字符的%和_仍然起通配符作用
Sql代码
select username from gg_user where username like '%xiao/_%' escape '/';

select username from gg_user where username like '%xiao/%%' escape '/';


正则模式
由MySQL提供的模式匹配的其他类型是使用扩展正则表达式。当你对这类模式进行匹配测试时，使用REGEXP和NOT REGEXP操作符（或RLIKE和NOT RLIKE，它们是同义词）。
扩展正则表达式的一些字符是：
“.”匹配任何单个的字符。（单字节字符）
一个字符类“［...］”匹配在方括号内的任何字符。例如，“［abc］”匹配“a”、“b”或“c”。为了命名字符的一个范围，使用一个“-”。“［a-z］”匹配任何小写字母，而“［0-9］”匹配任何数字。
“ * ”匹配零个或多个在它前面的东西。例如，“x*”匹配任何数量的“x”字符，“［0-9］*”匹配的任何数量的数字，而“.*”匹配任何数量的任何东西。
正则表达式是区分大小写的，但是如果你希望，你能使用一个字符类匹配两种写法。例如，“［aA］”匹配小写或大写的“a”而“［a-zA-Z］”匹配两种写法的任何字母。
如果它出现在被测试值的任何地方，模式就匹配（只要他们匹配整个值，SQL模式匹配）。
为了定位一个模式以便它必须匹配被测试值的开始或结尾，在模式开始处使用“^”或在模式的结尾用“$”。
为了说明扩展正则表达式如何工作，上面所示的LIKE查询在下面使用REGEXP重写：
为了找出以“三”开头的名字，使用“^”匹配名字的开始。
FROM ［user］ WHERE u_name REGEXP ‘^三’;
将会把u_name为 “三脚猫”等等以“三”开头的记录全找出来。
为了找出以“三”结尾的名字，使用“$”匹配名字的结尾。
FROM ［user］ WHERE u_name REGEXP ‘三$’;
将会把u_name为“张三”，“张猫三”等等以“三”结尾的记录全找出来。
你也可以使用“{n}”“重复n次”操作符重写先前的查询：
FROM ［user］ WHERE u_name REGEXP ‘b{2}$’;
注意：如果是中文字符，可能在使用时需要注意一下。
```
