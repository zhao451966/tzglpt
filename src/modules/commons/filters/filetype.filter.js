(function() {
    'use strict';

    angular.module('demo.core')
        .filter('fileType', function () {
            return function (m) {
                if (!m) return m;

                // 文件扩展名匹配文件图片
                if(m == 'txt' || m == 'TXT'){
                    return "txt";
                }else if(m == 'doc' || m == 'docx' || m == 'DOC' || m == 'DOCX'){
                    return "word"
                }else if(m == 'xls' || m == 'xlsx' || m == 'XLS' || m == 'XLSX'){
                    return "excel";
                }else if(m == 'ppt' || m == 'ppts' || m == 'pptx' || m == 'PPT' || m == 'PPTS' || m == 'PPTX'){
                    return "ppt";
                }else if(m == 'jpg' || m == 'jpeg' || m == 'bmp' || m == 'png' || m == 'gif'
                        || m == 'JPG' || m == 'JPEG' || m == 'BMP' || m == 'PNG' || m == 'GIF'){
                    return "image";
                }else if(m == 'avi' || m == 'mkv' || m == 'mp4'
                        || m == 'AVI' || m == 'MKV' || m == 'MP4'){
                    return "video";
                }else if( m == 'mp3' || m== 'wma' ||  m=='amr'
                        || m == 'MP3' || m== 'WMA' ||  m=='AMR'){
                    return "audio";
                }else if(m == 'pdf' || m == 'PDF'){
                    return "pdf";
                }else if(m == 'rar' || m == 'zip' || m == 'RAR' || m == 'ZIP'){
                    return "rar";
                } else {
                    return "file";
                }
            };
        })
})();
