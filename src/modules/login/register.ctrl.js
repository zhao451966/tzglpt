(function() {
    'use strict';

    angular.module('demo.login')
        .controller('registerController', registerController);

    /* @ngInject */
    function registerController($state, toastr, Authenticate, LoginAPI, Confirm,CacheAPI, SystemRestangular,Restangular,ngDialog,$translate,$stateParams,DialogUserinfoOrg) {
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
		        Restangular.all('xplogin').one('loginNotPwd?accessToken='+token).customPUT(vm.user)
		        // 跳转
		        .then(function(data) {
		            if (data.accessToken) {
		              Authenticate.checkLogin();
		              vm.view=0;
		              if(data.vcStatus=='2'){
		            	  vm.view=1;
		            	  Confirm($translate.instant('用户已经注册请直接登录',{
		   		            }),{
		   		                title:$translate.instant('登录'),
		   		                okText:'登录',
		   		                cancelText:'关闭',
		   		            }).then(function() {
		   		    	       vm.xplogin(vm.UserinfoRegister);
		   		            },function(){
		   		            	window.location.href = getViewContextPath()+'#/login';
		                    })
		              }
		              
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
        vm.submit = function(UserinfoRegister) {
        	if(!vm.UserinfoRegister.vcCompanyName){
                toastr.error("机构名称不能空!");//"请输入机构名称！"
                return;
            }
            if(!vm.UserinfoRegister.vcSecretPassword){
                toastr.error($translate.instant('N005125'));//"请输入新密码！"
                return;
            }
            var c = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/g;
            if(!c.test(vm.UserinfoRegister.vcSecretPassword)){
                toastr.error($translate.instant('N005130'));//"新密码至少6位，必须是数字和字母组合！"
                return;
            }
            if(!vm.UserinfoRegister.qdvcSecretPassword){
                toastr.error($translate.instant('N005126'));//"请输入确认新密码！"
                return;
            }
        	if (vm.UserinfoRegister.vcSecretPassword!=vm.UserinfoRegister.qdvcSecretPassword)
            {
                toastr.error($translate.instant('N005127'));//"新密码不一致！"
                return
            }
        	var telephone = vm.UserinfoRegister.telephone;
        	if(!telephone){
                toastr.error("请输入手机号码");
                return;
            }
		    if(!(/^1[34578]\d{9}$/.test(telephone))){ 
		        toastr.error("手机号码有误，请重填");
		        return false; 
		    }
        	if(vm.UserinfoRegister.code!='1'){
                toastr.error("请获取动态密码！");//"请获取验证码！"
                return;
            }
        	if(!vm.UserinfoRegister.sjs){
                toastr.error("请输入手机动态密码！");//"请获取验证码！"
                return;
            }
            Restangular.all('userinfoRegister/userinforegister')
                .post(UserinfoRegister)
                .then(function(data) {
    	            if (angular.isObject(data)) {
    	            	count = 0;
    	            	vm.xplogin(vm.UserinfoRegister);
    	            }else{
    	            	if(data=='1'){
    	            		toastr.error("动态密码失效，请重新获取验证码！");//"动态密码失效，请重新获取验证码！"
		                    return;
    	            	}else if (data=='2'){
    	            		toastr.error("动态密码输入错误！");//"动态密码输入错误!"
		                    return;
    	            	}else {
		                	toastr.error($translate.instant('N005128'));//"注册失败!"
		                    return;
    	            	}
                    }
                });
        };
        
        
        var count = 0;
        //随机数
		vm.sendsms = function() {
			count = 60;
			var telephone = vm.UserinfoRegister.telephone;
			vm.UserinfoRegister.vcRemark='注册';
		    if(!(/^1[34578]\d{9}$/.test(telephone))){ 
		        toastr.error("手机号码有误，请重填");
		        return false; 
		    } 
			Restangular.all('userinfoRegister/userinforegister/sendsms').customPUT(vm.UserinfoRegister)
	        .then(function(data) {
	        	if (data.code=='1') {
	        		toastr.success("手机动态密码发送成功");
	        		vm.UserinfoRegister.code=data.code;
	        		vm.GetNumber();
					$('#sjs').focus();
	        	}else{
	        		toastr.error("手机动态密码发送失败");
	        	}
	        });
			
		};
		vm.GetNumber = function() {
			$("#signIn1").attr("disabled", "disabled");
			$("#signIn1").val(count + "秒之后点击获取")
			count--;
			if (count > 0) {
				setTimeout(vm.GetNumber, 1000);
			} else {
				$("#signIn1").val("点击获取动态密码");
				$("#signIn1").removeAttr("disabled");
				count = 60;
			}
		};
		
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
            		vm.CurrentUser.regCellPhone=vm.UserinfoRegister.telephone!=undefined?vm.UserinfoRegister.telephone:vm.CurrentUser.regCellPhone;
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
                         		vm.CurrentUser.regCellPhone=vm.UserinfoRegister.telephone!=undefined?vm.UserinfoRegister.telephone:vm.CurrentUser.regCellPhone;
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
