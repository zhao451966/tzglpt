(function() {
    'use strict';

    angular.module('fosun.file')
        .controller('ImageViewController', ImageViewController);

     /* @ngInject
      * image = 图片对象 必须包含id,name
      * {
      * 	fileId:'图片id',
      * 	fileName:'图片名称',
      * 	url:'xxxx'......
      * }
      * */

    function ImageViewController($translate,$scope, $rootScope, Confirm, image ,fileAccessAPI) {

        $rootScope.OVERFLOW = 'hidden';

        var vm = this;
        vm.img = angular.extend({},image);

        //按钮权限
        var print = Authenticate.checkOpt('PROJECT_FILE_VIEW', 'FILE_PRINT');
        var down = Authenticate.checkOpt('PROJECT_FILE_VIEW', 'FILE_DOWNLOAD');
        var remove = Authenticate.checkOpt('PROJECT_FILE_VIEW', 'FILE_DELETE');
        if(vm.img.filePermision && vm.img.filePermision!= {}){
        	//如果传递了权限控制参数，则以传递的参数为准， 适用与 特殊权限控制，如董事约见
        	window.filePermision = vm.img.filePermision;
        }else{
        	//其他 情况 按权限配置
        	window.filePermision = vm.img.filePermision ={
        			view:print,
        			down:down,
        			remove:remove
        	};
        }
        //console.log(vm.img.filePermision);
//        	 filePermision={
//         			view:fileView,
//         			down:fileDown,
//         			remove:fileRemove
//         	};
        /*获取访问令牌ID后才能访问文件*/
        vm.getFileRight = function(file) {
            if(file.fileId){
			   // 直接根据文件ID，后台直接下载
				vm.img.url = ContextPath+'service/weboffice/downFileByType?fileId='
						+file.fileId;

            }else{
                   vm.img.url='';
            }
        };
        vm.getFileRight(vm.img);

       
        /**
         * 锁住页面
         */
        var lockPage =function (){
        	$("#lock").show();
        };
        
        /**
         * 解锁页面
         */
       var unlockPage= function  (){
        	$("#lock").hide();
        };
        
        /* 初始化参数*/
        vm.options = {
        		onSelect:lockPage,
    			onQueueComplete:unlockPage,
    			onMaxSizeExceed: function(size, limited, name) {
    				unlockPage();
    				if(size.size==0){
    					Confirm($translate.instant('N106035'),{//N106035 = '文件实际大小0kb无法读取！'
                            title:$translate.instant('N106021'),//N106021='提示'
                            okText:$translate.instant('N001008'),// N001008 = 确认
                            noCancel:true
                        });
    				}else{
    					//'N106036':'文件实际{realSize}大于默认值{defaultSize}！',
    					//'文件实际'+size.formatSize+'大于'+size.formatLimitSize+'！'
        				Confirm($translate.instant('N106036', {realSize:size.formatSize,defaultSize:size.formatLimitSize}),{
                            title:$translate.instant('N106021'),//N106021='提示'
                            okText:$translate.instant('N001008'),// N001008 = 确认
                            noCancel:true
                        });
    				}
    			},
    			onExtNameMismatch: function(info) {
    				unlockPage();
    				Confirm( $translate.instant('N106037',{type:info.name,allow:info.filters.toString()}) ,{
    					title:$translate.instant('N106021'),//N106021='提示'
                        okText:$translate.instant('N001008'),// N001008 = 确认
                        noCancel:true
                    });
    			},
    			onUploadError:function(status, msg) {
    				unlockPage();
    				var errmsg ='';
    				try{
    					if(msg && angular.isString(msg) && (msg = JSON.parse(msg))){
    						errmsg = $translate.instant( msg.code );
    					}
    				}catch(e){}
    				if(errmsg==''){
    					errmsg = $translate.instant('N106045');//N106045=上传失败
    				}else{
    					//'N106038':'上传文件出现错误：' + 具体报错信息
    					errmsg = $translate.instant('N106038')
    							+ $translate.instant(errmsg);
    				}
    				Confirm(errmsg,{
    					title:$translate.instant('N106021'),//N106021='提示'
                        okText:$translate.instant('N001008'),// N001008 = 确认
                        noCancel:true
                    });
    			},
        		browseFileBtn :
        			'<button class="browse-file mySelfClass" ></button>',
                extFilters: [".jpg", ".jpeg", ".bmp", ".png", ".gif"]
                
        };
        vm.onComplete = function(file) {
        	vm.img=file.msg;
//        	vm.img.url = vm.baseurl + vm.img.fileId;
        	unlockPage();
        	vm.getFileRight(vm.img);
//            alert("上传成功");
        };
        
        vm.deleteFile=function(){
        	 try {
        		if(!vm.img.fileId || vm.img.fileId==''){
        			return ;
        		}
        		Confirm($translate.instant('N106041'), {// 'N106041':'确认删除此文件？',
        			title:$translate.instant('N106021'),//N106021='提示'
        			okText:$translate.instant('N001008'),// N001008 = 确认
        		 })
	             .then(function() {
	            	//删除
	         		vm.isDeleted=true;
	         		vm.img.fileId = '';
	 				vm.img.fileName = '';
	 				vm.img.url = '';
                    $rootScope.OVERFLOW = '';
	 				$scope.closeThisDialog(vm.isDeleted);
	             });
			} catch (e) {
				// TODO: handle exception
			}
        };
        /*关闭*/
        vm.close = function(){
            $rootScope.OVERFLOW = '';
        	$scope.closeThisDialog(vm.isDeleted);
        };
        
       
    }
})();
