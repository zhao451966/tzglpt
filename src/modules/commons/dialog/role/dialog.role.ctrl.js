(function() {
    'use strict';

    angular.module('demo.core')
        .controller('DialogRoleController', DialogRoleController);

    /* @ngInject */
    function DialogRoleController($scope, $timeout, Restangular, selected) {
        var vm = this;
        var handler;
        vm.searchParam='';
        vm.customSelectedRoles=[]
        vm.roles = [];
        
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
        	
        	if(type=="init-single"){
        		param.s_roleCode = selected[0];
        	}else if(type=="init-multiple"){
        		param.s_roleCodes = selected;
        	}else if(type=="searchParam"){
        		param.s_searchParam = vm.searchParam;
        	}
        	return angular.extend(param,$scope.$$params);
        };

        if(!$scope.ngDialogData.selectionMode){
        	$scope.ngDialogData.selectionMode = 'single';
        }
        
        
        /**
         * 根据编码，名称查询角色
         */
        vm.searchRole=function(){
			/**
			 * 初始化 加载的角色，
			 *
			 * */
			if(selected){
				if($scope.ngDialogData.selectionMode == 'single'){
					var param = vm.buildParam("init-single");
					//查询一个角色
					Restangular.all('roleinfo/listRole')
						.customGETLIST('',param)
						.then(function(data) {
							if(data){
								vm.roles = data;
								vm.ifSelect(true);
							}
						});
				}else if($scope.ngDialogData.selectionMode == 'multiple'){
					var param = vm.buildParam("init-multiple");
					//初始化查询多个角色
					Restangular.all('roleinfo/listRole')
						.customGETLIST('',param)
						.then(function(data) {
							vm.roles = data;
							vm.ifSelect(true);
						});
				}
				selected=undefined;
			}else{
				var param = vm.buildParam("searchParam");
				Restangular.all('roleinfo/listRole')
				.customGETLIST('',param)
				.then(function(data) {
					vm.roles = data;
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
                    vm.searchRole();
                }, 200);
            }
        }); 
       
        /**
         * 新的查询结果，选中角色
         * 
         */
        vm.ifSelect=function(initLoad){

        	if(initLoad){
        		if(vm.customSelectedRoles.length>0){
            		var selects = vm.customSelectedRoles.map(function(obj) {
                    	return obj.roleCode;
                    });
                    vm.roles.forEach(function(obj) {
                    	obj.isSelected = selects.indexOf(obj.roleCode) > -1;
                    });
            	}else{
            		vm.roles.forEach(function(obj) {
                    	obj.isSelected = true;
                    	vm.customSelectedRoles.push(obj);
                    });
            	}
        	}else{
        		var selects = vm.customSelectedRoles.map(function(obj) {
                	return obj.roleCode;
                });
                vm.roles.forEach(function(obj) {
                	obj.isSelected = selects.indexOf(obj.roleCode) > -1;
                });
        	}
        	
        };
        
        /**
         * 选中角色 或 取消 选中
         */
        vm.toggleSelectRole = function(role) {
        	if($scope.ngDialogData.selectionMode == 'single'){
        		vm.customSelectedRoles=[];
        		if (role.isSelected) {
	        		vm.customSelectedRoles[0]=role;
        		} 
        		vm.roles.forEach(function(obj) {
            		if (obj.roleCode != role.roleCode) {
            			obj.isSelected = false;
            		}
            	})
        	}else if($scope.ngDialogData.selectionMode == 'multiple'){
	        	if (role.isSelected) {
	        		//选中，并添加到数组中
	        		vm.customSelectedRoles.push(role);
	        	}else {
	        		//取消选中
	        		var index = -1;
	        		vm.customSelectedRoles.forEach(function(obj, i) {
	        			if (obj.roleCode == role.roleCode) {
	        				index = i;
	        				return false;
	        			}
	        		});
	        		//从数组中移除
	        		vm.customSelectedRoles.splice(index, 1);
	        	}
        	}
        };
        
        /**
         * 取消选中角色,并从已选择数组中移除
         */
        vm.removeRole = function(role, index) {
        	//移除
        	vm.customSelectedRoles.splice(index, 1);
        	//取消选择
        	vm.roles.forEach(function(obj) {
        		if (obj.roleCode == role.roleCode) {
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
//            if (!$scope.$$selectedRows || !$scope.$$selectedRows.length) {
//                return;
//            }
            //返回角色数组
            $scope.closeThisDialog(vm.customSelectedRoles)
        };
    }
})();