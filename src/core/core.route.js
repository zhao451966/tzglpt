 (function () {
    'use strict';

    angular.module('demo.core')
        .run(CoreRun);

    /* @ngInject */
    function CoreRun (routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates () {
        return [
            {
                state: 'root',
                config: {
                    url: '',
                    abstract: true,
                    views: {
                        header: {
                            templateUrl: 'modules/commons/header.html',
                            controller: 'HeaderController as vm'
                        },

                        breadcrumb: {
                            templateUrl: 'modules/commons/breadcrumb.html',
                            controller: 'BreadcrumbController as vm'
                        },

                        menu: {
                            templateUrl: 'modules/commons/menu.html',
                            controller: 'MenuController as vm'
                        },

                        //footer: {
                        //    templateUrl: 'modules/commons/footer.html'
                        //}
                    },
                    data: {
                        requireLogin: false
                    }
                }
            }
        ];
    }
})();
