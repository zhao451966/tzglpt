(function() {
    'use strict';

    angular.module('demo.core')
        .factory('DialogNewUnitUser', DialogNewUnitUser);

    /* @ngInject */
    function DialogNewUnitUser(ngDialog,$translate) {
        var dialog = function(selected, options) {

            options = angular.extend({
                title: $translate.instant('N000216'),//'查询部门'
                cancelText: $translate.instant('N000992'),//N000992='取消'
                okText: $translate.instant('N001524'),//N001524='选择'
                selectionMode: 'multiple'
            }, options);

            return ngDialog.open({
                template: 'modules/commons/dialog/newUnit/dialog.newunituser.html',
                controller: 'DialogNewUnitUserController as vm',
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