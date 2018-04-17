(function() {
    'use strict';

    angular.module('demo.core')
        .controller('UserinfoOrgExchangeController', UserinfoOrgExchangeController);

    /* @ngInject */
    function UserinfoOrgExchangeController(Restangular,$scope,Utils,selected) {
        var vm = this;
        var select = selected;
      //当前登录用户
        vm.CurrentUser = Authenticate.getUser();
        vm.userCode=vm.CurrentUser.userCode;
        vm.queryTree = function() {
        	Restangular.all('userinfoorg/userinfoOrgUseCode').one(vm.userCode).get()
                .then(function(data) {
                	vm.userinfoOrgList = data;
                });

        }
        vm.queryTree();

        vm.ok = function() {
            $scope.closeThisDialog(vm.newObj);
        }
        vm.select = function(data) {
        	 $scope.closeThisDialog(data);
        }
    }
})();