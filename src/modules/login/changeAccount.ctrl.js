(function(){
    'use strict';

    angular
        .module('demo.login')
        .controller('changeAccountController',changeAccountController);

    /* @ngInject */
    function changeAccountController($scope,item,Restangular,toastr,$translate){
        var vm = this;
        vm.item={};
        vm.item.loginName=item.loginName;
        //更新用户密码
        vm.save = function() {
            var ce = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            var c = /^[a-z0-9A-Z_]{1,50}$/;
            if((!c.test(vm.item.newLoginName))&&(!ce.test(vm.item.newLoginName))){
                toastr.error("新帐号格式错误，只能输入字母数字下划线或邮箱!");
                return;
            }
            if (vm.item.loginName==vm.item.newLoginName)
            {
                toastr.error("新帐号与原帐号一致,请重新输入新帐号!");
                return
            }
            Restangular.all('userinfo').one('changeAccount')
                .customPUT(vm.item)
                .then(function(data) {
                    if(data=='1'){
                        toastr.success("申请成功");
                        $scope.closeThisDialog(data);
                    }
                    else if(data=='2'){
                        toastr.error("新帐号与原帐号一致,请重新输入新帐号!");
                    }
                    else if(data=='3'){
                        toastr.error("新帐号格式错误，只能输入字母数字下划线或邮箱!");
                    }
                    /*else if(data=='4'){
                        toastr.error("新帐号已存在,请重新输入新帐号!");
                    }*/
                    else if(data=='4'){
                        toastr.error("已存在该登录帐号修改申请，请等待审核!");
                    }
                    else if(data=='-1'){
                        toastr.error($translate.instant('N004566'));//N004566=参数错误！
                        $scope.closeThisDialog(data);
                    }
                });
        };
    }
})();