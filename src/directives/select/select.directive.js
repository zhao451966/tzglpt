(function() {
    'use strict';

    angular.module('demo.core')
        .directive('fxSelect', FxUsersDirective);

    /* @ngInject */
    function FxUsersDirective() {
        var directive = {
            restrict: 'A',
            templateUrl: 'directives/select/select.html',
            controller: Controller,
            scope: {
                selected: '=fxSelect',
                selectionMode: '@',
                outputMode: '@',
                catalog: '@',
                outputProperty: '@',
                code: '@',
                value: '@',
                url: '@',
                placeholder: '@'
            }

        };

        return directive;
    }

    /* @ngInject */
    function Controller($scope, Restangular,$translate) {

        $scope.selectionMode = $scope.selectionMode || 'single';
        var outputProperty = $scope.outputProperty || $scope.code || 'dataCode';
        var dataCode = $scope.code || 'dataCode';
        var dataValue = $scope.value || 'dataValue';
        var dataUrl = $scope.url;

        if (!dataUrl) {
            console.error('控件缺少dataUrl');
            return;
        }


        // 监控输入
        $scope.$watch(function() {
            return $scope.selected;
        }, function(selected) {
            update($scope.inputs, selected);
        });

        $scope.localLang = {
            selectAll       :$translate.instant('N106014'),//'N106014'='选择所有'
            selectNone      :$translate.instant('N106015'),//'N106015':'取消所有'
            reset           :$translate.instant('N106016'),//'N106016':'重置'
            search          :$translate.instant('N106017'),//'N106017':'查询...'
            nothingSelected : $scope.placeholder ||$translate.instant('N000037') //'N000037':'---请选择---'
        };

        $scope.inputs = [];

        Restangular.all(dataUrl)
            .getList()
            .then(function(data) {
                update(data, $scope.selected);
                $scope.inputs = data;
            });

        $scope.onItemClick = function () {
            var outputUsers = $scope.outputUsers;

            if (outputUsers) {
                $scope.selected = outputUsers.map(function(user) {
                    return user[outputProperty];
                }).join(',');
            }
            else {
                $scope.selected = '';
            }
        };

        function update(inputs, selected) {
            inputs = inputs || [];

            if (angular.isNumber(selected)) {
                selected += "";
            }

            var selectedUsers = selected ? selected.split(',') : [];

            if (angular.isArray(inputs) && angular.isArray(selectedUsers)) {
                inputs.forEach(function(input) {
                    input.selected = selectedUsers.indexOf(input[outputProperty]) > -1;
                });
            }
        }
    }
})();