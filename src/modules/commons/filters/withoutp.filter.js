/**
 * Created by xie_bin on 2016/5/5.
 */
(function() {
    'use strict';

    angular.module('demo.core')
        .filter('withoutp', function () {
            return function (wp) {

            wp+="";
             wp = wp.replace(/<p[^>]*>/gi,'').replace(/<\/p>/gi,'<br />');
             return wp;

            };
        })
})();