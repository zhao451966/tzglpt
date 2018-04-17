(function() {
    'use strict';

    angular.module('fosun.messageConfig')
            .controller('messageConfigController', messageConfigController);

    /* @ngInject */
    function messageConfigController($scope, Restangular,ngDialog) {

        var vm = this;
        // 查询列表
        vm.query = function() {
        	Restangular.all('messageCenter/sysmessageconf')
        	.getList($scope.$$params)
            .then(function(data) {
                vm.items = data;
            });
        };
        //启用、停用
        vm.setStatus=function(item){
        	item.upStatus="upStatus";
        	//保存更新
	       	 Restangular.all('messageCenter/sysmessageconf')
	   		 .post(item)
             .then(function(data) {
            	 vm.query();
             });
        };
        //编辑
        vm.edit = function(item) {
            ngDialog.open({
                template: 'modules/commons/dialog/messageConfig/message.config.html',
                controller: 'DialogMessageConfigController as vm',
                className: 'ngdialog-theme-default ngdialog-md',
                resolve: {
                    item: function() {
                        return item;
                    }
                }
            }).closePromise.then(function(data) {
            	vm.query();
            });
        };
    }
})();