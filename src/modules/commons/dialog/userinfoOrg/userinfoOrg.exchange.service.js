(function() {
    'use strict';

    angular.module('demo.core')
        .factory('DialogUserinfoOrg', DialogUserinfoOrg);

    /* @ngInject */
    function DialogUserinfoOrg(ngDialog,$translate) {
        var dialog = function(selected,options) {

            options = angular.extend({
//                title:$translate.instant('N000574') ,//N000574='管理平台'
//                cancelText: $translate.instant('N000992'),//N000992='取消'
//                okText: $translate.instant('N001524') //N001524='选择'
              title:"企业信息" ,
              cancelText: "取消",
              okText: "选择" 
            }, options);

            return ngDialog.open({
                template: 'modules/commons/dialog/userinfoOrg/userinfoOrg.exchange.html',
                controller: 'UserinfoOrgExchangeController as vm',
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