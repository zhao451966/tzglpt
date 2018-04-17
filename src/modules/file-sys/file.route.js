(function() {
    'use strict';

    angular.module('fosun.file')
        .run(FileRun);

    /* @ngInject */
    function FileRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'root.filelist',
                config: {
                    url: '/filelist',
                    views: {
                        'main@': {
                            templateUrl: 'modules/file-sys/file.list.html',
                            controller: 'FileListController as vm'
                        },
                        //'header@': '',
                        'menu@': '',
                        //'breadcrumb@': ''
                    },
                    title: '文件列表'
                    /*,data: {
                        requireLogin: false
                    }*/
                }

            },
            {
                state: 'root.filefundlist',
                config: {
                    url: '/filefundlist',
                    views: {
                        'main@': {
                            templateUrl: 'modules/file-sys/file.fund.list.html',
                            controller: 'FileFundListController as vm'
                        },
                        //'header@': '',
                        'menu@': '',
                        //'breadcrumb@': ''
                    },
                    title: '文件列表'
                    /*,data: {
                     requireLogin: false
                     }*/
                }

            }
        ];
    }
})();
