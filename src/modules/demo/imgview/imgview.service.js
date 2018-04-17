(function() {
    'use strict';

    angular.module('fosun.file')
        .factory('fileAccessAPI', fileAccessService);

    /* @ngInject */
    function fileAccessService(Restangular) {
        return Restangular.service('fileAccess');
    }
})();