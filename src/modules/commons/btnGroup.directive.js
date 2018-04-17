(function() {
    'use strict';

    angular.module('demo.core')
        .directive('fxBtnGroup', Directive)
        .directive('btnGroup', ['AutoscrollService', function(AutoscrollService) {
            return {
                restrict: 'C',
                link: function(scope, element) {
                    // console.log(element.closest('td').length);

                    // 必须是列表中的
                    if (!element.closest('td').length) return;

                    element.find('.btn').on('click', function() {
                        var ele = $(this).parent(),
                            ul = ele.find('.dropdown-menu'),
                            position = ele.offset(),
                            top = position.top,
                            eleHeight = ele.height(),
                            ulHeight = ul.find('li').length * 40 + 14,
                            bodyHeight = $('body').height(),
                            panel = ele.closest('.main-panel'),
                            scrollTop = panel[0] ? panel[0].scrollTop : 0,
                            offset = top + eleHeight + ulHeight - (scrollTop + bodyHeight);

                        // // 如果展示的下拉框在屏幕外，则向上弹
                        // if (top + eleHeight + ulHeight > scrollTop + bodyHeight) {
                        //     ele.addClass('dropup');
                        // }
                        // else {
                        //     ele.removeClass('dropup')
                        // }

                        AutoscrollService.autoscroll(ul, panel);
                    })
                }
            };
        }]);

    /* @ngInject */
    function Directive($timeout) {
        return {
            restrict: 'EA',

            compile: function(scope,element, attributes){

                return {
                    //pre: function(scope, element, attributes, controller, transcludeFn){
                    //    $timeout(function() {
                    //        console.log('pre: ', element.find('li a').length);
                    //    });
                    //
                    //},
                    post: function(scope, element, attributes, controller, transcludeFn){
                        $timeout(function() {

                            var count = element.find('li a').length;

                            if (!count) {
                                element.find('a.btn').addClass('disabled');
                            }
                        });

                        if(attributes.fxBtnGroup){
                            scope.$watch(attributes.fxBtnGroup,function(g){
                                if(g){
                                    $timeout(function() {
                                        var count = element.find('li a').length;

                                        if (count>0) {
                                            element.find('a.btn').removeClass('disabled');
                                        }else{
                                            element.find('a.btn').addClass('disabled');
                                        }
                                    });
                                }
                            },true)
                        }
                    }
                }
            },
        };
    }
})();