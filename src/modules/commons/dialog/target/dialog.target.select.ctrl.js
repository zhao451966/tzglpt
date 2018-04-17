(function(){
    'use strict';

    angular
        .module('demo.core')
        .controller('DialogTargetSelectController',DialogTargetSelectController);

    /* @ngInject */
    function DialogTargetSelectController($scope,$translate,  $timeout,Restangular, selected,Authenticate,toastr){
        var vm = this;
        vm.CurrentUser  = Authenticate.getUser();//当前登录用户
        vm.searchParam='';//查询条件：项目编号，项目全称，项目简称
        vm.targets = [];
        vm.customSelectedTargets = [];
        var handler;
        /**
         * 构造 查询参数
         */
        vm.buildParam=function(type){
        	var s_customQuery = '';
        	var param={};
        	//组装 自定义条件
        	if($scope.ngDialogData.s_customQuery){
        		param.s_customQuery = $scope.ngDialogData.s_customQuery;
        	}
        	//组装项目id
        	if($scope.ngDialogData.vcProId){
        		param.s_vcProId=$scope.ngDialogData.vcProId;
        	}
        	
        	if(type=="init-single"){
        		param.s_vcTargetId = selected[0];
        	}else if(type=="init-multiple"){
        		param.s_vcTargetIds = selected;
        	}else if(type=="searchParam"){
        		param.s_searchParam = vm.searchParam;
        	}
        	return param;
        };
        
        if(!$scope.ngDialogData.selectionMode){
        	$scope.ngDialogData.selectionMode = 'single';
        }
        
        //查询
        vm.query = function() {
			/**
			 * 初始化 加载的项目
			 * */
			if(selected){
				if($scope.ngDialogData.selectionMode == 'single'){
					var param = vm.buildParam("init-single");
					//查询一个用户
					Restangular.all('projects/listTarget')
						.customGETLIST('',param)
						.then(function(data) {
							if(data){
								vm.targets = data;
								vm.ifSelect(true);
							}
						});
				}else if($scope.ngDialogData.selectionMode == 'multiple'){
					var param = vm.buildParam("init-multiple");
					//初始化查询多个用户
					Restangular.all('projects/listTarget')
						.customGETLIST('',param)
						.then(function(data) {
							vm.targets = data;
							vm.ifSelect(true);
						});
				}
				selected=undefined;
			}else{
				var param = vm.buildParam("searchParam");
				Restangular.all('projects/listTarget')
				.customGETLIST('',angular.extend(param,$scope.$$params))
				.then(function(data){
					vm.targets = data;
					vm.ifSelect();
				});
			}
        };
        
        //联想查询
        $scope.$watch('vm.searchParam', function(newVal,oldVal) {
            if (handler) {
                $timeout.cancel(handler);
            }
            //2017-1-16 修改 。页面初始化加载 查询有table触发，查询条件改变时由此触发查询
            if(newVal || (oldVal && !newVal ) ){
        		handler = $timeout(function() {
                    vm.query();
                }, 200);
            }
        }); 
        
        //查询后 选中
        vm.ifSelect=function(initLoad){
        	if(initLoad){
        		if(vm.customSelectedTargets.length>0){
            		var selects = vm.customSelectedTargets.map(function(obj) {
                    	return obj.vcTargetId;
                    });
                    vm.targets.forEach(function(obj) {
                    	obj.isSelected = selects.indexOf(obj.vcTargetId) > -1;
                    });
            	}else{
            		vm.targets.forEach(function(obj) {
                    	obj.isSelected = true;
                    	vm.customSelectedTargets.push(obj);
                    });
            	}
        	}else{
        		var selects = vm.customSelectedTargets.map(function(obj) {
                	return obj.vcTargetId;
                });
                vm.targets.forEach(function(obj) {
                	obj.isSelected = selects.indexOf(obj.vcTargetId) > -1;
                });
        	}
        };
        
        /**
         * 选中 或 取消 选中
         */
        vm.toggleSelectTarget = function(target) {
        	if($scope.ngDialogData.selectionMode == 'single'){
        		vm.customSelectedTargets=[];
        		if (target.isSelected) {
	        		vm.customSelectedTargets[0]=target;
        		} 
        		vm.targets.forEach(function(obj) {
            		if (obj.vcTargetId != target.vcTargetId) {
            			obj.isSelected = false;
            		}
            	})
        	}else if($scope.ngDialogData.selectionMode == 'multiple'){
	        	if (target.isSelected) {
	        		//选中，并添加到数组中
	        		vm.customSelectedTargets.push(target);
	        	}else {
	        		//取消选中
	        		var index = -1;
	        		vm.customSelectedTargets.forEach(function(obj, i) {
	        			if (obj.vcTargetId == target.vcTargetId) {
	        				index = i;
	        				return false;
	        			}
	        		});
	        		//从数组中移除
	        		vm.customSelectedTargets.splice(index, 1);
	        	}
        	}
        };
        
        /**
         * 取消选中用户,并从已选择数组中移除
         */
        vm.removeTarget = function(target, index) {
        	//移除
        	vm.customSelectedTargets.splice(index, 1);
        	//取消选择
        	vm.targets.forEach(function(obj) {
        		if (obj.vcTargetId == target.vcTargetId) {
        			obj.isSelected = false;
        			return false;
        		}
        	});
        };
        

        vm.ok = function() {
            // 没有选中，不响应
//            if (!$scope.$$selectedRows || !$scope.$$selectedRows.length) {
//                return;
//            }
            //返回选中行
			if(vm.customSelectedTargets){
				var n = {},r=[]; //n为hash表，r为临时数组
				for(var i = 0; i < vm.customSelectedTargets.length; i++) //遍历当前数组
				{
					if (!n[vm.customSelectedTargets[i].vcProId]) //如果hash表中没有当前项
					{
						n[vm.customSelectedTargets[i].vcProId] = true; //存入hash表
						r.push(vm.customSelectedTargets[i].vcProId); //把当前数组的当前项push到临时数组里面
					}
				}
				if(r.length>1){
					toastr.error($translate.instant('N106774'));//N106774="不可以选择多个项目下的标的"
					return;
				};
			}

            $scope.closeThisDialog(vm.customSelectedTargets )
	};
    }
})();