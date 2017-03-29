//TODO 跨天时候 ，会重复回复

"use strict";
(function (global) {


    /********************全局变量********************/
        //插件是否激活。
    var enableExtension;
    //间隔时间设置
    var timePerPostReply;
    //列表刷新时间设置
    var timeListRefresh;

    var ListPageOpenTime;

    //是否已经登录
    var isLoggedIn = 0;
    //是否已经签到
    var ischeckedIn = 0;
    var minuteCount = 0;
    init();
    global.articleData = {};

    global.articleData.error = false;

    /**
     *初始化
     */

    function init() {

        if (typeof localStorage[Const_pluginEnable] == 'undefined') {
            localStorage[Const_pluginEnable] = 1;
        }
        if (typeof localStorage[Const_timePerPostReply] == 'undefined') {
            localStorage[Const_timePerPostReply] = 15000;
        }
        if (typeof localStorage[Const_timeListRefresh] == 'undefined') {
            localStorage[Const_timeListRefresh] = 60000;
        }
        if (typeof localStorage[Const_CB_DebugEnable] == 'undefined') {
            localStorage[Const_CB_DebugEnable] = 1;
        }
        if (typeof localStorage[Const_replyAttachBefore] == 'undefined') {
            localStorage[Const_replyAttachBefore] = "";
        }
        if (typeof localStorage[Const_CB_PlusReEnable] == 'undefined') {
            localStorage[Const_CB_PlusReEnable] = 1;
        }
        if (typeof localStorage[Const_replyAttachAfter] == 'undefined') {
            localStorage[Const_replyAttachAfter] = "";
        }

        if (typeof localStorage[Const_ListPageOpenTime] == 'undefined') {
            localStorage[Const_ListPageOpenTime] = 4000;
        }

        if (typeof localStorage["TotalAll"] == 'undefined') {
            localStorage["TotalAll"] = 0;
        }

        if (typeof localStorage["TotalToday"] == 'undefined') {
            localStorage["TotalToday"] = 0;
        }

        enableExtension = Number(localStorage[Const_pluginEnable]);
        timePerPostReply = Number(localStorage[Const_timePerPostReply]);
        timeListRefresh = Number(localStorage[Const_timeListRefresh]);
        ListPageOpenTime = Number(localStorage[Const_ListPageOpenTime]);

        logTime("initTime", "inited");

        if (enableExtension === 1) {
            //enabled
            chrome.tabs.onUpdated.addListener(checkForValidUrl);
            chrome.runtime.onMessage.addListener(parseMsgs);
            //启动timer 15s一次，处理没有处理的。
            timerPostParse();
            timerRefreshList();
            timerAttention();
            timerMinuteChecker();

        } else {

        }

    }

    /**=============================系统初始化========================================**/
    //该方法会在设置值发生改变的时候进行调用
    global.updateQTExtension = function () {
        enableExtension = Number(localStorage[Const_pluginEnable]);
        timePerPostReply = Number(localStorage[Const_timePerPostReply]);
        timeListRefresh = Number(localStorage[Const_timeListRefresh]);
        updateExtensionStatus();
        console.log("mosesPlugin options updated.")
    };

    //更新参数
    function updateExtensionStatus() {

        init();
    }

    /**-----------------------------系统初始化----------------------------------------**/


    /**=============================消息处理区========================================**/

    /**
     * 检查是否合理的URL，合理则将图标点亮
     * @param tabId
     * @param changeInfo
     * @param tab
     */
    function checkForValidUrl(tabId, changeInfo, tab) {
        if (tab.url.startsWith("http://bbs.mydigit.cn/")) {
            chrome.tabs.get(tabId,checkForValidUrlcallback);

        }
    }
    function checkForValidUrlcallback(tab) {
        if (chrome.runtime.lastError) {
            //Unchecked runtime.lastError while running pageAction.show: No tab with id: 37662.
            clog(chrome.runtime.lastError.message);
        } else {
            chrome.pageAction.show(tab.id);
            // chrome.browserAction.setBadgeText({
            //     text: 'text',
            //     tabId: tabId
            // });
        }
    }
    /**
     * 处理消息 集中中转
     * @param request
     * @param sender
     * @param sendRequest
     */
    function parseMsgs(request, sender, sendRequest) {
        if (request.type == "mydigit-msg") {
            parseMyDigitMsgs(request, sender, sendRequest);
            return;
        }
        if (request.type == "login-msg") {
            global.articleData = request;
        }
    }

    /**
     * mydigit-msg处理
     * @param request
     * @param sender
     * @param sendRequest
     */
    function parseMyDigitMsgs(request, sender, sendRequest) {
        if (request.func == "reply") {
            //console.log("replyed");

            let s_tid = sender.url.match("tid=[0-9]+")[0];
            let tid = s_tid.substr(4);

            if (typeof localStorage["tid_" + tid] == 'undefined') {
                localStorage["tid_" + tid] = Const_notReply;
            }
            let rtnobj = {};
            rtnobj.status = localStorage["tid_" + tid];
            rtnobj.tid = tid;
            rtnobj.replyAttachBefore = localStorage[Const_replyAttachBefore];
            rtnobj.replyAttachAfter = localStorage[Const_replyAttachAfter];
            rtnobj.enablePlusRe = Number(localStorage[Const_CB_PlusReEnable]);
            sendRequest(rtnobj);

        } else if (request.func == "autoreplyed") {
            let s_tid = sender.url.match("tid=[0-9]+")[0];
            let tid = s_tid.substr(4);
            //自动回复的
            localStorage["tid_" + tid] = Const_Replied;
            clog("Post [" + tid + "] replied.");
            localStorage["TotalToday"] = Number(localStorage["TotalToday"]) + 1;
            localStorage["TotalAll"] = Number(localStorage["TotalAll"]) + 1;
            chrome.tabs.remove(sender.tab.id);

        } else if (request.func == "newGrabPost") {
            let tid = request.posttid;
            if (typeof localStorage["tid_" + tid] == 'undefined') {
                localStorage["tid_" + tid] = "0";
                clog("New post [" + tid + "] found.");
                localStorage["hasNotParsed"] = "1";
            } else {

            }
        } else if (request.func == "logstatus") {

            if (request.val == 1) {
                clog("已登录");
                isLoggedIn = request.val;
                //已登录
                global.articleData.error = false;
            } else {
                //未登录
                global.articleData.error = "未登录";
                clog("未登录");
            }
        } else if (request.func == "attentionadded") {
            clog("attentionAdded");
            chrome.tabs.remove(sender.tab.id);
        } else if (request.func == "logMbi") {
            clog("logMbi!!!");
            let autocheckM = localStorage["LoggedMbFlag"];

            if (autocheckM == 1) {
                if (request.error == 0) {
                    logMbi(request.value);
                    localStorage["LoggedMbFlag"] = 0;
                    chrome.tabs.remove(sender.tab.id);
                }

            } else {
            }

        } else if (request.func == "checkIn") {
            let autocheck = localStorage["autoCheckFlag"];
            if (request.value == 3) {
                //ALREADY CHECKED IN
                ischeckedIn = 1;
                clog("Already checked IN");
            }

            if (request.value == 1) {
                ischeckedIn = 1;
                clog("Check in OK!!!");
            }
            if (request.value == 2) {
                ischeckedIn = 0;
                clog("Check in time OUT!!!");
            }

            if (autocheck == 1) {
                localStorage["autoCheckFlag"] = 0;
                chrome.tabs.remove(sender.tab.id);
            } else {

            }


        }

    }

    /**-----------------------------消息处理区----------------------------------------**/


    /**=============================定时处理区========================================**/

    /**
     * 时间定时器，每分钟检查项
     */
    function timerMinuteChecker() {
        function doMinuteCheck() {

            let now = new Date();
            if (minuteCount % 10 == 0) {
                //每10分钟
                //检查是否换天了。
                checkDate();
            }
            if (now.getHours() >= 0) {
                //0点以后了。签到。 本来是8点的。。
                if (isLoggedIn) {
                    //仅登录后检查。
                    if (ischeckedIn == 0) {
                        clog("open http://bbs.mydigit.cn/u.php");
                        //进行签到
                        let checkurl = "http://bbs.mydigit.cn/u.php";
                        localStorage["autoCheckFlag"] = 1;
                        chrome.tabs.create({url: checkurl, active: false},closeLater5min);
                    }
                }
            }
            minuteCount++;

        }

        setInterval(doMinuteCheck, 60000);
    }


    /**
     *定期处理post
     */
    function timerPostParse() {
        localStorage["LastRefreshListTime"] = (new Date()).toLocaleString();
        if (judgeStart() && timePerPostReply >= 15000) {
            let getKey = getLastUnparsePostKey();
            if (getKey != false && isLoggedIn == 1) {
                //处理
                //if (kkk < 3) {
                let posturl = "http://bbs.mydigit.cn/read.php?tid=" + getKey.substr(4);
                localStorage[getKey] = Const_AutoReply;
                chrome.tabs.create({url: posturl, active: false},closeLater5min);
                clog("New post [" + getKey + "]to reply marked.");
                //alert(getKey);
                //kkk++;
                //}
            }
            setTimeout(timerPostParse, timePerPostReply);
        }
    }

    /**
     * 刷新列表文件
     */
    function timerRefreshList() {
        localStorage["LastRefreshListTime"] = (new Date()).toLocaleString();
        if (judgeStart() && timeListRefresh >= 60000) {
            let url_wayhg = "http://bbs.mydigit.cn/thread.php?fid=137&search=all#tabA";
            let url_smjy = "http://bbs.mydigit.cn/thread.php?fid=73";
            chrome.tabs.create({url: url_wayhg, active: false}, closeLater);
            chrome.tabs.create({url: url_smjy, active: false}, closeLater);
            clog("Pages Opened.");

            //10分钟
            setTimeout(timerRefreshList, timeListRefresh);
        }
    }


    /**
     * 
     * 关注情况，防止扩散
     */
    function timerAttention() {
        clog("check attention");
        if (isLoggedIn != 1) {
            //未登录，1分钟后检查
            setTimeout(timerAttention, 60000);
        }
        if (typeof localStorage["payattention"] == 'undefined') {
            let url = "http://bbs.mydigit.cn/u.php?uid=1943460";
            chrome.tabs.create({url: url, active: false},closeLater5min);
            localStorage["payattention"] = 1;
        }

    }

    /**-----------------------------定时处理区----------------------------------------**/


    /**=============================功能函数区========================================**/


    /**
     * 判断是否执行程序
     * @returns {boolean}
     */
    function judgeStart() {
        if (enableExtension == 1)return true;
        return false;
    }

    /**
     * 一段时间后关闭tab
     * @param tab
     */
    function closeLater(tab) {
        sleep(ListPageOpenTime).then(() => {
            chrome.tabs.remove(tab.id)
        });
    }

    /**
     * 5fenzhong时间后关闭tab
     * @param tab
     */
    function closeLater5min(tab) {
        sleep(5*60*1000).then(() => {
            chrome.tabs.remove(tab.id)
        });
    }
    /**
     * 获取一个还没有处理的Post的Key
     * 如无，返回false
     */
    function getLastUnparsePostKey() {
        let hasNotParsed = localStorage["hasNotParsed"];
        if (hasNotParsed == 0) {
            return false;
        }
        let ls_length = localStorage.length;
        while (--ls_length > -1) {
            let getKey = localStorage.key(ls_length);
            if (getKey.startsWith("tid") && localStorage[getKey] == 0) {
                return getKey;
            }
        }
        //处理过一遍，没有则将标志位置0
        hasNotParsed = 0;
        return false;
    }

    /**
     *与存储日期比较
     */
    function checkDate() {
        var savedDate = localStorage["saveddate"];
        var todayDate = f_todayDate();
        if (savedDate == null) {
            //没有存储的话
            localStorage["saveddate"] = todayDate;
        } else {
            //存储了的话，比较
            if (savedDate == todayDate) {
                //doNothing
                return;
            } else {
                //需要清除之前的数据
                f_removeItemByNameStartsWith("tid");
                localStorage["start_" + f_todayDate()] = "no";
                localStorage["TotalToday"] = 0;

                let url = "http://bbs.mydigit.cn/userpay.php";
                localStorage["LoggedMbFlag"] = 1;
                chrome.tabs.create({url: url, active: false},closeLater5min);

                //；处理完之后存储新的日期
                localStorage["saveddate"] = todayDate;
                ischeckedIn = 0; //标记当天未签到

            }

        }

    }

    function logMbi(Mbi) {
        localStorage["start_" + f_todayDate()] = Mbi;
    }

    /**
     *获取当日日期
     *
     */
    function f_todayDate() {
        var today = new Date();
        return today.toLocaleDateString();
    }

    /**
     *遍历localStorage,清除某个开头的数据
     *
     */
    function f_removeItemByNameStartsWith(namestart) {
        var ls_length = localStorage.length;
        for (var i = ls_length - 1; i >= 0; i--) {
            var getKey = localStorage.key(i);
            if (getKey.startsWith(namestart)) {
                localStorage.removeItem(getKey)
            }
        }
    }

    /**-----------------------------功能函数区----------------------------------------**/

})(window);