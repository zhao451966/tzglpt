(function(){
    'use strict';

    angular
        .module('demo.login')
        .controller('changePhoneController',changePhoneController);

    /* @ngInject */
    function changePhoneController($scope,item,Restangular,toastr,$translate,Authenticate,$state){
        var vm = this;
        vm.item={};
        vm.item.regCellPhone=item.regCellPhone;
        vm.item.loginName=item.loginName;

        var count = 0;
        //随机数
        vm.sendsms = function() {
        	count = 60;
            var telephone = vm.item.newRegCellPhone;
            if(!(/^1[34578]\d{9}$/.test(telephone))){
                toastr.error("手机号码有误，请重填");
                return false;
            }
            Restangular.all('userinfo/sendsms').customPUT(vm.item)
                .then(function(data) {
                    if (data.code=='1') {
                    	toastr.success("手机动态密码发送成功");
                        vm.item.code=data.code;
                        vm.GetNumber();
                        $('#phoneCode').focus();
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
        }


        //更新用户密码
        vm.save = function() {
            var c = /^1[34578]\d{9}$/;
            if(!c.test(vm.item.newRegCellPhone)){
                toastr.error("新手机号码格式错误，请输入正确的手机号码!");
                return;
            }
            if (vm.item.newRegCellPhone==vm.item.regCellPhone)
            {
                toastr.error("新手机号码与原手机号码一致,请重新输入新手机号码!");
                return
            }
            if(vm.item.code!='1'){
                toastr.error("请获取动态密码！");
                return;
            }
            Restangular.all('userinfo').one('changePhone')
                .customPUT(vm.item)
                .then(function(data) {
                    if(data=='1'){
                    	count = 0;
                        toastr.success("手机号码修改成功");
                        Authenticate.reload();
                        $scope.closeThisDialog(data);
                        $state.reload();
                    }
                    else if(data=='2'){
                        toastr.error("新手机号码格式错误，请输入正确的手机号码!");
                    }
                    else if(data=='3'){
                        toastr.error("新手机号码与原手机号码一致,请重新输入新手机号码!");
                    }
                    else if(data=='4'){
                        toastr.error("验证码失效，请重新获取验证码！");
                    }
                    else if(data=='5'){
                        toastr.error("验证码错误！");
                    }
                    else if(data=='-1'){
                        toastr.error($translate.instant('N004566'));//N004566=参数错误！
                        $scope.closeThisDialog(data);
                    }
                });
        };
    }
})();