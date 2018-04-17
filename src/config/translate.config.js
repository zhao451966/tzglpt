(function() {
    'use strict';

    angular.module('demo.core')
        .config(TranslateConfig);

    /* @ngInject */
    function TranslateConfig($translateProvider) {
        getI18NResourse();

        // add translation table
        $translateProvider
            .translations('zh_CN', window.I18N_ZH)
            .translations('en_US', window.I18N_EN)
            .preferredLanguage(window.I18N);
            //.preferredLanguage('en_US');
    }
})();