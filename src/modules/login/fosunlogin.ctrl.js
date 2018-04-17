(function() {
    'use strict';

    angular.module('demo.login')
        .controller('fosunLoginController', fosunLoginController);

    /* @ngInject */
    function fosunLoginController($state, toastr, Authenticate, LoginAPI, CacheAPI, SystemRestangular,Restangular,ngDialog) {
        var vm = this;

        Authenticate.clearUser();

        var token;

        SystemRestangular.oneUrl('mainframe/login/csrf')
            .get()
            .then(function(data) {
                token = data.token;
                Authenticate.setCSRF(token);
            });

        Restangular.all('common').one('getMutilLanCofig').get()
            // 跳转
            .then(function(data) {

            })

        vm.getUser = function() {
            CacheAPI.one('userdetails')
                .customGET();
        };

        vm.login = function() {
            if(!vm.user){
                toastr.error("请输入用户名，密码！");
                return;
            }
            if(!vm.user.username){
                toastr.error("请输入用户名！");
                return;
            }
            if(!vm.user.password){
                toastr.error("请输入密码！");
                return;
            }
            var b = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,}$/g;
            if(!b.test(vm.user.password)){
                toastr.error("密码至少8位，必须是数字和字母组合！");
                return;
            }
            Restangular.all('fosun').one('fosunlogin?accessToken='+token).customPUT(vm.user)
                // 跳转
                .then(function(data) {
                    if (!data.code) {
                      return Authenticate.checkLogin();
                    }else{
                        var type=data.message.substring(0,4);
                        if('login error:Bad credentials!'==data.message){
                            toastr.error("您输入的密码错误!");
                        }else if(type=="user"){
                            toastr.error("您输入的用户名不存在!");
                        }else if(data.message=='lock!'){
                            toastr.error("您输入的用户己被停用或者离职!");
                        }
                    }
                })

                // 跳转
                .then(function(data) {
                    if (!data.code) {
                        toastr.success('登录成功！');

                        var prev = $state.prev;

                        if (prev) {
                            $state.go(prev.state, prev.params);
                        }

                        else {
                            /*$state.go('root.enter');*/
                            /*$state.go('root.projects');*/
                            window.location.href = getViewContextPath()+'dashboard/index.html';
                        }
                    }
                })
                //.catch(function(msg) {
                //    console.error(msg);
                //    toastr.error(msg);
                //});

        };
        //更新密码
        vm.uppwd=function(){
            ngDialog.open({
                template: 'modules/login/fosunChangePwd.html',
                controller: 'fosunChangePwdController as vm'
                , className: 'ngdialog-theme-default '
            });
        };
    }
})();
