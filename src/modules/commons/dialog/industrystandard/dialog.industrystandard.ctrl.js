(function() {
    'use strict';

    angular.module('demo.core')
        .controller('DialogIndustryStandardController', DialogIndustryStandardController);

    /* @ngInject */
    function DialogIndustryStandardController($scope,$timeout, Restangular) {
    	 var vm = this;
         var handler;
         
     	/**查询 行业标准**/
    	vm.getIndustryStandards=function(){
    		Restangular.all('industryStandards/listIndustryStandard')
    		.getList()
    		.then(function(data){
    			vm.industryStandards = data;
				for(var i=0;i<data.length;i++){
					var obj = data[i];
					if($scope.ngDialogData.industryStandard){
						if(obj.id == $scope.ngDialogData.industryStandard.id){
							$scope.ngDialogData.industryStandard =obj;
							break;
						}
					}
				}

    		});
    	};
    	/**
    	 *选择行业 ，事件
    	 *
    	 * I级 根据 标准 id 
    	 */ 
    	vm.industryStandardSelect=function(parentCode,level){
    		if(level=='I'){
    			//查询 一级 ，行业标准选择
    			vm.industryCategoryI =[];
    			vm.industryCategoryII=[];
    			vm.industryCategoryIII=[];
    			if(!$scope.ngDialogData.industryStandard){
    				$scope.ngDialogData.industryCategoryI={};
    				$scope.ngDialogData.industryCategoryII={};
        			$scope.ngDialogData.industryCategoryIII={};
    			}
    			if($scope.ngDialogData.industryStandard){
    				Restangular.all('industryStandards/industryClassificationMaintenances/industryOne?id='
        					+$scope.ngDialogData.industryStandard.id)
            		.getList()
            		.then(function(data){
            			vm.industryCategoryI = data;
            			if($scope.ngDialogData.industryCategoryI){
            				for(var i=0;i<data.length;i++){
            					var obj = data[i];
            					if(obj.code == $scope.ngDialogData.industryCategoryI.code){
            						$scope.ngDialogData.industryCategoryI =obj;
            						break;
            					}
            				}
            			}
            		});
    			}
    		}else if(level=='II'){
    			//查询二级 ，行业一级选择
    			vm.industryCategoryII=[];
    			vm.industryCategoryIII=[];
    			if(!$scope.ngDialogData.industryCategoryII){
    				$scope.ngDialogData.industryCategoryIII={};
    			}
				Restangular.all('industryStandards/industryClassificationMaintenances/industryTwo')
                .customGET( '', 
                		{
                	id:parentCode,
                	bzid:$scope.ngDialogData.industryStandard.id
                })
                .then(function(data) {
                	vm.industryCategoryII=data;
                	if($scope.ngDialogData.industryCategoryII){
	                	for(var i=0;i<data.length;i++){
	    					var obj = data[i];
	    					if(obj.code == $scope.ngDialogData.industryCategoryII.code){
	    						$scope.ngDialogData.industryCategoryII =obj;
	    						break;
	    					}
	    				}
                	}
                });
    		}else if(level=='III'){
    			//查询三级 ，行业二级选择 
    			vm.industryCategoryIII=[];
    				Restangular.all('industryStandards/industryClassificationMaintenances/industryTwo')//这里是三级
                    .customGET( '', 
                    		{
                    	id:parentCode,
                    	bzid:$scope.ngDialogData.industryStandard.id
                    })
                    .then(function(data) {
                    	vm.industryCategoryIII=data;
                    	if($scope.ngDialogData.industryCategoryIII){
	                    	for(var i=0;i<data.length;i++){
	        					var obj = data[i];
	        					if(obj.code == $scope.ngDialogData.industryCategoryIII.code){
	        						$scope.ngDialogData.industryCategoryIII =obj;
	        						break;
	        					}
	        				}
                    	}
                    });
    		}
    	};

    	//默认加载
    	vm.getIndustryStandards();//加载行业标准
    	if($scope.ngDialogData.industryStandard){
    		vm.industryStandardSelect($scope.ngDialogData.industryStandard.id,'I');//加载一级行业
    		if($scope.ngDialogData.industryCategoryI){
        		vm.industryStandardSelect($scope.ngDialogData.industryCategoryI.code,'II');//加载二级行业
        		if($scope.ngDialogData.industryCategoryII){
            		vm.industryStandardSelect($scope.ngDialogData.industryCategoryII.code,'III');//加载三级行业
            	}
        	}
    	}
		vm.cancelText='$closeButton';
         /**
          * 确认选择
          * @private
          */
         vm.ok = function() {
        	 var fullName='';
        	 if($scope.ngDialogData.industryStandard && $scope.ngDialogData.industryStandard.vcStandardName){
        		 fullName += $scope.ngDialogData.industryStandard.vcStandardName;
        	 }else{
        		 $scope.closeThisDialog();
        		 return; //必须选择 行业标准
        	 }
        	 if($scope.ngDialogData.industryCategoryI && $scope.ngDialogData.industryCategoryI.name){
        		 fullName += ':';
        		 fullName += $scope.ngDialogData.industryCategoryI.name;
        	 }
             //else{
        		// return;//必须选择行业一
        	 //}
        	 
        	 if($scope.ngDialogData.industryCategoryII && $scope.ngDialogData.industryCategoryII.name){
        		 fullName += '-';
        		 fullName += $scope.ngDialogData.industryCategoryII.name;
        	 }
             //else{
        		// fullName += '-';
        	 //}
        	 if($scope.ngDialogData.industryCategoryIII && $scope.ngDialogData.industryCategoryIII.name){
        		 fullName += '-';
        		 fullName += $scope.ngDialogData.industryCategoryIII.name;
        	 }
             //else{
        		// fullName += '-';
        	 //}
              
             $scope.closeThisDialog(
	    		 {
	    			 //行业标准 id,vcStandardCode,vcStandardName
	                 industryStandard: $scope.ngDialogData.industryStandard,
	                 //所属行业I  code,name 
	                 industryCategoryI:$scope.ngDialogData.industryCategoryI,
	                 industryCategoryII:$scope.ngDialogData.industryCategoryII,//所属行业II
	                 industryCategoryIII:$scope.ngDialogData.industryCategoryIII,//所属行业III
	                 fullName:fullName
	    		 });
         };
    }
})();