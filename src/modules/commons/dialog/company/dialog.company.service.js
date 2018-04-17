(function() {
    'use strict';

    angular.module('demo.core')
        .factory('DialogCompany', DialogCompany);

    /* @ngInject */
    function DialogCompany(ngDialog,$translate) {
        var dialog = function(selected,options) {

            options = angular.extend({
                title: $translate.instant('N001794'),//N001794=选择企业
                cancelText: $translate.instant('N000992'),//N000992='取消'
                okText: $translate.instant('N001524'),//N001524='选择'
                selectionMode: 'single',
                vcAppCountry:{},
                vcAppProvince:{},
                vcAppCity:{}
            }, options);

            return ngDialog.open({
                template: 'modules/commons/dialog/company/dialog.company.html',
                controller: 'DialogCompanyController as vm',
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