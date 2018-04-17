(function() {
    'use strict';

    angular.module('demo.core')
        .factory('DialogMessageSender', DialogMessageSender);

    /* @ngInject */
    function DialogMessageSender(ngDialog) {
        var dialog = function(messagecode,options) {

            options = angular.extend({
                title: '消息管理',
                cancelText: '取消',
                okText: '发送'
            }, options);

            return ngDialog.open({
                template: 'modules/commons/dialog/messageSender/message.sender.html',
                controller: 'DialogMessageSenderController as vm',
                data: options,
                className: 'ngdialog-theme-default ngdialog-md',
                resolve: {
                    messagecode: function() {
                        return messagecode;
                    }
                }
            });
        };

        return dialog;
    }
})();