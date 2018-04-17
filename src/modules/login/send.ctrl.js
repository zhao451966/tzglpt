(function() {
    'use strict';

    angular.module('demo.login')
        .controller('sendController', sendController);

    /* @ngInject */
    function sendController($state, toastr, Authenticate, LoginAPI, CacheAPI, SystemRestangular,Restangular,ngDialog,$stateParams) {
        var vm = this;
        vm.item;
        vm.UserinfoRegister={};
        var b = new Base64();
        vm.UserinfoRegister.vcLoginName=b.decode($stateParams.regEmail);
//        vm.UserinfoRegister.vcCompanyName=b.decode($stateParams.vcCompanyName);
//        if($stateParams.vcCreditCode){
//         vm.UserinfoRegister.vcCreditCode=b.decode($stateParams.vcCreditCode);
//        }
        Restangular.one('userinfoRegister/userinforegister/getLoginName').customPUT(vm.UserinfoRegister)
        .then(function(data) {
            if (data==undefined) {
            	window.location.href = getViewContextPath()+'#/login';
            }else{
                vm.UserinfoRegister.regEmail=data.regEmail;
            }
        });
        
        //验证机构名称和统一社会信用代码
	    vm.send = function() {
	    	Restangular.one('userinfoRegister/userinforegister/send').customPUT(vm.UserinfoRegister)
	        .then(function(data) {
	            if (angular.isObject(data)) {
	            	window.location.href = getViewContextPath()+'#/login';
	            }
	        });
	    	
	    };
    }
})();
