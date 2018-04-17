(function() {
    'use strict';

    /**
     * hidden指令
     *
     * 作用：
     *      有一些通过 ng-show 或者 ng-hide 控制隐藏的元素，可能在页面初始化的时候因为
     *      延时等原因在页面上一闪而过。
     *      为了解决这个问题，使用了html5的属性hidden确保元素一开始是隐藏的，在watch对应
     *      值来控制元素是否显示
     *
     * 使用方法：
     *      before: <div ng-show="isShow">Hello hidden</div>
     *
     *      after: <div hidden fx-hidden="!isShow">Hello hidden</div>
     *
     */
    angular.module('demo.core')
        .directive('fxHidden', Hidden);

    /* @ngInject */
    function Hidden() {
        return {
            restrict: 'EA',
            link: function(scope, element, attrs) {

                scope.$watch(function() {
                    return scope.$eval(attrs.fxHidden);
                }, function(isHidden) {

                    isHidden = isHidden === false ? false : true;

                    element.prop('hidden', isHidden)
                })

            }
        };
    }
})();