/**
 * Created by tangshengshan on 2014/12/16.
 */

var CONST_DATA_LIST = "fastLogin_dataList";
$(document).ready(function () {
    //列表
    initTbList();

    //保存
    $("#btnSave").click(function () {
        save();
    });

    //进入修改
    $('input[id="btnEnterUpdate"]').on("click", function () {
        enterUpdate(this);
    });

    //删除
    $('input[id="btnRemove"]').on("click", function () {
        remove($(this).attr("param-id"));
    });
})

/**
 * 初始化列表
 */
function initTbList() {
    var dataListJson = localStorage.getItem(CONST_DATA_LIST);
    var dataList = JSON.parse(dataListJson);
    if (dataList == null) {
        return;
    }
    var trStrArr = new Array();
    for (var i = 0; i < dataList.length; i++) {
        var dataItem = dataList[i];
        trStrArr.push("<tr>");
        //gen id
        trStrArr.push("<td>");
        trStrArr.push(dataItem.id);
        trStrArr.push("</td>");
        //loginUrl
        trStrArr.push("<td>");
        trStrArr.push(dataItem.loginUrl);
        trStrArr.push("</td>");
        //userID
        trStrArr.push("<td>");
        trStrArr.push(dataItem.userID);
        trStrArr.push("</td>");
        //pwdID
        trStrArr.push("<td>");
        trStrArr.push(dataItem.pwdID);
        trStrArr.push("</td>");
        //dataList
        trStrArr.push("<td>");
        trStrArr.push(JSON.stringify(dataItem.valueList));
        trStrArr.push("</td>");
        //操作
        trStrArr.push("<td>");
        trStrArr.push('<input type="button" id="btnEnterUpdate" param-id="' + dataItem.id + '" value="修改" />');
        trStrArr.push('<input type="button" id="btnRemove" param-id="' + dataItem.id + '" value="删除"/>');
        trStrArr.push("</td>");
        trStrArr.push("</tr>");
    }
    $(trStrArr.join("")).appendTo("#tbList");

}

//保存
function save() {
    //校验
    if(!$("#add").validate(vSettings)){
        return;
    }
    var loginUrl = $("#loginUrl").val();
    var userID = $("#userID").val();
    var pwdID = $("#pwdID").val();
    var dataSize = 5;
    var dataArr = new Array();
    for (var i = 1; i <= dataSize; i++) {
        var userVal = $("#userV" + i).val();
        if (!userVal) {
            continue;
        }
        var pwdVal = $("#pwdV" + i).val();
        var userValObj = {"userVal": userVal, "pwdVal": pwdVal};
        dataArr.push(userValObj);
    }
    var id = new Date().getTime();
    var jsonObj = {"id": id, "loginUrl": loginUrl, "userID": userID, "pwdID": pwdID, "valueList": dataArr};

    var dataListJson = localStorage.getItem(CONST_DATA_LIST);
    var dataList = null;
    if (dataListJson == null) {
        dataList = new Array();
    } else {
        dataList = JSON.parse(dataListJson);
    }
    dataList.push(jsonObj);
    var dataListJson = JSON.stringify(dataList);
    console.log("dataListJson=" + dataListJson);
    localStorage.setItem(CONST_DATA_LIST, dataListJson);
    sendMessage();
    window.location.reload();
}

//进入修改
function enterUpdate(obj) {
    var $tdObj = $(obj).parent();
    var $trObj = $tdObj.parent();
    var id = $trObj.find("td:nth-child(1)").text();
    var loginUrl = $trObj.find("td:nth-child(2)").text();
    var userID = $trObj.find("td:nth-child(3)").text();
    var pwdID = $trObj.find("td:nth-child(4)").text();
    var valueList = $trObj.find("td:nth-child(5)").text();
    //转义双引号
    valueList = valueList.replace(new RegExp("\"", "gm"), "&quot;");

    //替换成input
    $trObj.find("td:nth-child(2)").html('<input type="text" id="list_loginUrl" value="' + loginUrl + '" class="form-control"/>');
    $trObj.find("td:nth-child(3)").html('<input type="text" id="list_userID"  value="' + userID + '" class="form-control"/>');
    $trObj.find("td:nth-child(4)").html('<input type="text" id="list_pwdID"  value="' + pwdID + '" class="form-control"/>');
    $trObj.find("td:nth-child(5)").html('<input type="text" id="list_valueList"  value="' + valueList + '" class="form-control"/>');
    $trObj.find("td:nth-child(6)").find("input:first").remove();
    $trObj.find("td:nth-child(6)").find("input:first").before('<input type="button" id="btnUpdate" param-id="' + id + '" value="保存修改" />');

    //修改
    $('input[id="btnUpdate"]').on("click", function () {
        update($(this).attr("param-id"));
    });


}

//修改
function update(id) {
    var dataListJson = localStorage.getItem(CONST_DATA_LIST);
    var dataList = JSON.parse(dataListJson);
    if (dataList == null) {
        return;
    }
    for (var i = 0; i < dataList.length; i++) {
        var dataItem = dataList[i];
        if (dataItem.id == id) {
            dataItem.loginUrl = $("#list_loginUrl").val();
            dataItem.userID = $("#list_userID").val();
            dataItem.pwdID = $("#list_pwdID").val();
            dataItem.valueList = JSON.parse($("#list_valueList").val());
            var dataListJson = JSON.stringify(dataList);
            localStorage.setItem(CONST_DATA_LIST, dataListJson);
            sendMessage();
            window.location.reload();
        }
    }
}

//删除
function remove(id) {
    if (!confirm("您确认要删除吗？")) {
        return;
    }
    var dataListJson = localStorage.getItem(CONST_DATA_LIST);
    var dataList = JSON.parse(dataListJson);
    if (dataList == null) {
        return;
    }
    for (var i = 0; i < dataList.length; i++) {
        var dataItem = dataList[i];
        if (dataItem.id == id) {
            dataList.splice(i, 1);
            var dataListJson = JSON.stringify(dataList);
            localStorage.setItem(CONST_DATA_LIST, dataListJson);
            sendMessage();
            window.location.reload();
        }
    }
}

//发送消息
function sendMessage() {
    var dataListJson = localStorage.getItem(CONST_DATA_LIST);
    chrome.extension.getBackgroundPage().dataListJson = dataListJson;
}


//校验参数
vSettings = {
    rules:{
        loginUrl:{
            required:true
        },
        userID:{
            required:true
        },
        pwdID:{
            required:true
        }
    },
    messages:{
        loginUrl:{
            required:"登录URL不能为空"
        },
        userID:{
            required:"userID不能为空"
        },
        pwdID:{
            required:"pwdID不能为空"
        }
    }
};
