(function() {
    'use strict';

    angular.module('demo.core')
        .factory('DialogFiUnit', DialogFiUnit);

    /* @ngInject */
    function DialogFiUnit(ngDialog,$translate) {
        var dialog = function(selected, options) {

            options = angular.extend({
                title: $translate.instant('N000216'),//N000216='查询部门'
                cancelText: $translate.instant('N000992'),//N000992='取消'
                okText: $translate.instant('N001524'),//N001524='选择'
                selectionMode: 'single'
            }, options);

            return ngDialog.open({
                template: 'modules/commons/dialog/fiunit/dialog.fiunit.html',
                controller: 'DialogFiUnitController as vm',
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