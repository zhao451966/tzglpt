(function() {
    'use strict';

    /**
     * 格式化货币显示
     *
     * 123123123 ==> 123,123,123.00
     * */
    angular.module('demo.core')
        .filter('comma', function () {
            return function (s) {
                s += "";

                if(/[^0-9\.]/.test(s)) return s;

                s=s.replace(/^(\d*)$/,"$1.");
                s=(s+"00").replace(/(\d*\.\d\d)\d*/,"$1");
                s=s.replace(".",",");
                var re=/(\d)(\d{3},)/;
                while(re.test(s))
                    s=s.replace(re,"$1,$2");
                s=s.replace(/,(\d\d)$/,".$1");
                return s.replace(/^\./,"0.");
            };
        })
})();