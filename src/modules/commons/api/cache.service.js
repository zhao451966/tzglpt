(function() {
    'use strict';

    angular.module('demo.core')
        .factory('CacheAPI', CacheService);

    /* @ngInject */
    function CacheService(SystemRestangular) {
        return SystemRestangular.service('cp');
    }
})();