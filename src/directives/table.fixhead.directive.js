(function() {
    'use strict';

    angular.module('demo.core')
        .directive('fxTableFixHead', fxTableFixHead);

    /* @ngInject */
    function fxTableFixHead($parse, $timeout) {
        var directive = {
            restrict: 'A',
            compile: function(element) {

                var thead = element.find('thead'), tbody = element.find('tbody');
                tbody.after(thead);

                return linkFn;
            }

        };

        return directive;

        /////////////////////////////////

        function linkFn(scope, element, attrs, ctrl) {

            var isFixed = attrs.isFixed === "false" ? false : true;

            // 固定表头
            if (!isFixed) return;
            var th = element.find('th');

            //console.log(th);

            var parent = attrs.fixedHead ? element.closest(attrs.fixedHead) : element.parent();

            parent
                .off('scroll.fix-header')
                .on('scroll.fix-header', function() {
                    var top = $(this).scrollTop();
                    th.css({
                        "transform": "translate3d(0, "+ top +"px, 0)",
                        "-ms-transform": "translate3d(0, "+ top +"px, 0)",
                        "background":"white"
                    });
                });
            scope.$on('$destroy', function() {
                element.parent().off('scroll.fix-header')
            });
        }
    }
})();