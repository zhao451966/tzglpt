(function() {
    'use strict';

    angular
        .module('demo.core')
        .directive('fxScrollToTop', FxScrollToTopDirective);

    /* @ngInject */
    function FxScrollToTopDirective() {
        var directive = {
            restrict: 'A',
            link: linkFunction
        };

        return directive;

        //////////////////////////////

        function linkFunction(scope, element, attrs) {
            element = $(element);
            var time=500;
            time=parseInt(attrs.time)>0?parseInt(attrs.time):time;
            element.scrollToTop(time);

        }
    }
})();