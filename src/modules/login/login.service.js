(function() {
    'use strict';

    angular
        .module('demo.login')
        .factory('LoginAPI', LoginService);

    /* @ngInject */
    function LoginService (RootRestangular) {
        var service = RootRestangular.service('login');
        return service;
    }
})();