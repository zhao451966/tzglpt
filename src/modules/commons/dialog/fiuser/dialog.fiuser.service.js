(function() {
    'use strict';

    angular.module('demo.core')
        .factory('DialogFiUser', DialogFiUser);

    /* @ngInject */
    function DialogFiUser(ngDialog,$translate) {
        var dialog = function(selected, options) {

            options = angular.extend({
                title: $translate.instant('N000222'),//'查询用户'
                cancelText: $translate.instant('N000992'),//'取消'
                okText: $translate.instant('N001524'),//'选择'
                selectionMode: 'single'
            }, options);

            return ngDialog.open({
                template: 'modules/commons/dialog/fiuser/dialog.fiuser.html',
                controller: 'DialogFiUserController as vm',
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