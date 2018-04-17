(function() {
    'use strict';

    angular.module('demo.sample')
        .controller('SampleAddController', SampleAddController);

    /* @ngInject */
    function SampleAddController(CacheAPI) {
        var vm = this;

        vm.item = {
            text: '不可编辑文本',
            //date: '2016-03-26',
            time: '2016-03-26 15:26:26'
        };

        vm.dictionary = {};

        // 项目分类
        vm.dictionary.xmfl = CacheAPI
            .one('dictionary')
            .one('XMFL')
            .getList().$object;

        // 项目来源
        vm.dictionary.xmly = CacheAPI
            .one('dictionary')
            .one('XMLY')
            .getList().$object;

        // 项目归属地
        vm.dictionary.xmgsd = CacheAPI
            .one('dictionary')
            .one('XMGSD')
            .getList().$object;

        vm.save = function(item) {
            alert(JSON.stringify(item));
        };
    }
})();