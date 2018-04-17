(function() {
    'use strict';

    angular.module('demo.login')
        .controller('xpLoginController', xpLoginController);

    /* @ngInject */
    function xpLoginController($scope,$state, toastr, Authenticate, LoginAPI, CacheAPI, SystemRestangular,Restangular,ngDialog,$translate,DialogUserinfoOrg) {
        var vm = this;

        Authenticate.clearUser();
        vm.user;
        var token;
        vm.vcStatus;
        vm.view=0;
        SystemRestangular.oneUrl('mainframe/login/csrf')
        .get()
        .then(function(data) {
            token = data.token;
            Authenticate.setCSRF(token);
        });

	    Restangular.all('common').one('getMutilLanCofig').get()
	        // 跳转
	        .then(function(data) {
	
	        })
	
	    vm.getUser = function() {
	        CacheAPI.one('userdetails')
	            .customGET();
	    };
	    
        //验证邮箱
        vm.backPasswd = function() {
        	window.location.href = getViewContextPath()+'#/validateRegEmail';
        };

        vm.login = function() {
            if(!vm.user){
                toastr.error($translate.instant('N005103'));//"请输入用户名，密码！"
                return;
            }
            if(!vm.user.username){
                toastr.error($translate.instant('N005104'));//"请输入用户名！"
                return;
            }
            if(!vm.user.password){
                toastr.error($translate.instant('N005105'));//"请输入密码！"
                return;
            }
            // var b = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,}$/g;
            // if(!b.test(vm.user.password)){
            //    toastr.error("密码至少8位，必须是数字和字母组合！");
            //    return;
            //           }
            Restangular.all('xplogin').one('login?accessToken='+token).customPUT(vm.user)
                // 跳转
                .then(function(data) {
                    if (data.accessToken) {
                      vm.vcStatus=data.vcStatus;
                      return Authenticate.checkLogin();
                    }else{
                        var type=data.message.substring(0,4);
                        if('login error:Bad credentials!'==data.message){
                            toastr.error($translate.instant('N005106'));//"您输入的密码错误!"
                        }else {
                            toastr.error($translate.instant('N005107'));//"您输入的用户名不存在!"
                        }
                    }
                })

                // 跳转
                .then(function(data) {
                    if (data.userCode) {
                        //toastr.success('登录成功！');
                    	if(data.isValid=="F"){
                    		toastr.error("当前用户已停用");//"当前用户已停用"
                    		Authenticate.clearUser();
                    		return;
                    	}
						//不记录之前的URL
                        var prev = null;//$state.prev;

                        if (prev) {
                            $state.go(prev.state, prev.params);
                        }else {
                        	//0:平台管理员;1:基金管理员;2:基金用户;3:企业用户;
                        	if(data.userType=='3'){
	                    		Restangular.all('userinfoorg/userinfoOrgUseCode').one(data.userCode).get()
	                            .then(function(data1) {
	                            	vm.userinfoOrgList = data1;
	                            	if(vm.userinfoOrgList.length==1){
	                            		//把企业ID放到后台;
	                            		Restangular.one('userinfoorg/vcOrgCodeSession/'+vm.userinfoOrgList[0].vcOrgCode).customPUT().then(function(data) {
	                                        return Authenticate.reload();
	                                    }).then(function(){
											vm.CurrentUser = Authenticate.getUser();
											vm.CurrentUser.vcOrgcode=vm.userinfoOrgList[0].vcOrgCode;
											vm.CurrentUser.vcCompanyName=vm.userinfoOrgList[0].vcCompanyName;
											Authenticate.setUser(vm.CurrentUser);
											if(vm.vcStatus=='2'){
												//跳转系统页面
												window.location.href = getViewContextPath()+'#/filelist';
											}else if (vm.vcStatus=='1'){
												toastr.error("未注册!");
											}
										});
	                            	}else if (vm.userinfoOrgList.length>1){
	                            		vm.view=1;
	                            		var selected = '';
	                                    var option ={
	                                        "selectionMode":"single"
	                                    };
	                                    DialogUserinfoOrg(selected , option).closePromise
	                                        .then(function(data1) {
	                                            if (data1.value&&data1.value.vcOrgCode) {
	                                            	var userCode=data.userCode;
	                                        		vm.CurrentUser = Authenticate.getUser();
	                                        		vm.CurrentUser.vcOrgcode=data1.value.vcOrgCode;
	                                        		vm.CurrentUser.vcCompanyName=data1.value.vcCompanyName;
	                                                Authenticate.setUser(vm.CurrentUser);
	                                                Restangular.one('userinfoorg/vcOrgCodeSession/'+data1.value.vcOrgCode).customPUT().then(function(data) {
														return Authenticate.reload();
	                                                }).then(function(){
														if(vm.vcStatus=='2'){
															//跳转系统页面
															window.location.href = getViewContextPath()+'#/filelist';
														}else if (vm.vcStatus=='1'){
															toastr.error("未注册!");
														}
													});
	                                            }else{
	                                            	vm.view=0;
	                                            }
	                                     });
	                            	}else{
	                            		 toastr.error("该用户没有对应企业信息!");
	                            	}
	                            });
                        	}else if(data.userType=='2'||data.userType=='1'||data.userType=='0'){
                      		    //基金登录用户登录成功页面
                      		    window.location.href = getViewContextPath()+'#/filefundlist';
                      		}
                        }
                    }
                })
                //.catch(function(msg) {
                //    console.error(msg);
                //    toastr.error(msg);
                //});

        };

		if(!window.I18N) window.I18N="zh_CN";
		var i18n = window.I18N;
		$translate.use(i18n);
		$scope.wen2A = i18n == 'zh_CN';
		index = i18n == 'zh_CN' ? 0 : 1;

		vm.translate = function() {
			var qie = ['zh_CN', 'en_US'][++index % 2];
			$translate.use(qie);
			setCookie("i18n",qie);
			i18n= qie;
			window.I18N=i18n;
			index = i18n == 'zh_CN' ? 0 : 1;

			$scope.wen2A = i18n == 'zh_CN';
		};
		vm.translatelx = function(lx) {
			var indexlx=0;
			if('1'==lx){
				indexlx =1;
			}
			if('0'==lx){
				indexlx =0;
			}
			if(indexlx==index){
				index=indexlx;
				vm.translate();
			}
		};
    }
})();
