function validateEmpno(){
    return validateRegex("empno",/^\d{4}$/)
}

function validateEmpname(){
    return validateEmpty("empname")
}

function validateEmpjob(){
    return validateEmpty("job")
}

function validateEmphiredate(){  //日期验证可以使用日期组件进行验证，如My97DatePicker
    return validateRegex("hiredate",/^\d{4}-\d{2}-\d{2}$/)
}

function validateEmpsal(){
    return validateRegex("sal",/^\d+(\.\d{1,2})?$/)
}

function validateEmpcomm(){
    return validateRegex("comm",/^\d+(\.\d{1,2})?$/)
}


function validate(){
    return validateEmpno() &&
    validateEmpname() &&
    validateEmpjob() &&
    validateEmphiredate() &&
    validateEmpsal() &&
    validateEmpcomm();
}
