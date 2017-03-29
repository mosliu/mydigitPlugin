"use strict";
var Mbi = $(".f24.b.s2.mb5");
clog("userpay!!!")
if(Mbi.length!=0){
    var num = Mbi.text();
    clog("M:"+Mbi);
    chrome.runtime.sendMessage({type: "mydigit-msg", func: "logMbi", value: num,error:0}, (a)=> {
    });
}else{
    chrome.runtime.sendMessage({type: "mydigit-msg", func: "logMbi", error:1}, (a)=> {
    });
}
