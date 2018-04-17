(function () {
    'use strict';

    angular
        .module('demo.core')
        .controller('SpecialPdfController', SpecialPdfController);


    /* @ngInject */
    function SpecialPdfController(Confirm,$translate,ngDialog,$scope,Restangular,$rootScope,file) {
        var vm = this;
        vm.nowFile=file.fileObject;
        vm.visible=$rootScope.visible;
        vm.CurrentUser = Authenticate.getUser();
        vm.orgId='';
        vm.showFlag=true;
        if(file.fileObject.vcOrgId){
            vm.orgId=file.fileObject.vcOrgId;
        }else{
            vm.orgId=vm.CurrentUser.vcOrgId;
            vm.showFlag=false;
        }
        /**
         * 查询最近的文件
         */
        vm.queryToday = function () {
            Restangular
                .all('/file/doc/recentDay')
                .customGET('',{orgId:vm.orgId})
                .then(function(data) {
                    vm.items = data;
                });
        };
        vm.queryToday();
        $scope.init = function() {
            if(!$rootScope.visible){
                $("#PDF").removeClass("col-sm-8").addClass("col-sm-11");
                $("#INF").removeClass("col-sm-4").addClass("col-sm-1");
                $("#row").removeClass("row").addClass("row-big");
                $("#togglebtn").removeClass("open").addClass("close");
            }
        }

        vm.clickToggleBar=function(data){
            if(data){
                $rootScope.visible=false;
                vm.visible=false;
                $("#PDF").removeClass("col-sm-8").addClass("col-sm-11");
                $("#INF").removeClass("col-sm-4").addClass("col-sm-1");
                $("#row").removeClass("row").addClass("row-big");
                $("#togglebtn").removeClass("open").addClass("close");
            }else{
                $rootScope.visible=true;
                vm.visible=true;
                $("#PDF").removeClass("col-sm-11").addClass("col-sm-8");
                $("#INF").removeClass("col-sm-1").addClass("col-sm-4");
                $("#row").removeClass("row-big").addClass("row");
                $("#togglebtn").removeClass("close").addClass("open");
            }
        }

        window.changePdf=vm.changePdf=function(file){
            vm.nowFile=file;
            window.fileUrl=file.vcDocId;
            vm.file={
                fileId: file.vcDocId,
                fileName:file.vcDocName,
                fileType:file.vcType,
                fileSize: file.docSize,
                accessRight:'31',
                ORIGINAL:file.vcType.toLowerCase() == 'pdf'?0:1, //类型 0 原始文件 1 附属(PDF)文件
                fileObject:file
            };
            var childWindow = $("#pdfFream")[0].contentWindow;//获取子窗体中的对象
            childWindow.DEFAULT_URL = ContextPath+'service/weboffice?fileId='+encodeURIComponent(file.vcDocId);;
            childWindow.webViewerInitialized();
        }

        //vm.pdfUrl=ContextPath+'service/weboffice?fileId='+encodeURIComponent(file.fileId);
        $rootScope.OVERFLOW = 'hidden';
        var vm = this;
        /*获取访问令牌ID后才能访问文件*/
        //vm.baseurl = ContextPath+'upload/service/download/';
        window.fileUrl ='';
        window.isOffice=false;//区分 pdf,和office文件， 如果是office则显示 office查看按钮

        if(file.ORIGINAL=='1'){
            if(/chrome/.test(navigator.userAgent.toLowerCase())){
                vm.bowerType='chrome';
                window.isOffice=true; //IE浏览器，显示 金格打开
            }else if(navigator.userAgent.toLowerCase().indexOf("trident")!=-1
                && navigator.userAgent.indexOf("rv")!=-1 ){
                vm.bowerType='ie';//IE 11
                window.isOffice=true; //IE浏览器，显示 金格打开
            }else if (!!window.ActiveXObject || "ActiveXObject" in window){
                vm.bowerType='ie';
                window.isOffice=true;//IE浏览器，显示 金格打开
            }

        }
        vm.file ={};
        vm.CurrentUser  = Authenticate.getUser();
        //按钮权限
        var print = Authenticate.checkOpt('PROJECT_FILE_VIEW', 'FILE_PRINT');
        var down = Authenticate.checkOpt('PROJECT_FILE_VIEW', 'FILE_DOWNLOAD');
        var remove = Authenticate.checkOpt('PROJECT_FILE_VIEW', 'FILE_DELETE');
        //
        vm.file = angular.extend(vm.file,file);

        //下载原文件
        window.getOldDoc = vm.getOldDoc = function() {
            var file = {};
            angular.extend(file,vm.file);
            file.ORIGINAL='0';//原文件
            if(file.fileId){
                window.open(ContextPath+'service/weboffice/downFileByType?fileId='
                    +file.fileId,'_self');
            }
        };
        //获取pdf
        window.getPdf = vm.getFileRight = function(windowObj) {
            if(vm.file.fileId){
                //pdf.js pdf 文件下载路径
                window.fileUrl=vm.file.fileId;
                vm.pluginHtml='modules/commons/weboffice/generic/web/viewer.html';

            }
        };
        vm.getFileRight();

        //删除文件
        window.deleteFile = vm.deleteFile=function(){
            try {
                if(!vm.file.fileId || vm.file.fileId==''){
                    return ;
                }
                //'N106041':'确认删除此文件？',
                Confirm($translate.instant('N106041'), {
                    title:$translate.instant('N106021'),//N106021='提示'
                    okText:$translate.instant('N001008'),// N001008 = 确认
                })
                    .then(function() {
                        vm.isDeleted=true;//传回调用页面 已删除
                        $rootScope.OVERFLOW = '';
                        $scope.closeThisDialog(vm.isDeleted);
                    });

            } catch (e) {
            }
        };

        //office金格查看
        window.openOffice = vm.openOffice=function(){

            //pptx检查
            if(file.fileType.toLowerCase()=='pptx'){
                Confirm($translate.instant('N106053'), {//'N106053':'金格控件不支持pptx！',
                    title:$translate.instant('N106021'),//N106021='提示'
                    okText:$translate.instant('N001008'),// N001008 = 确认
                    noCancel:true});
                return;
            }

            var defaultFileSize = 20*1024; //默认文件最大20M
            if(file.fileSize){
                try{
                    defaultFileSize = Math.ceil(file.fileSize/1024/1024);//向上取整
                }catch (e) {
                    defaultFileSize = 20*1024;
                }
            }
            if(vm.bowerType=='ie'){
                ngDialog.open({
                    template:'modules/commons/iweboffice2009/iWebOffice2009.ie.html',
                    controller:'IWebOfficeController as vm',
                    className:'ngdialog-theme-default ngdialog-img',
                    resolve: {
                        file: function() {
                            return {
                                fileId:file.fileId,
                                fileName:file.fileName,
                                fileType:"."+file.fileType,//“.doc”、“.xls”、“.wps”或“.ppt” 等
                                userCode:vm.CurrentUser.userCode,//当前Usercode
                                userName:vm.CurrentUser.userName,//当前userName
                                maxFileSize:defaultFileSize,//文件最大大小
                                language:'CH',//Language:多语言支持显示选择   CH简体 TW繁体 EN英文
                                filePermision:filePermision//按钮权限控制
                            };
                        }
                    }
                }).closePromise
                    .then(function(isDeleted){
                        if(isDeleted.value){
                            vm.close();
                        }else{
                            $rootScope.OVERFLOW = '';
                            $scope.closeThisDialog(false);
                        }
                    });
            }else if(vm.bowerType=='chrome'){
                ngDialog.open({
                    template:'modules/commons/iweboffice2009/iWebOffice2009.chrome.html',
                    controller:'IWebOfficeChromeController as vm',
                    className:'ngdialog-theme-default ngdialog-img',
                    resolve: {
                        file: function() {
                            return {
                                fileId:file.fileId,
                                fileName:file.fileName,
                                fileType:"."+file.fileType,//“.doc”、“.xls”、“.wps”或“.ppt” 等
                                userCode:vm.CurrentUser.userCode,//当前Usercode
                                userName:vm.CurrentUser.userName,//当前userName
                                maxFileSize:defaultFileSize,//文件最大大小
                                language:'CH',//Language:多语言支持显示选择   CH简体 TW繁体 EN英文
                                filePermision:filePermision//按钮权限控制
                            };
                        }
                    }
                }).closePromise
                    .then(function(isDeleted){
                        if(isDeleted.value){
                            vm.close();
                        }else{
                            $rootScope.OVERFLOW = '';
                            $scope.closeThisDialog(false);
                        }
                    });
            }
        };

        /*关闭*/
        window.closePdf = vm.close = function(){
            $rootScope.OVERFLOW = '';
            $scope.closeThisDialog(vm.isDeleted);
        };
        

    }
})();