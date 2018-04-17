(function() {
    'use strict';

    angular.module('demo.core')
        .directive('projectFormat', userFormat);

    /* @ngInject */
    function userFormat() {
        var directive = {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {

                function formatter(value) {

                    // 若字符串直接返回
                    if (angular.isString(value)) return value;

                    // 项目数组，返回,拼接的项目名
                    if (angular.isArray(value)) {
                        return value.map(function(obj) {
                            return obj.projectName;
                        }).join(',');
                    }

                    // 单个项目对象，返回项目名
                    if (angular.isObject(value)) {
                        return value.projectName;
                    }

                    return value;
                }

                function parser() {
                    return ctrl.$modelValue;
                }

                ctrl.$formatters.push(formatter);
                ctrl.$parsers.unshift(parser);

            }
        };

        return directive;
    }


})();