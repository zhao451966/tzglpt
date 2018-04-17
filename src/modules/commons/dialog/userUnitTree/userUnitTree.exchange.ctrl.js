(function() {
    'use strict';

    angular.module('demo.core')
        .controller('UserUnitTreeExchangeController', UserUnitTreeExchangeController);

    /* @ngInject */
    function UserUnitTreeExchangeController($scope,DeptManageAPI,Utils,selected) {
        var vm = this;
        var select = selected;
        vm.state='1';
        vm.queryTree = function() {
            //树形展示
            DeptManageAPI.one('listAlltree1').get()
                .then(function(data) {
                    vm.listUnitTree=data;
                        selected.map(function (obj1) {
                            Utils.walkTree(vm.listUnitTree, function (obj) {
                                if (obj.unitCode == obj1.unitCode) {
                                    if(obj1.vcDatepowerFgbmType=='2'){
                                        obj.selected = true;
                                        obj.isSelected1 = true;
                                    }else if(obj1.vcDatepowerFgbmType=='1'){
                                        obj.isSelected1 = true;
                                    }else {
                                        obj.selected = true;
                                    }
                                }
                            });
                        });
                });

        }
        vm.queryTree();
        //5代码是正在加载
        vm.awesomeCallback = function(node, tree) {
            vm.node=node;
            if(vm.node.yjz!='1'){
            DeptManageAPI.one('listAlltree2').one(vm.node.unitCode).get()
                .then(function(data) {
                    vm.listUnitTree1=data;
                        Utils.walkTree(vm.listUnitTree, function (obj) {
                            if(obj.unitCode==vm.node.unitCode){
                                obj.yjz='1'
                                obj.children=[]
                                Utils.walkTree(vm.listUnitTree1, function (obj1) {
                                    if(obj.unitCode==obj1.parentUnit&&obj1.leaf=='2'){
                                        var selected=false;
                                        var isSelected1=false;
                                        //异步加载时,为已经选中的
                                        select.map(function (obj2) {
                                            if (obj1.unitCode == obj2.unitCode) {
                                                if(obj2.vcDatepowerFgbmType=='2'){
                                                    selected = true;
                                                    isSelected1 = true;
                                                }else if(obj2.vcDatepowerFgbmType=='1'){
                                                    isSelected1 = true;
                                                }else {
                                                    selected = true;
                                                }
                                            }
                                        });
                                        if(obj.selected){
                                            selected = true;
                                        }
                                        obj.children.push({
                                            unitCode: obj1.unitCode,
                                            unitCodefgbm: obj1.unitCodefgbm,
                                            parentUnit:obj1.parentUnit,
                                            unitName:obj1.unitName,
                                            zzjz:obj1.zzjz,
                                            selected:selected,
                                            isSelected1:isSelected1
                                        });
                                    }
                                });
                            }
                        });
                    //如果有下级时加个'正在加载...'
                    Utils.walkTree(vm.listUnitTree, function (obj) {
                        if(obj.parentUnit==vm.node.unitCode){
                            obj.children=[]
                            Utils.walkTree(vm.listUnitTree1, function (obj1) {
                                if(obj.unitCode==obj1.parentUnit&&obj1.leaf=='3'){
                                    obj.children.push({
                                        unitCode: obj1.unitCode,
                                        unitCodefgbm: obj1.unitCodefgbm,
                                        parentUnit:obj1.parentUnit,
                                        unitName:obj1.unitName,
                                        zzjz:obj1.zzjz
                                    });
                                }
                            });
                        }
                    });
                });
            }
        };

        vm.otherAwesomeCallback = function(node, isSelected, tree) {
            vm.node=node;
            vm.tree=tree;
        }

        vm.ok = function() {
            var newObj = [];
            //在列表中显示出来的
            Utils.walkTree(vm.listUnitTree, function(obj) {
                //前后都选中2，前选中为0，后选中为1
                if (obj.selected && obj.isSelected1&&obj.zzjz!='5' ) {
                    newObj.push({
                        unitCode: obj.unitCode,
                        unitName: obj.unitName,
                        vcDatepowerFgbmType:2
                    });
                }else if (obj.selected&&obj.zzjz!='5') {
                    newObj.push({
                        unitCode: obj.unitCode,
                        unitName: obj.unitName,
                        vcDatepowerFgbmType:0
                    });
                }else if(obj.isSelected1&&obj.zzjz!='5'){
                    newObj.push({
                        unitCode: obj.unitCode,
                        unitName: obj.unitName,
                        vcDatepowerFgbmType:1
                    });
                }
            });
            //已经选中但是在列表中没有显示出来的
            select.map(function (obj2) {
                var state1='1'
                Utils.walkTree(vm.listUnitTree, function(obj) {
                    if (obj.unitCode == obj2.unitCode&&obj.zzjz!='5') {
                        state1='2'
                    }
                });
                if(state1=='1'){
                    newObj.push({
                        unitCode: obj2.unitCode,
                        unitName: obj2.unitName,
                        vcDatepowerFgbmType:obj2.vcDatepowerFgbmType
                    });
                }
            });


            //console.log(newObj);
            $scope.closeThisDialog(newObj);
        }
    }
})();