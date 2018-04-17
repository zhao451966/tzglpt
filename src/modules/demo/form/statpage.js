(function() {
    'use strict';

    angular.module('demo.sample')
        .controller('StatpageController', StatpageController);

    /* @ngInject */
    function StatpageController($scope,$state,toastr,$stateParams,demoServ) {
        var vm = this;

        var queryName='STAFF_WORKLOAD';
        //var getQueryParms=function(){
        //
        //    console.log(); return;
        //
        //    var queryForm=$("#queryForm")[0].elements;
        //    var map={};
        //    for(var i=0;i<queryForm.length;i++){
        //        var key=queryForm[i].id;
        //        var value=queryForm[i].value;
        //        if(""!=key&&key!=null)
        //            map[key]=value;
        //    }
        //    return map;
        //}

        var myDate = new Date();
        //$scope.queryParams={year:myDate.getFullYear(),month:myDate.getMonth()+1,name:''};
        $scope.queryByParam=function(){
            demoServ.one(queryName).customPOST(null,'',vm.filter).then(function(data){
                $scope.data1=data;
                $scope.tableHead=data.tablePanel.thead;
                $scope.tableBody=data.tablePanel.tbody;
                $scope.conditions=data.conditions;
            })
        }
        $scope.queryByParam();
    }
})();