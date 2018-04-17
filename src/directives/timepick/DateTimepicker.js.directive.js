(function() {
    'use strict';

    angular.module('demo.core')
        .directive('fxTimepicker', TimePicker);

    /* @ngInject */
    function TimePicker() {
        return {
            restrict: 'EA',
            require: 'ngModel',

            link: function(scope, element, attrs) {
                if ($.fn.DateTimePicker) {
                    // var dtBox = $('#dtBox');
                    //
                    // if (!dtBox.length) {
                    //     dtBox = $('<div>').attr('id', 'dtBox').appendTo('body');
                    // }

                    if (window.I18N == 'zh_CN') {
                        $('<div>').insertAfter(element).DateTimePicker({
                            readonlyInputs: true,
                            mode: 'time',
                            language: "zh-CN",
                            labels: {
                                'year': '年',
                                'month': '月',
                                'day': '日',
                                'hour': '时',
                                'minutes': '分',
                                'seconds': '秒',
                                'meridiem': '午'
                            },
                            dateTimeFormat: "yyyy-MM-dd HH:mm",
                            dateFormat: "yyyy-MM-dd",
                            timeFormat: "HH:mm",

                            shortDayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                            fullDayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                            shortMonthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                            fullMonthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],

                            titleContentDate: "设置日期",
                            titleContentTime: "设置时间",
                            titleContentDateTime: "设置日期和时间",

                            setButtonContent: "设置",
                            clearButtonContent: "清除",
                            formatHumanDate: function (oDate, sMode, sFormat) {
                                if (sMode === "date")
                                    return  oDate.dayShort + ", " + oDate.yyyy + "年" +  oDate.month +"月" + oDate.dd + "日";
                                else if (sMode === "time")
                                    return oDate.HH + "时" + oDate.mm + "分";
                                else if (sMode === "datetime")
                                    return oDate.dayShort + ", " + oDate.yyyy + "年" +  oDate.month +"月" + oDate.dd + "日 " + oDate.HH + "时" + oDate.mm + "分";
                            }
                        })

                    }
                    else {
                        $('<div>').insertAfter(element).DateTimePicker({
                            readonlyInputs: true,
                            mode: 'time',
                            language: "en-US",
                            //labels: {
                            //    'year': '年',
                            //    'month': '月',
                            //    'day': '日',
                            //    'hour': '时',
                            //    'minutes': '分',
                            //    'seconds': '秒',
                            //    'meridiem': '午'
                            //},
                            dateTimeFormat: "yyyy-MM-dd HH:mm",
                            dateFormat: "yyyy-MM-dd",
                            timeFormat: "HH:mm",

                            //shortDayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                            //fullDayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                            shortMonthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                            fullMonthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],

                            //titleContentDate: "设置日期",
                            //titleContentTime: "设置时间",
                            //titleContentDateTime: "设置日期和时间",
                            //
                            //setButtonContent: "设置",
                            //clearButtonContent: "清除",
                            //formatHumanDate: function (oDate, sMode, sFormat) {
                            //    if (sMode === "date")
                            //        return  oDate.dayShort + ", " + oDate.yyyy + "年" +  oDate.month +"月" + oDate.dd + "日";
                            //    else if (sMode === "time")
                            //        return oDate.HH + "时" + oDate.mm + "分";
                            //    else if (sMode === "datetime")
                            //        return oDate.dayShort + ", " + oDate.yyyy + "年" +  oDate.month +"月" + oDate.dd + "日 " + oDate.HH + "时" + oDate.mm + "分";
                            //}
                        })
                    }

                }
            }
        };
    }
})();
