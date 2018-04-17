(function() {
    'use strict';

    angular
        .module('demo.core')
        .config(pdfDialogConfig);

    /* @ngInject */
    function pdfDialogConfig (ngPdfDialogProvider) {
        ngPdfDialogProvider.setDefaults({
            className: 'ngPdfDialog-theme-default',
            trapFocus : false,
            showClose: true,
            closeByDocument: false,
            closeByEscape: false
        });
    }

})();
