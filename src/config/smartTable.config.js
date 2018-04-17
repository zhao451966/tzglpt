(function() {
    'use strict';

    angular
        .module('demo.core')
        .config(SmartTableConfig);

    /* @ngInject */
    function SmartTableConfig (stConfig) {
        stConfig
            .pagination.template = 'modules/commons/pagination.html';

    }
})();