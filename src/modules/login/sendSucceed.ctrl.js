(function() {
    'use strict';

    angular.module('demo.login')
        .controller('sendSucceedController', sendSucceedController);

    /* @ngInject */
    function sendSucceedController($state, toastr, Authenticate, LoginAPI, CacheAPI, SystemRestangular,Restangular,ngDialog,$stateParams) {
        var vm = this;
        vm.item;
        vm.UserinfoRegister={};
        vm.UserinfoRegister.vcLoginName=$stateParams.regEmail;
        Restangular.one('userinfoRegister/userinforegister/getLoginName').customPUT(vm.UserinfoRegister)
        .then(function(data) {
            if (angular.isObject(data)) {
            	vm.UserinfoRegister.vcEnablePassword=data.vcEnablePassword;
            }
        });
        //验证机构名称和统一社会信用代码
	    vm.sendSucceed = function() {
	    	window.location.href = getViewContextPath()+'#/login';
	    };
    }
})();
