/**
 * 控制台输出
 * @param logcontent
 */
function clog(logcontent) {
    console.log("[" + (new Date()).toLocaleString() + "]:" + logcontent);
}
/**
 * 条件成立时才执行
 *
 * @param check 检查函式
 * @param timeout 最长等待时间
 * @param checkInterval 检查间隔
 */
var waitFor = function (check, timeout, checkInterval) {
    var dfd = $.Deferred();

    var checkHandle = setInterval(function () {
        //console.log(new Date() + "check:" + check);
        if (check()) {
            clearInterval(checkHandle);
            dfd.resolve();
        }
    }, checkInterval || 50);
    var timeoutHandle = setTimeout(function () {
        if (dfd.state() == "pending") {
            clearInterval(checkHandle);
            clearTimeout(timeoutHandle);
            dfd.reject();
        }
    }, timeout || 5000);
    return dfd.promise();
}
/**
 * 返回从min到max的一个随机数
 * @param min
 * @param max
 * @returns {number}
 */
function randomBetween(min, max) {
    if (max < min) {
        max = max + min;
        min = max - min;
        max = max - min;
    }
    return Math.floor(Math.random() * (max - min + 1) + min);
}
/**
 * 计算文本中 中文字的数量
 * @param text
 * @returns {number}
 */

function countChineseLetter(text){
    var count=escape(text).split("%u").length;
    return count-1;
}