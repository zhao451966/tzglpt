(function() {
    'use strict';

    angular.module('demo.core')
        .factory('DialogDueUser', DialogDueUser);

    /* @ngInject */
    function DialogDueUser(ngDialog,$translate) {
        var dialog = function(vcDueType,selected, options) {

            options = angular.extend({
                title:$translate.instant('N004189'),//N004189=查询尽调人员
                cancelText: $translate.instant('N000992'),//N000992=取消
                okText:$translate.instant('N001524'),//N001524=选择
                selectionMode: 'single'
            }, options);

            return ngDialog.open({
                template: 'modules/commons/dialog/dueUser/dialog.dueuser.html',
                controller: 'DialogDueUserController as vm',
                data: options,
                className: 'ngdialog-theme-default ngdialog-md',
                resolve: {
                    selected: function() {
                        return selected;
                    },
                    vcDueType: function() {
                        return vcDueType;
                    }
                }
            });
        };

        return dialog;
    }
})();