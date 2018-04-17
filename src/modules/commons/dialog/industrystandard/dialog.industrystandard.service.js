(function() {
    'use strict';

    angular.module('demo.core')
        .factory('DialogindustryStandard', DialogindustryStandard);

    /* @ngInject */
    function DialogindustryStandard(ngDialog,$translate) {
        var dialog = function(options) {

            options = angular.extend({
                title: $translate.instant('N001507'),//N001507='行业标准'
                cancelText: $translate.instant('N000992'),//N000992='取消'
                okText: $translate.instant('N001524'),//N001524='选择'
                industaryStandard:{id:''},//行业标准 id,vcStandardCode,vcStandardName
                industaryCategoryI:{code:''},//所属行业I  id,code,name 
                industaryCategoryII:{code:''},//所属行业II
                industaryCategoryIII:{code:''}//所属行业III
            }, options);

            return ngDialog.open({
                template: 'modules/commons/dialog/industrystandard/dialog.industrystandard.html',
                controller: 'DialogIndustryStandardController as vm',
                data: options,
                className: 'ngdialog-theme-default ngdialog-sm'
            });
        };

        return dialog;
    }
})();