var dataListJson = null;
var CONST_DATA_LIST = "fastLogin_dataList";
$(function(){

    dataListJson = localStorage.getItem(CONST_DATA_LIST);
    chrome.extension.onMessage.addListener(
        function(request, sender, sendResponse) {
            console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
            if (request.greeting == "start")
                sendResponse({dataListJson: dataListJson});
      });
})
