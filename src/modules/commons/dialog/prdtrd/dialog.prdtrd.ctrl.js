(function() {
    'use strict';

    angular.module('demo.core')
        .controller('DialogPrdtrdController', DialogPrdtrdController);

    /* @ngInject */
    function DialogPrdtrdController($scope,$timeout,stockOrBond, Restangular,EnterpriseLibraryAPI,selected,SystemRestangular) {
        var vm = this;
        var handler;
        vm.showPage=true;//查询证券代码验证接口，不需要分页了
        //$scope.$$filter.zqlb = "2";
        vm.type=stockOrBond;
        vm.searchParam='';
        vm.customSelectedCompanys=[];
        vm.companys = [];
        SystemRestangular.all('cp/dictionary/securityCodeSource')
            .getList()//{extraCode: xxx}
            .then(function(data){
                console.log(data);
                vm.customfdg = data;
                vm.gpdm='2';
            });
        /**
         * 构造 查询参数
         */
        vm.buildParam=function(type){
            var s_customQuery = '';
            if(stockOrBond){
                var param={s_type:type,s_zqlb:stockOrBond};
            }else{
                var param={s_type:type,s_zqlb:'1'};
            }
            //组装 自定义条件
            if($scope.ngDialogData.s_customQuery){
                param.s_customQuery = $scope.ngDialogData.s_customQuery;
            }

            if(type=="init-single"){
                param.s_vcId = selected[0];
            }else if(type=="init-multiple"){
                param.s_vcIds = selected;
            }else if(type=="searchParam"){
                param.s_searchParam = vm.searchParam;
            }else if(type=='searchParam-tickCode'){
                param.s_searchParamBG = vm.searchParamBG;
            }
            return angular.extend(param, $scope.$$params);
        };

        if(!$scope.ngDialogData.selectionMode){
            $scope.ngDialogData.selectionMode = 'single';
        }


        /**
         * 根据编码，名称查询公司
         */
        vm.searchCompany=function(kind){
            if(kind!='1'&&kind!='2'){
                var item = '2';
            }else{
                var item =kind;
            }

            if(angular.isUndefined(item))
                item='2';
            /**
             * 初始化 加载的公司，
             *
             * */
            if(item=='2'){
                vm.showPage=true;
                if (vm.exchanges) {
                    vm.getexchangesJys(vm.exchanges, {
                        's_searchParam': vm.searchParam
                    });
                    return;
                }
                if(selected){
                    if($scope.ngDialogData.selectionMode == 'single'){
                        var param = vm.buildParam("init-single");
                        //查询一个公司
                        Restangular.all('companyInfo/prdtrdcode/listSelectPrdtrd')
                            .customGETLIST('',param)
                            .then(function(data) {
                                if(data){
                                    vm.companys = data;
                                    vm.ifSelect(true);
                                }
                            });
                    }else if($scope.ngDialogData.selectionMode == 'multiple'){
                        var param = vm.buildParam("init-multiple");
                        //初始化查询多个公司
                        Restangular.all('companyInfo/prdtrdcode/listSelectPrdtrd')
                            .customGETLIST('',param)
                            .then(function(data) {
                                vm.companys = data;
                                vm.ifSelect(true);
                            });
                    }
                    selected=undefined;
                }else {
                    var param = vm.buildParam("searchParam");
                    Restangular.all('companyInfo/prdtrdcode/listSelectPrdtrd')
                        .customGETLIST('', param)
                        .then(function (data) {
                            vm.companys = data;
                            vm.ifSelect();
                        });
                }
            }else{
            	if(vm.searchParamBG){
            		var param = vm.buildParam("searchParam-tickCode");
                    Restangular.all('bigdata')
                    .one(vm.searchParamBG)
                    .customGETLIST('checkstockcode')
                    .then(function (data) {
                        vm.companys = data;

                        vm.ifSelect();
                        vm.showPage=false;
                    });
            	}
            }
        };

        /**
         * 查询交易所下拉列表数据
         */
        var dropCondition={s_zqlb:stockOrBond};
        Restangular.all('companyInfo/prdtrdcode/getPrdTrdCodeExchanges')
            .customGETLIST('', angular.extend({}, $scope.$$params, dropCondition))
            .then(function(data) {
                vm.getxchanges = data;
            });

        vm.getexchangesJys=function(item, params){
            Restangular.all('companyInfo/prdtrdcode/listSelectPrdtrds/'+item.exchanges)
                .customGETLIST('', angular.extend({}, $scope.$$params, params))
                .then(function(data) {
                    vm.companys = data;
                });
        }
        /**
         * 编码，名称 联想
         */
        $scope.$watch('vm.searchParam', function(newVal,oldVal) {
            if (handler) {
                $timeout.cancel(handler);
            }
            //2017-1-16 修改 。页面初始化加载 查询有table触发，查询条件改变时由此触发查询
            if(newVal || (oldVal && !newVal ) ){
                handler = $timeout(function() {
                    vm.searchCompany();
                }, 200);
            }
        });

        /**
         * 新的查询结果，选中公司
         *
         */
        vm.ifSelect=function(initLoad){

            if(initLoad){
                if(vm.customSelectedCompanys.length>0){
                    var selects = vm.customSelectedCompanys.map(function(obj) {
                        return obj.vcTrdCode;
                    });
                    vm.companys.forEach(function(obj) {
                        obj.isSelected = selects.indexOf(obj.vcTrdCode) > -1;
                    });
                }else{
                    vm.companys.forEach(function(obj) {
                        obj.isSelected = true;
                        vm.customSelectedCompanys.push(obj);
                    });
                }
            }else{
                var selects = vm.customSelectedCompanys.map(function(obj) {
                    return obj.vcTrdCode;
                });
                vm.companys.forEach(function(obj) {
                    obj.isSelected = selects.indexOf(obj.vcTrdCode) > -1;
                });
            }

        };

        /**
         * 选中公司 或 取消 选中
         */
        vm.toggleSelectCompany = function(role) {
            if($scope.ngDialogData.selectionMode == 'single'){
                vm.customSelectedCompanys=[];
                if (role.isSelected) {
                    vm.customSelectedCompanys[0]=role;
                }
                vm.companys.forEach(function(obj) {
                    if (obj.vcId != role.vcId) {
                        obj.isSelected = false;
                    }
                });
            }else if($scope.ngDialogData.selectionMode == 'multiple'){
                if (role.isSelected) {
                    //选中，并添加到数组中
                    vm.customSelectedCompanys.push(role);
                }else {
                    //取消选中
                    var index = -1;
                    vm.customSelectedCompanys.forEach(function(obj, i) {
                        if (obj.vcId == role.vcId) {
                            index = i;
                            return false;
                        }
                    });
                    //从数组中移除
                    vm.customSelectedCompanys.splice(index, 1);
                }
            }
        };

        /**
         * 取消选中公司,并从已选择数组中移除
         */
        vm.removeCompany = function(role, index) {
            //移除
            vm.customSelectedCompanys.splice(index, 1);
            //取消选择
            vm.companys.forEach(function(obj) {
                if (obj.vcId == role.vcId) {
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

            //返回公司数组
            $scope.closeThisDialog( vm.customSelectedCompanys)
        };
    }
})();