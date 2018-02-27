    //通过引用外部文件js/listdemo.js完成密码的校验
    //正则
    //一定要定义正则的开始和结束标记，正则符号不需要转义
    // /^正则$/.test(要检验的数据)
        function showEmail(){   //定义事件处理函数
            var emailElement = document.getElementById("email");
            // alert(emailElement.value)
            var MsgElement = document.getElementById("emailMsg");

            if(/^\w+@\w+\.\w+$/.test(emailElement.value)){
                // alert("数据合法");
                emailElement.className = "right";
                MsgElement.innerHTML="<font color='green'>email输入正确<font>";
                return true;
            }else{
                // alert("非法数据");
                emailElement.className = "wrong";
                MsgElement.innerHTML="<font color='red'>email输入错误<font>";
                return false;
            }
        }

        function validateEmpty(elementName){   //判断内容是否为空
            var PassElement = document.getElementById(elementName);
            var MsgElement = document.getElementById(elementName+"Msg");

            if(PassElement.value !="" ){   //不为空
                MsgElement.innerHTML="<font color='green'>输入正确<font>";
                return true;
            }else{
                MsgElement.innerHTML="<font color='red'>输入错误<font>";
                return false;
            }
        }

        function validateSame(srcname,descname){   //判断输入是否相同
            var SrcElement = document.getElementById(srcname);
            var DescElement = document.getElementById(descname);
            var MsgElement = document.getElementById(descname+"Msg");

            if(SrcElement.value == DescElement.value){
                MsgElement.innerHTML="<font color='green'>输入内容正确<font>";
                return true;
            }else{
                MsgElement.innerHTML="<font color='red'>和之前的输入不一致！<font>";
                return false;
            }
        }

        function validatePwd(){ //密码框
            return validateEmpty("pwd")
        }

        function validateConf(){
            if (validateEmpty("conf")){
                return validateSame("pwd","conf");
            } else{
                return false;
            }
        }

        window.onload = function(){
            document.getElementById("pwd").addEventListener("blur",validatePwd,false);
            document.getElementById("conf").addEventListener("blur",validateConf,false);

            document.all("fruits")[2].checked = true;
        }

        function selectAll(){   //全选
            var fruit=document.all("fruits");
            for (var i = 0; i < fruit.length; i++) {
                fruit[i].checked =document.getElementById("all").checked;
            }
        }


        function showCity(city){
            alert(city)
        }

        function onkeyEvent(){
            var note = document.getElementById("note")
            var msg = document.getElementById("noteMsg");
            // msg.innerHTML = "数据长度为："+note.value.length;
            var len = note.value.length;
            if(len <= 10){
                msg.innerHTML = "还可以输入"+(10-len)+"长度的字符。"
                document.getElementById("sub").disabled = false;
            }else{
                msg.innerHTML = "输入的内容过长！"
                document.getElementById("sub").disabled = true;
            }
        }
