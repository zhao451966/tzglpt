(function() {
    'use strict';

    angular.module('demo.core')
        .factory('UserRoleAPI', UserRoleService);

    /* @ngInject */
    function UserRoleService(Restangular) {
        return Restangular.service('userrole');
    }
})();