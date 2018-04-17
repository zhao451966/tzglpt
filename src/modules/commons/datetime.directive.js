(function() {
    angular.module('demo.core')
        .directive('dateTime', DateTime);

    /* @ngInject */
    function DateTime() {
        return {
            link: function(scope, element) {

                element.next('.add-on').click(function() {
                    element.focus();
                })

            }
        };
    }
})();