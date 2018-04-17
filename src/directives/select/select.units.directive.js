(function() {
    'use strict';

    angular.module('demo.core')
        .directive('fxSelectUnits', FxUsersDirective);

    /* @ngInject */
    function FxUsersDirective() {
        var directive = {
            restrict: 'A',
            templateUrl: 'directives/select/select.units.html',
            controller: Controller,
            scope: {
                selected: '=fxSelectUnits',
                selectionMode: '@',
                outputMode: '@'
            }

        };

        return directive;
    }

    /* @ngInject */
    function Controller($scope, SystemRestangular) {

        // 监控输入
        $scope.$watch(function() {
            return $scope.selected;
        }, function(selected) {
            update($scope.inputs, selected);
        });

        $scope.localLang = {
            selectAll       : "选择所有",
            selectNone      : "取消所有",
            reset           : "重置",
            search          : "查询...",
            nothingSelected : "请选择机构"
        };

        $scope.inputs = [];

        SystemRestangular.all('cp/allunits/A')
            .getList()
            .then(function(data) {
                update(data, $scope.selected);
                $scope.inputs = data;
            });

        $scope.onItemClick = function () {
            var outputUsers = $scope.outputUsers;

            if (outputUsers) {
                $scope.selected = outputUsers.map(function(user) {
                    return user.unitCode;
                }).join(',');
            }
            else {
                $scope.selected = '';
            }
        };

        function update(inputs, selected) {
            inputs = inputs || [];

            var selectedUsers = selected ? selected.split(',') : [];

            if (angular.isArray(inputs) && angular.isArray(selectedUsers)) {
                inputs.forEach(function(input) {
                    input.selected = selectedUsers.indexOf(input.unitCode) > -1;
                });
            }
        }
    }
})();