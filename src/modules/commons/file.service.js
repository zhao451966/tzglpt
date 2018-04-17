(function() {
    'use strict';

    angular.module('demo.core')
        .factory('FileUtils', ConfirmService);

    /* @ngInject */
    function ConfirmService($q, Confirm) {
        var baseUrl = ContextPath+'upload/service/';

        var Utils = {

            remove: _remove,

            getList: _getList,

            getUrl: function() {
                return baseUrl;
            }

        };

        return Utils;


        ////////////////////////////////////////////////////////

        /**
         * 删除文件
         * @param file {String | Object} 文件
         * @param isConfirm {Boolean} 是否弹出对话框
         * @returns {*}
         * @private
         */
        function _remove(file, isConfirm) {
            var deferred = $q.defer();

            var fileId = angular.isString(file) ? file : file.fileId, fileName = file.fileName;

            if (!fileId) {
                return deferred.reject('文件id不能为空');
            }
            else if (!angular.isString(fileId)) {
                return deferred.reject('文件id格式不正确');
            }

            // 是否需要弹出确认框
            if (isConfirm) {
                return Confirm(Mustache.render('是否确定删除{{fileName}}？', {
                    fileName: fileName
                }), {
                    title: '删除',
                    okText: '删除'
                }).then(removePromise)
            }
            else {
                return removePromise();
            }

            return deferred.promise;

            //////////////////////////////////////////////

            function removePromise () {
                var deferred = $q.defer();

                $.jsonp({
                    type:'get',
                    callback:"jsonpCallback",
                    dataType: 'jsonp',
                    url: baseUrl + "fileList/delete/"+fileId,
                    success: function(data){
                        return deferred.resolve(data);
                    },
                    error: function(msg) {
                        return deferred.reject(msg);
                    }
                });

                return deferred.promise;
            }
        }

        /**
         * 获取文件列表
         * @param groupId
         * @returns {*}
         * @private
         */
        function _getList(groupId, data) {
            var deferred = $q.defer();

            groupId = groupId || 'hoperun';

            $.jsonp({
                url: baseUrl + "fileList/" + groupId,
                data: data,
                callback:"jsonpCallback",
                dataType: "jsonp",
                success: function(json) {
                    var result = json.data ? json.data : [];

                    return deferred.resolve(result);
                },
                error: function(msg) {
                    return deferred.reject(msg);
                }
            });

            return deferred.promise;
        }

    }
})();