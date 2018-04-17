(function() {
    'use strict';

    angular.module('demo.core')
        .factory('DialogProjectDingGroup', DialogProject);

    /* @ngInject */
    function DialogProject(ngDialog) {
    	var dialog = function(selected, options) {

            options = angular.extend({
                title: '查询钉钉群',
                cancelText: '取消',
                okText: '选择',
                selectionMode: 'single'
            }, options);

            return ngDialog.open({
                template: 'modules/commons/dialog/projectDingGroup/dialog.project.ding.select.html',
                controller: 'DialogProjectDingGroupController as vm',
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