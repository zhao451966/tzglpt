(function() {
    'use strict';

    angular.module('fosun.messageConfig')
        .run(ValuationRun);

    /* @ngInject */
    function ValuationRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'root.messageConfig',
                config: {
                    url: '/messageConfig',
                    views: {
                        'main@': {
                            templateUrl: 'modules/commons/dialog/messageConfig/messageConfig.list.html',
                            controller: 'messageConfigController as vm'
                        }
                    },
                    title: '系统消息配置',
                    data: {
                        requireLogin: true
                    }
                }
            }
        ];
    }
})();