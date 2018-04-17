(function() {
    'use strict';

    angular.module('demo.login')
        .controller('validateRegEmailController', validateRegEmailController);

    /* @ngInject */
    function validateRegEmailController($state, toastr, Authenticate, LoginAPI, CacheAPI, SystemRestangular,Restangular,ngDialog,$translate) {
        var vm = this;
        vm.item;
        vm.UserinfoRegister={};
        var b = new Base64();  
        //验证邮箱
        vm.backPasswdYZ = function(UserinfoRegister) {
        	if(!vm.UserinfoRegister.vcLoginName){
                toastr.error($translate.instant('N004570'));//"请输入账号！"
                return;
            }
        	Restangular.one('userinfoRegister/userinforegister/getLoginName').customPUT(vm.UserinfoRegister)
            .then(function(data) {
                if (angular.isObject(data)) {
                	//跳转验证机构名称和统一社会信用代码
                    window.location.href = getViewContextPath()+'#/validateCompanyCredit/'+b.encode(vm.UserinfoRegister.vcLoginName)+'/'+b.encode(data.regCellPhone);
                	//window.location.href = getViewContextPath()+'#/validateCompanyCredit/'+b.encode(vm.UserinfoRegister.vcLoginName)+'/'+b.encode(data.regCellPhone);
                }else{
                	toastr.error($translate.instant('N005111'));//"您输入的邮箱不存在!"
                    return;
                }
            });
        	
        };
    }
})();
