(function() {
    'use strict';

    angular.module('demo.core')
        .controller('DialogFiUnitController', DialogFiUnitController);

    /* @ngInject */
    function DialogFiUnitController($scope, $timeout, Restangular, selected) {

		var vm = this;
		vm.paramInSel=selected;
		vm.customSelectedUnits=[];//已经选择的部门
		vm.units = [];//部门
		vm.unitName='';//部门名
		var handler;
		Restangular.all('unitinfo/getFirst')
			.customGET()
			.then(function(data) {
				vm.unit = data;
			});
		vm.showPath=false;

		/**
		 * 构造 查询参数
		 */
		vm.buildParam=function(type,code){
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
			}else if(type=="unitName"){
				param.s_unitName = vm.unitName;
			}else if(type=="parentUnit"){
				param.s_parentUnit = code;
				param.s_type="init-multiple";
				param.s_searchType=vm.searchType;
			}
			return angular.extend(param,$scope.$$params);
		};

		if(!$scope.ngDialogData.selectionMode||$scope.ngDialogData.selectionMode =='single-vcId'){
			$scope.ngDialogData.selectionMode = 'single';
		}
		/**
		 * 根据部门名称查询
		 */
		vm.code="";
		vm.searchType="";
		vm.searchUnitByName=function(type,data){
			if(data&&data.unitCode){
				vm.code=data.unitCode;
			}
			if(angular.isObject(type)){
				vm.searchType='tom';
			}
			/**
			 * 初始化 加载的部门，
			 *
			 * */
			if(angular.isObject(type)&&!vm.unitName&&!vm.code){
				if($scope.ngDialogData.selectionMode == 'single'||$scope.ngDialogData.selectionMode =='single-vcId'){
					var param = vm.buildParam("init-single");
					//查询一个部门
					Restangular.all('fiunitinfo/listUnit')
						.customGETLIST('',param)
						.then(function(data) {
							if(data){
								vm.units = data;
								vm.ifSelect(true);
							}
						});
				}else if($scope.ngDialogData.selectionMode == 'multiple'){
					var param = vm.buildParam("init-multiple");
					//初始化查询多个部门
					Restangular.all('fiunitinfo/listUnit')
						.customGETLIST('',param)
						.then(function(data) {
							vm.units = data;
							vm.ifSelect(true);
						});
				}
				selected=undefined;
			}else if(type=='link'||(angular.isObject(type)&&vm.code)){
				vm.unitName='';
				if(type=='link'){
					vm.searchType='link';
				}else{
					vm.searchType='tom';
				}
				var param = vm.buildParam("parentUnit",vm.code);
				Restangular.all('fiunitinfo/listUnit')
					.customGETLIST('',param)
					.then(function(data) {
						if(data&&data.length>0){
							vm.showPath=true;
							vm.units=[];
							vm.units = data;
							vm.ifSelect(true);
							Restangular.all('unitinfo/listTopUnitUser')
								.customGETLIST('',param)
								.then(function(info) {
									if(info&&info.length>0){
										vm.topUnits=info;
									}
								});
						}
					});
			}else if(type=='search'||(angular.isObject(type)&&vm.unitName)){
				vm.code='';
				var param = vm.buildParam("unitName");
				Restangular.all('fiunitinfo/listUnit')
					.customGETLIST('',param)
					.then(function(data) {
						vm.units = data;
						vm.ifSelect();
					});
				$("#chk_all").prop("checked",false)
			}
		};
		/**
		 * 部门名称联想
		 */
		$scope.$watch('vm.unitName', function(newVal,oldVal) {
			if (handler) {
				$timeout.cancel(handler);
			}
			//2017-1-16 修改 。页面初始化加载 查询有table触发，查询条件改变时由此触发查询
			if(newVal || (oldVal && !newVal ) ){
				handler = $timeout(function() {
					if(vm.unitName){
						vm.searchUnitByName('search');
					}else{
						vm.searchUnitByName();
					}
				}, 200)
			}
		});

		/**
		 * 新的查询结果，选中部门
		 *
		 */
		vm.ifSelect=function(initLoad){

			if(initLoad){
				if(vm.customSelectedUnits.length>0){
					var selects = vm.customSelectedUnits.map(function(obj) {
						return obj.unitCode;
					});
					vm.units.forEach(function(obj) {
						obj.isSelected = selects.indexOf(obj.unitCode) > -1;
					});
				}else{
					vm.units.forEach(function(obj) {
						for(var i=0;i<vm.paramInSel.length;i++){
							if(obj.unitCode==vm.paramInSel[i]){
								obj.isSelected = true;
								vm.customSelectedUnits.push(obj);
							}
						}
					});
				}
			}else{
				var selects = vm.customSelectedUnits.map(function(obj) {
					return obj.unitCode;
				});
				vm.units.forEach(function(obj) {
					obj.isSelected = selects.indexOf(obj.unitCode) > -1;
				});
			}

		};

		/**
		 * 选中部门 或 取消 选中
		 */
		vm.toggleSelectUnit = function(unit) {
			if($scope.ngDialogData.selectionMode == 'single'){
				vm.customSelectedUnits=[];
				if (unit.isSelected) {
					vm.customSelectedUnits[0]=unit;
				}
				vm.units.forEach(function(obj) {
					if (obj.unitCode != unit.unitCode) {
						obj.isSelected = false;
					}
				})
			}else if($scope.ngDialogData.selectionMode == 'multiple'){
				if (unit.isSelected) {
					//选中，并添加到数组中
					vm.customSelectedUnits.push(unit);
				}else {
					//取消选中
					var index = -1;
					vm.customSelectedUnits.forEach(function(obj, i) {
						if (obj.unitCode == unit.unitCode) {
							index = i;
							return false;
						}
					});
					//从数组中移除
					vm.customSelectedUnits.splice(index, 1);
				}
			}
		};

		/**
		 * 选中部门 或 取消 选中 (全选)
		 */
		vm.toggleSelectUnitAll = function() {
			if($scope.ngDialogData.selectionMode == 'multiple'){

				if ($("#chk_all").prop("checked")) {
					angular.forEach(vm.units ,function(item){
						item.isSelected = true;
					});
				}else{
					angular.forEach(vm.units ,function(item){
						item.isSelected = false;
					});
				}

				angular.forEach(vm.units ,function(unit){
					if (unit.isSelected) {
						//选中，并添加到数组中
						var index = -1;
						vm.customSelectedUnits.forEach(function(obj, i) {
							if (obj.unitCode == unit.unitCode) {
								index = 1;
								return false;
							}
						});
						if(index == -1){
							vm.customSelectedUnits.push(unit);
						};
					}else {
						//取消选中
						var index = -1;
						vm.customSelectedUnits.forEach(function(obj, i) {
							if (obj.unitCode == unit.unitCode) {
								index = i;
								return false;
							}
						});
						//从数组中移除
						vm.customSelectedUnits.splice(index, 1);
					}
				});
			}
		};

		/**
		 * 取消选中部门,并从已选择数组中移除
		 */
		vm.removeUnit = function(unit, index) {
			//移除
			vm.customSelectedUnits.splice(index, 1);
			//取消选择
			vm.units.forEach(function(obj) {
				if (obj.unitCode == unit.unitCode) {
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
//                vm.customSelectedUnits=[{
//                	unitCode:'',
//                	unitName:''
//                }];
//            }
			//返回部门数组
			$scope.closeThisDialog(vm.customSelectedUnits);
		};
	}
})();