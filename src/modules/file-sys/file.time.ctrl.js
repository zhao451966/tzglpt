(function() {
    'use strict';

    angular
        .module('fosun.file')
        .controller('FileTimeController', FileTimeController);

    /* @ngInject */
    function FileTimeController(
    		$translate, $scope,Restangular,
    		ngDialog,Confirm,toastr,file) {
        var vm = this;

        vm.item={};

        vm.init=function(){
            if(vm.item.vcDocTypeid){
                if(!vm.item.fileType){
                    vm.item.fileType={};
                }
                vm.item.fileType=vm.item.vcDocTypeid;
            }
            if(vm.item.vcReportDateFirst){
                if(!vm.item.fileFirstType){
                    vm.item.fileFirstType={};
                }
                vm.item.fileFirstType=vm.item.vcReportDateFirst;
            }

            if(vm.item.vcDocTypeid=='001'&&vm.item.vcReportDateSec){
                if(!vm.item.year){
                    vm.item.year={};
                }
                vm.item.year=vm.item.vcReportDateSec;
            }

            if(vm.item.vcDocTypeid=='001'&&vm.item.vcReportDateFirst=='004'){
                if(!vm.item.quarter){
                    vm.item.quarter={};
                }
                //季度转成月
                /*var month=vm.item.vcReportDateThird*3-2;
                vm.item.quarter=vm.item.year+"-"+(month<10?'0'+month:month);*/
                vm.item.quarter=vm.item.vcReportDateThird;
            }

            if(vm.item.vcDocTypeid=='001'&&vm.item.vcReportDateFirst=='005'){
                if(!vm.item.month){
                    vm.item.month={};
                }
                vm.item.month=vm.item.year+"-"+vm.item.vcReportDateThird;
            }

            if(vm.item.fileType=='002'){
                vm.item.filedate=vm.item.vcReportDateThird;
            }
            else{
                //根据一级文件类型获取二级文件类型
                vm.dictionary.fileFirstTypes=Restangular.all("file/doctype").one("second").one(vm.item.fileType)
                    .getList().$object
            }
        }


        /**
         * 引索标志
         * FILE_TYPE FILE_DATE SELECT_FILE
         */
        vm.guideFlag={
            FILE_TYPE:false,
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

        vm.selectFileType=function(){
            vm.item.fileFirstType=null;
            vm.item.year=undefined;
            vm.item.quarter=undefined;
            vm.item.month=undefined;
            vm.item.filedate=undefined;

            if(vm.item.fileType=='001'){
                //根据一级文件类型获取二级文件类型
                vm.dictionary.fileFirstTypes=Restangular.all("file/doctype").one("second").one(vm.item.fileType)
                    .getList().$object
            }
        }

        vm.selectFirstType=function(){
            vm.item.year=undefined;
            vm.item.quarter=undefined;
            vm.item.month=undefined;
            vm.item.filedate=undefined;
        }


        vm.queryFile=function(){
            Restangular.all('file/doc').one(file.vcDocId)
                .get()
                .then(function(data){
                    if(data){
                        vm.item=data;
                        vm.init();
                    }
                })
        }

        vm.queryFile();

        vm.save=function(){
            if(!vm.item.vcDocId)
                return;

            Restangular.all('file/doc').one('time').one(vm.item.vcDocId)
                .customPUT(vm.item)
                .then(function(data){
                    toastr.success($translate.instant('N004554'));//N004554='报告时间修改成功'
                    $scope.closeThisDialog();
                })
        }

        vm.close=function(){
            $scope.closeThisDialog();
        }

    }

})();