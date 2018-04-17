(function() {
    'use strict';

    angular.module('demo.core')
        .factory('DialogProject', DialogProject);

    /* @ngInject */
    function DialogProject(ngDialog,$translate) {
    	var dialog = function(selected, options) {
            options = angular.extend({
                title:  $translate.instant('N000221'),//'查询项目'
                cancelText: $translate.instant('N000992'),//N000992='取消'
                okText: $translate.instant('N001524'),//N001524='选择'
                selectionMode: 'single'
            }, options);

            return ngDialog.open({
                template: 'modules/commons/dialog/project/dialog.project.select.html',
                controller: 'DialogProjectSelectController as vm',
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