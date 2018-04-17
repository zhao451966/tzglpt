(function() {
    'use strict';

    angular
        .module('demo.core')
        .directive('layoutH', layoutH);

    /* @ngInject */
    function layoutH($document) {
        var directive = {
            restrict: 'A',
            link: linkFunction
        };

        return directive;

        ////////////////////////////////

        function linkFunction(scope, element, attrs) {
            element = $(element);

            var H = $(window).height();
            element.height(H - parseInt(attrs.layoutH));

            fixHeader(element);
        }

        function fixHeader (element) {
            var table = element.find('table.fixed-header');
            var thead = table.find('thead');

            if (table.length == 1) {
                element.off('scroll.fixHeader')
                    .on('scroll.fixHeader', function() {
                        var scrollTop = element.scrollTop();


                        thead.css({
                                transform: 'translate3d(0px, '+scrollTop+'px, 0px)'
                            });
                        if (scrollTop) {
                            thead.addClass('fixed');
                        }
                        else {
                            thead.removeClass('fixed');
                        }
                    });
            }
        }
    }
})();