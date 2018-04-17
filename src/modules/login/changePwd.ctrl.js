(function(){
    'use strict';

    angular
        .module('demo.login')
        .controller('changePwdController',changePwdController);

    /* @ngInject */
    function changePwdController($scope,item,Restangular,toastr,$translate){
        var vm = this;
        vm.item=item;
        //更新用户密码
        vm.save = function(password,newPassword,qrPassword) {
            var c = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/g;
            if(!c.test(newPassword)){
                toastr.error($translate.instant('N005130'));//N005130='新密码至少6位，必须是数字和字母组合！'
                return;
            }
            if (newPassword!=qrPassword)
            {
                toastr.error($translate.instant('N005127'));//N005127='新密码不一致！'
                return
            }
            Restangular.all('userinfo').one('change').one(item.userCode).one(password).one(newPassword)
                .put()
                .then(function(data) {
                    if(data=='1'){
                        toastr.success($translate.instant('N004563'));//N004563='成功更新密码！'
                        $scope.closeThisDialog(data);
                    }
                    else if(data=='2'){
                        toastr.error($translate.instant('N004564'));//N004564='旧密码不正确！'
                    }
                    else if(data=='3'){
                        toastr.error($translate.instant('N004565'));//N004565='新密码和旧密码一致，请重新输入新密码！'
                    }
                    else if(data=='4'){
                        toastr.error($translate.instant('N005130'));//N005130='新密码至少6位，必须是数字和字母组合！'
                    }
                    else if(data=='-1'){
                        toastr.error($translate.instant('N004566'));//N004566=参数错误！
                        $scope.closeThisDialog(data);
                    }
                });
        };
    }
})();