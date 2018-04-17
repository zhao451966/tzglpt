(function() {
    'use strict';

    angular.module('demo.core')
        .factory('DialogUserEmial', DialogUserEmial);

    /* @ngInject */
    function DialogUserEmial(ngDialog) {
        var dialog = function(selected, options) {

            options = angular.extend({
                title: '查询用户Email',
                cancelText: '取消',
                okText: '选择',
                selectionMode: 'single'
            }, options);

            return ngDialog.open({
                template: 'modules/commons/dialog/useremail/dialog.user.email.html',
                controller: 'DialogUserEmailController as vm',
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