(function() {
    'use strict';

    angular.module('demo.core')
        .factory('DialogContributeTarget', DialogContributeTarget);

    /* @ngInject */
    function DialogContributeTarget(ngDialog,$translate) {

    	var dialog = function(selected, options) {

            options = angular.extend({
                title: $translate.instant('N003073'),//'贡献度复制'
                cancelText: $translate.instant('N000992'),//'取消'
                okText: $translate.instant('N004145'),//'确定'
                selectionMode: 'multiple'
            }, options);

            return ngDialog.open({
                template: 'modules/commons/dialog/contributeTargetCopy/dialog.target.select.html',
                controller: 'DialogContributeTargetSelectController as vm',
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