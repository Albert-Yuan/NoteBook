# JavaScript
- 浏览器中运行的脚本语言 Netscape 解释型语言
- Java Sun 需要编译
- HBuilder 可以调试JS编辑器


```html
<html>
<body onload="alert('hi')">
    <script type="text/javascript">
        var hello;
        hello='Hello';
        var age = 16;
        if (age>=18)
        {
            alert('成年');
        }
        else
        {
            alert('还小呢')
        }
        //var ot = true;
        document.write("<h1>Hello World!</h1>");
        document.write(hello+age);
        age--;
    </script>
</body>
</html>
```

```html
<html>
<body onload="alert('hi')">
    <script type="text/javascript">
        var t=2;
        switch(t){
            case 1:
            alert("你好");
            case 2:
            alert("再见");
            break;
            default:
            alert("？？？");
        }
    </script>
</body>
</html>
```

```html
<html>
<body onload="alert('hi')">
    <script type="text/javascript">
        total = 10;
        max = 20;
        total = (total > max) ? total+1 : total+2;
        while (total<max)
        {
            total=total+1;
            alert(total);
        }
    </script>
</body>
</html>
```

```html
<html>
<body onload="alert('hi')">
    <script type="text/javascript">
        //while 算法：最大公约数
        var u=40;
        var v=21;
        function gcd(u,v){
            var temp=0;
            while (v != 0 )
            {
                temp=u%v;
                u=v;
                v=temp;
            }
            alert("最大公约数为"+u);
        }
        gcd(40,21);

        var f=new function("x","y","return x*y");

        function add(a,b){
            return a+b;
        }
        function cal(f,a,b){
            return f(a,b);
        }
        cal(add,10,11);
    </script>
</body>
</html>
```

```html
<html>
<body onload="alert('hi')">
    <script type="text/javascript">
        // var a = new Array();
        // var b = new Array(size);
        // var c = new Array(d1,d2,d3,...,dn);
        // var d = [d1,d2,d3,...,dn];
        var marks = new Array();
        marks[0] = 89;
        marks[2] = 98;
        var colors = ["red","blue","green"];
        colors[2] = "black";
        colors[colors.length] = 'brown';
        alert(colors.join("||"));
    </script>
</body>
</html>
```

```html
<html>
<body onload="alert('hi')">
    <script type="text/javascript">
        var colors = ["red","blue","green"];
        var count = colors.push("gray","yellow")
        // 堆栈
        var item = colors.pop();
        alert(item);
        // 队列
        var item2 = colors.shift();
        alert(item2);
        // 排序
        colors.sort();
        colors.reverse();
    </script>
</body>
</html>
```

```html
<html>
<body onload="alert('hi')">
    <script type="text/javascript">
        // 对象
        var book = new Object();
        var circle = {x:0,t:1,radius:2};
        book.title = "JS学习";
        book.chapter1 = new Object();
        book.chapter1.title = "第一章";
        // 遍历
        for (var x in book){
            alert(book[x];
        }
        // 删除
        delete book.title;
        book.chapter1 = null;
        // 构造函数
        function Rect(w,h){
            this.width=w;
            this.height=h;
            this.area=function(){return this.width*this.height;}
        }
    </script>
</body>
</html>
```

```html
<html>
<body onload="alert('hi')">
    <script type="text/javascript" src = "外部文件.js">
        // 原型
        function Person(){} //构造函数
        Person.prototype.name="Nike";
        Person.prototype.age=29;
        Person.prototype.friends=["A","B"];
        var Person1 = new Person();
        var Person2 = new Person();
        Person1.name = "Greg";
        alert(Person1.name);
        alert(Person2.name);

        // 非重新赋值 解决方法：如不在Person中使用this定义属性，就会不按照原型链传递
        Person1.friends.push("C");
        alert(Person1.friends); //"A" "B" "C"
        alert(Person2.friends); //"A" "B" "C"
    </script>
</body>
</html>
```

```html
<html>
<body onload="setInterval('update()',1000)" onunload="alert('bye') ">   <!-- setInterval()  定时器 -->
    <script type="text/javascript" src = "外部文件.js">
        // 事件处理器
        if(confirm("是否继续？")){ //yes no
            aler("好");
        } else{
            alert("再见");
        }
        var name = prompt("你的名字是："); //输入框
        alert(name);

        count = 10;  //定时器
        function update(){
            if(count>0)
                status = count--; //状态栏
        }
    </script>
    <p onmouseover="alert('hi')" onmouseout="alert('bye')">
        一个段落
    </p>
</body>
</html>
```



- JS代码写在script下

## Node
- [Node](https://nodejs.org/en/)

## 逻辑运算
- and &&
- or ||
- not !

## 注意
- break 中断循环
- continue 跳过当前循环，进入循环的下一轮
- slice(1,3) 切片数组
- splice(0,2) 删除 splice(2,0,"a","b") 插入 splice(2,1,"a","b") 替换 从参数1开始，删除参数2个，插入其余的参数
- window 所有全局变量都是它的成员


## this
|场景|值|
|---||
|全局环境|全局对象 windows|
|constructor|新创建的对象|
|函数调用|函数的调用者|
|new Function|全局对象 windows|
|eval|调用上下文中的this|


## 事件处理
- 事件的冒泡过程和事件的触发过程
- 触发时机都会设置为false，表示在事件的触发过程进行处理，阻止




