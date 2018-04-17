(function() {
    'use strict';

    angular.module('demo.core')
        .directive('fxFilterButton', FxFilterButtonDirective);

    /* @ngInject */
    function FxFilterButtonDirective() {
        var directive = {
            restrict: 'A',
            templateUrl: 'directives/filter/filter.button.html',
            controller: FxFilterButtonController
        };

        return directive;
    }

    /* @ngInject */
    function FxFilterButtonController($scope) {
        $scope.$$panel = {
            hasChart: false,
            isFilterPanelOpen: false,
            isChartPanelOpen: false,

            toggleFilterPanel: function () {
                $scope.$$panel.isChartPanelOpen = false;
                $scope.$$panel.isFilterPanelOpen = !$scope.$$panel.isFilterPanelOpen;
            },
            toggleChartPanel: function () {
                $scope.$$panel.isFilterPanelOpen = false;
                $scope.$$panel.isChartPanelOpen = !$scope.$$panel.isChartPanelOpen;
            }
        };
    }
})();