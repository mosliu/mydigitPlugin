"use strict";
var checked = 0;
//$(".card.fr.card_old")
var already = $("span:contains(天打卡)");
if (already.length != 0) {
    clog("已打卡");
    //value =1 已打卡
    chrome.runtime.sendMessage({type: "mydigit-msg", func: "checkIn", value: 3});
}else{
    doCheckin();
}


function doCheckin() {

    var punch = $("#punch");
    if (punch.length != 0);
    {
        punch.click();
    }
    waitFor(isCheckedIn, 2000, 50)
        .done(function () {
            console.log("Check In Ok!");
            chrome.runtime.sendMessage({type: "mydigit-msg", func: "checkIn", value: 1});
        }).fail(function () {
            chrome.runtime.sendMessage({type: "mydigit-msg", func: "checkIn", value: 2});
            console.log(new Date() + "Timeout");
        }
    )
    ;
}

function isCheckedIn() {
    // console.log(new Date() + "checkOpenFriendPopup():"+$(".popoutContent").length );
    return $("span:contains(天打卡)").length != 0;
}