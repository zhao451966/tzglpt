(function() {
    'use strict';
 
    angular.module('demo.core')
        .controller('DialogUserController', DialogUserController);

    /* @ngInject */
    function DialogUserController($scope, $timeout, Restangular, selected,UserInfoAPI) {
        var vm = this;
        vm.customSelectedUsers=[];//以选择的用户
        //vm.users = [];//用户
        vm.name='';//用户名
        var handler;
        
        /**
         * 构造 查询参数
         */
        vm.buildParam=function(type){
        	var s_customQuery = '';
        	var param={s_type:type};
        	param.s_selectType ='1';
        	//组装 自定义条件
        	if($scope.ngDialogData.s_customQuery){
        		param.s_customQuery = $scope.ngDialogData.s_customQuery;
        	}
			if($scope.ngDialogData.unitCode){
				param.s_unitCode = $scope.ngDialogData.unitCode;
			}
        	if(type=="init-single"){
        		param.s_userCode = selected[0];
        	}else if(type=="init-multiple"){
        		param.s_userCodes = selected;
        	}else if(type=="userName"){
        		param.s_userName = vm.name;
        	}
        	param = angular.extend(param, $scope.ngDialogData);
        	return angular.extend(param, $scope.$$params);
        };
        
        if(!$scope.ngDialogData.selectionMode){
        	$scope.ngDialogData.selectionMode = 'single';
        }
        /**
         * 根据姓名查询用户
         */
        vm.searchUserByName=function(){
        	/**
             * 初始化 加载的用户，
             * 
             * */
            if(selected){
            	if($scope.ngDialogData.selectionMode == 'single'){
            		var param = vm.buildParam("init-single");
            		//查询一个用户
            		Restangular.all('userinfo/findUserInfoList')
                    .customGETLIST('',param)
                    .then(function(data) {
						if(data){
                    		vm.users = data;
                            vm.ifSelect(true);
                    	}
                    });
            	}else if($scope.ngDialogData.selectionMode == 'multiple'){
            		var param = vm.buildParam("init-multiple");
            		//初始化查询多个用户
            		 Restangular.all('userinfo/findUserInfoList')
                    .customGETLIST('',param)
                    .then(function(data) {
                        vm.users = data;
                        vm.ifSelect(true);
                    });
            	}
            	selected=undefined;
            }else{
            	var param = vm.buildParam("userName");
            	Restangular.all('userinfo/findUserInfoList')
                .customGETLIST('',param)
                .then(function(data) {
                    vm.users = data;
                    vm.ifSelect();
                });
            }
        };
        
        /**
         * 姓名联想
         */
        $scope.$watch('vm.name', function(newObj, oldObj) {
            if (handler) {
                $timeout.cancel(handler);
            }
            //如果 有查询条件 或  查询条件改变  都会查询！！
            //第一次加载页面 不触发查询，由table 的属性 st-pipe="vm.searchUserByName" 触发查询
            if(newObj || (oldObj && !newObj ) ){
        		handler = $timeout(function() {
                    vm.searchUserByName();
                }, 200);
            }
        }); 
       
        /**
         * 新的查询结果，选中用户
         * 
         */
        vm.ifSelect=function(initLoad){

        	if(initLoad){
        		if(vm.customSelectedUsers.length>0){
            		var selects = vm.customSelectedUsers.map(function(obj) {
                    	return obj.userCode;
                    });
                    vm.users.forEach(function(obj) {
                    	obj.isSelected = selects.indexOf(obj.userCode) > -1;
                    });
            	}else{
            		vm.users.forEach(function(obj) {
                    	obj.isSelected = true;
                    	vm.customSelectedUsers.push(obj);
                    });
            	}
        	}else{
        		var selects = vm.customSelectedUsers.map(function(obj) {
                	return obj.userCode;
                });
                vm.users.forEach(function(obj) {
                	obj.isSelected = selects.indexOf(obj.userCode) > -1;
                });
        	}
        	
        };
        
        /**
         * 选中用户 或 取消 选中
         */
        vm.toggleSelectUser = function(user) {
        	if($scope.ngDialogData.selectionMode == 'single'){
        		vm.customSelectedUsers=[];
        		if (user.isSelected) {
	        		vm.customSelectedUsers[0]=user;
        		} 
        		vm.users.forEach(function(obj) {
            		if (obj.userCode != user.userCode) {
            			obj.isSelected = false;
            		}
            	})
        	}else if($scope.ngDialogData.selectionMode == 'multiple'){
	        	if (user.isSelected) {
	        		//选中，并添加到数组中
	        		vm.customSelectedUsers.push(user);
	        	}else {
	        		//取消选中
	        		var index = -1;
	        		vm.customSelectedUsers.forEach(function(obj, i) {
	        			if (obj.userCode == user.userCode) {
	        				index = i;
	        				return false;
	        			}
	        		});
	        		//从数组中移除
	        		vm.customSelectedUsers.splice(index, 1);
	        	}
        	}
        };
        
        /**
         * 取消选中用户,并从已选择数组中移除
         */
        vm.removeUser = function(user, index) {
        	//移除
        	vm.customSelectedUsers.splice(index, 1);
        	//取消选择
        	vm.users.forEach(function(obj) {
        		if (obj.userCode == user.userCode) {
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
            //返回用户数组
            $scope.closeThisDialog(vm.customSelectedUsers)
        };
    }
})();