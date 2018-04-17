(function() {
    'use strict';

    angular.module('demo.core')
        .factory('DialogTarget', DialogTarget);

    /* @ngInject */
    function DialogTarget(ngDialog,$translate) {

    	var dialog = function(selected, options) {

            options = angular.extend({
                title: $translate.instant('N000215'),//N000215='查询标的',
                cancelText: $translate.instant('N000992'),//N000992='取消'
                okText: $translate.instant('N001524'),//N001524='选择'
                selectionMode: 'single'
            }, options);

            return ngDialog.open({
                template: 'modules/commons/dialog/target/dialog.target.select.html',
                controller: 'DialogTargetSelectController as vm',
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