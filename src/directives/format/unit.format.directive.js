(function() {
    'use strict';

    angular.module('demo.core')
        .directive('unitFormat', userFormat);

    /* @ngInject */
    function userFormat() {
        var directive = {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {

                function formatter(value) {

                    // 若字符串直接返回
                    if (angular.isString(value)) return value;

                    // 部门数组，返回,拼接的部门名
                    if (angular.isArray(value)) {
                        return value.map(function(obj) {
                            return obj.unitName;
                        }).join(',');
                    }

                    // 单个部门对象，返回部门名
                    if (angular.isObject(value)) {
                        return value.unitName;
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