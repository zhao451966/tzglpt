(function() {
    'use strict';

    angular.module('demo.core')
        .directive('fxTableManual', FxTableManualDirective);

    /* @ngInject */
    function FxTableManualDirective($parse, $timeout,$translate) {
        var directive = {
            require: 'stTable',
            restrict: 'A',

            compile: function(element) {


                var thead = element.find('thead'), tbody = element.find('tbody');
                tbody.after(thead);


                return linkFn;
            }

        };

        return directive;

        /////////////////////////////////

        function linkFn(scope, element, attrs, ctrl) {

            var isFixed = attrs.isFixed === "false" ? false : true;
            var propertyName = attrs.stTable;
            var displayGetter = $parse(propertyName);

            scope.$$model = attrs.fxTable;

            // 监控sort信息
            scope.$watch(function() {
                return ctrl.tableState().sort;
            }, function(sort) {
                scope.vm.$$sort = {};

                if (sort.predicate) {
                    scope.$$sort = {
                        'sort': sort.predicate,
                        'order': sort.reverse ? 'desc' : 'asc'
                    }
                }

                scope.$$generateParams();
            }, true);


            // 监控select信息
            scope.$watch(function() {
                var rows = displayGetter(scope);

                return rows ? rows.map(function(row) {
                    return row.isSelected;
                }).join(',') : undefined;
            }, function() {
                var rows = displayGetter(scope);
                if (!rows) return;

                scope.$$selectedRows = rows.filter(function(row) {
                    return row.isSelected;
                })
            });

            // 监控filter信息
            scope.$watch(function() {
                return scope.$$filter;
            }, _.debounce(function(nv, ov) {

                if (!_.isEqual(nv, ov)) {
                    scope.$$generateParams();
                    //ctrl.pipe();
                }

            }, 200), true);
            scope.$$filter = scope.$$filter || {};


            // 监控分页信息
            scope.$watch(function() {
                return displayGetter(scope);
            }, function(rows) {

                element.parent().find('p.no-data').remove();
                // 加载数据
                if (!rows) {
                    element.after('<p class="text-center no-data">'+$translate.instant('N005060')+'</p>');//正在加载数据...
                }
                // 无数据处理
                else if (rows && !rows.length) {
                    element.after('<p class="text-center no-data">'+$translate.instant('N005061')+'</p>');//没有数据
                }

                if (rows && rows.pageDesc) {
                    scope.$$pagination = angular.extend({}, scope.$$pagination, rows.pageDesc);
                    //delete scope.$$pagination.totalRows;
                    delete scope.$$pagination.rowStart;

                    // 计算总页数
                    scope.$$totalPage = Math.ceil(rows.pageDesc.totalRows / (rows.pageDesc.pageSize || 20)) || 1;
                    scope.$$pageSize = rows.pageDesc.pageSize || 20;
                }
            });

            scope.$$pipe = function() {
                $timeout(function() {
                    scope.$$generateParams();
                    ctrl.pipe();
                });
            };

            // 生成查询参数
            scope.$$generateParams = function() {


                 var filter = {};
                 for (var name in scope.$$filter) {
                     filter['s_' + name] = scope.$$filter[name];
                 }

                 scope.$$params = angular.extend({}, scope.$$sort, filter, scope.$$pagination);
                 delete scope.$$params['totalRows'];
                 delete scope.$$params['rowStart'];
                 //console.log('params', scope.$$params);
            };

            // 固定表头
            if (!isFixed) return;
            var th = element.find('th');

            //console.log(th);

            var parent = attrs.fixedHead ? element.closest(attrs.fixedHead) : element.parent();

            parent
                .off('scroll.fix-header')
                .on('scroll.fix-header', function() {
                    var top = $(this).scrollTop();
                        th.css({
                            "transform": "translate3d(0, "+ top +"px, 0)",
                            "-ms-transform": "translate3d(0, "+ top +"px, 0)",
                            "background":"white"
                        });
                });
            scope.$on('$destroy', function() {
                element.parent().off('scroll.fix-header')
            });
        }
    }
})();