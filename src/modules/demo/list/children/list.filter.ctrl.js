(function() {
    'use strict';

    angular.module('demo.sample')
        .controller('ListFilterController', ListFilterController);

    /* @ngInject */
    function ListFilterController($scope, FilterAPI) {
        var vm = this;

        // 新增过滤器
        vm.addFilter = _addFilter;

        // 修改过滤器
        vm.saveFilter = _saveFilter;

        // 删除过滤器
        vm.removeFilter = _removeFilter;

        vm.queryFilter = $scope.$parent.$queryFilter;

        vm.beginEdit = function() {
            $scope.$editing = true;
        };

        vm.endEdit = function() {
            $scope.$editing = false;
        };

        var model = $scope.$parent.$$model;

        ///////////////////////////////////////////

        function _addFilter(filter, obj) {
            var value = obj ? JSON.stringify(obj) : '';

            filter['filterValue'] = value;
            filter['modleCode'] = model;

            FilterAPI.post(filter)
                .then(function(id) {
                    vm.queryFilter(id);
                });
        }

        function _saveFilter(filter, obj) {
            var value = obj ? JSON.stringify(obj) : '';

            filter['filterValue'] = value;
            FilterAPI.one(filter['filterNo'])
                .customPUT(filter)
                .then(function() {
                    vm.queryFilter(filter['filterNo']);
                });
        }

        function _removeFilter(id) {
            FilterAPI.one(id)
                .customDELETE()
                .then(function() {
                    vm.queryFilter();
                });
        }

    }
})();