(function() {
    'use strict';

    angular.module('demo.core')
        .directive('fxProject', Breadcrumb);

    /* @ngInject */
    function Breadcrumb() {
        return {
            restrict: 'AE',//以什么形式被声明;
            replace: true,//如果为真替换当前元素;
            scope: {
                project: '=fxProject'
            },
            templateUrl: 'modules/commons/project.directive.html'
        }
    }
})();