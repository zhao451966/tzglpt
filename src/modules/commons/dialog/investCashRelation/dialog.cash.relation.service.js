(function() {
    'use strict';

    angular.module('demo.core')
        .factory('DialogInvestProCash', DialogInvestProCash);

    /* @ngInject */
    function DialogInvestProCash(ngDialog,$translate) {
        var dialog = function(selected, options) {

            options = angular.extend({
                title: $translate.instant('N106820'),//'项目现金流'
                cancelText: $translate.instant('N106821'),//'N106821':'取消关联',
                okText: $translate.instant('N000561'),//N000561='关联'
                selectionMode: 'multiple'
            }, options);

            return ngDialog.open({
                template: 'modules/commons/dialog/investCashRelation/dialog.cash.relation.html',
                controller: 'DialogCashRelationController as vm',
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