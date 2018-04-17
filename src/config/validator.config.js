(function() {
    'use strict';

    angular
        .module('demo.core')
        .config(ValidationConfig);

    /* @ngInject */
    function ValidationConfig ($validationProvider) {
        getI18NResourse();

        $validationProvider.showSuccessMessage = false; // or true(default)


        /**
         * Add your Msg Element
         * @param {DOMElement} element - Your input element
         * @return void
         */
        $validationProvider.addMsgElement = function(element) {

            if ($(element).parent().is('.input-append')) {
                $(element).parent().after('<span class="msg"></span>');
            }
            else {
                $(element).after('<span class="msg"></span>');
            }
        };

        /**
         * Function to help validator get your Msg Element
         * @param {DOMElement} element - Your input element
         * @return {DOMElement}
         */
        $validationProvider.getMsgElement = function(element) {

            //console.log($(element).parent(), $(element).parent().is('.input-append'));


            if ($(element).parent().is('.input-append')) {
                return $(element).parent().parent().find('span.msg');
            }
            else {
                return $(element).parent().find('span.msg');
            }


        };

        //console.log($validationProvider, $validationProvider.getErrorHTML);

        $validationProvider.getErrorHTML = function(msg, element, attrs) {
            var error = msg;

            if (angular.isFunction(msg)) {
                error =  msg(element, attrs);
            }

            return '<p class="validation-invalid">' + error + '</p>';
        };


        $validationProvider.setExpression({
            minlength: function(value, scope, element, attrs, param) {
                if (!value || !param) return;
                param = parseInt(param);

                return value.length >= param;
            },
            maxlength: function(value, scope, element, attrs, param) {
                if (!value || !param) return true;
                param = parseInt(param);

                return value.length <= param;
            },

            min: function(value, scope, element, attrs, param) {
                if (!value || !param) return;
                param = parseInt(param);

                value = parseFloat(value);
                return value >= param;
            },
            max: function(value, scope, element, attrs, param) {
                if (!value || !param) return true;
                param = parseInt(param);

                value = parseFloat(value);
                return value <= param;
            },

            digits: function (value) {
                if (!value) return true;

                return /^-?\d+(\.\d+)?$/.test(value);

            },

            number: function (value) {
                if (!value) return true;

                return /^-?\d+$/.test(value);
            },

            numberComma: function (value) {
                if (!value) return true;

                // 没有,
                if (value.indexOf(',') < 0) return /^-?\d+$/.test(value);

                // 有,严格按照标准
                return /^-?(\d{1,3})(,\d{3})*$/.test(value);
            },

            digitsComma: function (value){
                if (!value) return true;

                // 没有,
                if (value.indexOf(',') < 0) return /^\d+(\.\d{1,2})?$/.test(value);

                // 有,严格按照标准
                return /^\d+(\.\d{1,2})?$/.test(value);
            },

            socialCode: function (value){
                /*if(angular.isUndefined(value)){
                    return true;
                }*/
                if (!value) return true;

                // 没有,
                if (value.indexOf(',') < 0) return /^[A-Z0-9]{0,18}$/.test(value);

                // 有,严格按照标准
                return /^[A-Z0-9]{18}$/.test(value);
            },
            phone: function (value){
                if (!value) return true;

                return /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(value);
            }

        });

        $validationProvider.setDefaultMsg({
            digits: {
                error: getI18NResourse('NP01003') //'必须为数字。'
            },

            digitsComma: {
                error: getI18NResourse('NP01004') // '只允许输入数字，最多包<br/>含两位小数。'
            },

            required: {
                error: getI18NResourse('NP01005'), // '此为必填项。',
                success: 'It\'s Required'
            },
            url: {
                error: getI18NResourse('NP01006'), // '无效的Url。',
                success: 'It\'s Url'
            },
            email: {
                error: getI18NResourse('NP01007'), // '无效的邮箱地址。',
                success: 'It\'s Email'
            },
            phone: {
                error: getI18NResourse('NP01008'), // '无效的手机号码。'
            },
            number: {
                error: getI18NResourse('NP01009'), // '必须为整数。',
                success: 'It\'s Number'
            },
            numberComma: {
                error: getI18NResourse('NP010010'), // '必须为整数。',
                success: 'It\'s Number'
            },
            minlength: {
                error: getI18NResourse('NP01011'), // '字符过短。',
                success: 'Long enough!'
            },
            maxlength: {
                error: getI18NResourse('NP01012'), // '字符过长。',
                success: 'Short enough!'
            },
            socialCode: {
                error: getI18NResourse('NP01013'), // '统一社会信用代码由最大18位数字和大写字母组成',
                success: 'Unified social credit code / Registration No. group by 18 numbers and capital&small letter'
            },
            min: {
                error: function(element, attrs) {

                    var min=0;

                    attrs.validator.split(',').some(function(str) {
                        var match = str.match(/([a-zA-Z]*)=?(.*)/);
                        if (match[1] == 'min') {
                            min = match[2];
                            return true;
                        }

                        return false;
                    });


                    return getI18NResourse('NP01014') + min; // '数字不能小于' + min;
                },
                success: 'Long enough!'
            },
            max: {
                error: function(element, attrs) {

                    var max=0;

                    attrs.validator.split(',').some(function(str) {
                        var match = str.match(/([a-zA-Z]*)=?(.*)/);
                        if (match[1] == 'max') {
                            max = match[2];
                            return true;
                        }

                        return false;
                    });


                    return getI18NResourse('NP01015') + max; // '数字不能大于' + max;
                },
                success: 'Long enough!'
            },
        });

        $validationProvider.setValidMethod('submit');
        //console.log($validationProvider);

        //angular.extend($validationProvider, {
        //    validCallback: function (element){
        //        $(element)
        //            .closest('.control-group')
        //            .removeClass('error')
        //            .addClass('success');
        //    },
        //    invalidCallback: function (element) {
        //        $(element)
        //            .closest('.control-group')
        //            .addClass('error')
        //            .removeClass('success');
        //    }
        //});

    }
})();