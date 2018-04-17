(function() {
    'use strict';

    angular.module('demo.sample')
        .factory('demoServ', PileSystemPushAPI);

    /* @ngInject */
    function PileSystemPushAPI(RootRestangular) {
        return RootRestangular.service('stat/service/stat/twodimenform');
    }
})();