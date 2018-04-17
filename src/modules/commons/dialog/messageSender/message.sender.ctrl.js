(function() {
    'use strict';

    angular.module('demo.core')
        .controller('DialogMessageSenderController', DialogMessageSenderController);

    /* @ngInject */
    function DialogMessageSenderController($scope,$timeout, Restangular,messagecode,Confirm,
    		DialogProjectDingGroup,DialogUser,DialogUserEmial,DialogUnit) {
    	
    	 var handler;
    	 var vm = this;
    	 vm.item={};
    	 angular.extend(vm.item,$scope.ngDialogData);
    	 vm.item.sendType='1';//默认及时发送
 
       //从用户中选取 Email
         vm.item.selEmail=[];
         vm.searchEmail=function(){
        	 var selected = '';
          	var option ={
          			"selectionMode":"multiple"
          	};
          	if(vm.item.selEmail.length > 0){
          		selected = new Array();
          		selected = vm.item.selEmail.map(function(obj){
              		return obj.userCode;
              	});
          	}
          	DialogUserEmial(selected,option).closePromise
                  .then(function(data) {
                      if (angular.isObject(data.value)) {
                          vm.item.selEmail = data.value.map(function(obj) {
                              return {
                                  userCode: obj.userCode,
                                  userName: obj.userName,
                                  regEmail: obj.regEmail
                              }
                          });
                      }
                  });
         };
         
         vm.item.selusers=[];
         // 选择用户（多选）
         vm.queryUser = function() {
         	var selected = '';
         	var option ={
         			"selectionMode":"multiple"
         	};
         	if(vm.item.selusers.length > 0){
         		selected = new Array();
         		selected = vm.item.selusers.map(function(obj){
             		return obj.userCode;
             	});
         	}
             DialogUser(selected,option).closePromise
                 .then(function(data) {
                     if (angular.isObject(data.value)) {
                         vm.item.selusers = data.value.map(function(obj) {
                             return {
                                 userCode: obj.userCode,
                                 userName: obj.userName
                             }
                         });
                     }
                 });
         };

         // 部门（多选）
         vm.item.selunits=[];
         vm.queryUnit = function() {
         	var selected = '';
         	var option ={
         			"selectionMode":"multiple"
         	};
         	if(vm.item.selunits.length > 0){
         		selected = new Array();
         		selected = vm.item.selunits.map(function(obj){
             		return obj.unitCode;
             	});
         	}
             DialogUnit(selected,option).closePromise
                 .then(function(data) {
                     if (angular.isObject(data.value)) {
                         vm.item.selunits = data.value.map(function(obj) {
                             return {
                                 unitCode: obj.unitCode,
                                 unitName: obj.unitName
                             }
                         });
                     }
                 });
         };
         //项目多选，从活动的项目中 提取钉钉群
         vm.item.dinggroups =[];
         vm.queryProjects = function(){
         	var selected = '';
         	var option ={
         			"selectionMode":"multiple"
         	};
         	if(vm.item.dinggroups.length > 0){
         		selected = new Array();
         		selected = vm.item.dinggroups.map(function(obj){
             		return obj.vcProId;
             	});
         	}
         	DialogProjectDingGroup(selected,option).closePromise
             .then(function(data) {
                 if (angular.isObject(data.value)) {
                 	 vm.item.dinggroups = data.value.map(function(obj) {
                          return {
                         	 projectName:obj.vcProName,
                              vcProId:obj.vcProId,
                              dingTalkId:obj.dingTalkId
                          }
                      });
                 }
             });
         };
         //确认发送
         vm.ok=function(){
        	 if(	 vm.item.selEmail.length==0 &&
        			 vm.item.selusers.length==0 &&
        			 vm.item.selunits.length==0 &&
        			 vm.item.dinggroups.length==0){
        		 Confirm('没有选择消息接受对象!', {title: '提示'})
        		 .then(function(){
        			 
        		 });
        		 return ;
        	 }
        	 //发送消息
        	 Restangular
        	 .all('messageSender/innermsg/send')
        	 .customPOST(vm.item)
        	 .then(function(data){
    			 Confirm(data, {title: '提示'});
    			 $scope.closeThisDialog();
        	 });
         };
         
    }
})();