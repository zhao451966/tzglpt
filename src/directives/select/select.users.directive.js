(function() {
    'use strict';

    angular.module('demo.core')
        .directive('fxSelectUsers', FxUsersDirective);

    /* @ngInject */
    function FxUsersDirective() {
        var directive = {
            restrict: 'A',
            templateUrl: 'directives/select/select.users.html',
            controller: Controller,
            scope: {
                selected: '=fxSelectUsers',
                users: '=',
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
            nothingSelected : "请选择用户"
        };

        // 如果传入了数据，则不再通过url查询
        if ($scope.users) {
            $scope.$watch(function() {
                return $scope.users;
            }, function(users) {
                if (users) {
                    users = angular.copy(users);

                    update(users, $scope.selected);
                    $scope.inputs = users;
                }
            });
        }
        else {
            $scope.inputs = [];
            SystemRestangular.all('cp/alluser/A')
                .getList()
                .then(function(data) {
                    update(data, $scope.selected);
                    $scope.inputs = data;
                });
        }


        $scope.onItemClick = function () {
            var outputUsers = $scope.outputUsers;

            console.log(outputUsers);

            if (outputUsers) {
                $scope.selected = outputUsers.map(function(user) {
                    return user.userCode;
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
                    input.selected = selectedUsers.indexOf(input.userCode) > -1;
                });
            }
        }
    }
})();