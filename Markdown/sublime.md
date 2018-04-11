# sublime text 3

- Hbuilder 自带tomcat

- 文本编辑器

##### 开启Package Control
```
使用Ctrl+`快捷键或者通过View->Show Console菜单打开命令行，粘贴如下代码：
import urllib.request,os; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); open(os.path.join(ipp, pf), 'wb').write(urllib.request.urlopen( 'http://sublime.wbond.net/' + pf.replace(' ','%20')).read())
```

# 插件
```sh
SQL Bueatifier
*SQL美化 Ctrl+K再Ctrl+F 瞬间格式化SQL

CovertToUTF8
*兼容GBK汉字 打开时自动转为UTF8

Markdown Editing
*Markdown语法高亮

OmniMarkupPreviewer
*Ctrl+Alt+O在浏览器中预览 Ctrl+Alt+X Export as HTML Ctrl+Alt+C: Copy as HTML

Chinese Localization
*中文汉化字符集

IMESupport
*输入法跟随
```
# 配置
```sh
环境设置
{
    "color_scheme": "Packages/Color Scheme - Default/IDLE.tmTheme",
    //"color_scheme": "Packages/MarkdownEditing/MarkdownEditor.tmTheme",
    "default_line_ending": "unix",
    "ensure_newline_at_eof_on_save": true,
    "font_size": 15,
    "ignored_packages":
    [
        "Vintage"
    ],
    "tab_size": 4,
    "translate_tabs_to_spaces": true,
    "trim_trailing_white_space_on_save": true
}

插件 >>Markdown Editing >>Markdown GFM Setting
{
    "wrap_width": 120,
    "draw_centered": false,
    "line_numbers": true,
    "default_line_ending": "unix",
    "ensure_newline_at_eof_on_save": true,
    "tab_size": 4,
    "translate_tabs_to_spaces": true,
    "trim_trailing_white_space_on_save": true
}
```

- Package Control无法连接搜索，原因一般是网络问题，重试即可
- 列编辑：鼠标右键＋Shift; Ctrl+Shift+L 列选模式; 配合Shift键来多选每行的字符
