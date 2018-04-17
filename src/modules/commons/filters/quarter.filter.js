(function() {
    'use strict';
    /**
     * 季度
     */
    angular.module('demo.core')
        .filter('quarter', function () {
            return function (m) {
                if (!m) return m;

                if(m.length>=7)
                    m= m.substring(5,7);

                if(m<=4){

                }
                else{
                    if(m.indexOf("0")==0)
                        m=""+(parseInt((parseInt(m.replace("0", ""))-1)/3)+1);
                    else
                        m=""+(parseInt((parseInt(m)-1)/3)+1);
                }
                return m;
            };
        })
})();
