(function() {
    'use strict';

    angular.module('demo.core')
        .directive('fxFilter', Userfilter);

    /* @ngInject */
    function Userfilter() {
        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            controller: 'ListFilterController as vm',
            templateUrl: 'modules/commons/userfilter/filter.directive.html'
        };
    }
})();