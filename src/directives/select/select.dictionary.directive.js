(function() {
    'use strict';

    angular.module('demo.core')
        .directive('fxSelectDictionary', FxUsersDirective);

    /* @ngInject */
    function FxUsersDirective(AutoscrollService) {
        var directive = {
            restrict: 'A',
            require: '?form',
            templateUrl: 'directives/select/select.dictionary.html',
            controller: Controller,
            scope: {
                selected: '=fxSelectDictionary',
                selectionMode: '@',
                outputMode: '@',
                catalog: '@',
                outputProperty: '@',
                name: '@',
                form: '@',
                validator: '@',
                helperElements: "@",
                maxLabels: "@"
            },

            link: function(scope, element, attrs, form) {


                scope.onOpen = function() {

                    var ele = element.find('.checkboxLayer');
                    var parent;

                    // 弹出框
                    if (element.closest('.ngdialog-content').length) {
                        parent = element.closest('section');
                    }
                    // body
                    else {
                        parent = $('body');
                    }

                    // 没有找到父节点，return
                    if (parent.length == 0 || ele.length == 0) return;

                    AutoscrollService.autoscroll(ele, parent);
                }

            }

        };

        return directive;
    }

    /* @ngInject */
    function Controller($scope, SystemRestangular, $timeout,$translate) {

        $scope.selectionMode = $scope.selectionMode || 'single';
        $scope.helperElements = $scope.helperElements || '';
        $scope.maxLabels = $scope.maxLabels || '5';
        var outputProperty = $scope.outputProperty || 'dataCode';

        // 监控输入
        $scope.$watch(function() {
            return $scope.selected;
        }, function(selected) {
            update($scope.inputs, selected);
        });

        $scope.localLang = {
            selectAll       : $translate.instant('N106014'),//N106014=选择所有
            selectNone      : $translate.instant('N106015'),//N106015=取消所有
            reset           : $translate.instant('N106016'),//N106016=重置
            search          : $translate.instant('N106017'),//N106017=查询...
            nothingSelected : $translate.instant('N000037')//N000037=——请选择——
        };

        $scope.inputs = [];

        SystemRestangular.all('cp/dictionary/' + $scope.catalog)
            .getList()
            .then(function(data) {

                // 只有单选才需要 “请选择”
                if (data && data.unshift && $scope.selectionMode == 'single') {
                    data.unshift({
                        dataCode: '',
                        dataValue:$translate.instant('N000037')//N000037=——请选择——
                    })
                }

                update(data, $scope.selected);
                $scope.inputs = data;
            });

        $scope.onItemClick = function onItemClick () {
            $timeout(function() {
                var outputUsers = $scope.outputUsers;

                if (outputUsers) {
                    $scope.selected = outputUsers.map(function(user) {
                        return user[outputProperty];
                    }).join(',');
                }
                else {
                    $scope.selected = '';
                }
            });
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