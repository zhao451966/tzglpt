(function() {
    'use strict';

    angular.module('demo.core')
        .controller('DialogAddressController', DialogAddressController);

    /* @ngInject */
    function DialogAddressController($scope,$timeout, Restangular) {
    	 var vm = this;
         var handler;
         
     	/**查询国家**/
    	vm.getCountrys=function(){
    		Restangular.all('boardAppointApply/getCountryList')
    		.getList()
    		.then(function(data){
    			vm.countrys = data;
    			if($scope.ngDialogData.vcAppCountry){
    				for(var i=0;i<data.length;i++){
    					var obj = data[i];
    					if(obj.VC_COUNTRY_ID == $scope.ngDialogData.vcAppCountry.VC_COUNTRY_ID){
    						$scope.ngDialogData.vcAppCountry =obj;
    						break;
    					}
    				}
    			}
    		});
    	};
    	/**查询省份**/
    	vm.getProvints=function(countryId,isApp){
    		Restangular.all('boardAppointApply/getProvintList?countryId='+countryId)
    		.getList()
    		.then(function(data){
    			vm.provints=data;
					for(var i=0;i<data.length;i++){
						var obj = data[i];
						if(obj.VC_PROVIN_ID == $scope.ngDialogData.vcAppProvince.VC_PROVIN_ID){
							$scope.ngDialogData.vcAppProvince =obj;
							break;
						}
					}
    		});
    	};
    	/**查询城市**/
    	vm.getCitys=function(countryId,provintId,isApp){
    		Restangular.all('boardAppointApply/getCityList?countryId='+countryId+'&provintId='+provintId)
    		.getList()
    		.then(function(data){
    			vm.citys = data;
					for(var i=0;i<data.length;i++){
						var obj = data[i];
						if(obj.VC_CITY_ID == $scope.ngDialogData.vcAppCity.VC_CITY_ID){
							$scope.ngDialogData.vcAppCity =obj;
							break;
						}
					}
    		});
    	};
    	//国家选择事件
    	vm.countrySelect=function(){
    		vm.citys=[];
    		$scope.ngDialogData.vcAppProvince={};
    		$scope.ngDialogData.vcAppCity={};
    		if($scope.ngDialogData.vcAppCountry){
    			vm.getProvints($scope.ngDialogData.vcAppCountry.VC_COUNTRY_ID);
    		}
    		if(!$scope.ngDialogData.vcAppCountry){
    			$scope.ngDialogData.vcAppCountry={};
    			vm.provints=[];
    		}
    	};
    	//省份选择事件
    	vm.provinceSelect=function(){
    		$scope.ngDialogData.vcAppCity={};
    		if($scope.ngDialogData.vcAppCountry && $scope.ngDialogData.vcAppProvince){
    			vm.getCitys($scope.ngDialogData.vcAppCountry.VC_COUNTRY_ID,$scope.ngDialogData.vcAppProvince.VC_PROVIN_ID);
    		}
    		if(!$scope.ngDialogData.vcAppProvince){
    			$scope.ngDialogData.vcAppProvince={};
    			vm.citys=[];
    		}
    	};
    	//城市选择事件
    	vm.citiySelect=function(){
    		if(!$scope.ngDialogData.vcAppCity){
    			$scope.ngDialogData.vcAppCity={};
    		}
    		
    	};
    	
    	vm.getCountrys();
    	if($scope.ngDialogData.vcAppCountry){
    		vm.getProvints($scope.ngDialogData.vcAppCountry.VC_COUNTRY_ID,true);
    		if($scope.ngDialogData.vcAppProvince){
        		vm.getCitys($scope.ngDialogData.vcAppCountry.VC_COUNTRY_ID,$scope.ngDialogData.vcAppProvince.VC_PROVIN_ID,true);
        	}
    	}
         /**
          * 确认选择
          * @private
          */
         vm.ok = function() {
        	 var countryId = '';
			 var provinId= '';
			 var cityId = '';
			 var countryName = '';
			 var provinName = '';
			 var cityName = '';
			 var addressCodes ='';
			 var addressNames ='';

			 if($scope.ngDialogData.vcAppCountry && $scope.ngDialogData.vcAppCountry.VC_COUNTRY_ID){
				 countryId = $scope.ngDialogData.vcAppCountry.VC_COUNTRY_ID;
				 countryName = $scope.ngDialogData.vcAppCountry.VC_COUNTRY_NAME;
			 }
			 if($scope.ngDialogData.vcAppProvince && $scope.ngDialogData.vcAppProvince.VC_PROVIN_ID){
				  provinId= $scope.ngDialogData.vcAppProvince.VC_PROVIN_ID;
				  provinName = $scope.ngDialogData.vcAppProvince.VC_PROVIN_NAME; 
			 }
			 if($scope.ngDialogData.vcAppCity && $scope.ngDialogData.vcAppCity.VC_CITY_ID){
				  cityId = $scope.ngDialogData.vcAppCity.VC_CITY_ID;			 
				  cityName = $scope.ngDialogData.vcAppCity.VC_CITY_NAME;				 
			 }
			 if(countryId!=''){
				 addressCodes += countryId;
			 }
			 if(provinId!=''){
				 addressCodes += '-'+provinId;
			 }
			 if(cityId!=''){
				 addressCodes += '-'+cityId;
			 }
			 
			 if(countryName!=''){
				 addressNames += countryName;
			 }
			 if(provinName!=''){
				 addressNames += '-'+provinName;
			 }
			 if(cityName!=''){
				 addressNames += '-'+cityName;
			 }
             //返回 国家，省份，城市 数组
             $scope.closeThisDialog(
        		 {
               		"vcAppCountry":$scope.ngDialogData.vcAppCountry,
              		"vcAppProvince":$scope.ngDialogData.vcAppProvince,
              		"vcAppCity":$scope.ngDialogData.vcAppCity,
              		"addressCodes":addressCodes,
              		"addressNames":addressNames
        		 });
         };
    }
})();