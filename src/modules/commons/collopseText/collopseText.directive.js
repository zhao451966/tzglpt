(function() {
    'use strict';

    angular.module('demo.core')
        .directive('fxCollopseText', CollopseText);

    /* @ngInject */
    function CollopseText() {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                text: '='
            },
            controller: ['$scope', function($scope) {
                $scope.isExpand = false;
                $scope.isOverflow = false;

                $scope.$watch(function() {
                    return $scope.text;
                }, function(text) {
                    if (text) {
                        $scope.isOverflow = text.length > 60;
                    }
                });

                $scope.toggle = function(isExpand) {
                    $scope.isExpand = isExpand;
                }
            }],
            templateUrl: 'modules/commons/collopseText/collopseText.directive.html'
        };
    }
})();