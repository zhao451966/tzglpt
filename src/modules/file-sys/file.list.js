(function () {
    'use strict';

    angular
        .module('fosun.file')
        .controller('FileListController', FileListController);


    /* @ngInject */
    function FileListController($stateParams,$scope,$rootScope,$document, toastr, $state, Restangular,Confirm,$translate,ngDialog,ngPdfDialog) {
        var vm = this;

        $rootScope.visible=true;
        vm.fileListTitle={
            title:$translate.instant('N004533'),//N004533='已披露文件'
            reportDate:$translate.instant('N004534'),//N004534='报告时间'
            upLoador:$translate.instant('N001054'),//N001054='上传人'
            upLoadDate:$translate.instant('N004535')//N004535='上传时间'
        }

        //vm.isNoTop=false;

        $scope.$$pagination = {
            pageSize:  parseInt(($(window).height()-168)/49)
        };

        //报告时间
        vm.filterData=function(type){
            $scope.$$filter.reportType=type;

            if(type=='1')
                vm.fileListTitle.reportDate=$translate.instant('N004534');//N004534='报告时间'
            else if(type=='2')
                vm.fileListTitle.reportDate=$translate.instant('N004522');//N004522='年报'
            else if(type=='3')
                vm.fileListTitle.reportDate=$translate.instant('N004523');//N004523='季报'
            else if(type=='4')
                vm.fileListTitle.reportDate=$translate.instant('N004524');//N004524='月报'
            else if(type=='5')
                vm.fileListTitle.reportDate=$translate.instant('N004525');//N004525='约定报告'
        }

        /**
         * 搜索时，清空下面所有条件
         */
        $rootScope.$on('queryFiles', function(event, data) {

            vm.isSearchQueryRoot=true;
            angular.extend($scope.$$filter, data);
            $scope.$$filter.isSearchQueryRoot=true;
            //清空下面所有条件，包括分页
            vm.filterData('1');
            $scope.$$pagination.pageNo =1;
        });

        vm.isSearchQueryRoot=false;

        vm.isSearchQuery=false;
        /**
         * 查询今天的文件
         */
        vm.query = function () {
            Restangular
                .all('/file/doc')
                .customGET('',$scope.$$params)
                .then(function(data) {
                    vm.items = data;

                    //同步一下是否来自搜索
                    vm.isSearchQuery=vm.isSearchQueryRoot;
                });
        };

        /**
         * 返回完整列表
         */
        vm.backFileList=function(){
            //清空搜索查询条件
            $scope.$$filter.search=null;
            $scope.$$filter.fileType=null;
            $scope.$$filter.fileFirstType=null;
            $scope.$$filter.year=null;
            $scope.$$filter.quarter=null;
            $scope.$$filter.month=null;
            $scope.$$filter.filedate=null;
            $scope.$$filter.uploadTimeFrom=null;
            $scope.$$filter.uploadTimeTo=null;
            $scope.$$filter.keyword=null;
            $scope.$$filter.isSearchQueryRoot=null;

            vm.isSearchQueryRoot=false;
            //清空下面所有条件，包括分页
            vm.filterData('1');
            $scope.$$pagination.pageNo =1;
        }

        /**
         * 查询今天的文件
         */
        vm.queryToday = function () {
            Restangular
                .all('/file/doc').one("today")
                .customGET('',$scope.$$params)
                .then(function(data) {
                    vm.itemsToday = data;
                });
        };

        /**
         * 查询更早的文件
         * https://appuat.fosun.com/newinvest/service/dueDiligence?pageNo=1&pageSize=20&s_vcProName=123
         */
        vm.queryAgo = function () {
            Restangular
                .all('/file/doc').one("ago")
                .customGET('',$scope.$$params)
                .then(function(data) {
                    vm.itemsAgo = data;
                });
        };

        //鼠标滚动，切换列表头显示信息
        //var newOffSet = $('#newFileListHeader').offset();
        //var newOffSetX=newOffSet.top;
        $document.on('scroll.file', function() {

            var scrollTop=$document.scrollTop();
            //var oldOffSet = $('#oldFileListHeader').offset();
            //var oldOffSetX=oldOffSet.top;

            if (  scrollTop> 0) {
                $("#newFileListHeader").addClass("boxShadow");
            }else{
                $("#newFileListHeader").removeClass("boxShadow");
            }

            /*if (  oldOffSetX-scrollTop< newOffSetX) {
                $("#fileListTitle")[0].innerHTML=$("#fileListTitle")[0].innerHTML.replace("今天","更早的文件");
            }else{
                $("#fileListTitle")[0].innerHTML=$("#fileListTitle")[0].innerHTML.replace("更早的文件","今天");
            }*/
        });

        $scope.$on("$destroy", function() {
            $document.off('scroll.file');
        });

        // 文件上传
        vm.UploadFile = function(){
            ngDialog.open({
                template: 'modules/file-upload/file.upload.html',
                controller: 'FileUploadController as vm',
                className: 'ngdialog-theme-default',// ngdialog-lg
                //传参数
                resolve: {
                    projectId:function (){
                        return '11111';
                    },
                    vcProNo:function () {
                        return '';
                    },
                    busspk:function (){
                        return '123';
                    },
                    targetId:function (){
                        return "234";
                    },

                    // “按文档类型查看”页面，上传文件时，需要传递：文档阶段、文档一级类型、文档二级类型、类型id
                    params: function() {
                        return {
                            vcProStatus:"",
                            vcProStatusName:"",
                            vcFirstTypeid:"",
                            vcFirstTypename:"",
                            vcSecTypeid:"",
                            vcSecTypename:"",
                            vcDocTypeid:""
                        };
                    }
                }
            }).closePromise.then(function() {
                    vm.query();
                });
        };


        // 在线查看文件（图片、office/pdf文档）
        vm.Preview=function(file){
            if(!file.vcType ){
                //'N106039':'该数据没有文件类型',
                Confirm($translate.instant('N106039'),{
                    title:$translate.instant('N106021'),
                    okText:$translate.instant('N001008'),
                    noCancel:true
                });
                return;
            }
            if( !file.vcDocId){
                //'N106040':'该数据没有文件Id'
                Confirm($translate.instant('N106040'),{
                    title:$translate.instant('N106021'),
                    okText:$translate.instant('N001008'),
                    noCancel:true
                });
                return;
            }
            var imgType =['jpg','gif','png','jpeg','bmp'];
            var officeType=['doc','docx','xls','xlsx','ppt','ppts','pptx','pdf'];
            if( $.inArray(file.vcType.toLowerCase(),imgType) >=0 ){
                vm.ImageView(file);
            }else if($.inArray(file.vcType.toLowerCase(),officeType) >=0){
                if (file.vcType.toLowerCase() == 'pdf') {
                    vm.weboffice(file, '0');
                } else {
                    vm.weboffice(file, '1');
                }
            }else if(file.vcType.toLowerCase()=='html'){
                file.ORIGINAL='0';//原文件
                file.fileId = file.vcDocId;
                file.fileSize=file.docSize;
                file.fileType=file.vcType;
                file.fileName=file.vcDocName;


                var url = '/weboffice/downFileByType?fileId='
                    +file.fileId;

                //将返回的html文本展示出来
                Restangular.all(url)
                    .customGET()
                    .then(function(code){
                        if(code){
                            var OpenWindow=window.open("", "newwin", "height=1000,width=1000,toolbar=no,scrollbars="+scroll+",menubar=no");
                            OpenWindow.document.write(code);
                        }
                    });


            }else{
                //其他格式，直接下载
                vm.downLoadFile(file);
            }
        };


        //下载文件（txt/TXT、音频/视频、压缩包，这几种类型的文件，点击实现直接下载）
        vm.downLoadFile = function(f){
            var file = {};
            angular.extend(file,f);
            file.ORIGINAL='0';//原文件
            file.fileId = file.fileId;
            if(file.fileId){
                var url = 'BatchPlatform/service/weboffice/downFileByType?fileId='
                    +file.fileId;
                window.open(ContextPath+url);
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
                            fileId : file.vcDocId,
                            fileSize:file.docSize,
                            fileType:file.vcType,
                            fileName:file.vcDocName,
                            ORIGINAL:'0' //类型 0 原始文件 1 附属(PDF)文件
                        };
                    }
                }
            }).closePromise
                .then(function(isDeleted){
                    if(isDeleted.value){

                        vm.WaitUpload.splice(index, 1);
                    }
                });
        };


        // 查看office/pdf文档
        vm.weboffice = function(file,original){

            ngPdfDialog.open({
                template:'modules/commons/weboffice/specialPdf.html',
                controller: 'SpecialPdfController as vm',
                className:'modal-dialog',
                resolve: {
                    file: function() {
                        return {
                            fileId: file.vcDocId,
                            fileName:file.vcDocName,
                            fileType:file.vcType,
                            fileSize: file.docSize,
                            accessRight:'31',
                            ORIGINAL:original, //类型 0 原始文件 1 附属(PDF)文件
                            fileObject:file
                        };

                    }
                }
            }).closePromise
                .then(function(){
                });


            /* ngDialog.open({
                 template:'modules/commons/weboffice/genericPdf.html',
                 controller:'genericPdfController as vm',
                 className:'ngdialog-theme-default ngdialog-img',
                 resolve: {
                     file: function() {
                         return {
                             fileId: file.fileId,
                             fileName:file.vcDocname,
                             fileType:file.vcType,
                             fileSize: file.docSize,
                             accessRight:'31',
                             ORIGINAL:original //类型 0 原始文件 1 附属(PDF)文件
                         };

                     }
                 }
             }).closePromise
                 .then(function(isDeleted){
                     if(isDeleted.value){

                         vm.WaitUpload.splice(index, 1);
                     }
                 });*/
        };



        // 通过文件服务器上的文件id，先查出对应的文件主键，再调用框架的删除方法，进行删除
        vm.deleteFile = function(index,fileid){
            //'N106041':'确认删除此文件？',
            Confirm($translate.instant('N106041'),{
                title:$translate.instant('N106042'),//'N106042':'删除文件',
                okText:$translate.instant('N001008')
            }).then(function(){

                vm.WaitUpload.splice(index, 1);
                toastr.success($translate.instant('N106043'));//'N106043':'文件删除成功！',

            })
        };

        /**
         * 重命名
         * @param item
         */
        vm.rename=function(item){
            ngDialog.open({
                template:'modules/file-sys/file.rename.html',
                controller:'FileRenameController as vm',
                className:'ngdialog-theme-default ngdialog-md file-rename',
                resolve: {
                    file: function() {
                        return item;
                    }
                }
            }).closePromise
            .then(function(data){
                    vm.query();
            });
        }

        vm.remove=function(item){
            //Confirm($translate.instant('N106041'),{
            //    title:$translate.instant('N106042'),//'N106042':'删除文件',
            //    okText:$translate.instant('N001008')
            //}).then(function(){
                Restangular.all('file/doc').one('remove').one(item.vcDocId)
                    .customDELETE()
                    .then(function(data){
                        toastr.success($translate.instant('N106043'));//'N106043':'文件删除成功！',
                        vm.query();
                    })
            //})
        }

        /**
         * 修改报告时间
         * @param item
         */
        vm.retime=function(item){
            ngDialog.open({
                template:'modules/file-sys/file.time.html',
                controller:'FileTimeController as vm',
                className:'ngdialog-theme-default ngdialog-md file-retime',
                resolve: {
                    file: function() {
                        return item;
                    }
                }
            }).closePromise
                .then(function(data){
                    vm.query();
                });
        }
    }
})();