(function() {
    'use strict';

    angular.module('demo.core')
        .factory('Confirm', ConfirmService);

    /* @ngInject */
    function ConfirmService($translate,ngDialog) {
        var confirm = function(message, options) {

            options = angular.extend({
                message: message,
                cancelText: $translate.instant('N000992'),// '取消'
                okText: $translate.instant('N001008'),// '确认'
                hasOk:true
            }, options);

            return ngDialog.openConfirm({
                template: 'modules/commons/confirm.html',
                className: 'ngdialog-theme-default ngdialog-confirm',
                data: options
            });
        };

        return confirm;
    }
})();