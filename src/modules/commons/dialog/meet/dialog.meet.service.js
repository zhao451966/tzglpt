(function() {
    'use strict';

    angular.module('demo.core')
        .factory('SystemDialogMeet', SystemDialogMeet);

    /* @ngInject */
    function SystemDialogMeet(ngDialog,$translate) {
        var dialog = function(selected, options) {

            options = angular.extend({
                title: $translate.instant('N106819'),//'查询会议'
                cancelText: $translate.instant('N000992'),//N000992='取消'
                okText: $translate.instant('N001524'),//N001524='选择'
                selectionMode: 'single'
            }, options);

            return ngDialog.open({
                template: 'modules/commons/dialog/meet/dialog.meet.html',
                controller: 'systemDialogMeetController as vm',
                data: options,
                className: 'ngdialog-theme-default ngdialog-md',
                resolve: {
                    selected: function() {
                        return selected;
                    }
                }
            });
        };

        return dialog;
    }
})();