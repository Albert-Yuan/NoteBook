window.onload = function(){
    document.getElementById("unitprice").addEventListener("blur",validateUnitprice,false)
    document.getElementById("rent").addEventListener("blur",validateRent,false)
    document.getElementById("cost").addEventListener("blur",validateCost,false)
    document.getElementById("area").addEventListener("blur",validateArea,false)
    document.getElementById("interest").addEventListener("blur",validateInterest,false)

    var trElement = document.all("tabRow");
    for (var x = 0;x < trElement.length;x++){
        trElement[x].addEventListener("mousemove",function(){changeColor(this,'#FFFFFF')},false)
        trElement[x].addEventListener("mouseout",function(){changeColor(this,'#F2F2F2')},false)
    }
    document.getElementById("calBut").addEventListener("click",cal,false);
}


function validateUnitprice(){
    return validateRegex("unitprice",/^\d+(\.\d{1,2})?$/)
}

function validateRent(){
    return validateRegex("rent",/^\d+(\.\d{1,2})?$/)
}

function validateCost(){
    return validateRegex("cost",/^\d+(\.\d{1,2})?$/)
}

function validateArea(){
    return validateRegex("area",/^\d+(\.\d{1,2})?$/)
}

function validateInterest(){
    return validateRegex("interest",/^\d+(\.\d{1,2})?$/)
}

function validate(){
    return validateUnitprice() &&
           validateRent() &&
           validateCost() &&
           validateArea() &&
           validateInterest()
}

function cal(){ //计算函数
    if(validate){   //数据验证通过
        // parseInt 字符串==》数字 parseFloat ==》小数
        var t_unitprice = parseFloat(getValue("unitprice"));
        var t_rent = parseFloat(getValue("rent"));
        var t_cost = parseFloat(getValue("cost"));
        var t_area = parseFloat(getValue("area"));
        var t_first = parseInt(getValue("first"))/10;
        var t_interest = parseFloat(getValue("interest"))/100;

        //计算显示结果
        document.getElementById("firstResult").innerHTML = "￥" + round(t_unitprice * t_area * t_first,2);
        document.getElementById("totalResult").innerHTML = "￥" + round(t_unitprice * t_area * (1 - t_first),2);
        document.getElementById("monthResult").innerHTML = "￥" + round(t_unitprice * t_area * (1 - t_first) * t_interest/12,2);
        document.getElementById("rentResult").innerHTML = "￥" + round(t_rent * t_area,2);
        document.getElementById("costResult").innerHTML = "￥" + round(t_cost * t_area,2);
    }
}

function getValue(eleName){     //专门负责取出内容
    if (document.getElementById(eleName) != null){
        return document.getElementById(eleName).value;
    }
}
