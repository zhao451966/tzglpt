
(function() {
    'use strict';

    angular.module('demo.core')
        .controller('IWebOfficeHelpController', IWebOfficeHelpController);

    function IWebOfficeHelpController($scope,Restangular,Confirm ) {

        var vm = this;
        
        vm.bowerType='';
        if(/chrome/.test(navigator.userAgent.toLowerCase())){
        	vm.bowerType='chrome';
        }else if(navigator.userAgent.toLowerCase().indexOf("trident")!=-1
        		&& navigator.userAgent.indexOf("rv")!=-1 ){
        	vm.bowerType='ie';
        }
         
    }
})();
	

 