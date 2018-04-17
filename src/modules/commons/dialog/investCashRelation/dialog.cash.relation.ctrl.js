(function() {
    'use strict';

    angular.module('demo.core')
        .controller('DialogCashRelationController', DialogCashRelationController);

    /* @ngInject */
    function DialogCashRelationController($scope, $timeout,$translate, Restangular, selected,Confirm) {
        var vm = this;
        vm.customSelectedUsers=[];//已选择的项目现金流
        /**
         * 构造 查询参数
         */
        vm.buildParam=function(type){
        	var s_customQuery = '';
        	var param={s_type:type};
        	//标的id
        	param.s_vcTargetId= $scope.ngDialogData.vcTargetId;
        	//组装 自定义条件
        	if($scope.ngDialogData.s_customQuery){
        		param.s_customQuery = $scope.ngDialogData.s_customQuery;
        	}
        	if(type=="init-single"){
        		param.s_proCashIds = selected;
        	}else if(type=="init-multiple"){
        		param.s_proCashIds = selected;
        	}
        	return angular.extend(param, $scope.$$params);
        };
        
        if(!$scope.ngDialogData.selectionMode){
        	$scope.ngDialogData.selectionMode = 'multiple';
        }
        /**
         * 查询
         */
        vm.searchUserByName=function(){
        	var param = vm.buildParam("showAllByTarget");
        	Restangular.all('project/projectinvestmentcash/investCahsRelation')
            .customGETLIST('',param)
            .then(function(data) {
                vm.users = data;
                //初始没有勾选
                var initNoSelected=false;
            	if(vm.customSelectedUsers.length==0){
            		initNoSelected=true;
            	}
        		var selects = vm.customSelectedUsers.map(function(obj) {
                	return obj.proCashId;
                });
            	if(selected!=""){
            		selects = selects.concat(selected);
            	}
                vm.users.forEach(function(obj) {
                	obj.isSelected = selects.indexOf(obj.proCashId) > -1;
                	if(initNoSelected && obj.isSelected==true){
                		vm.customSelectedUsers.push(obj);
                	}
                });
                selected=undefined;
            });
        };
        /**
         * 选中项目现金流 或 取消 选中
         */
        vm.toggleSelectUser = function(user) {
        	if($scope.ngDialogData.selectionMode == 'multiple'){
	        	if (user.isSelected) {
	        		//选中，并添加到数组中
	        		vm.customSelectedUsers.push(user);
	        	}else {
	        		//取消选中
	        		var index = -1;
	        		vm.customSelectedUsers.forEach(function(obj, i) {
	        			if (obj.proCashId == user.proCashId) {
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
         * 确认选择
         * @private
         */
        vm.ok = function() {
        	if(!vm.customSelectedUsers || vm.customSelectedUsers.length==0){
        		Confirm($translate.instant('N106822'),{//'N106822':'请选择要关联的行',
                    title:$translate.instant('N106021'),//N106021='提示'
                    okText:$translate.instant('N001008'),// N001008 = 确认
                    noCancel:true
                });
        		return;
        	}
            $scope.closeThisDialog(vm.customSelectedUsers);
        };
        vm.cancel = function(){
        	if(!vm.customSelectedUsers || vm.customSelectedUsers.length==0){
        		Confirm($translate.instant('N106823'),{//'N106823':'请选择要取消关联的行',
                    title:$translate.instant('N106021'),//N106021='提示'
                    okText:$translate.instant('N001008'),// N001008 = 确认
                    noCancel:true
                });
        		return;
        	}
        	$scope.closeThisDialog({"cancel":true,"cashRelation":vm.customSelectedUsers});
        }
    }
})();