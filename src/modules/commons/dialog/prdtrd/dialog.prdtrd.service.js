(function() {
    'use strict';

    angular.module('demo.core')
        .factory('DialogPrdtrd', DialogPrdtrd);

    /* @ngInject */
    function DialogPrdtrd(ngDialog,$translate) {
        var dialog = function(selected,options,type) {
            options = angular.extend({
                title: $translate.instant('N001530'),//N001530= 选择证券
                cancelText: $translate.instant('N000992'),//N000992='取消'
                okText: $translate.instant('N001524'),//N001524='选择'
                selectionMode: 'single'
            }, options);

            return ngDialog.open({
                template: 'modules/commons/dialog/prdtrd/dialog.prdtrd.html',
                controller: 'DialogPrdtrdController as vm',
                data: options,
                className: 'ngdialog-theme-default ngdialog-md',
                resolve: {
                    selected: function() {
                        return selected;
                    },
                    stockOrBond: function() {
                        return type;
                    }
                }
            });
        };

        return dialog;
    }
})();