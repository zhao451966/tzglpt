(function() {
    'use strict';

    angular.module('demo.login')
        .controller('enterpriseAssociateUserController', enterpriseAssociateUserController);

    /* @ngInject */
    function enterpriseAssociateUserController($state, Confirm,toastr, Authenticate, LoginAPI, CacheAPI, SystemRestangular,Restangular,ngDialog,$translate,$stateParams,DialogUserinfoOrg) {
        var vm = this;
        vm.item;
        vm.user={};
        vm.str={};
        vm.UserinfoRegister={};
        vm.display=0;
        if($stateParams.LoginName!=undefined){
        	vm.str.username=$stateParams.LoginName;
        }
        if($stateParams.password!=undefined){
        	vm.str.password=$stateParams.password;
        }
        if(vm.str.username!=undefined){
            if($stateParams.vcCompanyName!=undefined){
            	vm.str.vcCompanyName=$stateParams.vcCompanyName;
            }
            if($stateParams.vcCreditCode!=undefined){
            	vm.str.vcCreditCode=$stateParams.vcCreditCode;
            }
            Restangular.all('batchPlatformInvitation/decodeType').customPUT(vm.str)
            .then(function(data) {
            	vm.user.username=data.username;
            	vm.UserinfoRegister.vcLoginName=data.username;
            	vm.user.password=data.password;
            	vm.UserinfoRegister.vcCompanyName=data.vcCompanyName;
            	vm.UserinfoRegister.vcCreditCode=data.vcCreditCode;
	            Authenticate.clearUser();
		        var token;
		        SystemRestangular.oneUrl('mainframe/login/csrf')
		        .get()
		        .then(function(data) {
		            token = data.token;
		            Authenticate.setCSRF(token);
		        });
		        Restangular.all('xplogin').one('login?accessToken='+token).customPUT(vm.user)
		        // 跳转
		        .then(function(data) {
		            if (data.accessToken) {
		            	if(data.userInfo.isValid=="F"){
	                		window.location.href = getViewContextPath()+'#/login';
	                		return;
	                	}
		               Authenticate.checkLogin();
		               Restangular.all('userinfoorg/userinfoOrgUseCodeVcCompanyName').one(vm.UserinfoRegister.vcLoginName).one(vm.UserinfoRegister.vcCompanyName).get()
		               .then(function(data) {
		               	if(angular.isObject(data)&&data.length==1){
		               		//'可展期天数：'+data.standstillDay+'，下次停滞日期：'+data.standstillDate
		   		            Confirm($translate.instant('账号和企业"'+vm.UserinfoRegister.vcCompanyName+'"已经关联请直接登录',{
		   		            }),{
		   		                title:$translate.instant('企业信息披露提示'),
		   		                okText:'登录',
		   		                cancelText:'关闭',
		   		            }).then(function() {
		   		    	       vm.xplogin(vm.UserinfoRegister);
		   		            },function(){
		   		            	window.location.href = getViewContextPath()+'#/login';
		                    })
	
		               	}else {
		               		//'可展期天数：'+data.standstillDay+'，下次停滞日期：'+data.standstillDate
		   		            Confirm($translate.instant('您是否同意为"'+vm.UserinfoRegister.vcCompanyName+'"企业进行企业披露？',{
		   		            }),{
		   		                title:$translate.instant('企业信息披露提示'),
		   		                okText:'同意',
		   		                cancelText:'关闭',
		   		            }).then(function() {
		   		            	Restangular.all('userinfoRegister/userinforegister/enterpriseAssociateUser').customPUT(vm.UserinfoRegister)
		   		    	        .then(function(data) {
		   		    	        		 vm.xplogin(vm.UserinfoRegister);
		   		    	        });
		   		            },function(){
		   		            	window.location.href = getViewContextPath()+'#/login';
		                    })
		               	}
		               }); 
		            }else{
		                var type=data.message.substring(0,4);
		                if('login error:Bad credentials!'==data.message){
		                   // toastr.error($translate.instant('N005106'));//"您输入的密码错误!"
		                    window.location.href = getViewContextPath()+'#/login';
		                }else {
		                   // toastr.error($translate.instant('N005107'));//"您输入的用户名不存在!"
		                    window.location.href = getViewContextPath()+'#/login';
		                }
		            }
		        })
            });    
        }
        
        vm.xplogin = function(UserinfoRegister) {
        	//当前登录用户
            vm.CurrentUser = Authenticate.getUser();
            vm.userType=vm.CurrentUser.userType;
     		Restangular.all('userinfoorg/userinfoOrgUseCode').one(vm.CurrentUser.userCode).get()
             .then(function(data1) {
             	vm.userinfoOrgList = data1;
             	if(vm.userinfoOrgList.length==1){
             		//把企业ID放到后台;
             		Restangular.one('userinfoorg/vcOrgCodeSession/'+vm.userinfoOrgList[0].vcOrgCode).customPUT().then(function(data) {
             			Authenticate.reload();
             		});
             		vm.CurrentUser = Authenticate.getUser();
            		vm.CurrentUser.vcOrgcode=vm.userinfoOrgList[0].vcOrgCode;
            		vm.CurrentUser.vcCompanyName=vm.userinfoOrgList[0].vcCompanyName;
                    Authenticate.setUser(vm.CurrentUser);
             		//0:平台管理员;1:基金管理员;2:基金用户;3:企业用户;
             		if(vm.userType=='3'){
                			//跳转系统页面
                            window.location.href = getViewContextPath()+'#/filelist';
               		}else if(vm.userType=='2'||vm.userType=='1'){
               		    //基金登录用户登录成功页面
               		    window.location.href = getViewContextPath()+'#/filefundlist';
               		}
             	}else if (vm.userinfoOrgList.length>1){
             		var selected = '';
                     var option ={
                         "selectionMode":"single"
                     };
                     DialogUserinfoOrg(selected , option).closePromise
                         .then(function(data1) {
                             if (data1.value&&data1.value.vcOrgCode) {
                         		vm.CurrentUser = Authenticate.getUser();
                         		vm.CurrentUser.vcOrgcode=data1.value.vcOrgCode;
                         		vm.CurrentUser.vcCompanyName=data1.value.vcCompanyName;
                                 Authenticate.setUser(vm.CurrentUser);
                                 Restangular.one('userinfoorg/vcOrgCodeSession/'+data1.value.vcOrgCode).customPUT().then(function(data) {
                                	 Authenticate.reload();
                                 });
                                 //0:平台管理员;1:基金管理员;2:基金用户;3:企业用户;
                         		if(vm.userType=='3'){
 	                    			//跳转系统页面
 	                                window.location.href = getViewContextPath()+'#/filelist';
                           		}else if(vm.userType=='2'||vm.userType=='1'){
                           		    //基金登录用户登录成功页面
                           		    window.location.href = getViewContextPath()+'#/filefundlist';
                           		}
                             }else{
                            	 window.location.href = getViewContextPath()+'#/login';
                             }
                      });
             	}else{
             		 toastr.error("该用户没有对应企业信息!");
             		 window.location.href = getViewContextPath()+'#/login';
             	}
             });
		}
        
    }
})();
