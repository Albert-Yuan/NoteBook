//保存所有通用操作
function validateEmpty(eleName){    //验证指定元素是否为空
    var obj = document.getElementById(eleName);
    var msg = document.getElementById(eleName+"Msg");

    if (obj.value != ""){
        obj.className = "right";
        if(!msg){
            msg.innerHTML = "<font color = 'green'>内容输入正确!</font>";
        }
        return true;
    }else{
        obj.className = "wrong";
        msg.innerHTML = "<font color = 'red'>内容格式错误!</font>";
        return false;
    }

}

function validateRegex(eleName,regex){    //验证指定元素是否符合正则
    var obj = document.getElementById(eleName);
    var msg = document.getElementById(eleName+"Msg");

    if (regex.test(obj.value)){
        obj.className = "right";
        msg.innerHTML = "<font color = 'green'>内容输入正确!</font>";
        return true;
    }else{
        obj.className = "wrong";
        msg.innerHTML = "<font color = 'red'>内容格式错误!</font>";
        return false;
    }

}

function changeColor(obj,color){    //负责改编表格显示颜色
    obj.bgColor = color;
}

function round(num,scale){
    var result = Math.round(num*Math.pow(10,scale))/Math.pow(10,scale)
    return result;
}
