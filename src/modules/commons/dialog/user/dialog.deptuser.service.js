(function() {
    'use strict';

    angular.module('demo.core')
        .factory('DialogDeptUser', DialogDeptUser);

    /* @ngInject */
    function DialogDeptUser(ngDialog,$translate) {
        var dialog = function(selected, options) {

            options = angular.extend({
                title:$translate.instant('N000222') ,// '查询用户'
                cancelText: $translate.instant('N000992'),//N000992='取消'
                okText: $translate.instant('N001524'),//N001524='选择'
                selectionMode: 'single',
                parentUnitCode:undefined//是否取 指定部门的子部门树
            }, options);

            return ngDialog.open({
                template: 'modules/commons/dialog/user/dialog.deptuser.html',
                controller: 'DialogDeptUserController as vm',
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