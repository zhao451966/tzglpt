(function() {
    'use strict';

    angular
        .module('demo.core')
        .directive('fxFixed', FxFixedDirective);

    /* @ngInject */
    function FxFixedDirective() {
        var directive = {
            restrict: 'A',
            link: linkFunction
        };

        return directive;

        //////////////////////////////

        function linkFunction(scope, element, attrs) {
            element = $(element);
            var offset = element.offset(),
                width = element.width(),
                height = element.height();

            element.css({
                position: 'fixed',
                top: offset.top,
                left: offset.left,
                width: width,
                height: height,
                margin: 0,
                'z-index': 1
            });
        }
    }
})();