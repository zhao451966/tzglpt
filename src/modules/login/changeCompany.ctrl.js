(function(){
    'use strict';

    angular
        .module('demo.login')
        .controller('changeCompanyController',changeCompanyController);

    /* @ngInject */
    function changeCompanyController($scope,item,Restangular,toastr,$translate){
        var vm = this;
        vm.item={};
        vm.item.vcCompanyName=item.vcCompanyName;
        //更新用户密码
        vm.save = function() {
            if (vm.item.vcCompanyName==vm.item.vcNewCompanyName)
            {
                toastr.error("新企业名称与原企业名称一致,请重新输入新企业名称!");
                return
            }
            Restangular.all('userinfo').one('changeCompany')
                .customPUT(vm.item)
                .then(function(data) {
                    if(data=='1'){
                        toastr.success("申请成功");
                        $scope.closeThisDialog(data);
                    }
                    else if(data=='2'){
                        toastr.error("新企业名称与原企业名称一致,请重新输入新企业名称!");
                    }
                    /*else if(data=='3'){
                        toastr.error("新企业名称已存在,请重新输入新企业名称!");
                    }*/
                    else if(data=='3'){
                        toastr.error("已存在该企业名称修改申请，请等待审核!");
                    }
                    else if(data=='-1'){
                        toastr.error($translate.instant('N004566'));//N004566=参数错误！
                        $scope.closeThisDialog(data);
                    }
                });
        };
    }
})();