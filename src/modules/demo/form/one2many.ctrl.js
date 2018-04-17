(function() {
    'use strict';

    angular.module('demo.sample')
        .controller('SampleOne2ManyController', SampleOne2ManyController);

    /* @ngInject */
    function SampleOne2ManyController($scope, item, $q, $timeout) {
        var vm = this;

        vm.item = item;

        $scope.$$onshow = function(formrow) {
            $scope.$$editForm = formrow;
        };

        $scope.$$onhide = function() {
            $scope.$$editForm = undefined;
        };

        $scope.$$checkForm = function() {
            if ($scope.$$editForm) {
                $scope.$$editForm.$submit();
                return false;
            }

            return true;
        };

        // 添加字典明细
        vm.add = function(dictionaries) {

            if (!$scope.$$checkForm()) return;

            vm.inserted = {
                catalogCode: item.catalogCode
            };

            dictionaries.push(vm.inserted);
        };

        // 删除字典明细
        vm.remove = function(dictionaries, index) {
            dictionaries.splice(index, 1);
        };

        // 保存
        vm.save = function(item) {
            if (!$scope.$$checkForm()) return;
            console.log(item.dataDictionaries);
        };

        // 校验编码
        vm.checkCode = function($data, oldValue) {
            if ($data == oldValue && $data) return;

            var deferred = $q.defer();
            $timeout(function() {
                if (!$data) {
                    deferred.resolve('编码不能为空');
                }
                else {
                    deferred.resolve();
                }
            }, 2000);

            return deferred.promise;
        };
    }
})();