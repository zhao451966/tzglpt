(function() {
    'use strict';

    angular.module('demo.core')
        .controller('DialogGlptController', DialogGlptController);

    /* @ngInject */
    function DialogGlptController($scope, $timeout, Restangular, selected) {
        var vm = this;
        vm.customSelectedGlpts=[];//以选择的管理平台
        vm.glpts = [];//管理平台
        vm.name='';//管理平台名
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
        		param.s_unitCode = selected[0];
        	}else if(type=="init-multiple"){
        		param.s_unitCodes = selected;
        	}else if(type=="search"){
        		param.s_unitName = vm.unitName;
        	}
        	return angular.extend(param,$scope.$$params);
        };

        if(!$scope.ngDialogData.selectionMode){
        	$scope.ngDialogData.selectionMode = 'single';
        }
        /**
         * 根据姓名查询管理平台
         */
        vm.searchGlptByName=function(){
			/**
			 * 初始化 加载的管理平台，
			 *
			 * */
			if(selected){
				if($scope.ngDialogData.selectionMode == 'single'){
					var param = vm.buildParam("init-single");
					//查询一个管理平台
					Restangular.all('unitinfo/listGLPT')
						.customGETLIST('',param)
						.then(function(data) {
							if(data){
								vm.glpts = data;
								vm.ifSelect(true);
							}
						});
				}else if($scope.ngDialogData.selectionMode == 'multiple'){
					var param = vm.buildParam("init-multiple");
					//初始化查询多个管理平台
					Restangular.all('unitinfo/listGLPT')
						.customGETLIST('',param)
						.then(function(data) {
							vm.glpts = data;
							vm.ifSelect(true);
						});
				}
				selected=undefined;
			}else {
				var param = vm.buildParam("search");
				Restangular.all('unitinfo/listGLPT')
				.customGETLIST('',param)
				.then(function(data) {
					vm.glpts = data;
					vm.ifSelect();
				});
			}
        };
        /**
         * 姓名联想
         */
        $scope.$watch('vm.unitName', function(newVal,oldVal) {
            if (handler) {
                $timeout.cancel(handler);
            }
            //2017-1-16 修改 。页面初始化加载 查询有table触发，查询条件改变时由此触发查询
            if(newVal || (oldVal && !newVal ) ){
        		handler = $timeout(function() {
                    vm.searchGlptByName();
                }, 200);
            }
        }); 
       
        /**
         * 新的查询结果，选中管理平台
         * 
         */
        vm.ifSelect=function(initLoad){
        	if(initLoad){
        		if(vm.customSelectedGlpts.length>0){
            		var selects = vm.customSelectedGlpts.map(function(obj) {
                    	return obj.unitCode;
                    });
                    vm.glpts.forEach(function(obj) {
                    	obj.isSelected = selects.indexOf(obj.unitCode) > -1;
                    });
            	}else{
            		vm.glpts.forEach(function(obj) {
                    	obj.isSelected = true;
                    	vm.customSelectedGlpts.push(obj);
                    });
            	}
        	}else{
        		var selects = vm.customSelectedGlpts.map(function(obj) {
                	return obj.unitCode;
                });
                vm.glpts.forEach(function(obj) {
                	obj.isSelected = selects.indexOf(obj.unitCode) > -1;
                });
        	}
        	
        };
        
        /**
         * 选中管理平台 或 取消 选中
         */
        vm.toggleSelectGlpt = function(glpt) {
        	if($scope.ngDialogData.selectionMode == 'single'){
        		vm.customSelectedGlpts=[];
        		if (glpt.isSelected) {
	        		vm.customSelectedGlpts[0]=glpt;
        		} 
        		vm.glpts.forEach(function(obj) {
            		if (obj.unitCode != glpt.unitCode) {
            			obj.isSelected = false;
            		}
            	})
        	}else if($scope.ngDialogData.selectionMode == 'multiple'){
	        	if (glpt.isSelected) {
	        		//选中，并添加到数组中
	        		vm.customSelectedGlpts.push(glpt);
	        	}else {
	        		//取消选中
	        		var index = -1;
	        		vm.customSelectedGlpts.forEach(function(obj, i) {
	        			if (obj.unitCode == glpt.unitCode) {
	        				index = i;
	        				return false;
	        			}
	        		});
	        		//从数组中移除
	        		vm.customSelectedGlpts.splice(index, 1);
	        	}
        	}
        };
        
        /**
         * 取消选中管理平台,并从已选择数组中移除
         */
        vm.removeGlpt = function(glpt, index) {
        	//移除
        	vm.customSelectedGlpts.splice(index, 1);
        	//取消选择
        	vm.glpts.forEach(function(obj) {
        		if ( obj.unitCode == glpt.unitCode) {
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
            //返回管理平台数组
            $scope.closeThisDialog( vm.customSelectedGlpts)
        };
    }
})();