(function() {
    'use strict';

    angular
        .module('demo.core')
        .directive('fxForm', FxFormDirective);

    /* @ngInject */
    function FxFormDirective($compile) {
        var directive = {
            restrict: 'ACE',
            link: linkFunction,
            controller: ['$scope', function($scope) {
                $scope.$$clear = function() {
                    for (var name in $scope.$$filter) {
                        delete $scope.$$filter[name];
                    }
                };
            }]
        };

        return directive;

        //////////////////////////////

        function linkFunction(scope, element, attrs) {
            var form = $(element);
            var h3 =  form.parent().find('h3:first');

            console.log(h3);
            h3.after($compile('<button class="btn formbx" ng-click="$$clear()">'+getI18NResourse('N106016')+'</button>')(scope));
            h3.after($compile('<button class="btn formbx2" ng-click="$$pipe()">'+getI18NResourse('N000214')+'</button>')(scope));
        }
    }
})();
