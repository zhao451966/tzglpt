(function() {
  angular
    .module('validation.directive')
    .directive('validationSubmit', Submit);

  function Submit($injector) {
    var $validationProvider = $injector.get('$validation');
    var $timeout = $injector.get('$timeout');
    var $parse = $injector.get('$parse');
    return {
      priority: 2, // execute before origin validationSubmit (1)
      require: '?ngClick',
      link: function postLink(scope, element, attrs) {
        var form = $parse(attrs.validationSubmit)(scope);

        var handler = null, timeout = 2000;

        // 阻止表单重复提交
        var sumbitFn = function() {
          if (!handler) {
            $validationProvider.validate(form)
              .success(function() {
                $parse(attrs.ngClick)(scope);
              });

            handler = setTimeout(function() {
              handler = null;
            }, timeout);

            return;
          }

          clearTimeout(handler);
          handler = setTimeout(function() {
            handler = null;
          }, timeout);
        };

        $timeout(function() {
          // Disable ng-click event propagation
          element.off('click');

          element.on('click', sumbitFn);
        });
      }
    };
  }
  Submit.$inject = ['$injector'];
}).call(this);
