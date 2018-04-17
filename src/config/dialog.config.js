(function() {
    'use strict';

    angular
        .module('demo.core')
        .config(DialogConfig);

    /* @ngInject */
    function DialogConfig (ngDialogProvider) {
        ngDialogProvider.setDefaults({
            className: 'ngdialog-theme-default',
            trapFocus : false,
            showClose: true,
            closeByDocument: false,
            closeByEscape: false
        });
    }

})();
