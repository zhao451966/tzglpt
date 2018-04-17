(function() {
    'use strict';

    angular
        .module('demo.core')
        .config(DialogConfig);

    /* @ngInject */
    function DialogConfig ($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist(
        		[
        		 '**'
        		 ]);
    }

})();
