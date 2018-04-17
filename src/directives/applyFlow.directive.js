(function() {
    'use strict';

    angular
        .module('demo.core')
        .directive('applyFlow', applyFlow);
    
    var template =  
    	'<li ng-show="show_commit"><a ng-click="openFlow(\'commit\')">提交</a></li>'
	 +'	<li ng-show="show_revoke"><a ng-click="openFlow(\'revoke\')">撤销</a></li>'
	 +'	<li ng-show="show_review"><a ng-click="openFlow(\'review\')">复核</a></li>';
    /* @ngInject 
     * 流程 按钮指令
     * */
    function applyFlow($document, $compile,DialogApplyFlow) {
    	return {
    	    restrict: "A",
    	    scope: {
    	      businessdesc:"=",	//业务名称
    	      state:"=",		//当前单据状态值
    	      businessid:"=",	//主键id值
    	      processid:"=",	//流程配置id
		 	  projectid:"=",	//项目id
		 	  pageurl:"=",		//业务单据url
		 	  callback:"&"
    	    },
    	    template:
    	    	 '<div class="btn-group">'
	    		 +'<a class="btn dropdown-toggle btn-mini" data-toggle="dropdown">'
	    		 +'    <span class="caret"></span>'
	    		 +'</a>'
	    		 +'<ul class="dropdown-menu pull-right" ng-transclude>'

	    		 +' </ul>'
	    		 +'</div>',
    	    replace: true, 
    	    transclude: true,
    	    controller: [ "$scope", function ($scope) {}], 
    	    link: function (scope, element, attrs, controller) {
    	    	//将template 加入进来
    	    	element.find('ul').append($compile(template)(scope));
    	    	//显示，隐藏
    	    	scope.show_commit=false;
    	    	scope.show_revoke=false;
    	    	scope.show_review=false;
    	    	if(scope.state=='1' || scope.state=='3' || scope.state=='6'){
    	    		//新建状态 控制
    	    		scope.show_commit=true;
    	    	}else if(scope.state=='2'){
    	    		//提交状态 控制
    	    		scope.show_revoke=true;
    	    		//根据权限控制...?
    	    		scope.show_review=true;
    	    	}
    	    	//操作
    	    	scope.openFlow=function(type){
  		 		  	if(!scope.businessdesc){
  		 			  	alert('未知参数：businessdesc！');
  		 				return ;
  		 		  	}
    	    		if(!scope.state){
    	    			alert('未知参数：state！');
	            		return ;
    	    		}
    	    		if(!scope.businessid){
    	    			alert('未知参数：businessid！');
	            		return ;
    	    		}
    	    		if(!scope.processid){
    	    			alert('未知参数：processId！');
	            		return ;
    	    		}
    	    		if(!scope.projectid){
    	    			alert('未知参数：projectId！');
	            		return ;
    	    		}
    	    		if(!scope.pageurl){
    	    			alert('未知参数：pageurl！');
	            		return ;
    	    		}
	    	    	var option={};
	            	if(type=='commit'){
	            		option={
	            				flowType:'commit',
	            				title:scope.businessdesc+'流程提交',
	            				okText:'提交'
	            		};
	            	}else if(type=='revoke'){
	            		option={
	            				flowType: 'revoke',
	            				title:scope.businessdesc+'流程撤销',
	            				okText:'撤销'
	            		};
	            	}else if(type=='review'){
	            		option={
	            				flowType:'review',
	            				title:scope.businessdesc+'流程复核',
	            				okText:'复核'
	            		};
	            	}else{
	            		alert('参数不详！');
	            		return ;
	            	}
	            	var param = angular.extend({}, scope, option);
	            	//跳转到流程弹窗
	            	DialogApplyFlow(param)
	                    .closePromise
	                    .then(function(data) {
	                    	var msg='';
	                    	if(data && data.value && data.value.flowValidMsg){
	                    		if(data.value.flowValidMsg != 'SUCCESS' && data.value.flowValidMsg != 'OK'){
	                    			alert(data.value.flowValidMsg);
	                    		}
	                    		msg = data.value.flowValidMsg ;
	                    	}
	                    	//回调函数
	                    	scope.callback(msg);
	                    });
    	    	};
    	    }
    	  }
    }
})();