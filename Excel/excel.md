

#### IFERROR
```
IFERROR(VLOOKUP(F17,C:D,2,FALSE),0)
```

#### VLOOKUP
```
VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])
VLOOKUP 函数语法具有下列参数 （参数：为操作、事件、方法、属性、函数或过程提供信息的值。）：

lookup_value  必需。要在表格或区域的第一列中搜索的值。lookup_value 参数可以是值或引用。如果为 lookup_value 参数提供的值小于 table_array 参数第一列中的最小值，则 VLOOKUP 将返回错误值 #N/A。

table_array  必需。包含数据的单元格区域。可以使用对区域（例如，A2:D8）或区域名称的引用。table_array 第一列中的值是由 lookup_value 搜索的值。这些值可以是文本、数字或逻辑值。文本不区分大小写。

col_index_num  必需。table_array 参数中必须返回的匹配值的列号。col_index_num 参数为 1 时，返回 table_array 第一列中的值；col_index_num 为 2 时，返回 table_array 第二列中的值，依此类推。

如果 col_index_num 参数：

小于 1，则 VLOOKUP 返回错误值 #VALUE!。

大于 table_array 的列数，则 VLOOKUP 返回错误值 #REF!。

range_lookup  可选。一个逻辑值，指定希望 VLOOKUP 查找精确匹配值还是近似匹配值：

如果 range_lookup 为 TRUE 或被省略，则返回精确匹配值或近似匹配值。如果找不到精确匹配值，则返回小于 lookup_value 的最大值。

要点  如果 range_lookup 为 TRUE 或被省略，则必须按升序排列 table_array 第一列中的值；否则，VLOOKUP 可能无法返回正确的值。

有关详细信息，请参阅对区域或表中的数据进行排序。

如果 range_lookup 为 FALSE，则不需要对 table_array 第一列中的值进行排序。

如果 range_lookup 参数为 FALSE，VLOOKUP 将只查找精确匹配值。如果 table_array 的第一列中有两个或更多值与 lookup_value 匹配，则使用第一个找到的值。如果找不到精确匹配值，则返回错误值 #N/A。
```
