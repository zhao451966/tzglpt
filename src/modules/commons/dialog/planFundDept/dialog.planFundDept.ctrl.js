(function() {
    'use strict';

    angular.module('demo.core')
        .controller('DialogPlanFundDeptController', DialogPlanFundDeptController);

    /* @ngInject */
    function DialogPlanFundDeptController($scope, $timeout, Restangular, selected) {
    	
    	var vm = this;
        vm.customSelectedPlanFundDepts=[];//已经选择的拟出资平台
        vm.planFundDepts = [];//拟出资平台
        vm.vcDeptName='';//拟出资平台名
        var handler;

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
        		param.s_id = selected[0];
        	}else if(type=="init-multiple"){
        		param.s_ids = selected;
        	}else if(type=="searchParam"){
        		param.s_searchParam = vm.vcDeptName;
        	}
        	return param;
        };
        /**
         * 初始化 加载的部门，
         * 
         * */
        if(selected){
        	if($scope.ngDialogData.selectionMode == 'single'){
        		var param = vm.buildParam("init-single");
        		//查询一个部门
        		Restangular.all('meetingManage/planfunddept/listSelectDept')
                .customGETLIST('',param)
                .then(function(data) {
                	if(data[0]){
                		vm.planFundDepts[0] = data[0];
                        vm.ifSelect(true);
                	}
                });
        	}else if($scope.ngDialogData.selectionMode == 'multiple'){
        		var param = vm.buildParam("init-multiple");
        		//初始化查询多个部门
        		 Restangular.all('meetingManage/planfunddept/listSelectDept')
                .customGETLIST('',param)
                .then(function(data) {
                    vm.planFundDepts = data;
                    vm.ifSelect(true);
                });
        	}
        }

        if(!$scope.ngDialogData.selectionMode){
        	$scope.ngDialogData.selectionMode = 'single';
        }
        /**
         * 根据拟出资平台名称查询
         */
        vm.searchPlanFundDeptByName=function(){
        	var param = vm.buildParam("searchParam");
        	Restangular.all('meetingManage/planfunddept/listSelectDept')
				//.getList()
				.customGETLIST('',param)
				.then(function(data) {
					vm.planFundDepts = data;
					vm.ifSelect();
				});
        };

		vm.searchPlanFundDeptByName();

        /**
         * 拟出资平台名称联想
         */
        $scope.$watch('vm.vcDeptName', function(newVal,oldVal) {
            if (handler) {
                $timeout.cancel(handler);
            }
            //2017-1-16 修改 。页面初始化加载 查询有table触发，查询条件改变时由此触发查询
            if(newVal || (oldVal && !newVal ) ){
        		handler = $timeout(function() {
                    vm.searchPlanFundDeptByName();
                }, 200);
            }
        }); 
       
        /**
         * 新的查询结果，选中部门
         * 
         */
        vm.ifSelect=function(initLoad){

        	if(initLoad){
        		if(vm.customSelectedPlanFundDepts.length>0){
            		var selects = vm.customSelectedPlanFundDepts.map(function(obj) {
                    	return obj.id;
                    });
                    vm.planFundDepts.forEach(function(obj) {
                    	obj.isSelected = selects.indexOf(obj.id) > -1;
                    });
            	}else{
            		vm.planFundDepts.forEach(function(obj) {
                    	obj.isSelected = true;
                    	vm.customSelectedPlanFundDepts.push(obj);
                    });
            	}
        	}else{
        		var selects = vm.customSelectedPlanFundDepts.map(function(obj) {
                	return obj.id;
                });
                vm.planFundDepts.forEach(function(obj) {
                	obj.isSelected = selects.indexOf(obj.id) > -1;
                });
        	}
        	
        };
        
        /**
         * 选中部门 或 取消 选中
         */
        vm.toggleSelectPlanFundDept = function(dept) {
        	if($scope.ngDialogData.selectionMode == 'single'){
        		vm.customSelectedPlanFundDepts=[];
        		if (dept.isSelected) {
	        		vm.customSelectedPlanFundDepts[0]=dept;
        		} 
        		vm.planFundDepts.forEach(function(obj) {
            		if (obj.id != dept.id) {
            			obj.isSelected = false;
            		}
            	})
        	}else if($scope.ngDialogData.selectionMode == 'multiple'){
	        	if (dept.isSelected) {
	        		//选中，并添加到数组中
	        		vm.customSelectedPlanFundDepts.push(dept);
	        	}else {
	        		//取消选中
	        		var index = -1;
	        		vm.customSelectedPlanFundDepts.forEach(function(obj, i) {
	        			if (obj.id == dept.id) {
	        				index = i;
	        				return false;
	        			}
	        		});
	        		//从数组中移除
	        		vm.customSelectedPlanFundDepts.splice(index, 1);
	        	}
        	}
        };
        
        /**
         * 取消选中部门,并从已选择数组中移除
         */
        vm.removePlanFundDept = function(planFundDept, index) {
        	//移除
        	vm.customSelectedPlanFundDepts.splice(index, 1);
        	//取消选择
        	vm.units.forEach(function(obj) {
        		if (obj.id == planFundDept.id) {
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
            //返回部门数组
            $scope.closeThisDialog($scope.$$selectedRows)
        };
    }
})();