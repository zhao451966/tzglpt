(function() {
    'use strict';

    angular.module('demo.core')
        .factory('DialogFundInfo', DialogFundInfo);

    /* @ngInject */
    function DialogFundInfo(ngDialog,$translate) {
        var dialog = function(selected, options) {
        	
            options = angular.extend({
                title: $translate.instant('N000217'),//N000217='查询出资实体'
                cancelText: $translate.instant('N000992'),//N000992='取消'
                okText: $translate.instant('N001524'),//N001524='选择'
                selectionMode: 'single'
            }, options);

            return ngDialog.open({
                template: 'modules/commons/dialog/fundInfo/dialog.fundinfo.html',
                controller: 'DialogFundInfoController as vm',
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