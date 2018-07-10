# PowerDesigner

#### 相关配置
```
外键连线直接使用Name
tools->display preferences->object view ->reference ->name

设置name不自动等于code
tools->general Options->Dialog ->Name to Code mirroring

表显示信息配置（可以在advance中调出其他指标，可以用Modify修改样式）
这里可以调处code然后用comment覆盖name的值，方法在下面
tools->display preferences->Table

连线显示信息配置
tools->display preferences->Reference

表信息显示comment列
点开表->columns->Customize Columns and Filter->comment

隐藏网格线
Tools->Display Preferences->show page delimiter

```



#### 从name替换comment

```
Option   Explicit
ValidationMode   =   True
InteractiveMode   =   im_Batch

Dim   mdl   '   the   current   model

'   get   the   current   active   model
Set   mdl   =   ActiveModel
If   (mdl   Is   Nothing)   Then
      MsgBox   "There   is   no   current   Model "
ElseIf   Not   mdl.IsKindOf(PdPDM.cls_Model)   Then
      MsgBox   "The   current   model   is   not   an   Physical   Data   model. "
Else
      ProcessFolder   mdl
End   If

'   This   routine   copy   name   into   comment   for   each   table,   each   column   and   each   view
'   of   the   current   folder
Private   sub   ProcessFolder(folder)
      Dim   Tab   'running     table
      for   each   Tab   in   folder.tables
            if   not   tab.isShortcut   then
                  tab.comment   =   tab.name
                  Dim   col   '   running   column
                  for   each   col   in   tab.columns
                        col.comment=   col.name
                  next
            end   if
      next

      Dim   view   'running   view
      for   each   view   in   folder.Views
            if   not   view.isShortcut   then
                  view.comment   =   view.name
            end   if
      next

      '   go   into   the   sub-packages
      Dim   f   '   running   folder
      For   Each   f   In   folder.Packages
            if   not   f.IsShortcut   then
                  ProcessFolder   f
            end   if
      Next
end   sub
```

#### 从comment替换name
```
Option   Explicit
ValidationMode   =   True
InteractiveMode   =   im_Batch

Dim   mdl   '   the   current   model

'   get   the   current   active   model
Set   mdl   =   ActiveModel
If   (mdl   Is   Nothing)   Then
      MsgBox   "There   is   no   current   Model "
ElseIf   Not   mdl.IsKindOf(PdPDM.cls_Model)   Then
      MsgBox   "The   current   model   is   not   an   Physical   Data   model. "
Else
      ProcessFolder   mdl
End   If

Private   sub   ProcessFolder(folder)
On Error Resume Next
      Dim   Tab   'running     table
      for   each   Tab   in   folder.tables
            if   not   tab.isShortcut   then '如果有表的注释,则不改变它.如果没有表注释.则把name添加到注释里面.
                  'tab.name   =   tab.comment
                  Dim   col   '   running   column
                  for   each   col   in   tab.columns
                  if col.comment="" then '如果col的comment为空,则填入name,如果已有注释,则不添加;这样可以避免已有注释丢失
                  else
                        col.name=   col.comment
                  end if
                  next
            end   if
      next

      Dim   view   'running   view
      for   each   view   in   folder.Views
            if   not   view.isShortcut   then
                  view.name   =   view.comment
            end   if
      next

      '   go   into   the   sub-packages
      Dim   f   '   running   folder
      For   Each   f   In   folder.Packages
            if   not   f.IsShortcut   then
                  ProcessFolder   f
            end   if
      Next
end   sub
```
