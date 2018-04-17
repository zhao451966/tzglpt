(function() {
    'use strict';

    angular.module('demo.core')
        .factory('DialogAddress', DialogAddress);

    /* @ngInject */
    function DialogAddress(ngDialog,$translate) {
        var dialog = function(options) {

            options = angular.extend({
                title: $translate.instant('N001526'),//N001526='选择地址'
                cancelText: $translate.instant('N000992'),//N000992='取消'
                okText: $translate.instant('N001524'),//N001524='选择'
                vcAppCountry:{},
                vcAppProvince:{},
                vcAppCity:{}
            }, options);

            return ngDialog.open({
                template: 'modules/commons/dialog/address/dialog.address.html',
                controller: 'DialogAddressController as vm',
                data: options,
                className: 'ngdialog-theme-default ngdialog-sm'
            });
        };

        return dialog;
    }
})();