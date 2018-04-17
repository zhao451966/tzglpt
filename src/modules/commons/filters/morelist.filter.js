(function() {
    'use strict';

    angular.module('demo.core')
        .filter('moreList', function () {
            return function (m, isMore) {
                if(m && m.length){
                    return isMore ? m : [m[0]];
                }else{
                    return m;
                }

            };
        })
})();
