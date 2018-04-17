(function() {
    'use strict';

    angular
        .module('fosun.file')
        .controller('FileRenameController', FileRenameController);

    /* @ngInject */
    function FileRenameController(
    		$translate, $scope,Restangular,
    		ngDialog,Confirm,toastr,file) {
        var vm = this;

        vm.item={};
        vm.queryFile=function(){
            Restangular.all('file/doc').one(file.vcDocId)
                .get()
                .then(function(data){
                    if(data){
                        vm.item=data;
                    }
                })
        }

        vm.queryFile();

        vm.save=function(){
            if(!vm.item.vcDocId)
                return;
            Restangular.all('file/doc').one('rename').one(vm.item.vcDocId)
                .customPUT(vm.item)
                .then(function(data){
                    toastr.success($translate.instant('N004537'));//N004537='重命名成功'
                    $scope.closeThisDialog();
                })
        }

        vm.close=function(){
            $scope.closeThisDialog();
        }
    }
})();