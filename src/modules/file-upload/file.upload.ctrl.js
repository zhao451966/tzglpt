(function() {
    'use strict';

    angular
        .module('fosun.file')
        .controller('FileUploadController', FileUploadController);

    /* @ngInject */
    function FileUploadController(
    		$translate,$window,Authenticate, $scope,Restangular,
    		ngDialog,Confirm,toastr,fileAccessAPI,$injector,ngPdfDialog,$filter) {

        var $validationProvider = $injector.get('$validation');
        var vm = this;


        vm.urlParams;
        /**
         * 引索标志
         * FILE_DATE SELECT_FILE
         */
        vm.guideFlag={
            FILE_DATE:false,
            SELECT_FILE:false
        };

        vm.dictionary={};

        vm.dictionary.fileTypes=
            Restangular.all("file/doctype").one("first")
            .getList().$object
        /*[
            {dataValue:"定期报告",dataCode:'001'},
            {dataValue:"约定报告",dataCode:'002'},
        ]*/

        vm.dictionary.fileFirstTypes=[]/*[
            {dataValue:"年度",dataCode:'1'},
            {dataValue:"季度",dataCode:'2'},
            {dataValue:"月度",dataCode:'3'},
        ]*/

        vm.dictionary.quarters=[
            {dataValue:$translate.instant('N004550'),dataCode:'1'},//N004550='第一季度'
            {dataValue:$translate.instant('N004551'),dataCode:'2'},//N004551='第一季度'
            {dataValue:$translate.instant('N004552'),dataCode:'3'},//N004552='第一季度'
            {dataValue:$translate.instant('N004553'),dataCode:'4'},//N004553='第一季度'
        ]
        
        // 存放需要保存的文档字段 （P_DOC表中对应字段）
        vm.item = {};

        vm.selectFileType=function(){
            vm.item.fileFirstType=null;
            vm.item.year=undefined;
            vm.item.quarter=undefined;
            vm.item.month=undefined;
            vm.item.filedate=undefined;
            //根据一级文件类型获取二级文件类型
            vm.dictionary.fileFirstTypes=Restangular.all("file/doctype").one("second").one(vm.item.fileType.dataCode)
                .getList().$object
        }

        vm.selectFirstType=function(){
            vm.item.year=undefined;
            vm.item.quarter=undefined;
            vm.item.month=undefined;
            vm.item.filedate=undefined;
        }

        vm.next=function(form){

            //选择了报告时间
            if(vm.guideFlag.FILE_DATE==false){
                $validationProvider.validate(form)
                    .success(function(message){
                        vm.guideFlag.FILE_DATE=true;
                        vm.createUrlParams();
                    })
                    .error(function(message){
                    });
            }
            //选择了文件
            else if(vm.guideFlag.FILE_DATE==true&&vm.guideFlag.SELECT_FILE==false){
                vm.guideFlag.SELECT_FILE=true;
            }
        }

        vm.previous=function(){
            //选择了文件
            if(vm.guideFlag.FILE_DATE==true&&vm.guideFlag.SELECT_FILE==true){
                vm.guideFlag.FILE_DATE=false;
            }
            //选择了报告时间
            else if(vm.guideFlag.FILE_DATE==true&&vm.guideFlag.SELECT_FILE==false){
                vm.guideFlag.FILE_DATE=false;
            }
        }

        /**
         * 上一步时清除表单数据
         */
        vm.clearParams=function(type){
            if(type=='FILE_TYPE'){
                //清空参数
                vm.selectFileType();
            }
        }

        /**
         * 拼接url参数
         */
        vm.createUrlParams=function(){
            vm.urlParams="";
            if(vm.item.fileType){
                vm.urlParams+="fileType="+vm.item.fileType.dataCode;
            }
            if(vm.item.fileFirstType){
                vm.urlParams+="&fileFirstType="+vm.item.fileFirstType.dataCode;
            }

            if(vm.item.year){
                vm.urlParams+="&year="+vm.item.year;
            }

            if(vm.item.quarter){
                vm.urlParams+="&quarter="+vm.item.quarter;
            }

            if(vm.item.month){
                vm.urlParams+="&month="+vm.item.month;
            }

            if(vm.item.filedate){
                vm.urlParams+="&filedate="+vm.item.filedate;
            }

            //控件初始化，自定义属性
            vm.options={
                onSelect:function(list){
                    lockPage(list)
                },
                //onQueueComplete:vm.unlockPage,
                onMaxSizeExceed: function(size, limited, name) {
                    vm.unlockPage();
                    if(size.size==0){
                        /*Confirm($translate.instant('N106035'),{//N106035 = '文件实际大小0kb无法读取！'
                            title:$translate.instant('N106021'),//N106021='提示'
                            okText:$translate.instant('N001008'),// N001008 = 确认
                            noCancel:true
                        });*/
                        toastr.error($translate.instant('N106035'));
                    }else{
                        //'N106036':'文件实际{realSize}大于默认值{defaultSize}！',
                        //'文件实际'+size.formatSize+'大于'+size.formatLimitSize+'！'
                        /*Confirm($translate.instant('N106036', {realSize:size.formatSize,defaultSize:size.formatLimitSize}),{
                            title:$translate.instant('N106021'),//N106021='提示'
                            okText:$translate.instant('N001008'),// N001008 = 确认
                            noCancel:true
                        });*/
                        toastr.error($translate.instant('N106036', {realSize:size.formatSize,defaultSize:size.formatLimitSize}));
                    }
                },
                onExtNameMismatch: function(info) {
                    vm.unlockPage();
                    //'N106037':'{type}不是允许的文件类型，只允许上传[{allow}]格式的文件',
                    //info.name+'不是允许的文件类型，只允许上传[' + info.filters.toString()+']格式的文件'
                    /*Confirm( $translate.instant('N106037',{type:info.name,allow:info.filters.toString()}) ,{
                        title:$translate.instant('N106021'),//N106021='提示'
                        okText:$translate.instant('N001008'),// N001008 = 确认
                        noCancel:true
                    });*/
                    //toastr.error($translate.instant('N106037',{type:info.name,allow:info.filters.toString()}));
                    toastr.error($translate.instant('N004568',{allow:info.filters.toString()}));
                },
                onUploadError:function(status, msg) {
                    vm.unlockPage();
                    var errmsg ='';
                    try{
                        if(msg && angular.isString(msg) && (msg = JSON.parse(msg))){
                            errmsg = $translate.instant( msg.code );
                        }
                    }catch(e){}
                    if(errmsg==''){
                        errmsg = $translate.instant('N106045');//N106045=上传失败
                    }else{
                        //'N106038':'上传文件出现错误：' + 具体报错信息
                        errmsg = $translate.instant('N106038')
                            + $translate.instant(errmsg);
                    }
                   /* Confirm(errmsg,{
                        title:$translate.instant('N106021'),//N106021='提示'
                        okText:$translate.instant('N001008'),// N001008 = 确认
                        noCancel:true
                    });*/
                    toastr.error(errmsg);
                },
                urlParam:vm.urlParams
            };
        }


        //<!--上传大文件或是多文件时，等待提示-->
        //锁住页面
        var lockPage =function (list){
            $("#FullPageLock").show();
            vm.selectFiles=list.length;
            vm.finishFiles=0;
            //调用一下，apply让变量值的变化立即反应到view上
            $scope.$apply();
        };

        //解锁页面
        vm.unlockPage= function  (){
            $("#FullPageLock").hide();
            //调一下下一步
            $scope.$apply();
        };

        //记录选择的文件数量
        vm.selectFiles=0;
        //记录已上传的文件数量
        vm.finishFiles=0;

        // 当前用户
        vm.CurrentUser=Authenticate.getUser();

        // 存放待保存到数据库中的文件
        vm.WaitUpload = [
        ];

        // 在线查看文件（图片、office/pdf文档）
        vm.Preview=function(file){
        	if(!file.vcType ){
        		//'N106039':'该数据没有文件类型',
        		/*Confirm($translate.instant('N106039'),{
                    title:$translate.instant('N106021'),
                    okText:$translate.instant('N001008'),
                    noCancel:true
                });*/
                toastr.error($translate.instant('N106039'));
        		return;
        	}
        	if( !file.fileId){
        		//'N106040':'该数据没有文件Id'
        		/*Confirm($translate.instant('N106040'),{
                    title:$translate.instant('N106021'),
                    okText:$translate.instant('N001008'),
                    noCancel:true
                });*/
                toastr.error($translate.instant('N106040'));
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
                file.fileId = file.fileId;
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
                            fileId : file.fileId,
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
            //将报告时间传给文件预览界面
            if(vm.item.fileType){
                file.vcDocTypeid=vm.item.fileType.dataCode;
            }
            if(vm.item.fileFirstType){
                file.vcReportDateFirst=vm.item.fileFirstType.dataCode;
            }
            if(vm.item.fileType.dataCode=='001'){
                file.vcReportDateSec=$filter("year")(vm.item.year);
            }else{
                file.vcReportDateThird=vm.item.filedate;
            }
            if(vm.item.fileType.dataCode=='001'&&vm.item.fileFirstType.dataCode=='004'){
                file.vcReportDateThird=$filter("quarter")(vm.item.quarter);
            }
            if(vm.item.fileType.dataCode=='001'&&vm.item.fileFirstType.dataCode=='005'){
                file.vcReportDateThird=$filter("month")(vm.item.month);
            }

            ngPdfDialog.open({
                template:'modules/commons/weboffice/specialPdf.html',
                controller: 'SpecialPdfController as vm',
                className:'modal-dialog',
                resolve: {
                    file: function() {
                        return {
                            fileId: file.fileId,
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
        	/*ngDialog.open({
                template:'modules/commons/weboffice/genericPdf.html',
                controller:'genericPdfController as vm',
                className:'ngdialog-theme-default ngdialog-img',
                resolve: {
                    file: function() {
                        return {
                            fileId: file.fileId,
                            fileName:file.vcDocName,
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
            //Confirm($translate.instant('N106041'),{
            //    title:$translate.instant('N106042'),//'N106042':'删除文件',
            //    okText:$translate.instant('N001008')
            //}).then(function(){

                vm.WaitUpload.splice(index, 1);
                toastr.success($translate.instant('N106043'));//'N106043':'文件删除成功！',

            //})
        };


        vm.save = function() {
            if(vm.WaitUpload.length==0)
                toastr.warning($translate.instant('N004555'));//N004555=请先选择文件

            // 保存时，传的参数（待上传文件，标的）
            vm.savecontent = {
                    waitupload:vm.WaitUpload
            };
            if(vm.item.fileType){
                vm.savecontent.fileType=vm.item.fileType.dataCode;
            }
            if(vm.item.fileFirstType){
                vm.savecontent.fileFirstType=vm.item.fileFirstType.dataCode;
            }

            if(vm.item.year){
                vm.savecontent.year=vm.item.year;
            }

            if(vm.item.quarter){
                vm.savecontent.quarter=vm.item.quarter;
            }

            if(vm.item.month){
                vm.savecontent.month=vm.item.month;
            }

            if(vm.item.filedate){
                vm.savecontent.filedate=vm.item.filedate;
            }

            Restangular.all('file/doc/addfile')
                .post(vm.savecontent)
                .then(function (data) {
                    if(data){
                        if(data.code=='1'){
                            toastr.success($translate.instant('N001790'));//N001790=文件上传成功
                            $scope.closeThisDialog();
                        }else{
                            toastr.error($translate.instant('N106045'));//N106045=文件上传失败
                        }
                    }
                });
        };



        // 上传文件——取消
        vm.Close = function(){
            $scope.closeThisDialog();
            vm.WaitUpload = [];       // 关闭“上传文件”窗口的同时，删除右侧所有待上传的文件
           /* if(vm.WaitUpload.length > 0){
                Confirm('存在待上传文件，确定关闭窗口？',{
                    title:'关闭窗口',
                    okText:$translate.instant('N001008')
                }).then(function(){
                    $scope.closeThisDialog();
                    vm.WaitUpload = [];       // 关闭“上传文件”窗口的同时，删除右侧所有待上传的文件
                });
            }else{
                $scope.closeThisDialog();
            }*/

        };


        //文件上传成功后，获取到文件的相关属性，保存到P_DOC(文档信息表)中
        vm.onComplete = function(file) {

        	//如果返回失败信息解锁页面，弹出提示
        	if(file.msg.message){
        		//Confirm(file.msg.message,{title:$translate.instant('N106021'),okText:$translate.instant('N001008')});

                toastr.success(file.msg.message);
        	}
        	if(!file.msg.success|| !file.msg.fileId){
        		//'N106045':'文件上传失败',
        		//Confirm($translate.instant('N106045'),{title:$translate.instant('N106021'),okText:$translate.instant('N001008')});
                toastr.error($translate.instant('N106045'));
        		return ;
        	}
        	
            vm.item.fileId = file.msg.fileId;
            vm.item.vcType = file.msg.fileType;
            vm.item.vcDocName = file.msg.fileName;
            vm.item.docSize = file.msg.start;
            vm.item.vcOrgId = file.msg.vcOrgId;

            /*  1、将已上传的文件放到数组中，等待保存到数据库；
             2、unshift方法，将最新的文件放到最上面，push相反；
             */

            vm.WaitUpload.unshift({
                fileId: file.msg.fileId,
                vcType: file.msg.fileType,
                vcDocName: file.msg.fileName,
                docSize: file.msg.start,
                vcOrgId: file.msg.vcOrgId
            });

            // 只存放本次上传时选择的文件
            var NewWaitUpload = [];
            NewWaitUpload.unshift({
                fileId: file.msg.fileId,
                vcType: file.msg.fileType,
                vcDocName: file.msg.fileName,
                docSize: file.msg.start,
                vcOrgId: file.msg.vcOrgId
            });

            //调一下下一步
            vm.next();

            //记录已上传的文件
            vm.finishFiles=vm.finishFiles+1;
            $scope.$apply();
            //vm.Save(NewWaitUpload);

          /* selectedLi="";//清空已选中的文件*/
        };




        //设置选中文件的背景
        vm.setLiBackground = function(selLi){
            $("[id^=fileLi]").each(function(){
                if("fileLi"+selLi==$(this).attr("id")) {
                    $(this).css("background-color", "#F0F0F0");//选中li的背景
                }else{
                    $(this).css("background-color", "#FFF");//未选中li的背景
                }
            });
        };

        /**
         * 重命名
         * @param item
         */
        vm.rename=function(index,item){
            ngDialog.open({
                template:'modules/file-upload/file.rename.html',
                controller:'FileUploadRenameController as vm',
                className:'ngdialog-theme-default ngdialog-md file-rename',
                resolve: {
                    file: function() {
                        return item;
                    }
                }
            }).closePromise
                .then(function(data){
                    if(data&&data.value&&data.value.fileId){
                        item=data.value;
                        //先删后插
                        vm.WaitUpload.splice(index, 1,item);
                    }
                });
        }
    }

})();