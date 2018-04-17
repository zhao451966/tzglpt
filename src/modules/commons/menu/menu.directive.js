(function() {
    'use strict';

    angular.module('demo.core')
        .directive('fxMenu', MenuDirective);

    var currentElement, currentTarget;

    /* @ngInject */
    function MenuDirective($compile) {
        return {
            restrict: 'EA',
            compile: function(element) {

                return function LinkFn(scope, element, attrs) {

                    // 只有含有子菜单，才继续添加事件
                    if (!scope.m1.children || !scope.m1.children.length) return;

                    element.hover(function() {
                        show(element);
                    }, function() {});
                }
            }
        };
    }

    function show(ele) {

        // 判断进入事件的一级菜单是否是当前显示的一级菜单，如果是则退出
        if (ele == currentElement) return;
        currentElement = ele;

        // 首先将其他二级菜单隐藏去除
        _hide();

        // 创建二级菜单
        var div = $('<div></div>')
            .addClass('sub-menu')
            .appendTo($('body'))
            .append($('<div></div>').addClass('arrow'))
            .append(ele.find('ul').clone());

        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;

        /**
         * 本来一级菜单和二级菜单时顶部对齐
         *
         * 为了显示好看，对二级菜单进行偏移。将一级菜单和二级菜单的中心线进行对齐
         *
         * 箭头始终对齐一级菜单的中心线
         *
         * @type {number|*|offset.top|Function}
         */
        var top = ele.offset().top - scrollTop, offset = (div.outerHeight() - 42) / 2;
        var baseTop = top - offset, baseBottom = baseTop + div.outerHeight();
        var arrowTop = 13 + offset;


        // 本体
        div.css({
            top: baseTop
        });
        // 箭头
        div.find('.arrow').css({
            top: arrowTop
        });


        //console.log(top, offset);


        // 超出窗口底部
        //baseBottom -= scrollTop;
        if (baseBottom > $(window).height()) {

            /**
             * 如果二级菜单的底线超过了屏幕高度，则需将二级擦弹向上偏移
             *
             * @type {number}
             */
            var offsetTop = baseBottom - $(window).height() + 2;
            var toTop = baseTop - offsetTop;
            var toArrowTop = arrowTop + offsetTop;

            //alert(offsetTop);
            // 本体
            div.css({
                top: toTop
            });
            // 箭头
            div.find('.arrow').css({
                top: toArrowTop
            });
        }

        // 超出窗口顶部
        if (baseTop < 110) {

            /**
             * 如果二级菜单的顶部超过了屏幕，则需要将二级菜单向下偏移
             *
             * @type {number}
             */
            var offsetTop = (110 - baseTop) + 2;
            var toTop = baseTop + offsetTop;
            var toArrowTop = arrowTop - offsetTop;

            // 本体
            div.css({
                top: toTop
            });
            // 箭头
            div.find('.arrow').css({
                top: toArrowTop
            });
        }

        currentTarget = div;
        /**
         * 解决鼠标从一级菜单动到
         */
        $(document).on('mouseover.menu', _.debounce(function(e) {
            hide(ele, e);
        }, 200));

    }

    function hide(ele, e) {
        var isInMenu = $(e.target).closest(ele).length > 0;
        var isInSubMenu = $(e.target).closest(currentTarget).length > 0;

        if (!isInMenu && !isInSubMenu) {
            _hide();
        }
    }

    function _hide() {
        currentTarget && currentTarget.remove();
        currentTarget = null;
        currentElement = null;
        $(document).off('mouseover.menu');
    }
})();