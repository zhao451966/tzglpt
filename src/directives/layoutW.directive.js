(function() {
    'use strict';

    angular
        .module('demo.core')
        .directive('layoutW', layoutW);

    /* @ngInject */
    function layoutW($document,$rootScope) {
        var directive = {
            restrict: 'A',
            link: linkFunction
        };

        return directive;

        ////////////////////////////////

        function linkFunction(scope, element) {
            layoutWF();
        }

       /* function layoutWF() {
            var expand=$rootScope.menuExpand;

            //菜单未展开时宽度
            var menuOffsetWidth_Small=56;
            //菜单展开时宽度
            var menuOffsetWidth_Lager=200;

            //屏幕宽度
            var W = $(window).width();
            //搜索栏
            var breadcrumb=$("#breadcrumb");

            if(expand){

                breadcrumb.width(W - menuOffsetWidth_Lager);
            }else{
                breadcrumb.width(W - menuOffsetWidth_Small);
            }

            var widgetContentFix = $('div[id$=idgetContentFix]');
            if(widgetContentFix){
                //获取项目信息头的offsetWidth
                var widgetContentFixOffsetWidth=widgetContentFix[0].offsetWidth;
                //获取项目信息头的width
                var widgetContentFixWidth=widgetContentFix.width();
                //计算项目信息头的宽度的padding+border=offsetWidth-width
                var widgetContentFixPBW=widgetContentFixOffsetWidth-widgetContentFixWidth;
                if(expand){
                    widgetContentFix.width(W - menuOffsetWidth_Lager-widgetContentFixPBW);
                }else{
                    widgetContentFix.width(W - menuOffsetWidth_Small-widgetContentFixPBW);
                }
            }
        }*/

    }
})();