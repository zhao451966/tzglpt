(function() {
    'use strict';
    /**
     * 季度
     */
    angular.module('demo.core')
        .filter('month', function () {
            return function (m) {
                if (!m) return m;

                if(m.length>=7)
                    m= m.substring(5,7);

                return m;
            };
        })
})();
