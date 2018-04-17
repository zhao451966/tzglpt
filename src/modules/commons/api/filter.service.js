(function() {
    'use strict';

    angular.module('demo.core')
        .factory('FilterAPI', FilterService);

    /* @ngInject */
    function FilterService(SystemRestangular) {
        return SystemRestangular.service('userqueryfilter');
    }
})();