(function() {
    'use strict';

    angular.module('demo.core')
        .directive('useriunittreeFormat', userIUnitTreeFormat);

    /* @ngInject */
    function userIUnitTreeFormat() {
        var directive = {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {

                function formatter(value) {

                    // 若字符串直接返回
                    if (angular.isString(value)) return value;

                    // 用户数组，返回,拼接的用户名
                    if (angular.isArray(value)) {
                        return value.map(function(obj) {
                            return obj.DEPTNAME;
                        }).join(',');
                    }

                    // 单个用户对象，返回用户名
                    if (angular.isObject(value)) {
                        return value.DEPTNAME;
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