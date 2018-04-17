(function() {
    'use strict';

    angular.module('demo.core')
        .factory('UploadAPI', CacheService);

    /* @ngInject */
    function CacheService(RootRestangular) {
        return RootRestangular.service('upload');
    }
})();