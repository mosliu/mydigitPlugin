"use strict";
var reward = $("#leftreplyrewardnum")
if (reward.length == 0) {
    //没有奖分
    //alert("noreward");
} else {
    var rewardpoint = reward.text();
    if (rewardpoint > 0) {
        chrome.runtime.sendMessage({type: "mydigit-msg", func: "reply"}, doReply);
        //alert(rewardpoint+"!!!");

    } else {
        //chrome.runtime.sendMessage({type: "mydigit-msg", func: "reply"}, doReply);
        //alert(rewardpoint);
    }
}


function doReply(response) {
    let status = response.status;
    let tid = response.tid;
    let replyAttachBefore = response.replyAttachBefore;
    let replyAttachAfter = response.replyAttachAfter;
    let enablePlusRe = response.enablePlusRe;

    let topic = $("#atc_title").val().substr(3);
    topic = getRandomText(topic, 10, topic.length);

    var tempArr = [];

    if (replyAttachBefore.length != 0) {
        tempArr.push(replyAttachBefore);
        //replytopic = replytopic + replyAttachBefore + "\r\n";
    }
    if (enablePlusRe == 1) {
        tempArr.push(topic);
        // replytopic = replytopic +  topic;
    } else {
        tempArr.push(tid % 10);
        // replytopic = replytopic +  tid % 10;
    }
    if (replyAttachAfter.length != 0) {
        tempArr.push(replyAttachAfter);
        // replytopic = replytopic +  "\r\n" + replyAttachAfter ;
    }
    let replytopic = tempArr.join("\r\n");
    if(countChineseLetter(replytopic)<5){
        replytopic = "哈哈哈哈哈"+tid%10;
    }

    if (status == Const_notReply) {
        //0==>未处理的。

        $(".editorTextarea").val(replytopic);
        //$(".editorTextarea").val($("#atc_title").val().substr(3));
        $("button[name='Submit']").click();
    } else if (status == Const_AutoReply) {
        //1==>后台自动打开的。
        $("img").remove();
        // let topic = $("#atc_title").val().substr(3);
        // topic = getRandomText(topic, 12, topic.length);
        $(".editorTextarea").val(replytopic);
        $("button[name='Submit']").click();
        doCheckReplyed();
        // chrome.runtime.sendMessage({type: "mydigit-msg", func: "autoreplyed"});

    } else if (status == Const_Replied) {
        //已回复过的。
        //$(".editorTextarea").val(replytopic);
        //do nothing;
    }
}


//点击加关注
function doCheckReplyed() {
    // console.log(new Date() + "Start");
    waitFor(checkReplyed, 2000, 50)
        .done(function () {
            console.log("Confirm Replied");
            chrome.runtime.sendMessage({type: "mydigit-msg", func: "autoreplyed"});
        }).fail(function () {
        chrome.runtime.sendMessage({type: "mydigit-msg", func: "autoreplyed"});
        console.log(new Date() + "Timeout");
    });
}

function checkReplyed() {
    //$("#isreplyrewardsuccess")
    return $(".add_following").length != 0;
}

//$(".editorTextarea").val($("#atc_title").val().substr(3));
//$("button[name='Submit']").click();


//$("#atc_title").val().substr(3)
function getRandomText(text, min, max) {
    // let rad = Math.random();
    max = max < text.length ? max : text.length;
    // min = min > max ? max : min;
    let rad = randomBetween(min, max);
    //console.log("max,min,rad:"+max+","+min+","+rad);
    // rad = Math.floor(rad * (max - min));
    //console.log("max,min,rad:"+max+","+min+","+rad);
    return text.substr(0, rad);
}