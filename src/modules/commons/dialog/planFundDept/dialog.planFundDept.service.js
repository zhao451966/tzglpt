(function() {
    'use strict';

    angular.module('demo.core')
        .factory('DialogPlanFundDept', DialogPlanFundDept);

    /* @ngInject */
    function DialogPlanFundDept(ngDialog,$translate) {
        var dialog = function(selected, options) {

            options = angular.extend({
                title: $translate.instant('N000219'),//N000219=查询拟出资平台
                cancelText: $translate.instant('N000992'),//N000992=取消
                okText:$translate.instant('N001524'),//N001524=选择
                selectionMode: 'multiple'
            }, options);

            return ngDialog.open({
                template: 'modules/commons/dialog/planFundDept/dialog.planFundDept.html',
                controller: 'DialogPlanFundDeptController as vm',
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