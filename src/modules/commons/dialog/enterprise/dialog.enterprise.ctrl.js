(function() {
    'use strict';

    angular.module('demo.core')
        .controller('DialogEnterpriseController', DialogEnterpriseController);

    /* @ngInject */
    function DialogEnterpriseController($scope) {
        var vm = this;

        //企业List
        vm.enteripriseList = [
            {xydm:'913200007888658698',gpdm:'6008763',qymc:'中孚实业',qylx:'实业',frdb:'张三',zczb:'400,216',zgb:'9,025,000',clrq:'2011-12-30',djzt:'正常',zs:'北京市朝阳区中华大街215号'},
            {xydm:'090801893275846278',gpdm:'6002123',qymc:'润和股份',qylx:'股份制',frdb:'李泉',zczb:'9,740,131',zgb:'301,042',clrq:'2002-01-31',djzt:'正常',zs:'南京市雨花台区软件大道188号'},
            {xydm:'',gpdm:'3009808',qymc:'美国航空',qylx:'股份制',frdb:'Jams.Dogws',zczb:'824,300',zgb:'9,860,100',clrq:'2005-04-27',djzt:'正常',zs:'Address 3900 West Century Boulevard Inglewood, CA 90303'},
            {xydm:'133464332289289031',gpdm:'6008707',qymc:'中航科技',qylx:'股份制',frdb:'赵晓',zczb:'430,750',zgb:'9,251,440',clrq:'2009-12-15',djzt:'正常',zs:'上海市南京路89号'}
        ];
        
        vm.query= function(){
        	
        };

        vm.ok = function() {
            console.log($scope.$$selectedRows);
            if ($scope.$$selectedRows.length) {
                $scope.closeThisDialog($scope.$$selectedRows[0]);
            }
        }
    }
})();