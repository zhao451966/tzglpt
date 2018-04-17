(function() {
    'use strict';

    angular.module('demo.core')
        .factory('UserUnitTreeExchangeController', UserUnitTreeExchangeController);

    /* @ngInject */
    function UserUnitTreeExchangeController(ngDialog,$translate) {
        var dialog = function(selected,options) {

            options = angular.extend({
                title: $translate.instant('N000409'),// N000409='分管部门'
                cancelText: $translate.instant('N000992'),//N000992='取消'
                okText: $translate.instant('N001524'),//N001524='选择'
            }, options);

            return ngDialog.open({
                template: 'modules/commons/dialog/userUnitTree/userUnitTree.exchange.html',
                controller: 'UserUnitTreeExchangeController as vm',
                data: options,
                className: 'ngdialog-theme-default ngdialog-md',
                resolve: {
                    selected: function() {
                        return selected;
                    }
                }
            });
        };

        return dialog;
    }
})();