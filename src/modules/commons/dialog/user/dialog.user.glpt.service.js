(function() {
    'use strict';

    angular.module('demo.core')
        .factory('DialogUserGlpt', DialogUserGlpt);

    /* @ngInject */
    function DialogUserGlpt(ngDialog,$translate) {
        var dialog = function(selected, options) {

            options = angular.extend({
                title: $translate.instant('N106004') ,// N106004=用户管理平台
                cancelText: $translate.instant('N000992'),//N000992='取消'
                okText: $translate.instant('N001524'),//N001524='选择'
                selectionMode: 'single'
            }, options);

            return ngDialog.open({
                template: 'modules/commons/dialog/user/dialog.user.glpt.html',
                controller: 'DialogUserGlptController as vm',
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