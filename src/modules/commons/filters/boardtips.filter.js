(function() {
    'use strict';

    angular.module('demo.core')
        .filter('boardtips', function () {
            return function (m,item) {
                if (!m) return '';
                if(!item) return '';
//                {{child.boardName}}(
//                <i ng-if="item.state==2">关闭 </i>
//                <i ng-if="item.state==3">超期关闭 </i>
//                <i ng-if="item.state==4">已删除 </i>
//                {{child.detailStateName}})
                // 文件扩展名匹配文件图片
                
                var tips = '';
                for(var i=0;i<m.length;i++){
                	var o = m[i];
                	 tips += o.boardName;
                	 tips += '(';
                     if(item.state=='2'){
                     	tips+='关闭';
                     }
     				if(item.state=='3'){
     					tips+='超期关闭';             	
     				}
     				if(item.state=='4'){
     					tips+='已删除';  
     				}
     				tips += o.detailStateName;
                     tips += ')';
                }
                return tips;
            };
        })
})();
