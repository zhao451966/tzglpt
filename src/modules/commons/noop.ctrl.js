(function() {
    'use strict';

    angular.module('demo.core')
        .controller('NoopController', NoopController);


    /* @ngInject */
    function NoopController($rootScope, $state, Authenticate) {
        window.$state = $state;
        window.Authenticate = Authenticate;

        $rootScope.ContextPath = window.ContextPath || '/BatchPlatform/';
    }
})();