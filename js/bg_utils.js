"use strict";

//是否输出debug信息
var enableDebug;
enableDebug = Number(localStorage[Const_CB_DebugEnable]) | 1;

/**
 * 从URL中，提取网站名。
 */
function getDomainFromUrl(url) {
    var host = "null";
    if (typeof url == "undefined" || null == url)
        url = window.location.href;
    var regex = /.*\:\/\/([^\/]*).*/;
    var match = url.match(regex);
    if (typeof match != "undefined" && null != match)
        host = match[1];
    return host;
}

/**
 * 延时函数
 * 使用方式：sleep(500).then(() => {  Do something after the sleep!}
 * @param time
 * @returns {Promise}
 */
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}



/**
 * 控制台输出
 * @param logcontent
 */
function clog(logcontent) {
    if (Number(enableDebug) == 1)
        console.log("[" + (new Date()).toLocaleString() + "]:" + logcontent);
}

/**
 * 在存档中记录时间，日志
 * @param key
 * @param content
 */
function logTime(key, content) {
    if (Number(enableDebug) == 1)
        localStorage["log_" + key] = (new Date()).toLocaleString() + " :[" + content + "]";
}

