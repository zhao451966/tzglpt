(function() {
    'use strict';

    angular.module('demo.core')
        .controller('DialogExchangeController', DialogExchangeController);

    /* @ngInject */
    function DialogExchangeController($scope,ProjectEstimatecashInfoAPI) {
        var vm = this;

        vm.query = function() {

            if ($scope.$$params && !$scope.$$params.s_toExchange) {
                $scope.$$filter.toExchange = 142;
            }

            ProjectEstimatecashInfoAPI.one("listExchangeCommon").get($scope.$$params)
                .then(function(data) {
                    vm.exchangeList = data;
                });
        };
        vm.query();
        //企业List
        //vm.exchangeList = [
        //    {exchangeDate:'2015-10-31',fromExchange:'人民币',TO:'港元',exchange:'1.2206'},
        //    {exchangeDate:'2015-10-31',fromExchange:'人民币',TO:'港元',exchange:'0.1433'}
        //];

        vm.ok = function() {
            console.log($scope.$$selectedRows);
            if ($scope.$$selectedRows.length) {
                $scope.closeThisDialog($scope.$$selectedRows[0]);
            }
        }
    }
})();