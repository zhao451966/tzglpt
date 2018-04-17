(function() {
    'use strict';

    angular.module('demo.core')
        .directive('fxUserfilter', Userfilter);

    /* @ngInject */
    function Userfilter() {
        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            controller: 'ListFilterController as vm',
            templateUrl: 'modules/commons/userfilter/userfilter.directive.html'
        };
        ////////////////////////////////////////////////////////////
    }
})();