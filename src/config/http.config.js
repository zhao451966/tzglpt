(function() {
    'use strict';

    angular
        .module('demo.core')
        .config(HttpConfig);

    /* @ngInject */
    function HttpConfig ($httpProvider) {
        //$httpProvider.defaults.withCredentials = true;
    }

})();
