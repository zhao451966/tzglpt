(function() {
    'use strict';

    angular.module('demo.core')
        .controller('UserIUnitTreeExchangeController', UserIUnitTreeExchangeController);

    /* @ngInject */
    function UserIUnitTreeExchangeController($scope,DeptManageInterfaceAPI,Utils,selected) {
        var vm = this;
        var select = selected;
        vm.queryTree = function() {
            //树形展示
            DeptManageInterfaceAPI.one('listIUnitTree').one(selected.USERCODE).get()
                .then(function(data) {
                    if (!data || !data.length) {
                        vm.listIUnitTree = '';
                        return;
                    };
                    vm.listIUnitTree = data.plain();
                    Utils.walkTree(vm.listIUnitTree, function(obj) {
                        if(obj.VCID==select.VCID){
                            obj.selected = "selected";
                        }
                    });
                });

        }
        vm.queryTree();

        $scope.$watch( 'DEPTCODE.currentNode', function( newObj, oldObj ) {
            if(newObj.type!='1'){
                vm.newObj=newObj;
                Utils.walkTree(vm.listIUnitTree, function(obj) {
                        if(newObj.VCID!=obj.VCID) {
                            obj.selected = false;
                        }
                });
            }else{
                if(vm.listIUnitTree){
                    Utils.walkTree(vm.listIUnitTree, function(obj) {
                        if(oldObj.VCID==obj.VCID){
                            obj.selected = "selected";
                        }
                    });
                }
            }
            //if(!oldObj ){
            //	if(vm.listIUnitTree){
	         //       Utils.walkTree(vm.listIUnitTree, function(obj) {
	         //           if(obj.VCID==select.VCID&&newObj.VCID!=select.VCID&&newObj.type!='1'){
	         //               obj.selected = false;
	         //           }
	         //       });
            //	}
            //}
        }, false);
        $scope.printParent = function() {
            Utils.walkTree(vm.listIUnitTree, function(obj) {
                Utils.walkTree(vm.listIUnitTree, function(obj1) {
                    if(obj.VCID==obj1.VCID&&obj.type=='1'){
                        obj.selected = false;
                    }
                });
            });
        };

        vm.ok = function() {
            $scope.closeThisDialog(vm.newObj);
        }
    }
})();