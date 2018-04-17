(function() {
    'use strict';

    angular.module('demo.core')
        .controller('DialogFiUserController', DialogFiUserController);

    /* @ngInject */
    function DialogFiUserController($scope, $timeout, Restangular, selected,UserInfoAPI) {
        var vm = this;
        vm.customSelectedUsers=[];//以选择的用户
        vm.users = [];//用户
        vm.userName='';//用户名
        var handler;

		vm.chkAll = function(){
			if ($("#chk_all").prop("checked")) {
				$("input[type=checkbox]").prop("checked",true);
			}else{
				$("input[type=checkbox]").prop("checked",false);
			}
		}
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
        	if(type=="init-single"){
        		param.s_userCode = selected[0];
        	}else if(type=="init-multiple"){
        		param.s_userCodes = selected;
        	}else if(type=="userName"){
        		param.s_userName = vm.userName;
        	}
        	return angular.extend(param,$scope.$$params);
        };
        /**
         * 初始化 加载的用户，
         *
         * */
        if(selected){
        	if($scope.ngDialogData.selectionMode == 'single'){
        		var param = vm.buildParam("init-single");
        		//查询一个用户
        		Restangular.all('fiuserinfo/findUserInfoList')
                .customGETLIST('',param)
                .then(function(data) {
                	if(data[0]){
                		vm.users[0] = data[0];
                        vm.ifSelect(true);
                	}
                });
        	}else if($scope.ngDialogData.selectionMode == 'multiple'){
        		var param = vm.buildParam("init-multiple");
        		//初始化查询多个用户
        		 Restangular.all('fiuserinfo/findUserInfoList')
                .customGETLIST('',param)
                .then(function(data) {
                    vm.users = data;
                    vm.ifSelect(true);
                });
        	}
        }
        if(!$scope.ngDialogData.selectionMode){
        	$scope.ngDialogData.selectionMode = 'single';
        }
        /**
         * 根据姓名查询用户
         */
        vm.searchUserByName=function(){
        	var param = vm.buildParam("userName");
        	Restangular.all('fiuserinfo/findUserInfoList')
            .customGETLIST('',param)
            .then(function(data) {
                vm.users = data;
                vm.ifSelect();
            });
        };
        /**
         * 姓名联想
         */
        $scope.$watch('vm.userName', function(newVal,oldVal) {
            if (handler) {
                $timeout.cancel(handler);
            }
            //2017-1-16 修改 。页面初始化加载 查询有table触发，查询条件改变时由此触发查询
            if(newVal || (oldVal && !newVal ) ){
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
		 * 全选
		 */
		//vm.chkAll = function(data){
		//	if ($("#chk_all").prop("checked")) {
		//		vm.customSelectedUsers=[];
		//		$scope.$$selectedRows=[];
		//		for(var i=0;i<data.length;i++){
		//			//alert($scope.$$selectedRows+"---"+$scope.$$selectedRows.length);
		//			data[i].isSelected;
		//			vm.customSelectedUsers.push(data[i]);
		//			$scope.$$selectedRows.push(data[i]);
		//		}
		//		$("input[type=checkbox]").prop("checked",true);
		//		//$("input[type=checkbox][id!=chk_all]").click();
		//	}else{
		//		for(var i=0;i<data.length;i++){
		//			//alert($scope.$$selectedRows+"---"+$scope.$$selectedRows.length);
		//			vm.customSelectedUsers.splice(index, 1);
		//			//$scope.$$selectedRows.splice(index, 1);
		//		}
		//		vm.customSelectedUsers=[];
		//		$("input[type=checkbox]").prop("checked",false);
		//		//$("input[type=checkbox][id!=chk_all]").click();
		//	}
		//}
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
            $scope.closeThisDialog($scope.$$selectedRows)
        };
    }
})();