(function() {
    'use strict';

    angular.module('demo.core')
        .directive('fxPaginatiion', FxPaginationDirective);

    /* @ngInject */
    function FxPaginationDirective() {
        var directive = {
            restrict: 'A',
            templateUrl: 'directive/pagination/pagination.directive.html'
        };

        return directive;

        //////////////////////////////////
    }
})();