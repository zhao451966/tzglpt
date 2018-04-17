(function(){
    'use strict';

    angular
        .module('demo.core')
        .controller('DialogProjectDingGroupController',DialogProjectDingGroupController);

    /* @ngInject */
    function DialogProjectDingGroupController($scope,  $timeout,Restangular, selected){
        var vm = this;
        vm.searchParam='';//查询条件：项目编号，项目全称，项目简称
        vm.projects = [];
        vm.customSelectedProjects = [];
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
        	
        	if(type=="init-single"){
        		param.s_vcProId = selected[0];
        	}else if(type=="init-multiple"){
        		param.s_vcProIds = selected;
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
					//查询一个
					Restangular.all('projects/listProjectDingGroup')
						.customGETLIST('',param)
						.then(function(data) {
							if(data){
								vm.projects = data;
								vm.ifSelect(true);
							}
						});
				}else if($scope.ngDialogData.selectionMode == 'multiple'){
					var param = vm.buildParam("init-multiple");
					//初始化查询多个
					Restangular.all('projects/listProjectDingGroup')
						.customGETLIST('',param)
						.then(function(data) {
							vm.projects = data;
							vm.ifSelect(true);
						});
				}
				selected=undefined;
			}else{
				var param = vm.buildParam("searchParam");
				Restangular.all('projects/listProjectDingGroup')
				.customGETLIST('',angular.extend(param,$scope.$$params))
				.then(function(data){
					vm.projects = data;
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
        		if(vm.customSelectedProjects.length>0){
            		var selects = vm.customSelectedProjects.map(function(obj) {
                    	return obj.vcProId;
                    });
                    vm.projects.forEach(function(obj) {
                    	obj.isSelected = selects.indexOf(obj.vcProId) > -1;
                    });
            	}else{
            		vm.projects.forEach(function(obj) {
                    	obj.isSelected = true;
                    	vm.customSelectedProjects.push(obj);
                    });
            	}
        	}else{
        		var selects = vm.customSelectedProjects.map(function(obj) {
                	return obj.vcProId;
                });
                vm.projects.forEach(function(obj) {
                	obj.isSelected = selects.indexOf(obj.vcProId) > -1;
                });
        	}
        };
        
        /**
         * 选中 或 取消 选中
         */
        vm.toggleSelectProject = function(project) {
        	if($scope.ngDialogData.selectionMode == 'single'){
        		vm.customSelectedProjects=[];
        		if (project.isSelected) {
	        		vm.customSelectedProjects[0]=project;
        		} 
        		vm.projects.forEach(function(obj) {
            		if (obj.vcProId != project.vcProId) {
            			obj.isSelected = false;
            		}
            	})
        	}else if($scope.ngDialogData.selectionMode == 'multiple'){
	        	if (project.isSelected) {
	        		//选中，并添加到数组中
	        		vm.customSelectedProjects.push(project);
	        	}else {
	        		//取消选中
	        		var index = -1;
	        		vm.customSelectedProjects.forEach(function(obj, i) {
	        			if (obj.vcProId == project.vcProId) {
	        				index = i;
	        				return false;
	        			}
	        		});
	        		//从数组中移除
	        		vm.customSelectedProjects.splice(index, 1);
	        	}
        	}
        };
        
        /**
         * 取消选中用户,并从已选择数组中移除
         */
        vm.removeProject = function(project, index) {
        	//移除
        	vm.customSelectedProjects.splice(index, 1);
        	//取消选择
        	vm.projects.forEach(function(obj) {
        		if (obj.vcProId == project.vcProId) {
        			obj.isSelected = false;
        			return false;
        		}
        	});
        };
        

        vm.ok = function() {
            //返回选中行
            $scope.closeThisDialog(vm.customSelectedProjects )
        };
    }
})();