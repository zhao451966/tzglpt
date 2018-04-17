(function() {
    'use strict';

    angular.module('demo.core')
        .filter('docSize', function () {
            return function (m, fixed) {
                if (!m) return m;
                fixed = fixed || 2;

                // 字节流转换成KB、MB、GB
                if (m > 0 && m < 1024*1024) {
                    return (m / 1024).toFixed(fixed) + 'KB';
                }
                else if (m > 1024*1024 && m < 1024*1024*1024) {
                    return (m / 1024 / 1024).toFixed(fixed) + 'MB';
                }else if(m > 1024*1024*1024 && m < 1024*1024*1024*1024){
                    return (m / 1024 / 1024 / 1024).toFixed(fixed) + 'GB';
                }
            };
        })
})();