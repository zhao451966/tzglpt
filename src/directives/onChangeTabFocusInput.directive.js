(function() {
    'use strict';

    angular.module('demo.core')
        .directive('onChangeTabFocusInput', onChangeTabFocusInputDirective);

    /* @ngInject */
    function onChangeTabFocusInputDirective() {
        return {
            restrict: 'A',
            link: function(scope, element, attributes) {
                if(attributes.onChangeTabFocusInput){
                    scope.$watch(attributes.onChangeTabFocusInput,function(g){
                        if(g){
                            var _p= $("#"+attributes.onChangeTabFocusForm+" [name='"+ g.substring(0,g.lastIndexOf("_"))+"']")[0];
                            setTimeout(function() {
                                if(_p){
                                    _p.focus();
                                }
                                console.log('onChangeTabFocusInput');
                            },100);
                        }
                    },true)
                }
            }
        };
    }
})();