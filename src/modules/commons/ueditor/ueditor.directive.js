(function() {
    'use strict';

    angular.module('demo.core')
        .directive('fxUeditor', Ueditor);

    /* @ngInject */
    function Ueditor() {
        return {
            restrict: 'EA',
            scope: {
                content: '='
            },
            template: '<iframe src="modules/commons/ueditor/ueditor.iframe.html" style="width:100%; border:none;" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>',
            link: linkFn
        };

        ////////////////////////////////////////////////////

        function linkFn (scope, element, attrs) {

            var iframe, content;

            scope.$watch(function() {
                return scope.content
            }, function(c) {
                if (c) {

                    if (iframe) {
                        iframe.html(c);
                        autoHeight(element, iframe);
                    }

                    content = c;
                }
            });


            element.find('iframe').load(function () {
                var body = this.contentWindow.document.body;
                iframe = $(body);

                if (content) {
                    iframe.html(content);
                    autoHeight(element, iframe);
                }
            });
        }



        function autoHeight(element, body) {
            setTimeout(function() {
                var height = body.height();
                element.find('iframe').height(height+15);
            },500);
        }
    }
})();