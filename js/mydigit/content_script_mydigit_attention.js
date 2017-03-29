"use strict";
var Attendedstatus =0;
function checkOpenFriendPopup() {
    // console.log(new Date() + "checkOpenFriendPopup():"+$(".popoutContent").length );
    return $(".popoutContent").length != 0;

}
function checkfollowing() {
    return $(".add_following").length != 0;
}
var checkAddedFriend = function () {
    //return ($(".add_following") == null) == false;
    return $("#pw_dialog").length != 0;
}

doFollow(doClickAddFriend(doClickSubmitFriend));


//doFollow();
//sleep(1000).then(() => {
//    var addfriendbtn = $("a[href='pw_ajax.php?action=addfriend&touid=1943460']");
//    addfriendbtn.click();
//
//
//    sleep(1000).then(() => {
//        $("button[name='ajaxsubmit']").click();
//        sleep(1000).then(() => {
//            chrome.runtime.sendMessage({type: "mydigit-msg", func: "attentionadded"});
//        });
//    });
//
//});


//点击加关注
function doFollow(nextaction) {
    var followbtn = $(".add_follow");
    if (followbtn.length != 0) {
        followbtn.get(0).click();
    }
    console.log(new Date() + "Start");
    waitFor(checkfollowing, 2000, 50)
        .done(function () {
            console.log("Followed");
            nextaction;
        }).fail(function () {
        console.log(new Date() + "Timeout");
    });
}


//doClickAddFriend(()=>{console.log(new Date() + "Ended");})
//点击加为好友
function doClickAddFriend(nextaction) {
    var addfriendbtn = $("a[href='pw_ajax.php?action=addfriend&touid=1943460']");
    if (addfriendbtn.length != 0) {
        addfriendbtn.get(0).click();
    }else{
        chrome.runtime.sendMessage({type: "mydigit-msg", func: "attentionadded"});
    }
    waitFor(checkOpenFriendPopup, 2000, 100)
        .done(function () {
            console.log("Opened Friend Popup");
            nextaction();
        }).fail(function () {
        console.log(new Date() + "Timeout");
    })
    ;
}

//点击提交
function doClickSubmitFriend() {
    var btn = $("button[name='ajaxsubmit']");
    if (btn.length > 0) {
        btn.get(0).click();
    }
    waitFor(checkAddedFriend, 2000)
        .done(function () {
                console.log("Opened Friend Popup");
                chrome.runtime.sendMessage({type: "mydigit-msg", func: "attentionadded"});
            }
        ).fail(function () {
            console.log("Timeout");

        }
    )
    ;
}
