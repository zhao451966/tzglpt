(function() {
    'use strict';

    angular.module('demo.core')
        .factory('DialogMessageConfig', DialogMessageConfig);

    /* @ngInject */
    function DialogMessageConfig(ngDialog,$translate) {
        var dialog = function(s,options) {

            options = angular.extend({
                title:  $translate.instant('N106023'),//'N106023':'消息配置'
                cancelText: $translate.instant('N000992'),//N000992='取消'
                okText: $translate.instant('N001524'),//N001524='选择'
            }, options);

            return ngDialog.open({
                template: 'modules/commons/dialog/messageConfig/message.config.html',
                controller: 'DialogMessageConfigController as vm',
                data: options,
                className: 'ngdialog-theme-default ngdialog-md',
                resolve: {
                    item: function() {
                        return {};
                    }
                }
            });
        };

        return dialog;
    }
})();