"use strict";
graball();
/**
*获取页面所有的数据
*/
function graball(){
  var loggedin = $("#nav_pwuser").length==0?1:0;
  chrome.runtime.sendMessage({type:"mydigit-msg",func:"logstatus",val:loggedin });

  var posts = $("td:contains([回帖奖励)").not(":contains([回帖奖励0])");
  //var posts = $("td:contains([回帖奖励)");
  var postslength = posts.length;
  //alert("共有:"+postslength);
  if(postslength>0){
    // //清旧的存储
    // chrome.runtime.sendMessage({type:"mydigit-msg",func:"checkDate" });

    for (var i = 0; i < postslength; i++) {
      var tid = posts.get(i).id.substr(3);
      //var postlink = "http://bbs.mydigit.cn/read.php?tid="+tid;
      chrome.runtime.sendMessage({type:"mydigit-msg",func:"newGrabPost",posttid:tid});

    }

  }
}



//$(posts[0]).find("a.subject_t").attr("href")

//$(".editorTextarea").val($("#atc_title").val());
//$("button[name='Submit']").click();
