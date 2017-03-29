"use strict";
document.addEventListener('DOMContentLoaded', function () {
	var data = chrome.extension.getBackgroundPage().articleData;
	if(data.error){
		$("#message").text(data.error);
		$("#content").hide();
	}else{
		$("#message").hide();
		$("#content-title").text(data.title);
		$("#content-msg").text(data.msg);
	}
});
$("#content-total").text(localStorage["TotalAll"]);
$("#content-today").text(localStorage["TotalToday"]);
$("#content-tids").html(getAllTids());
$("#content-mbs").html(getAllMBs());

$("#btn_clear").click(function () {
    let ls_length = localStorage.length;
    consolelog("Clear button clicked!");
    while (--ls_length >= 0) {
        let getKey = localStorage.key(ls_length);
        if (getKey.startsWith("tid")) {
            consolelog("Remove "+getKey);
            localStorage.removeItem(getKey);
        }
    }
    location.reload();
});
function getAllTids() {
    let ls_length = localStorage.length;
    let rtn = "共回复了以下帖子：<ul>";
    while (--ls_length >= 0) {
        let getKey = localStorage.key(ls_length);
        if (getKey.startsWith("tid")) {
            rtn += "<li>" + getKey + "</li>";
        }
    }
    //处理过一遍，没有则将标志位置0
    rtn += "</ul>";
    return rtn;
}
function getAllMBs() {
    let ls_length = localStorage.length;
    let rtn = "MB:<ul>";
    // while (--ls_length >= 0) {
    //     let getKey = localStorage.key(ls_length);
    //     if (getKey.startsWith("start_")) {
    //         rtn += "<li>" + getKey +":" +localStorage[getKey] + "</li>";
    //     }
    // }

    let ccc =[];

    ls_length = localStorage.length
    while (--ls_length >= 0) {
        let getKey = localStorage.key(ls_length);

        if (getKey.startsWith("start_")) {
            ccc.push({date:new Date(getKey.substr(6)).valueOf(),key:getKey,num:localStorage[getKey]});
        }
    }
    ccc.sort(by('date'));
    for (var i = 0; i < ccc.length; i++) {
        var obj = ccc[i];
        rtn += "<li>" + obj.key +":" +obj.num + "</li>";
        console.log( obj.key +":" +obj.num);
    }

    //处理过一遍，没有则将标志位置0
    rtn += "</ul>";
    return rtn;
}

//by函数接受一个成员名字符串做为参数
//并返回一个可以用来对包含该成员的对象数组进行排序的比较函数
function by(name){
    return function(o, p){
        var a, b;
        if (typeof o === "object" && typeof p === "object" && o && p) {
            a = o[name];
            b = p[name];
            if (a === b) {
                return 0;
            }
            if (typeof a === typeof b) {
                return a < b ? -1 : 1;
            }
            return typeof a < typeof b ? -1 : 1;
        }
        else {
            throw ("error");
        }
    }
}

function consolelog(logcontent) {
    console.log("[" + (new Date()).toLocaleString() + "]:" + logcontent);
}