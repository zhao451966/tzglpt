(function() {
    'use strict';

    angular.module('demo.core')
        .factory('DialogDoc', DialogDoc);

    /* @ngInject */
    function DialogDoc(ngDialog,$translate) {
        var dialog = function(vcProId,options) {
            options = angular.extend({
                title: $translate.instant('N106019'), //'N106019':'项目文档查看'
                cancelText: $translate.instant('N000557') // N000557='关闭'
            }, options);
            return ngDialog.open({
                template: 'modules/commons/dialog/doc/dialog.doc.html',
                controller: 'DialogDocController as vm',
                data: options,
                className: 'ngdialog-theme-default ngdialog-md',
                resolve: {
                    vcProId: function() {
                        return vcProId;
                    }
                }
            });
        };
        return dialog;
    }
})();