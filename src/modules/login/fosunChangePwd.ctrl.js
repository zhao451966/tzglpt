(function(){
    'use strict';

    angular
        .module('demo.login')
        .controller('fosunChangePwdController',fosunChangePwdController);

    /* @ngInject */
    function fosunChangePwdController($scope,Restangular,toastr){
        var vm = this;
        //更新用户密码
        vm.save = function(password,newPassword,qrPassword) {

            var b = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,}$/g;
            if(!b.test(password)){
                toastr.error("旧密码至少8位，必须是数字和字母组合！");
                return;
            }
            var c = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,}$/g;
            if(!c.test(newPassword)){
                toastr.error("新密码至少8位，必须是数字和字母组合！");
                return;
            }
            if (newPassword!=qrPassword)
            {
                toastr.error("新密码不一致！");
                return
            }
            Restangular.all('fosun').one('change').one(password).one(newPassword).one('?accessToken=123321').put()
                .then(function(data) {
                    // 关闭弹出窗口并返回更新对象
                    toastr.success('成功更新密码！');
                    $scope.closeThisDialog(data);
                })
            .catch(function(msg) {
                console.error(msg);
                toastr.error(msg);
            });

        };
    }
})();