(function() {
    'use strict';

    if (!window.requestMap) {
        window.requestMap = {};
    }

    angular
        .module('demo.core')
        .config(RestAngularConfig)
        .factory('RootRestangular', RootRestangular)
    	.factory('SystemRestangular', SystemRestangular);

    /* @ngInject */
    function RestAngularConfig (RestangularProvider) {
        var showError = _.throttle(function(msg) {
            // if (window.toastr) {
            //     toastr.error(msg, {timeOut: 3000});
            // }
            console.error(msg);
        }, 1);

        RestangularProvider
            .setBaseUrl(ContextPath+'service/')
            .addRequestInterceptor(removeDeleteMethodRequestBody)
            .addResponseInterceptor(transformResponse)
            .addFullRequestInterceptor(function(elem, operation, what, url, headers, params) {
                params.accessToken = (window._user ? window._user.accessToken : undefined);
            })
            .setDefaultHeaders({'X-Requested-With': 'XMLHttpRequest'})
            .setErrorInterceptor(function(response, deferred, responseHandler) {
                console.error(response);

                showError('后台发生异常，请联系管理员');
                $('#request-loader').hide();
                window.requestMap = {};
                return deferred.reject(response.status + " " + response.statusText);
            });
            //设置前端等待响应时间
            //.setDefaultHttpFields({timeout: 1000*10});

        function transformResponse (data, operation, what, url, res, deferred) {

            if (['post', 'put', 'customPUT', 'customPOST', 'remove', 'customREMOVE'].indexOf(operation) > -1) {

                delete window.requestMap[url];

                if (_.isEmpty(window.requestMap)) {
                    $('#request-loader').hide();
                }

            }

            // 正确返回
            if (data.code == 0) {
                if (data.data) {
                    var result = data.data;

                    // 系统列表
                    if (result.objList || result.pageDesc) {

                        if (!result.objList) {
                            result.objList = [];
                        }

                        // 分页信息
                        if (result.pageDesc) {
                            result.objList.pageDesc = result.pageDesc;
                        }

                        return result.objList;
                    }
                    else if (['getList', 'customGETLIST'].indexOf(operation) > -1 && !angular.isArray(result)) {
                        return [];
                    }

                    return result;
                }

                return null;
            }

            else if (data.code == 401) {
                //return window.location.href = getContextPath() + '#/login';
                return 'userdetails' === what ? null : window.location.href = getViewContextPath() + '#/login';
            }
            // 错误返回 101,400系统登录返回
            else if(data.code == 101){
            }
            // 错误返回 501不提示错误信息
            else if (data.code && data.code != 501) {
                if (window.toastr && data.message) {
                    toastr.error(data.message || '系统错误', {timeOut: 3000});
                }
                return deferred.reject(data.message || '系统错误')
            }

            else if (data.code == 501) {
                return deferred.reject(data.message || '系统错误')
            }

            return data;
        }
    }

    /* @ngInject */
    function SystemRestangular(Restangular) {
        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer
                .setBaseUrl(ContextPath+'system/');
        });
    }

    
    /* @ngInject */
    function RootRestangular(Restangular) {
        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer
                .setBaseUrl(ContextPath);
        });
    }

    // 移出DELETE请求 body
    window.$requestCount = 0;
    function removeDeleteMethodRequestBody (elem, operation, what, url) {

        //console.log(arguments);

        if (['post', 'put', 'customPUT', 'customPOST', 'remove', 'customREMOVE'].indexOf(operation) > -1) {

            // 不包含校验请求
            if (url && url.indexOf('check') < 0) {

                window.requestMap[url] = true;

                $('#request-loader').show();
                //
                //setTimeout(function() {
                //    $('#request-loader').hide();
                //}, 1000);
            }
        }


        if (operation === "remove") {
            return null;
        }

        return elem;
    }
})();
