(function() {
    'use strict';

    angular.module('demo.sample')
        .controller('WorkFlowController', WorkFlowController);

    /* @ngInject */
    function WorkFlowController($scope,Restangular) {
        var vm = this;
        vm.item={"sqlsh":"1","vcXmbm":"PRO2016049927","vcBt":"项目标题","vcQryydyssysm":"已阅读","vcSfdlhbm":"0","vcLhbm":"人事行政部",
            "vcLhfqr":"u0000000","vcCsry":"u0000000","vcFwshr":"u0000000","vcLhbmdkfw":"0","vcSfsy":"0","vcWjmc":"文件1","vcYzmc":"印章1",
            "vcYyfs":"10","vcSjje":"100","vcDfdwmc":"单位名称","vcNrzy":"内容1","vcJjcd":"1","sfyx":"1","vcWorkflowId":"0001",
            "vcCjr":"u000001","vcCjsq":"2016-01-01","vcTargetId":"402808b054607c9d0154607db8860000","vcProId":"4028484853f904e10153f9aef576003d"
        }
        ;
        vm.save = function(item) {
            Restangular.all('oawork/oawork').one("createOaWork").customPOST(item)
                .then(function(data) {
                    if (angular.isObject(data)) {
                        toastr.success(data.code +','+data.message);
                    }
                });
        };
    }
})();