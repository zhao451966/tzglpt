(function() {
    'use strict';

    angular.module('demo.sample')
        .controller('SampleChartController', SampleChartController);

     /* @ngInject
      *
      * @param  Confirm:确认窗口
      * @param  toastr :提示层
      * @param  ngDialog :弹开窗口
      *
      * */
    function SampleChartController($scope) {
        var pageload = {
            name: 'page.load',
            radius: [100, 140],
            pie: {
                itemStyle : {}
            },
            datapoints: [
                { x: 2001, y: 1012 },
                { x: 2002, y: 1023 },
                { x: 2003, y: 1045 },
                { x: 2004, y: 1062 },
                { x: 2005, y: 1032 },
                { x: 2006, y: 1040 },
                { x: 2007, y: 1023 },
                { x: 2008, y: 1090 },
                { x: 2009, y: 1012 },
                { x: 2010, y: 1012 },
            ]
        };

        var firstPaint = {
            name: 'page.firstPaint',
            radius: [0, 70],
            pie: {
                itemStyle : {
                    normal : {
                        label : {
                            position : 'inner'
                        },
                        labelLine : {
                            show : false
                        }
                    }
                }
            },
            datapoints: [
                { x: 1, y: 3070 },
                { x: 2, y: 3134 },
                { x: 3, y: 3125 },
                { x: 4, y: 1012 }
            ]
        };

        var thirdPaint = {
            name: 'page.firstPaint',
            radius: [160, 200],
            pie: {
                itemStyle : {
                    normal : {
                        label : {
                            position : 'inner'
                        },
                        labelLine : {
                            show : false
                        }
                    }
                }
            },
            datapoints: [
                { x: 1, y: 3070 },
                { x: 2, y: 3134 },
                { x: 3, y: 3125 },
                { x: 4, y: 1012 }
            ]
        };

        $scope.config = {
            title: 'Line Chart',
            subtitle: 'Line Chart Subtitle',
            debug: true,
            showXAxis: true,
            showYAxis: true,
            showLegend: true,
            stack: false,
        };

        $scope.barConfig = {
            title: 'Line Chart',
            subtitle: 'Line Chart Subtitle',
            debug: true,
            stack: false,
        };

        $scope.areaConfig = {
            title: 'Area Chart',
            subtitle: 'Area Chart Subtitle',
            yAxis: { scale: true },
            debug: true,
            stack: true
        };

        $scope.pieConfig = {
            height: 480,
            title : {
                text: '某站点用户访问来源',
                subtext: '纯属虚构',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient : 'vertical',
                x : 'left',
            },

            center: ['50%', '50%'],
            debug: true
        };

        $scope.gaugeConfig = {
            debug: true
        };

        $scope.data = [ pageload ];
        $scope.multiple = [pageload, firstPaint ];

    }
})();