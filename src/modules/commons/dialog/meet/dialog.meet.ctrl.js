(function() {
    'use strict';

    angular.module('demo.core')
        .controller('systemDialogMeetController', systemDialogMeetController);

    /* @ngInject */
    function systemDialogMeetController($scope, $timeout, Restangular, selected,UserInfoAPI) {
        var vm = this;
        vm.customSelectedUsers=[];//以选择的会议
        //vm.users = [];//会议
        vm.name='';//会议名
        var handler;
        
        /**
         * 构造 查询参数
         */
        vm.buildParam=function(type){
        	var s_customQuery = '';
        	var param={s_type:type};
        	param.s_selectType ='1';
        	//项目id
        	param.s_vcProId= $scope.ngDialogData.vcProId;
        	//组装 自定义条件
        	if($scope.ngDialogData.s_customQuery){
        		param.s_customQuery = $scope.ngDialogData.s_customQuery;
        	}
        	if(type=="init-single"){
        		param.s_meetIds = selected;
        	}else if(type=="init-multiple"){
        		param.s_meetIds = selected;
        	}else if(type=="userName"){
        		param.s_vcProName = vm.name;
        	}
        	return angular.extend(param, $scope.$$params);
        };
        
        if(!$scope.ngDialogData.selectionMode){
        	$scope.ngDialogData.selectionMode = 'single';
        }
        /**
         * 根据输入查询
         */
        vm.searchUserByName=function(){
        	/**
             * 初始化 加载的会议，
             * 
             * */
            if(selected){
            	if($scope.ngDialogData.selectionMode == 'single'){
            		var param = vm.buildParam("init-single");
            		//查询一个会议
            		Restangular.all('meeting/dialoglistMeetingObjectsAsJson')
                    .customGETLIST('',param)
                    .then(function(data) {
						if(data){
                    		vm.users = data;
                            vm.ifSelect(true);
                    	}
                    });
            	}else if($scope.ngDialogData.selectionMode == 'multiple'){
            		var param = vm.buildParam("init-multiple");
            		//初始化查询多个会议
            		 Restangular.all('meeting/dialoglistMeetingObjectsAsJson')
                    .customGETLIST('',param)
                    .then(function(data) {
                        vm.users = data;
                        vm.ifSelect(true);
                    });
            	}
            	selected=undefined;
            }else{
            	var param = vm.buildParam("userName");
            	Restangular.all('meeting/dialoglistMeetingObjectsAsJson')
                .customGETLIST('',param)
                .then(function(data) {
                    vm.users = data;
                    vm.ifSelect();
                });
            }
        };
        
        /**
         * 输入联想
         */
        $scope.$watch('vm.name', function(newVal,oldVal) {
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
         * 新的查询结果，选中会议
         * 
         */
        vm.ifSelect=function(initLoad){

        	if(initLoad){
        		if(vm.customSelectedUsers.length>0){
            		var selects = vm.customSelectedUsers.map(function(obj) {
                    	return obj.id;
                    });
                    vm.users.forEach(function(obj) {
                    	obj.isSelected = selects.indexOf(obj.id) > -1;
                    });
            	}else{
            		vm.users.forEach(function(obj) {
                    	obj.isSelected = true;
                    	vm.customSelectedUsers.push(obj);
                    });
            	}
        	}else{
        		var selects = vm.customSelectedUsers.map(function(obj) {
                	return obj.id;
                });
                vm.users.forEach(function(obj) {
                	obj.isSelected = selects.indexOf(obj.id) > -1;
                });
        	}
        	
        };
        
        /**
         * 选中会议 或 取消 选中
         */
        vm.toggleSelectUser = function(user) {
        	if($scope.ngDialogData.selectionMode == 'single'){
        		vm.customSelectedUsers=[];
        		if (user.isSelected) {
	        		vm.customSelectedUsers[0]=user;
        		} 
        		vm.users.forEach(function(obj) {
            		if (obj.id != user.id) {
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
	        			if (obj.id == user.id) {
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
         * 取消选中会议,并从已选择数组中移除
         */
        vm.removeUser = function(user, index) {
        	//移除
        	vm.customSelectedUsers.splice(index, 1);
        	//取消选择
        	vm.users.forEach(function(obj) {
        		if (obj.id == user.id) {
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
            //返回会议数组
            $scope.closeThisDialog(vm.customSelectedUsers)
        };
    }
})();