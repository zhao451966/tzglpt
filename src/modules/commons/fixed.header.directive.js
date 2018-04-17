(function() {
    'use strict';

    window.index = 0;

    angular.module('demo.core')
        .directive('fxFixedHeader', FixedHeader);

    /* @ngInject */
    function FixedHeader($document, $timeout) {
        return {
            restrict: 'EA',
            link: function(scope, element) {

                var widgetContentFix= element.find("#widgetContentFix");
                var iconChevronLeftFix=element.find("#iconChevronLeftFix");
                var iconChevronRightFix=element.find("#iconChevronRightFix");
                var projectIcon=element.find("#projectIcon");
                var subTitle=element.find("#subTitle");
                var subProject=element.find("#subProject");
                var subTitle1=element.find("#subTitle1");
                var project_treetops = element.find('#project_treetops');

                var projectbaike=element.find("#projectbaike");

                //console.log('test', window.index++);

                scope.$on("$destroy", function() {
                    $document.off('scroll.project');
                });

                $timeout(function() {
                    $document.on('scroll.project', function() {

                        var scrollTop=$document.scrollTop();

                        //console.log('test-scroll', scrollTop);


                        if (scrollTop > 81) {
                            widgetContentFix.addClass("widget-fix");
                            iconChevronLeftFix.addClass("widget-fix");
                            iconChevronRightFix.addClass("widget-fix");
                            projectIcon.addClass("widget-fix");
                            subTitle.addClass("widget-fix");
                            subProject.addClass("widget-fix");
                            subTitle1.addClass("widget-fix");

                            project_treetops.css({
                                top: '-9999px',
                                left: '-9999px',
                                position: 'relative'
                            });


                            projectbaike.addClass("bike-display");

                        } else {
                            widgetContentFix.removeClass("widget-fix");
                            iconChevronLeftFix.removeClass("widget-fix");
                            iconChevronRightFix.removeClass("widget-fix");
                            projectIcon.removeClass("widget-fix");
                            subTitle.removeClass("widget-fix");
                            subProject.removeClass ("widget-fix");
                            subTitle1.removeClass("widget-fix");

                            project_treetops.css({
                                position: 'static'
                            });

                            projectbaike.removeClass("bike-display");
                        }
                    });

                    $document.trigger('scroll.project');
                });

            }
        };
    }
})();