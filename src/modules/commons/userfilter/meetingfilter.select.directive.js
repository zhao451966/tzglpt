(function() {
    'use strict';

    angular.module('demo.core')
        .directive('fxMeetingfilterSelect', MeetingfilterSelect);

    /* @ngInject */
    function MeetingfilterSelect() {
        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'modules/commons/userfilter/meetingfilter.select.directive.html',
            controller: MeetingfilterSelectCtrl
        };
    }

    /* @ngInject */
    function MeetingfilterSelectCtrl($scope, FilterAPI,$translate) {

        $scope.$$filters = [];

        // 查询用户条件
        $scope.$queryFilter = function(id) {
            FilterAPI.one('list').one($scope.$$model).getList()
                .then(function(data) {

                    if (!data) data = [];

                    // 添加自定义查询条件（非数据库，每个用户都有）
                    if (angular.isArray($scope.$$customFilters)) {
                        $scope.$$customFilters.reverse().forEach(function(filter) {
                            data.unshift(filter);
                        });
                    }

                    // 添加默认的全部信息
                    data.unshift({
                        filterName: $translate.instant('N003339'),//'N003339':'项目类会议'
                        selected: !id
                    });

                    if (id) {
                        angular.forEach(data, function(obj) {
                            obj.selected = (obj.filterNo == id);
                        })
                    }

                    $scope.$$filters = data;
                });
        };
        $scope.$queryFilter();

        // 获取过滤条件值
        $scope.$getFilter = function(filter) {
            if (!filter.filterNo) {

                if (!window.INIT_PARAMS) {
                    $scope.$$filter = filter.filterValue || {};
                }
                else {
                    $scope.$$filter = angular.extend({}, filter.filterValue, $scope.$$filter);
                    window.INIT_PARAMS = false;
                }

                return;
            }

            FilterAPI.one(filter.filterNo)
                .get()
                .then(function(data) {
                    if (data) {

                        if (!window.INIT_PARAMS) {
                            $scope.$$filter = JSON.parse(data.filterValue) || {};
                        }
                        else {
                            $scope.$$filter = angular.extend({}, JSON.parse(data.filterValue), $scope.$$filter);
                            window.INIT_PARAMS = false;
                        }

                    }
                });
        };

        // 监控用户条件选择
        $scope.$watch(function() {
            return $scope.$$userFilter;
        }, function(data) {
            if(data && data[0]) {
                $scope.$getFilter(data[0]);
            }
        }, true);

    }
})();