(function() {
    'use strict';

    angular.module('demo.core')
        .factory('DialogRUnit', DialogRUnit);

    /* @ngInject */
    function DialogRUnit(ngDialog) {
        var dialog = function(selected, options) {

            options = angular.extend({
                title: '查询部门',
                cancelText: '取消',
                okText: '选择',
                selectionMode: 'single'
            }, options);

            return ngDialog.open({
                template: 'modules/commons/dialog/rUnit/dialog.unit.html',
                controller: 'DialogRUnitController as vm',
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