(function() {
    'use strict';

    angular.module('demo.core')
        .controller('DialogFundInfoController', DialogFundInfoController);

    /* @ngInject */
    function DialogFundInfoController($scope, $timeout, Restangular, selected) {
    	
    	var vm = this;
        vm.customSelectedFundInfos=[];//已经选择的出资实体
        vm.fundInfos = [];//出资实体
        vm.vcFundName='';//出资实体名
        var handler;
		vm.cancelText='$closeButton';
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
        		param.s_searchParam = vm.vcFundName;
        	}
        	return angular.extend(param, $scope.$$params);
        };
        
        if(!$scope.ngDialogData.selectionMode){
        	$scope.ngDialogData.selectionMode = 'single';
        }
        /**
         * 根据出资平台名称查询
         */
        vm.query=function(){
        	/**
             * 初始化 加载的，
             * 
             * */
            if(selected){
            	if($scope.ngDialogData.selectionMode == 'single'){
            		var param = vm.buildParam("init-single");
            		//查询一个
            		Restangular.all('sysfundinfo/listFundInfo')
                    .customGETLIST('',param)
                    .then(function(data) {
                    	//2017-1-17 注释掉， 必须将data 赋值给 table的数据属性【 st-table="vm.fundInfos"】
                    	//否则 table将无法正常 判断 表格是否有数据 ，导致 一直显示 “没有数据”
//                    	if(data[0]){
                    		vm.fundInfos = data;
                            vm.ifSelect(true);
//                    	}
                    });
            	}else if($scope.ngDialogData.selectionMode == 'multiple'){
            		var param = vm.buildParam("init-multiple");
            		//初始化查询多个
            		 Restangular.all('sysfundinfo/listFundInfo')
                    .customGETLIST('',param)
                    .then(function(data) {
                        vm.fundInfos = data;
                        vm.ifSelect(true);
                    });
            	}
            	selected=undefined;
            }else{
            	var param = vm.buildParam("searchParam");
            	Restangular.all('sysfundinfo/listFundInfo')
                .customGETLIST('',param)
                .then(function(data) {
                    vm.fundInfos = data;
                    vm.ifSelect();
                });
            }
        };

        /**
         * 出资平台名称联想
         */
        $scope.$watch('vm.vcFundName', function(newVal,oldVal) {
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
       
        /**
         * 新的查询结果，选中
         * 
         */
        vm.ifSelect=function(initLoad){

        	if(initLoad){
        		if(vm.customSelectedFundInfos.length>0){
            		var selects = vm.customSelectedFundInfos.map(function(obj) {
                    	return obj.id;
                    });
                    vm.fundInfos.forEach(function(obj) {
                    	obj.isSelected = selects.indexOf(obj.id) > -1;
                    });
            	}else{
            		vm.fundInfos.forEach(function(obj) {
                    	obj.isSelected = true;
                    	vm.customSelectedFundInfos.push(obj);
                    });
            	}
        	}else{
        		var selects = vm.customSelectedFundInfos.map(function(obj) {
                	return obj.id;
                });
                vm.fundInfos.forEach(function(obj) {
                	obj.isSelected = selects.indexOf(obj.id) > -1;
                });
        	}
        	
        };
        
        /**
         * 选中 或 取消 选中
         */
        vm.toggleSelectFundInfo = function(dept) {
        	if($scope.ngDialogData.selectionMode == 'single'){
        		vm.customSelectedFundInfos=[];
        		if (dept.isSelected) {
	        		vm.customSelectedFundInfos[0]=dept;
        		} 
        		vm.fundInfos.forEach(function(obj) {
            		if (obj.id != dept.id) {
            			obj.isSelected = false;
            		}
            	})
        	}else if($scope.ngDialogData.selectionMode == 'multiple'){
	        	if (dept.isSelected) {
	        		//选中，并添加到数组中
	        		vm.customSelectedFundInfos.push(dept);
	        	}else {
	        		//取消选中
	        		var index = -1;
	        		vm.customSelectedFundInfos.forEach(function(obj, i) {
	        			if (obj.id == dept.id) {
	        				index = i;
	        				return false;
	        			}
	        		});
	        		//从数组中移除
	        		vm.customSelectedFundInfos.splice(index, 1);
	        	}
        	}
        };
        
        /**
         * 取消选中,并从已选择数组中移除
         */
        vm.removePlanFundDept = function(planFundDept, index) {
        	//移除
        	vm.customSelectedFundInfos.splice(index, 1);
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
            if (!$scope.$$selectedRows || !$scope.$$selectedRows.length) {
                vm.customSelectedUnits=[{
                	id:'',
                	vcFundName:'',
                	vcFundShortName:''
                }];
            }
            //返回数组
            $scope.closeThisDialog(vm.customSelectedFundInfos)
        };
    }
})();