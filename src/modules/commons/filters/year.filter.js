(function() {
    'use strict';

    /**
     * 年
     */
    angular.module('demo.core')
        .filter('year', function () {
            return function (m) {
                if (!m) return m;

                if(m.length>4)
                    return m.substring(0,4);
                else
                    return "";
            };
        })
})();
