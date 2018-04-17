(function() {
    'use strict';

    angular
        .module('demo.core')
        .config(RouterProviderConfig);

    /* @ngInject */
    function RouterProviderConfig ($urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');
    }
})();