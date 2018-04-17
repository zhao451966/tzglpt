(function() {
    'use strict';

    angular.module('demo.core')
        .directive('roleFormat', userFormat);

    /* @ngInject */
    function userFormat() {
        var directive = {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {

                function formatter(value) {

                    // 若字符串直接返回
                    if (angular.isString(value)) return value;

                    // 角色数组，返回,拼接的角色名
                    if (angular.isArray(value)) {
                        return value.map(function(obj) {
                            return obj.roleName;
                        }).join(',');
                    }

                    // 单个角色对象，返回角色名
                    if (angular.isObject(value)) {
                        return value.roleName;
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