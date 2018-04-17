(function() {
    'use strict';

    angular.module('demo.core')
        .controller('DialogDocController', DialogDocController).directive('onFinishRenderFilters', function ($timeout) {
            return {
                restrict: 'A',
                link: function(scope, element, attr) {
                    if (scope.$last === true) {
                        $timeout(function() {
                            scope.$emit('ngRepeatFinished');
                        });
                    }
                }
            };
        });

    /* @ngInject */
    function DialogDocController($scope,PileSystemPushAPI,$translate ,ngDialog,$stateParams,ProjectAPI,toastr,ProjectfileAPI,fileAccessAPI,$document ,Confirm  ) {
        var vm = this;
        vm.vcProId = $stateParams.vcproid;
        vm.query = function() {
            PileSystemPushAPI.one("proCommon").one( vm.vcProId).getList()
                .then(function(data) {
                    vm.exchangeList = data;
                });
        };
        ProjectAPI.one(vm.vcProId)
            .get()
            .then(function(data){
                vm.bigviewheaders = data;
            });
        //状态校验
        vm.enterView = function(item) {
            if(item == '3'){
                toastr.error($translate.instant('N003011'));
            }else if(item == '2'){
                toastr.error($translate.instant('N003012'));
            }else{
                toastr.error($translate.instant('N003013'));
            }
        }

        // 在线查看文件（图片、office/pdf文档）
        vm.view=function(file){
            //判断 文件权限
            var fileView = Authenticate.checkOpt('PROJECT_FILE_VIEW', 'LIST');
            //删除文件权限： 1.有删除按钮权限 2.是创建人(上传人) 3.未提交
            var fileRemove = Authenticate.checkOpt('PROJECT_FILE_VIEW', 'FILE_DELETE');
            var fileDown = Authenticate.checkOpt('PROJECT_FILE_VIEW', 'FILE_DOWNLOAD');

            if(!fileView){
            	//'N106020':'您无权查看该文件'
                Confirm($translate.instant('N106020'),{
                    title:$translate.instant('N106021'),//'N106021':'提示',
                    okText:$translate.instant('N001008'),//'N001008':'确认'
                    noCancel:true
                });
                return;
            }

            var filePermision={
                view:fileView,
                down:fileDown,
                remove:fileRemove
            };

            var imgType =['jpg','gif','png','jpeg','bmp'];
            var officeType=['doc','docx','xls','xlsx','ppt','ppts','pptx','pdf'];
            if( $.inArray(file.vcType.toLowerCase(),imgType) >=0 ){
                vm.ImageView(file,filePermision);
            }else if($.inArray(file.vcType.toLowerCase(),officeType) >=0){
                vm.weboffice(file,filePermision);
            }else{
                if(!fileDown){
                    Confirm($translate.instant('N106022'),{//'N106022':'您无权下载该文件'
                    	title:$translate.instant('N106021'),//'N106021':'提示',
                        okText:$translate.instant('N001008'),//'N001008':'确认'
                        noCancel:true
                    });
                    return;
                }else{
                    //其他格式 直接下载
                    vm.downLoadFile(file);
                }
            }
        };

        //下载文件（txt/TXT、音频/视频、压缩包，这几种类型的文件，点击实现直接下载）
        vm.downLoadFile = function(f){
            var file = {};
            angular.extend(file,f);
            file.ORIGINAL='0';//原文件
            file.fileId = file.vcDocPath;
            if(file.fileId){
                fileAccessAPI
                    .one('filePath')
                    .customPOST(file)
                    .then(function(data) {
                        if(data){
                            window.open(ContextPath+'upload/service/download/' + data);
                        }
                    });
            }
        };


        // 查看图片
        vm.ImageView=function(file){
            ngDialog.open({
                template:'modules/demo/imgview/imgview.html',
                controller:'ImageViewController as vm',
                className:'ngdialog-theme-default ngdialog-img',
                resolve: {
                    image: function() {
                        return {
                            fileId : file.vcDocPath,
                            fileType:file.vcType,
                            fileName:file.vcDocName,
                            ORIGINAL:'0' //类型 0 原始文件 1 附属(PDF)文件
                        };
                    }
                }
            }).closePromise
                .then(function(isDeleted){
                    if(isDeleted.value){
                        //预览窗口中，删除附件后，在关闭预览窗口的同时，要将库中对应文件删除
                        ProjectfileAPI.one('queryfile').one(file.vcDocPath).get();
                        vm.WaitUpload.splice(index, 1);
                    }
                });
        };


        // 查看office/pdf文档
        vm.weboffice = function(file){
            ngDialog.open({
                template:'modules/commons/weboffice/genericPdf.html',
                controller:'genericPdfController as vm',
                className:'ngdialog-theme-default ngdialog-img',
                resolve: {
                    file: function() {
                        if(file.vcType.toLowerCase() == 'pdf'){
                            return {
                                fileId: file.vcDocPath,
                                fileType:file.vcType,
                                fileName:file.vcDocName,
                                fileSize:file.docSize,
                                accessRight:'31',
                                ORIGINAL:'0' //类型 0 原始文件 1 附属(PDF)文件
                            };
                        }else{
                            return {
                                fileId: file.vcDocPath,
                                fileType:file.vcType,
                                fileName:file.vcDocName,
                                fileSize:file.docSize,
                                accessRight:'31',
                                ORIGINAL:'1' //类型 0 原始文件 1 附属(PDF)文件
                            };
                        }
                    }
                }
            }).closePromise
                .then(function(isDeleted){
                    if(isDeleted.value){
                        //预览窗口中，删除附件后，在关闭预览窗口的同时，要将库中对应文件删除
                        ProjectfileAPI.one('queryfile').one(file.vcDocPath).get();
                        vm.WaitUpload.splice(index, 1);
                    }
                });
        };

        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            //跳到指定的位置
            vm.scrollId=$stateParams.scrollId;
            if(!vm.scrollId){
                vm.scrollId='0';
            }

            //下面是在table render完成后执行的js
            window_onload($document,vm.scrollId);
        });
        vm.setRowTips=function(name,rowIndex){
        	$('#'+name+rowIndex+' tooltip').addClass('active');
        };
        vm.clearRowTips=function(name,rowIndex){
        	$('#'+name+rowIndex+' tooltip').removeClass('active');
        };
        // 文件上传
        vm.UploadFile = function(data){
            ngDialog.open({
                template: 'modules/project-file/project-file.upload.html',
                controller: 'ProjectfileUploadController as vm',
                className: 'ngdialog-theme-default ngdialog-lg',
                //传参数
                resolve: {

                    projectId:function (){
                        return vm.vcProId;
                    },

                    busspk:function (){
                        return "";
                    },

                    targetId:function (){
                        return "";
                    },
                    vcProNo:function (){
                        return "";
                    },

                    // “按文档类型查看”页面，上传文件时，需要传递：文档阶段、文档一级类型、文档二级类型
                    params: function() {
                        return {
                            vcProStatus: data.vcProStatus,
                            vcProStatusName:data.vcProStatusName,
                            vcFirstTypeid:data.vcFirstTypeid,
                            vcFirstTypename:data.vcFirstTypename,
                            vcSecTypeid:data.vcSecTypeid,
                            vcSecTypename:data.vcSecTypename,
                            vcDocTypeid:data.vcDocTypeid,
                            optId:'PROJECT_FILE_Z_TYPE'
                        };
                    }
                }
            }).closePromise.then(function() {
                    vm.query();    // 关闭“上传文件”弹窗后，刷新项目文件查询列表
                });
        };
    }
})();

//setTimeout("window_onload()",1000);
function window_onload($document,scrollId1){
    //alert("asfddsadfas");
    var tab = document.getElementById("ordertb"); //要合并的tableID
    if (!tab) {
        //alert("未获取到表格！");
    }
    else {
        //从第二行开始，排除标题行
        var startRow = 1;
        //循环记录表格中td的内容,用来判断td中的value是否发生了改变
        var td1TempV = "";
        var td2TempV = "";
        var td3TempV = "";
        //如果td的值相同,那么变量加1, 否则将临时变量加入集合中
        var rowCount1 = 1;
        var rowCount2 = 1;
        var rowCount3 = 1;
        //得到相同内容的行数的集合www.2cto.com
        var totalcount1 = new Array();
        var totalcount2 = new Array();
        var totalcount3 = new Array();
        for (var i = 1; i < tab.rows.length; i++) {
            //首先拿出来td的值
            var td1Text = tab.rows[i].cells[0].innerText;
            //var td2Text = tab.rows[i].cells[1].innerText+"%"+td1Text;
            var td2Text = tab.rows[i].cells[1].innerText+td1Text;
            var td3Text = tab.rows[i].cells[2].innerText+td2Text;

            //如果是第一次走循环,直接continue;
            if (i == startRow) {
                td1TempV = td1Text;
                td2TempV = td2Text;
                td3TempV = td3Text;
                continue;
            }
            //如果当前拿出来的值和出处的值相同,那么将临时数量加1，否则添加到集合里面
            if (td1TempV == td1Text && td1Text != null && td1Text != "") {
                rowCount1++;
            } else {
                totalcount1.push(rowCount1);
                td1TempV = td1Text;
                rowCount1 = 1;
            }

            if (td2TempV == td2Text && td2Text != null && td2Text != "") {
                rowCount2++;
            } else {
                totalcount2.push(rowCount2);
                td2TempV = td2Text;
                rowCount2 = 1;
            }

            if (td3TempV == td3Text && td3Text != null && td3Text != "") {
                rowCount3++;
            } else {
                totalcount3.push(rowCount3);
                td3TempV = td3Text;
                rowCount3 = 1;
            }

            //判断是否是循环的最后一次,如果是最后一次那个直接将当前的数量存储到集合里面
            if (i == tab.rows.length - 1) {
                totalcount1.push(rowCount1);
                totalcount2.push(rowCount2);
                totalcount3.push(rowCount3);
            }
        }
        //临时变量,再循环中判断是否和数组中的一项值相同
        var tNum1 = 0;
        var tNum2 = 0;
        var tNum3 = 0;
        //注意这个循环是倒着来的
        for (var i = tab.rows.length - 1; i >= startRow; i--) {
            //临时变量,存储td
            var tTd1 = tab.rows[i].cells[0];
            var tTd2 = tab.rows[i].cells[1];
            var tTd3 = tab.rows[i].cells[2];
            tNum1++;
            tNum2++;
            tNum3++;
            if (tab.rows.length == 2) {
                continue;
            }
            //如果发现tNum和数组中最后一个值相同,那么就可以断定相同的td已经结束[只是其中一个]
            if (tNum1 == totalcount1[totalcount1.length - 1]) {
                //给当前td添加rowSpan属性
                tTd1.setAttribute("rowSpan", totalcount1[totalcount1.length - 1]);
                tTd1.setAttribute("style", "background-color:#ffffff");
                //将数组的最后一个元素弹出
                totalcount1.pop();
                tNum1 = 0;
            } else {
                //删除当前td
                tab.rows[i].removeChild(tTd1);
            }

            if (tNum2 == totalcount2[totalcount2.length - 1]) {
                //给当前td添加rowSpan属性

                tTd2.setAttribute("rowSpan", totalcount2[totalcount2.length - 1]);
                tTd2.setAttribute("style", "background-color:#ffffff");
                //将数组的最后一个元素弹出
                totalcount2.pop();
                tNum2 = 0;
            } else {
                //删除当前td
                tab.rows[i].removeChild(tTd2);
            }

            if (tNum3 == totalcount3[totalcount3.length - 1]) {
                //给当前td添加rowSpan属性
                tTd3.setAttribute("rowSpan", totalcount3[totalcount3.length - 1]);
                tTd3.setAttribute("style", "background-color:#ffffff");
                //将数组的最后一个元素弹出
                totalcount3.pop();
                tNum3 = 0;
            } else {
                //删除当前td
                tab.rows[i].removeChild(tTd3);
            }
        }
    }
    if(scrollId1!='0'){
        //跳到指定的位置
        scrollId=scrollId1;
        var dueresult = angular.element(document.getElementById(scrollId));
        $document.scrollTo(dueresult,190, 1000);
    }
};
