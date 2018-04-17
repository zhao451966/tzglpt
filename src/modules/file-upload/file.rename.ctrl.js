(function() {
    'use strict';

    angular
        .module('fosun.file')
        .controller('FileUploadRenameController', FileUploadRenameController);

    /* @ngInject */
    function FileUploadRenameController(
    		$translate, $scope, ngDialog,Confirm,toastr,file) {
        var vm = this;

        //进行属性拷呗
        vm.item=angular.extend({}, vm.item, file);

        vm.save=function(){
            toastr.success($translate.instant('N004537'));//N004537=重命名成功
            $scope.closeThisDialog(vm.item);
        }

        vm.close=function(){
            $scope.closeThisDialog();
        }
    }
})();