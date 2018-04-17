(function() {
    'use strict';

    angular.module('demo.sample')
        .controller('ScController', ScController);

    /* @ngInject */
    function ScController($scope,Restangular) {
        var vm = this;
        vm.item;
        vm.save = function(item) {
            Restangular.all('oawork/oawork').post(item)
                .then(function(data) {
                    if (angular.isObject(data)) {
                        toastr.success(data.code +','+data.message);
                    }
                });
        };
    }
})();