"use strict";
/***************这是选项页面的js**************/


/********************加载存储的变量********************/
//插件是否激活。
var enableExtension = Number(localStorage[Const_pluginEnable]);
//间隔时间设置
var timePerPostReply = Number(localStorage[Const_timePerPostReply]);
//列表刷新时间设置
var timeListRefresh = Number(localStorage[Const_timeListRefresh]);
//是否允许输出调试信息
var enableDebug =  Number(localStorage[Const_CB_DebugEnable]);
var enableCheckin = Number(localStorage[Const_CB_CheckinEnable]);
//回复前附加
var replyAttachBefore = localStorage[Const_replyAttachBefore];
//
var enablePlusRe = Number(localStorage[Const_CB_PlusReEnable]);
//回复后附加
var replyAttachAfter =localStorage[Const_replyAttachAfter];

/********************页面DOM定义********************/
var cb_FuncEnable = $("#CB_FuncEnable");
var btn_confirm = $("#btn_confirm");
var input_timePerPostReplay = $("#timePerPostReply");
var input_timeListRefresh = $("#timeListRefresh");

var input_replyAttachBefore = $("#replyAttachBefore");
var input_replyAttachAfter = $("#replyAttachAfter");
var CB_PlusReEnable = $("#CB_PlusReEnable");
var cb_DebugEnable = $("#CB_DebugEnable");
var CB_CheckinEnable = $("#CB_CheckinEnable");

/********************开始********************/
$(function () {
    //根据插件可用参数，来设置插件设置页面的外观

    setCheckbox(cb_FuncEnable,enableExtension);
    input_timePerPostReplay.val(timePerPostReply);
    input_timeListRefresh.val(timeListRefresh);
    setCheckbox(cb_DebugEnable,enableDebug);
    setCheckbox(CB_CheckinEnable,enableCheckin);
    setCheckbox(CB_PlusReEnable,enablePlusRe);
    input_replyAttachBefore.val(replyAttachBefore);
    input_replyAttachAfter.val(replyAttachAfter);

    //根据属性进行处理外观
    if (enableExtension === 0) {
        //设定不启动
        $("fieldSet").attr("disabled", true).toggleClass("disabled");
    } else {
    }


    //处理开启复选框的点击事件
    cb_FuncEnable.click(function () {
        if (cb_FuncEnable.is(":checked")) {
            localStorage[Const_pluginEnable] = 1;
            $("fieldSet").attr("disabled", false).toggleClass("disabled");
        } else {
            localStorage[Const_pluginEnable] = 0;
            $("fieldSet").attr("disabled", true).toggleClass("disabled");
        }
        chrome.extension.getBackgroundPage().updateQTExtension();

    });

    //处理确认
    btn_confirm.click(function () {
        localStorage[Const_timePerPostReply] = Number(input_timePerPostReplay.val());
        localStorage[Const_timeListRefresh] = Number(input_timeListRefresh.val());
        localStorage[Const_CB_DebugEnable] = Number(cb_DebugEnable.is(":checked")?1:0);
        localStorage[Const_CB_CheckinEnable] = Number(CB_CheckinEnable.is(":checked")?1:0);
        localStorage[Const_CB_PlusReEnable] = Number(CB_PlusReEnable.is(":checked")?1:0);
        //回复前附加
        localStorage[Const_replyAttachBefore]=input_replyAttachBefore.val();
        //回复后附加
        localStorage[Const_replyAttachAfter]=input_replyAttachAfter.val();



        chrome.extension.getBackgroundPage().updateQTExtension();
    });
});

/**
 * Checkbox 设定DOM状态
 * @param CB
 * @param val
 */
function setCheckbox(CB,val){
    if(val===0){
        //false
        CB.attr("checked", false);
    }else{
        CB.attr("checked", true);
    }
}