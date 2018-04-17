(function () {
    'use strict';

    angular
        .module('helper.logger')
        .factory('logger', LoggerService);

    /* @ngInject */
    function LoggerService ($log) {
        var service = {

            success: success,
            error: error,
            info: info,
            warning: warning

        };

        return service;

        ///////////////////////////////

        function success (message, data) {
            $log.success('Success: ' + message, data);
        }

        function error (message, data) {
            $log.error('Error: ' + message, data);
        }

        function info (message, data) {
            $log.info('Info: ' + message, data);
        }

        function warning (message, data) {
            $log.warning('Warning: ' + message, data);
        }
    }
})();
