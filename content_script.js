var dataListJson = null;
//startWith
String.prototype.startWith=function(str){
    var reg=new RegExp("^"+str);
    return reg.test(this);
}
$(document).ready(function(){
    chrome.extension.sendMessage({greeting: "start"}, function(response) {
        dataListJson = response.dataListJson;
        loadUserComp();
    });

});



//加载用户名选择组件
function loadUserComp(){
    if(!dataListJson){
        return;
    }
    var dataList = JSON.parse(dataListJson);
    if(dataList == null){
        return;
    }
    for(var i = 0; i < dataList.length; i++) {
        var dataItem = dataList[i];
        var dbloginUrl = dataItem.loginUrl;
        var loginUrl = window.location.toString();


        if(loginUrl.startWith(dbloginUrl)){
            console.log("domain="+loginUrl);
            var valueList = dataItem.valueList;
            var userID = dataItem.userID;
            var pwdID = dataItem.pwdID;
            var arrData = new Array();//["aa","bb","bb1","bb2","bb3","bb4"];
            var dataMap = {};


            //$("#"+userID).attr("autocomplete","off");
            //var strArr = new Array('<div class="bdsug" style="height: auto; display: none;"> <div>');
            for(var j = 0; j < valueList.length;j++){
                var valueItem = valueList[j];

                if(j == 0){   //设置默认
                    $("#"+userID).val(valueItem.userVal);
                    $("#"+pwdID).val(valueItem.pwdVal);
                    if($("#"+userID).length == 0){
                        $("input[name='"+userID+"']").val(valueItem.userVal);
                    }
                    if($("#"+pwdID).length == 0){
                        $("input[name='"+pwdID+"']").val(valueItem.pwdVal);
                    }
                }
                arrData.push(valueItem.userVal);
                dataMap[valueItem.userVal] = valueItem.pwdVal;
            }

            $("#"+userID).autocomplete(arrData,{inputPwd:pwdID,dataMap:dataMap});

        }
    }
}


