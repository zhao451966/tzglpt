(function() {
    'use strict';


    angular.module('demo.core')
        .directive('fxLike', Like);

    /* @ngInject */
    function Like() {
        var direcitve = {
            restrict: 'A',
            scope: {},
            templateUrl: 'modules/commons/like/like.directive.html',
            controller: ControllerFn,
            linkFn: linkFn,
            replace: true
        };

        return direcitve;

        ///////////////////////////////////////////

        function linkFn(scope, element, attrs) {
            $scope.$watch(attrs.fxLike, function(project) {
                if (!project) return;

                scope.project = project;
                scope.liked = project.focuson;
            });
        }

        /* @ngInject */
        function ControllerFn($scope,FocusAPI,$stateParams,BigViewAPI) {

            var vm = this;

            BigViewAPI.one($stateParams.id)
                .get()
                .then(function(data){
                    vm.bigviewheaders = data;

                    $scope.liked = vm.bigviewheaders.focuson == '0';

                });



       /*     $scope.liked = true;*/

            $scope.like = _like;

            $scope.unlike = _unlike;




            //////////////////////////////////////

            function _like() {
                  FocusAPI.one($stateParams.id)
                    .customPUT({},'addfocus')
                    .then(function(){
                        $scope.liked = true;
                    });
            }

            function _unlike() {
                FocusAPI.one($stateParams.id)
                    .customPUT({},'removefocus')
                    .then(function(){
                        $scope.liked = false;
                    });
            }

        }
    }
})();