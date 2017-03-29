var btn = $(".pub_but");
if(btn.length!=1){
  chrome.runtime.sendMessage({type:"login-msg", error:"解析错！！！"});
}

var wait = function() {
  var dtd = $.Deferred();
  var i = 0;

  function updateLater() {
    $('#js_output').text(i++);
    if (i < 1000) {
      setTimeout(updateLater, 0);
    }
    if (i == 1000) {
      dtd.resolve(); // 改变Deferred对象的执行状态
    }
  }
  updateLater();
  return dtd.promise(); // 返回promise对象
}
$.when(wait()).done(function() {
    parsebtn();
});

function parsebtn(){
  var btntext = btn.text();
  if(btntext=="去登录"){
    var msg = {
  		type: "login-msg",
  		title : btntext+',1',
      msg: 1,
  		url: document.URL
  	};
    chrome.runtime.sendMessage(msg);
  }else{
    var msg = {
  		type: "login-msg",
  		title : btntext+',2',
      msg :2,
  		url: document.URL
  	};
    chrome.runtime.sendMessage(msg);
  }
}
