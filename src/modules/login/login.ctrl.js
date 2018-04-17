(function() {
    'use strict';

    angular.module('demo.login')
        .controller('LoginController', LoginController);

    /* @ngInject */
    function LoginController($state, toastr, Authenticate, LoginAPI, CacheAPI, SystemRestangular) {



        var vm = this;

        Authenticate.clearUser();

        var token;

        SystemRestangular.oneUrl('mainframe/login/csrf')
            .get()
            .then(function(data) {
                token = data.token;
                Authenticate.setCSRF(token);
            });

        vm.getUser = function() {
            CacheAPI.one('userdetails')
                .customGET();
        };

        vm.login = function() {

            LoginAPI
                .post(null, angular.extend({ajax: true, '_csrf': token}, vm.user))

                // 登录
                .then(function() {

                    return Authenticate.checkLogin();

                })

                // 跳转
                .then(function() {

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
                })

                .catch(function(msg) {
                    console.error(msg);
                    toastr.error(msg);
                });

        };

    }
})();
