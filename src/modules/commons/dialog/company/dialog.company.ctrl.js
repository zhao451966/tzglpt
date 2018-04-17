(function() {
    'use strict';

    angular.module('demo.core')
        .controller('DialogCompanyController', DialogCompanyController);

    /* @ngInject */
    function DialogCompanyController($scope,$timeout, Restangular,EnterpriseLibraryAPI,selected) {
    	 var vm = this;
         var handler;
         vm.searchParam='';
         vm.customSelectedCompanys=[]
         vm.companys = [];
         
     	/**查询国家**/
    	vm.getCountrys=function(){
    		Restangular.all('boardAppointApply/getCountryList')
    		.getList()
    		.then(function(data){
    			vm.countrys = data;
				for(var i=0;i<data.length;i++){
					var obj = data[i];
					if(obj.VC_COUNTRY_ID == $scope.ngDialogData.vcAppCountry.VC_COUNTRY_ID){
						$scope.ngDialogData.vcAppCountry =obj;
						break;
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
    			// -- 请选择国家 --
    			vm.getProvints($scope.ngDialogData.vcAppCountry.VC_COUNTRY_ID);
    		}
    		if(!$scope.ngDialogData.vcAppCountry){
    			vm.provints=[];
    		}
    		//根据国家查询企业信息
    		vm.searchCompany();
    	};
    	//省份选择事件
    	vm.provinceSelect=function(){
    		$scope.ngDialogData.vcAppCity={};
    		if($scope.ngDialogData.vcAppCountry && $scope.ngDialogData.vcAppProvince){
    			vm.getCitys($scope.ngDialogData.vcAppCountry.VC_COUNTRY_ID,$scope.ngDialogData.vcAppProvince.VC_PROVIN_ID);
    		}
    		if(!$scope.ngDialogData.vcAppProvince){
    			vm.citys=[];
    		}
    		//根据国家，省份 查询企业信息
    		vm.searchCompany();
    	};
    	//城市选择事件
    	vm.citiySelect=function(){
    		//根据 国家，省份，城市 查询企业信息
    		vm.searchCompany();
    	};
    	
    	vm.getCountrys();
    	if($scope.ngDialogData.vcAppCountry.VC_COUNTRY_ID){
    		vm.getProvints($scope.ngDialogData.vcAppCountry.VC_COUNTRY_ID,true);
    		if($scope.ngDialogData.vcAppProvince.VC_PROVIN_ID){
        		vm.getCitys($scope.ngDialogData.vcAppCountry.VC_COUNTRY_ID,$scope.ngDialogData.vcAppProvince.VC_PROVIN_ID,true);
        	}
    	}
     	
         /**
          * 构造 查询参数
          */
         vm.buildParam=function(type){
         	var s_customQuery = '';
         	var param={s_type:type};
         	//组装 自定义条件
         	if($scope.ngDialogData.s_customQuery){
         		param.s_customQuery = $scope.ngDialogData.s_customQuery;
         	}
         	//组装 国家，省份，城市 条件
         	if($scope.ngDialogData.vcAppCountry){
         		param.s_vcCountryId=$scope.ngDialogData.vcAppCountry.VC_COUNTRY_ID;
         	}
         	if($scope.ngDialogData.vcAppProvince){
         		param.s_vcProvinId = $scope.ngDialogData.vcAppProvince.VC_PROVIN_ID;
         	}
         	if($scope.ngDialogData.vcAppCity){
         		param.s_vcCityId = $scope.ngDialogData.vcAppCity.VC_CITY_ID;
         	}
         	if(type=="init-single"){
         		param.s_vcId = selected[0];
         	}else if(type=="init-multiple"){
         		param.s_vcIds = selected;
         	}else if(type=="searchParam"){
         		param.s_searchParam = vm.searchParam;
         	}
         	return param;
         };

         if(!$scope.ngDialogData.selectionMode){
         	$scope.ngDialogData.selectionMode = 'single';
         }
         
         
         /**
          * 根据编码，名称查询公司
          * 
          */
         vm.searchCompany=function(){
			 /**
			  * 初始化 加载的公司，
			  *
			  * */
			 if(selected){
				 if($scope.ngDialogData.selectionMode == 'single'){
					 var param = vm.buildParam("init-single");
					 //查询一个公司
					 Restangular.all('companyInfo/listSelectCompany')
						 .customGETLIST('',param)
						 .then(function(data) {
							 if(data){
								 vm.companys = data;
								 vm.ifSelect(true);
							 }
						 });
				 }else if($scope.ngDialogData.selectionMode == 'multiple'){
					 var param = vm.buildParam("init-multiple");
					 //初始化查询多个公司
					 Restangular.all('companyInfo/listSelectCompany')
						 .customGETLIST('',param)
						 .then(function(data) {
							 vm.companys = data;
							 vm.ifSelect(true);
						 });
				 }
				 selected=undefined;
			 }else{
				var param = vm.buildParam("searchParam");
				Restangular.all('companyInfo/listSelectCompany')
				 .customGETLIST('',angular.extend(param,$scope.$$params))
				 .then(function(data) {
					 vm.companys = data;
					 vm.ifSelect();
				 });
			 }
         };
         /**
          * 编码，名称 联想
          */
         $scope.$watch('vm.searchParam', function(newVal,oldVal) {
             if (handler) {
                 $timeout.cancel(handler);
             }
             //2017-1-16 修改 。页面初始化加载 查询有table触发，查询条件改变时由此触发查询
             if(newVal || (oldVal && !newVal ) ){
         		handler = $timeout(function() {
                     vm.searchCompany();
                }, 200); 
             }
         }); 
        
         /**
          * 新的查询结果，选中公司
          * 
          */
         vm.ifSelect=function(initLoad){

         	if(initLoad){
         		if(vm.customSelectedCompanys.length>0){
             		var selects = vm.customSelectedCompanys.map(function(obj) {
                     	return obj.vcId;
                     });
                     vm.companys.forEach(function(obj) {
                     	obj.isSelected = selects.indexOf(obj.vcId) > -1;
                     });
             	}else{
             		vm.companys.forEach(function(obj) {
                     	obj.isSelected = true;
                     	vm.customSelectedCompanys.push(obj);
                     });
             	}
         	}else{
         		var selects = vm.customSelectedCompanys.map(function(obj) {
                 	return obj.vcId;
                 });
                 vm.companys.forEach(function(obj) {
                 	obj.isSelected = selects.indexOf(obj.vcId) > -1;
                 });
         	}
         	
         };
         
         /**
          * 选中公司 或 取消 选中
          */
         vm.toggleSelectCompany = function(role) {
         	if($scope.ngDialogData.selectionMode == 'single'){
         		vm.customSelectedCompanys=[];
         		if (role.isSelected) {
 	        		vm.customSelectedCompanys[0]=role;
         		} 
         		vm.companys.forEach(function(obj) {
             		if (obj.vcId != role.vcId) {
             			obj.isSelected = false;
             		}
             	});
         	}else if($scope.ngDialogData.selectionMode == 'multiple'){
 	        	if (role.isSelected) {
 	        		//选中，并添加到数组中
 	        		vm.customSelectedCompanys.push(role);
 	        	}else {
 	        		//取消选中
 	        		var index = -1;
 	        		vm.customSelectedCompanys.forEach(function(obj, i) {
 	        			if (obj.vcId == role.vcId) {
 	        				index = i;
 	        				return false;
 	        			}
 	        		});
 	        		//从数组中移除
 	        		vm.customSelectedCompanys.splice(index, 1);
 	        	}
         	}
         };
         
         /**
          * 取消选中公司,并从已选择数组中移除
          */
         vm.removeCompany = function(role, index) {
         	//移除
         	vm.customSelectedCompanys.splice(index, 1);
         	//取消选择
         	vm.companys.forEach(function(obj) {
         		if (obj.vcId == role.vcId) {
         			obj.isSelected = false;
         			return false;
         		}
         	});
         };
         
         
         /**
          * 确认选择
          * @private
          */
         vm.ok = function() {
             // 没有选中，不响应
//             if (!$scope.$$selectedRows || !$scope.$$selectedRows.length) {
//                 return;
//             }
             //返回公司数组
             $scope.closeThisDialog(
            		 {
            			 "address":{
                       		"selectCountry":$scope.ngDialogData.vcAppCountry,
                      		"selectProvince":$scope.ngDialogData.vcAppProvince,
                      		"selectCity":$scope.ngDialogData.vcAppCity
                      	},
                      	"selectedRows":vm.customSelectedCompanys
            		 });
         };
    }
})();