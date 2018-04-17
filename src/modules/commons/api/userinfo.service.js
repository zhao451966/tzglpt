(function() {
    'use strict';

    angular.module('demo.core')
        .factory('UserInfoAPI', UserInfoService);

    /* @ngInject */
    function UserInfoService(Restangular) {
        return Restangular.service('userinfo');
    }
})();