(function () {
    'use strict';

    angular
        .module('demo.sample')
        .run(ProjectsRun);

    /* @ngInject */
    function ProjectsRun (routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates () {
        return [
            {
                state: 'root.sample',
                config: {
                    url: '/sample-list',
                    views: {
                        'main@': {
                            templateUrl: 'modules/demo/list/list.html',
                            controller: 'SampleListController as vm'
                        }
                    },
                    title: '列表Demo',
                    data: {
                        requireLogin: false
                    }
                }
            },

            {
                state: 'root.sample.chart',
                config: {
                    url: '/charts',
                    views: {
                        'main@': {
                            templateUrl: 'modules/demo/list/chart.html',
                            controller: 'SampleChartController as vm'
                        }
                    },
                    title: 'ChartDemo',
                    data: {
                        requireLogin: false
                    }
                }
            },
            {
                state: 'root.checkingpbdmgz',
                config: {
                    url: '/checkingpbdmgz',
                    views: {
                        'main@': {
                            templateUrl: 'modules/commons/dialog/prdtrd/dialog.pbdmgz.html',
                            controller: 'DialogPrdtrdsController as vm'
                        },
                        'header@': '',
                        'menu@': '',
                        'breadcrumb@': ''

                    },
                    title: '查看列表',
                    data: {
                        requireLogin: false
                    }
                }
            }
            /*{
                state: 'root.checkingRule',
                config: {
                    url: '',
                    views: {
                        'main@': {
                            templateUrl: 'modules/commons/dialog/prdtrd/dialog.pbdmgz.html',
                            controller: 'DialogPrdtrdsController as vm'
                        }
                    },
                    title: 'ChartDemo'
                }
            }*/
        ];
    }

})();
