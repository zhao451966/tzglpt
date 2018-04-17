(function(){
    'use strict';

    angular
        .module('demo.core')
        .controller('DialogContributeTargetSelectController',DialogContributeTargetSelectController);

    /* @ngInject */
    function DialogContributeTargetSelectController($scope,$stateParams,$timeout,Restangular,$translate, selected,Authenticate,toastr){
        var vm = this;
        vm.targets = [];
        vm.customSelectedTargets = [];

		vm.title=$translate.instant('N003074', {
			vcTargetName:$scope.ngDialogData.target.vcTargetName,
			effectiveDate:$scope.ngDialogData.effectiveDate
		});

        if(!$scope.ngDialogData.selectionMode){
        	$scope.ngDialogData.selectionMode = 'multiple';
        }
        
        //查询
        vm.query = function() {
			/**
			 * 初始化 加载的项目
			 * */
			Restangular.all('teammember/procontributedegree/viewCopy/'+$stateParams.id+'/'+$scope.ngDialogData.target.id)
				.customGET()
				.then(function(data) {
					if(data){
						vm.targets = data;
					}
				});
        };
		vm.query();
        /**
         * 选中 或 取消 选中
         */
        vm.toggleSelectTarget = function(target) {
        	if($scope.ngDialogData.selectionMode == 'multiple'){
	        	if (target.isSelected) {
	        		//选中，并添加到数组中
	        		vm.customSelectedTargets.push(target);
	        	}else {
	        		//取消选中
	        		var index = -1;
	        		vm.customSelectedTargets.forEach(function(obj, i) {
	        			if (obj.vcTargetId == target.vcTargetId) {
	        				index = i;
	        				return false;
	        			}
	        		});
	        		//从数组中移除
	        		vm.customSelectedTargets.splice(index, 1);
	        	}
        	}
        };
        
        /**
         * 取消选中用户,并从已选择数组中移除
         */
        vm.removeTarget = function(target, index) {
        	//移除
        	vm.customSelectedTargets.splice(index, 1);
        	//取消选择
        	vm.targets.forEach(function(obj) {
        		if (obj.vcTargetId == target.vcTargetId) {
        			obj.isSelected = false;
        			return false;
        		}
        	});
        };
        

        vm.ok = function() {
            $scope.closeThisDialog(vm.customSelectedTargets )
	};
    }
})();