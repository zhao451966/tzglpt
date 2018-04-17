(function() {
    'use strict';

    angular.module('demo.core')
        .factory('DialogEnterprise', DialogEnterprise);

    /* @ngInject */
    function DialogEnterprise(ngDialog) {
        var dialog = function(options) {

            options = angular.extend({
                title: '查询企业',
                cancelText: '取消',
                okText: '选择'
            }, options);

            return ngDialog.open({
                template: 'modules/commons/dialog/enterprise/dialog.enterprise.html',
                controller: 'DialogEnterpriseController as vm',
                data: options,
                className: 'ngdialog-theme-default ngdialog-md'
            });
        };

        return dialog;
    }
})();