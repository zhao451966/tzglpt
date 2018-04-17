(function() {
    'use strict';

    angular.module('demo.login')
        .controller('validateCompanyCreditController', validateCompanyCreditController);

    /* @ngInject */
    function validateCompanyCreditController($state, toastr, Authenticate, LoginAPI, CacheAPI, SystemRestangular,Restangular,ngDialog,$stateParams,$translate) {
        var vm = this;
        vm.item;
        vm.UserinfoRegister={};
        vm.url;
        var b = new Base64();
        vm.UserinfoRegister.vcLoginName=b.decode($stateParams.regEmail);
        vm.UserinfoRegister.telephone=b.decode($stateParams.regCellPhone);
	    vm.validateCompanyCredit = function(UserinfoRegister) {
	    	if(vm.UserinfoRegister.code!='1'){
                toastr.error("请获取动态密码！");//"请获取验证码！"
                return;
            }
        	if(!vm.UserinfoRegister.sjs){
                toastr.error("请输入手机动态密码！");//"请获取验证码！"
                return;
            }
	    	Restangular.one('userinfoRegister/userinforegister/validateCompanyCredit').customPUT(vm.UserinfoRegister)
	        .then(function(data) {
	            if (angular.isObject(data)) {
	            	count = 0;
	            	window.location.href =getViewContextPath()+'#/send/'+b.encode(vm.UserinfoRegister.vcLoginName);
	            }else{
	            	if(data=='1'){
	            		toastr.error("动态密码失效，请重新获取验证码！");//"动态密码失效，请重新获取验证码！"
	                    return;
	            	}else if (data=='2'){
	            		toastr.error("动态密码输入错误！");//"动态密码输入错误!"
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
			vm.UserinfoRegister.vcRemark='找回密码';
			Restangular.all('userinfoRegister/userinforegister/sendsms').customPUT(vm.UserinfoRegister)
	        .then(function(data) {
	        	if (data.code=='1') {
	        		toastr.success("手机动态密码发送成功");
	        		vm.UserinfoRegister.code=data.code;
	        		vm.GetNumber();
					$("#username").focus();
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
    }
})();
