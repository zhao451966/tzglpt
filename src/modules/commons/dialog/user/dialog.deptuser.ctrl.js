(function() {
    'use strict';

    angular.module('demo.core')
        .controller('DialogDeptUserController', DialogDeptUserController);

    /* @ngInject */
    function DialogDeptUserController($scope, $timeout, Restangular, selected,DeptManageAPI,UserInfoAPI) {
        var vm = this;
        vm.customSelectedUsers=[];//以选择的用户
        vm.users = [];//用户
        vm.units = [];//部门
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
        	//组装 部门code,用来查询子部门人员
        	if($scope.ngDialogData.parentUnitCode){
        		param.s_parentUnitCode = $scope.ngDialogData.parentUnitCode;
        	}
    		if(type=="init-single"){
        		param.s_userCode = selected[0];
        	}else if(type=="init-multiple"){
        		param.s_userCodes = selected;
        	}else if(type=="dept"){
        	}else if(type=="userName"){
        		param.s_userName = vm.name;
        	}
        	return angular.extend(param,$scope.$$params);
        };
        
        if(!$scope.ngDialogData.selectionMode){
        	$scope.ngDialogData.selectionMode = 'single';
        }
        
        /**
         * 加载部门树
         */
        vm.loadDeptTree=function(){
        	/*if(!$scope.ngDialogData.parentUnitCode){
        		DeptManageAPI.one('listAll').getList()
                .then(function (data) {
                    vm.units = data;
                });
        	}else{
        		//查询子部门树
        		DeptManageAPI.
        		one('listAllUnitCode')
        		.getList($scope.ngDialogData.parentUnitCode)
                .then(function (data) {
                    vm.units = data;
                });
        	}*/
        };
        //vm.loadDeptTree();
        
		function addDiyDom(treeId, treeNode) {
			var spaceWidth = 5;
			var switchObj = $("#" + treeNode.tId + "_switch"),
			icoObj = $("#" + treeNode.tId + "_ico");
			switchObj.remove();
			icoObj.before(switchObj);

			if (treeNode.level > 1) {
				var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+ "px'></span>";
				switchObj.before(spaceStr);
			}
		};

		function beforeClick(treeId, treeNode) {
			var param = vm.buildParam("dept");
        	param.s_queryByUnit = treeNode.unitCode;
        	// 当前部门下的 用户 
            Restangular.all('userinfo/findUserInfoList')
            .customGETLIST('',param)
            .then(function(data) {
                vm.users = data;
                vm.ifSelect();
            });
			return true;
		};
		
        DeptManageAPI.
		one('listTreeUnit')
		.getList()
        .then(function (data) {
    		//最上级部门
    		vm.units = data;
    		var setting = {
    				async:{
    					enable:true,
    					type:'get',
    					url:ContextPath+'service/unitinfo/listTreeUnit',
    					autoParam:['unitCode'],
    					dataType:'json',
    					//ajax 请求必须带上token参数，后端有过滤（com.xxxxx.sys.interceptor.SessionInvalidHandleInterceptor.preHandle()）
    					otherParam:{'accessToken':'testToken'}
    				},
    				data:{
    					key:{
    						name:'name',//后端数据中指定 name字段
    						//url:'xxx' 超链接
    					},
    					simpleData:{
        					enable:true,
        					idKey:'unitCode',
        					pIdKey:'parentUnit',
        					rootPId:'root'
        				}
    				},
    				view: {
    					showLine: false,
    					showIcon: false,
    					selectedMulti: false,
    					dblClickExpand: false
    					,addDiyDom: addDiyDom
    				}
    				,
    				callback: {
    					beforeClick: beforeClick,
    				}
    			};
    		vm.zTreeObj = $.fn.zTree.init($("#unitTree"), setting, vm.units);
        });
        
        /**
         * 根据部门查询用户
         */
 /*       $scope.$watch( 'unitCode.currentNode', function( newObj, oldObj ) {
            if (newObj && newObj.unitCode) {
            	var param = vm.buildParam("dept");
            	param.s_queryByUnit = newObj.unitCode;
            	// 当前部门下的 用户 
                Restangular.all('userinfo/findUserInfoList')
                .customGETLIST('',param)
                .then(function(data) {
                    vm.users = data;
                    vm.ifSelect();
                });
            }
        }, false);*/
        
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
         * 全选 全不选
         */
//        vm.checkall=false;
//        vm.checkAll=function(){
//        	if(vm.checkall){
//        		vm.users.forEach(function(obj) {
//                	obj.isSelected = true;
//                });
//        		vm.customSelectedUsers = vm.users;
//        		vm.checkall=false;
//        	}else{
//        		vm.users.forEach(function(obj) {
//                	obj.isSelected = false;
//                });
//        		vm.customSelectedUsers=[];
//        		vm.checkall=true;
//        	}
//        };
        	
        
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