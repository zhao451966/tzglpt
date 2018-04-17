(function() {
    'use strict';

    angular.module('fosun.file')
        .factory('FileAPI', FileService);

    /* @ngInject */
    function FileService(Restangular) {
        return Restangular.service('projectfile/doc');
    }
})();