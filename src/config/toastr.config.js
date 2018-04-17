(function() {
    'use strict';

    angular.module('demo.core')
        .config(ToastrConfig);

    /* @ngInject */
    function ToastrConfig(toastrConfig) {
        /**
         * 让这个表达返回true,就可以实现后一个提示直接冲掉前一个提示
         *  options.autoDismiss && options.maxOpened && toasts.length > options.maxOpened;
         */
        angular.extend(toastrConfig, {
                //timeOut: 6000,
                autoDismiss:true,
                maxOpened: 1,
                positionClass:'toast-bottom-left'// 'toast-top-full-width'
            });
    }
})();