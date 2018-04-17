(function() {
    'use strict';

    angular.module('demo.core')
        .directive('fxBreadcrumb', Breadcrumb);

    /* @ngInject */
    function Breadcrumb() {
        return {
            restrict: 'AE',//以什么形式被声明;
            transclude: true,
            replace: true,//如果为真替换当前元素;
            template: '<p class="fosun-breadcrumb" ng-transclude></p>'
        }
    }
})();