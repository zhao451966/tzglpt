(function() {
    'use strict';

    angular.module('demo.core')
        .factory('AutoscrollService', AutoscrollService)
        .directive('fxAutoscroll', Autoscroll);

    /* @ngInject */
    function AutoscrollService() {
        return {
            autoscroll: function(element, parent) {
                var bottom = element.offset().top + element.outerHeight();

                var containerBottom = parent.offset().top + parent.outerHeight();

                //console.log('当前容器scrollTop', element.offset().top);
                //console.log('当前容器', element.offset().top);
                //console.log('', element.offset().top);
                //console.log('', element.offset().top);
                //console.log('', element.offset().top);
                //console.log('', element.offset().top);
                //console.log('', element.offset().top);

                console.log(element.offset().top);

                // 待显示的元素在容器底部外
                if (bottom > containerBottom - 10) {
                    parent.scrollTopAnimated(parent.scrollTop() + bottom - containerBottom + 10);
                }
            }
        };
    }

    /* @ngInject */
    function Autoscroll($timeout, AutoscrollService) {
        return {
            restrict: 'EA',
            priority: 0,
            link: function(scope, element, attrs) {

                $timeout(function() {
                    var parentSelect = attrs.autoscrollParent;
                    var elementSelect = attrs.autoscrollElement;
                    var parent;

                    if (elementSelect) {
                        element.find(elementSelect);
                    }

                    // 指定父容器
                    if (parentSelect) {
                        parent = element.closest(parentSelect)
                    }
                    else {
                        // 弹出框
                        if (element.closest('.ngdialog-content').length) {
                            parent = element.closest('section');
                        }
                        // body
                        else {
                            parent = $('body');
                        }
                    }

                    // 没有找到父节点，return
                    if (parent.length == 0 || element.length == 0) return;

                    AutoscrollService.autoscroll(element, parent);
                });
            }
        };

        ////////////////////////////////////////////////////
        //
        //function scroll(element, parent) {
        //
        //    var bottom = element.offset().top + element.outerHeight();
        //
        //    var containerBottom = parent.scrollTop() + parent.outerHeight();
        //
        //    // 待显示的元素在容器底部外
        //    if (bottom > containerBottom - 10) {
        //        parent.scrollTopAnimated(bottom + 10);
        //    }
        //
        //}
    }
})();