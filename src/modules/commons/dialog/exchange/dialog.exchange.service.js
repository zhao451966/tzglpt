(function() {
    'use strict';

    angular.module('demo.core')
        .factory('DialogExchange', DialogExchange);

    /* @ngInject */
    function DialogExchange(ngDialog,$translate) {
        var dialog = function(options) {

            options = angular.extend({
                title:$translate.instant('N106008'),// '查询汇率'
                cancelText: $translate.instant('N000992'),//N000992='取消'
                okText: $translate.instant('N001524'),//N001524='选择'
            }, options);

            return ngDialog.open({
                template: 'modules/commons/dialog/exchange/dialog.exchange.html',
                controller: 'DialogExchangeController as vm',
                data: options,
                className: 'ngdialog-theme-default ngdialog-md'
            });
        };

        return dialog;
    }
})();