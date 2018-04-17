(function() {
    'use strict';

    angular.module('demo.core')
        .directive('fxPagination', Pagination);

    /* @ngInject */
    function Pagination() {
        var directive = {
            restrict: 'AE',
            replace: true,
            templateUrl: 'modules/commons/pagination/pagination.directive.html'
        };

        return directive;
    }
})();