(function () {
    'use strict';

    angular.module('helper.router')
        .provider('routerHelper', RouterHelperProvider);

    /* @ngInject */
    function RouterHelperProvider($locationProvider, $stateProvider, $urlRouterProvider) {

        var config = {
            html5Mode: false,
            otherwise: '/login',
            resolveAlways: {}
        };

        this.configure = function (cfg) {
            angular.extend(config, cfg);
        };

        this.$get = RouterHelper;
        /* @ngInject */
        function RouterHelper($state, $rootScope, toastr, Authenticate) {

            var service = {
                configureStates: configureStates,
                getStates: getStates
            };

            init();

            return service;

            /////////////////////////

            function init () {
                $locationProvider.html5Mode(config.html5Mode);
                $urlRouterProvider.otherwise(config.otherwise);

                $rootScope.$on('$stateChangeStart',
                    function(event, toState, toParams, fromState, fromParams){
                        //路由跳转前，清空所有弹出提示
                         toastr.clear();
                    }
                );

                $rootScope.$on('$stateChangeError',
                    function (event, toState, toParams, fromState, fromParams, error){
                        if (error === 'ERROR_REQUIRE_LOGIN') {
                            toastr.error('请先登录！');

                            $state.prev = {
                                state: toState.name,
                                params: toParams
                            };

                            return $state.go('root.login');
                        }
                        else if (error === 'ERROR_ONLY_COMPANY') {
                            toastr.error('您只能查看企业文件列表！');
                            return $state.go('root.filelist');
                        }
                        else if (error === 'ERROR_ONLY_FUND') {
                            toastr.error('您只能查看基金文件列表！');
                            return $state.go('root.filefundlist');
                        }
                    }
                );

                $rootScope.$on('$stateChangeStart',
                    function(event, toState, toParams, fromState, fromParams, options){
                        //TODO 判断弹出窗口是否打开
                        //if ($.find('.ngdialog').length) {
                        //    return event.preventDefault();
                        //}
                        // transitionTo() promise will be rejected with
                        // a 'transition prevented' error
                    });

                $rootScope.$on('$stateChangeSuccess',
                    function(event, toState, toParams, fromState, fromParams){

                        //console.log('toState: ', toState);
                        //console.log('toParams: ', toParams);
                        //console.log('fromState: ', fromState);
                        //console.log('fromParams: ', fromParams);

                        if (fromState.name === "root.projects.bigview") {
                            window.$currentProject = fromParams.id;
                        }

                        if (toState.name === "root.projects.bigview") {

                            // 切换到其他项目，清空当前选中
                            if (window.$currentProject != toParams.id) {
                                $rootScope.$currentStage = undefined;
                                $rootScope.$currentStageTabs = [];
                            }

                        }


                        if (toState.id) {
                            $('body').attr('id', toState.id);
                        }
                        else {
                            $('body').removeAttr('id');
                        }

                        if (toState != fromState) {
                            $('body')[0].scrollTop = 0;
                        }


                        $('body').addClass('loaded');

                        var hasMenu = !(toState.views['menu@'] === '');
                        if (hasMenu) {
                            $('body').removeClass('no-menu');
                        }
                        else {
                            $('body').addClass('no-menu');
                        }

                        var hasHeader = !(toState.views['header@'] === '');
                        if (hasHeader) {
                            $('body').removeClass('no-header');
                        }
                        else {
                            $('body').addClass('no-header');
                        }

                        // 发送统计信息
                        sendFonova(_user);
                    }
                );
            }

            function configureStates(states, otherwisePath) {
                angular.forEach(states, function (state) {

                    var data = state.config.data;

                    if (data && data.requireLogin === false) {
                    }
                    //企业用户
                    else if(state.state=='root.filelist'){

                        //console.log(state.state == 'root.login');

                        state.config.resolve = angular.extend(
                            state.config.resolve || {},
                            {
                                'loginResolve': function() {
                                    return Authenticate.checkQYLogin();
                                }
                            }
                        );
                    }
                    //基金用户
                    else if(state.state=='root.filefundlist') {

                        //console.log(state.state == 'root.login');

                        state.config.resolve = angular.extend(
                            state.config.resolve || {},
                            {
                                'loginResolve': function() {
                                    return Authenticate.checkJJLogin();
                                }
                            }
                        );
                    }
                    else {

                        //console.log(state.state == 'root.login');

                        state.config.resolve = angular.extend(
                            state.config.resolve || {},
                            {
                                'loginResolve': function() {
                                    return Authenticate.checkLogin();
                                }
                            }
                        );
                    }

                    state.config.resolve = angular.extend(state.config.resolve || {},
                        config.resolveAlways);

                    $stateProvider.state(state.state, state.config);

                    if (otherwisePath) {
                        $urlRouterProvider.otherwise(otherwisePath);
                    }
                });
            }

            function getStates () {
                return $state.get();
            }

        }
    }
})();
