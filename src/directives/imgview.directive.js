(function() {
	'use strict';

	angular.module('demo.core').directive('bnDocumentClick', ImgViewDirective);

	/* @ngInject */
	function ImgViewDirective($document, $parse) {

		//将Angular的上下文链接到DOM事件
		var linkFunction = function($scope, $element, $attributes) {
			var scopeExpression = $attributes.bnDocumentClick;
			var invoker = $parse(scopeExpression);
			//绑定 onpropertychange oninput 事件
			$element.on("click", function(event) {
				//当点击事件被触发时
				$scope.$apply(function() {
					//将jQuery事件映射到$event对象上
					invoker($scope, {
						$event : event
					});
				});
			});
		};
		//返回linking函数
		return (linkFunction);
	}
})();
