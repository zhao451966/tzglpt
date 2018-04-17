(function() {
    'use strict';

    angular.module('demo.core')
        .directive('fxTable', FxTableDirective);

    window.clearTableParams = function() {
        window.PARAMS = {};
        console.log(window.PARAMS);
    };

    /* @ngInject */
    function FxTableDirective($parse, $timeout,$translate) {
        var directive = {
            require: 'stTable',
            restrict: 'A',

            compile: function(element) {


                var thead = element.find('thead'), tbody = element.find('tbody');
                tbody.after(thead);


                return linkFn;
            }

        };

        window.PARAMS = window.PARAMS || {};

        return directive;

        /////////////////////////////////

        function linkFn(scope, element, attrs, ctrl) {

            var isFixed = attrs.isFixed === "false" ? false : true;
            var propertyName = attrs.stTable;
            var displayGetter = $parse(propertyName);
            var tableName = attrs.fxTable;

            scope.$$model = attrs.fxTable;

            //查询条件不缓存
            window.PARAMS[tableName] = {};//window.PARAMS[tableName] || {};
            if (window.PARAMS[tableName]) {
                window.INIT_PARAMS = true;
                scope.$$filter = window.PARAMS[tableName].$$filter || {};
                //scope.$$pagination = { "pageNo": 3, "pageSize": 20, "totalRows": 551 }; //window.PARAMS[tableName].$$pagination;
            }
            else {
                scope.$$filter = scope.$$filter || {};
            }

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
                    ctrl.pipe();
                    window.PARAMS[tableName].$$filter = angular.extend({}, scope.$$filter);
                }

            }, 500), true);
            scope.$$filter = scope.$$filter || {};


            // 监控分页信息
            scope.$watch(function() {
                return displayGetter(scope);
            }, function(rows) {

                element.parent().find('div.no-data').remove();
                // 加载数据
                if (!rows) {
                    element.after('<div class="text-center no-data" ><span class="no-data-loading">'+$translate.instant('N005060')+'</span></div>');//正在加载数据...
                }
                // 无数据处理
                else if (rows && !rows.length) {
                    //如果来自搜索，无数据文字信息另外显示
                    if(scope.$$filter.isSearchQueryRoot&&scope.$$filter.isSearchQueryRoot==true){
                        element.after('<div class="text-center no-data" ><span class="no-data-title">未检索到文件</span><span class="no-data-tip">点击"+"即可上传新文件</span></div>');//没有数据
                    }else{
                        element.after('<div class="text-center no-data" ><span class="no-data-title">尚未上传任何文件</span><span class="no-data-tip">点击"+"即可上传新文件</span></div>');//没有数据
                    }
                }

                if (rows && rows.pageDesc) {
                    scope.$$pagination = angular.extend({}, scope.$$pagination, rows.pageDesc);
                    //delete scope.$$pagination.totalRows;
                    delete scope.$$pagination.rowStart;

                    // 计算总页数
                    scope.$$totalPage = Math.ceil(rows.pageDesc.totalRows / (rows.pageDesc.pageSize || 20)) || 1;
                    scope.$$pageSize = rows.pageDesc.pageSize || 20;

                    window.PARAMS[tableName].$$pagination = angular.extend({}, scope.$$pagination);
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
