(function() {
    'use strict';

    angular.module('demo.core')
        .directive('fxUploader', FxUploaderDirective);

    var uploader_url=ContextPath+"service/";

    function requestParam(paras){
        var url = location.href;
        var suburl = url.substring(url.indexOf("?")+1,url.length);
        return suburl;
    }

    var suburl = "";

    /* @ngInject */
    function FxUploaderDirective($parse,$translate) {
        var directive = {
            restrict: 'A',
            require: '?ngModel',
            template: '<div><span class="process"></span></div><div hidden></div>',
            link: linkFn
        };

        return directive;

        /////////////////////////////////

        function linkFn(scope, element, attrs, ngModel) {
            var tk = new Date().getTime(), button = 'i_select_files_' + tk, queue = 'i_stream_files_queue_' + tk;
            element.find('div:first').attr('id', button);
            element.find('div:last').attr('id', queue);

            var onComplete,onQueueComplete, options,range;
            if (attrs.onComplete) {
                onComplete = $parse(attrs.onComplete)(scope);
            }

            if (attrs.onQueueComplete) {
                onQueueComplete = $parse(attrs.onQueueComplete)(scope);
            }

            if (attrs.fxUploader) {
                options = $parse(attrs.fxUploader)(scope);
            }

            if (attrs.range) {
                range = $parse(attrs.range)(scope);
            }

            //console.log(onComplete);
            var upload=$translate.instant('N004556');//N004556=从电脑中选取文件


            var DEFAULT_CONFIGS = {
                browseFileId : "i_select_files",
                /** 选择文件的ID, 默认: i_select_files */
                browseFileBtn :"<button class='browse-file bg-select'>" +
                "<p style='line-height: 17px;margin: 0;display: block;float: left;'>"+upload+"</p>" +
                "</button>",
                /** 显示选择文件的样式, 默认: `<div>请选择文件</div>` */
                //dragAndDropArea : "i_select_files",
                /** 拖拽上传区域，Id（字符类型"i_select_files"）或者DOM对象, 默认: `i_select_files` */
                //dragAndDropTips : "",
                /** 拖拽提示, 默认: `<span>把文件(文件夹)拖拽到这里</span>` */
                filesQueueId : "i_stream_files_queue",
                /** 文件上传容器的ID, 默认: i_stream_files_queue */
                filesQueueHeight : 150,
                /** 文件上传容器的高度（px）, 默认: 450 */
                //messagerId : "i_stream_message_container",
                /** 消息显示容器的ID, 默认: i_stream_message_container */
                multipleFiles :true,
                /** 多个文件一起上传, 默认: false */
                //autoUploading: false, /** 选择文件后是否自动上传, 默认: true */
                //autoRemoveCompleted : false, /** 是否自动删除容器中已上传完毕的文件, 默认: false */
                maxSize: 1024*1024*50, /** 单个文件的最大大小，默认:2G */

                tokenURL : uploader_url+"upload/tk", /** 根据文件名、大小等信息获取Token的URI（用于生成断点续传、跨域的令牌） */
                frmUploadURL : uploader_url+"formdata?" + suburl, /** Flash上传的URI */
                uploadURL : uploader_url+"stream/upload"+(range==true?"/range":"")+"?" + suburl, /** HTML5上传的URI */
                simLimit: 200, /** 单次最大上传文件个数 */
                extFilters: [ ".doc", ".docx", ".xls", ".xlsx",".pdf"],
                // [ ".doc", ".docx", ".xls", ".xlsx",".ppt",".pptx",".jpg", ".jpeg", ".bmp", ".png", ".gif",".pdf"],
                /** 允许的文件扩展名, 默认: [] */
                onSelect: function(list) {
//            alert("选择了文件。。。。");
                }, /** 选择文件后的响应事件 */
                onMaxSizeExceed: function(size, limited, name) {
                    alert('文件尺寸过大：'+size);
                }, /** 文件大小超出的响应事件 */
                //onFileCountExceed: function(selected, limit) {alert('onFileCountExceed');}, /** 文件数量超出的响应事件 */
                onExtNameMismatch: function(info) {alert(info.name+'不是允许的文件类型，只允许上传[' + info.filters.toString()+']格式的文件');}, /** 文件的扩展名不匹配的响应事件 */
                //onCancel : function(file) {alert('Canceled:  ' + file.name);}, /** 取消上传文件的响应事件 */
                onComplete : function(file) { /** 单个文件上传完毕的响应事件 */
                    onComplete(file);
                },
                onQueueComplete: function() {
                    onQueueComplete();
                }, /** 所以文件上传完毕的响应事件 */
                onUploadError: function(status, msg) {alert("上传文件出现错误！");} /** 文件上传出错的响应事件 */
                //groupID : window.opener.g_groupID
            };


            var config = angular.extend({}, DEFAULT_CONFIGS, options, {
                browseFileId: button,
                filesQueueId: queue,
                onComplete: function(file) {
                    file && angular.isString(file.msg) && (file.msg = JSON.parse(file.msg));

                    if (onComplete) {
                        onComplete.call(window, file);
                       /* scope.$apply(function() {
                            onComplete.call(window, file);
                        });*/
                    }
                },
                onQueueComplete: function() {
                    if (onQueueComplete) {
                        onQueueComplete.call(window);
                       /* scope.$apply(function() {
                            onQueueComplete.call(window);
                        });*/
                    }
                }
            });

            setTimeout(function() {
                new Stream(config)
            }, 10);

        }


    }
})();