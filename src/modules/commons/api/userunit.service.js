(function() {
    'use strict';

    angular.module('demo.core')
        .factory('UserUnitAPI', UserUnitService);

    /* @ngInject */
    function UserUnitService(Restangular) {
        return Restangular.service('userunit');
    }
})();