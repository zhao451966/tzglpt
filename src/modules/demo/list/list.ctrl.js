(function() {
    'use strict';

    angular.module('demo.sample')
        .controller('SampleListController', SampleListController);

     /* @ngInject
      *
      * @param  Confirm:确认窗口
      * @param  toastr :提示层
      * @param  ngDialog :弹开窗口
      *
      * */
    function SampleListController($scope, Confirm, toastr, ngDialog, FileUtils, $translate, Restangular) {

        var vm = this;

        vm.content = "abcded";
        
        $scope.$$pagination = {
            pageSize: 20
        };

        
        //文件上传成功
        vm.onComplete = function(file) {

            console.log(file);

            vm.file = file.msg;
            //var fileProp = JSON.parse(vm.file.msg);
            alert("上传成功，文件名称:"+vm.file.fileName);
        };

        vm.getUser = function() {
            CacheAPI.one('userdetails')
                .customGET();
        };




        vm.options = {
            extFilters: ['.png']
        };

        vm.getFiles = function() {
            FileUtils.getList('xxx', {'abc': 123})
                .then(function(data) {
                    console.log('files ', data);
                });
        };
 
        vm.removeFile = function() {

            FileUtils.remove(vm.file, true)
                .then(function() {
                    alert('成功删除');
                });
        };

        vm.save = function() {
            alert(JSON.stringify(vm.file));
        };

        Restangular.all("/common/getMutilLanCofig")
            .get()
            .then(function(data){
                if(data)
                    console.log(data);
            });

        /*// 查询方法
        vm.query = function() {
            ProjectAPI.getList($scope.$$params)
                .then(function(data) {
                    vm.items = data;
                })
        };

        $scope.$$customFilters = [{
            filterName: '已关闭项目',
            filterValue: {
                vcProName: '肯德基'
            }
        }];
        
        
        /!**
         * 消息发送
         *!/
        vm.messageSender=function(){
        	var option ={
        			optId:'',//模块，或者表
        			optMethod:'',//方法，或者字段
        			optTag:'' //一般用于关联到业务主体
        	};
        	DialogMessageSender('',option)
            .closePromise
            .then(function(data) {
                if (angular.isObject(data.value)) {
                }
            });
        };
        
        vm.messageConfig=function(){
        	var option ={
        			optId:'',//模块，或者表
        			optMethod:'',//方法，或者字段
        			optTag:'' //一般用于关联到业务主体
        			//.....可扩展
        	};
        	DialogMessageConfig('',option)
            .closePromise
            .then(function(data) {
                if (angular.isObject(data.value)) {
                }
            });
        };
        
        
        /!**
         * 提交流程 回调函数
         * @param msg = 返回消息
         *!/
        vm.flowCallback = function(msg) {
        	alert('回调函数，返回消息：'+msg);
        }
        /!**
         * 流程提交
         *!/
        vm.applyFlow = function(type){
        	//流程必须参数
        	var option={
        			//流程节点配置 id
        			processid:'100006', 
        			//项目id
   				 	projectid:'4028484855bf4c220155c4ffee4101d2',
   				 	//业务单据页面url
   				 	pageurl:'xxx/xxx/xxx',
   				 	//业务流程描述
   				    businessdesc:'项目退出', 
   				    //当前业务单据状态
   				    state:'2', 
   				    //当前业务单据 id	
   				    businessid:'4028484855bf4c220155c424ce9d015e'
        	};
        	if(type=='commit'){
        		option.flowType='commit';
        		option.title='流程提交';
        		option.okText='提交';
        	}else if(type=='revoke'){
        		option.flowType='revoke';
        		option.title='流程撤销';
        		option.okText='撤销';
        	}else if(type=='review'){
        		option.flowType='review';
        		option.title='流程复核';
        		option.okText='复核';
        	}else{
        		alert('参数不详！');
        		return ;
        	}
        	DialogApplyFlow(option)
                .closePromise
                .then(function(data) {
                	
                });
        };
        
        vm.iweboffice2009=function(){
        	ngDialog.open({
        		template:'modules/commons/iweboffice2009/iWebOffice2009.html',
        		controller:'IWebOfficeController as vm',
        		className:'ngdialog-theme-default ngdialog-img',
        		resolve: {
                    file: function() {
                        return {
//                        	fileId:"7ebeba36363b41a98bbd8a3b9731e967", 
//                        	fileName:"test.doc",
//                        	fileType:".doc",//“.doc”、“.xls”、“.wps”或“.ppt” 等
                        	
//                        	fileId:"ecd4bbeabc7d4e9f9c0fef614289979d",
//                        	fileName:"文档分类v2.xlsx",
//                        	fileType:".xlsx",//“.doc”、“.xls”、“.wps”或“.ppt” 等
                        	
                        		
                        	fileId:"AF94E903CA5848FE876551458977aaaa",
                        	fileName:"2e012421b1bdb3b39a2b9fbe1395e476.pptx",
                        	fileType:".pptx",//“.doc”、“.xls”、“.wps”或“.ppt” 等
                        	
                        	userCode:'19009884',//当前Usercode
                        	userName:'Tester',//当前userName
                        	maxFileSize:8*1024,//文件最大大小
                        	language:'CH',//Language:多语言支持显示选择   CH简体 TW繁体 EN英文

                        	//按钮权限控制
                        	filePermision:{
                        		view:true,
                    			down:true,
                    			remove:true
                        	}
                        };
                    }
                }
        	});
        };
        
        vm.weboffice = function(){
        	ngDialog.open({
        		template:'modules/commons/weboffice/genericPdf.html',
        		controller:'genericPdfController as vm',
        		className:'ngdialog-theme-default ngdialog-img',
        		resolve: {
                    file: function() {
                        return {
                        	fileId:'aca6beb767698ca04a22411f86eb85241460344036871',
                        	accessUsercode:'19009884',//当前Usercode
                        	accessUsename:'陈峰',//当前userName
                        	/!**
                        	 * 	// 授权类别
								// 00    只读不加水印     01    只读加水印
								// 10    打印不加水印     11    打印加水印
								// 30    下载不加水印     31    下载加水印
                        	 *!/
                        	accessRight:'31',
                        	ORIGINAL:'1' //类型 0 原始文件 1 附属(PDF)文件
                        };
                    }
                }
        	});
        };
        
        //图片查看
        vm.ImageView=function(){
        	ngDialog.open({
        		template:'modules/demo/imgview/imgview.html',
        		controller:'ImageViewController as vm',
        		className:'ngdialog-theme-default ngdialog-img',
        		resolve: {
                    image: function() {
                        return {
                        	id:'',
                        	name:'',
                        	url:''
                        };
                    }
                }
        	});
        };
        
        // 通用弹出窗口查询
        vm.openDialog = function() {
            ngDialog.open({
                template: 'modules/demo/dialog/dialog.html',
                controller: 'SampleDialogController as vm',
                className: 'ngdialog-theme-default ngdialog-md'
            });
        };

        // 一对多示例
        vm.one2Many = function() {
            ngDialog.open({
                template: 'modules/demo/form/one2many.html',
                controller: 'SampleOne2ManyController as vm',
                className: 'ngdialog-theme-default ngdialog-md',
                resolve: {
                    item: function() {
                        //return Restangular
                        //    .all('sys/datacatalog')
                        //    .one('TEST')
                        //    .get();

                        return {dataDictionaries: []};
                    }
                }
            });
        };

        //附件上传
        vm.fileUpload = function(){
            ngDialog.open({
                template: '../../../../fileUpload/fileUpload.html',
                controller: '',
                className: 'ngdialog-theme-default ngdialog-md'
            });
        };

        // 新增
        vm.add = function() {
            ngDialog.open({
                template: 'modules/demo/form/form.html',
                controller: 'SampleAddController as vm',
                className: 'ngdialog-theme-default ngdialog-md'
            }).closePromise.then(function(data) {

                // 成功新增对象
                if (angular.isObject(data)) {
                    vm.query();
                }
            });
        };

        // 删除
        vm.remove = function(item) {
            Confirm($translate.instant('delete.project', {
                name: item.vcProName
            }), {
                title: $translate.instant('delete'),
                okText: $translate.instant('delete')
            })
                .then(function() {
                    // DELETE /projects/:id
                    return item.remove();
                })
                .then(function() {
                    toastr.success('成功删除项目！');
                    vm.query();
                });
        };

        // 关闭
        vm.close = function(item) {
            Confirm('是否确认关闭项目？')
                .then(function() {
                    // PUT /projects/:id/close
                    return item.customPUT(item, 'close')
                })
                .then(function() {
                    toastr.success('成功关闭项目！');
                    vm.query();
                });
        };

        // 恢复
        vm.restore = function(item) {
            Confirm('是否确认恢复项目？')
                .then(function() {
                    // PUT /projects/:id/restore
                    return item.customPUT(item, 'restore')
                })
                .then(function() {
                    toastr.success('成功恢复项目！');
                    vm.query();
                });
        };

        // 文档列表
        vm.doc = function() {
            vm.vcProId="10000";
            DialogDoc(vm.vcProId)
        };
        // 流程跟踪
        vm.applyFlowView = function() {
            var option={
                vcApplyId:"b8acd9c569ad4265a39a40237800e805",
            };
            DialogApplyFlowView(option)
        };
        // 流程跟踪业务
        vm.applyFlowViewyw = function() {
            var option={
                //流程节点配置 id
                processid:'100003',
                //当前业务单据 id
                businessid:'402808ec535f545301535f9b0001000c'
            };
            DialogApplyFlowView(option)
        };
        //baobiao
        vm.baobiao = function(){
            ngDialog.open({
                template: 'modules/demo/form/statpage.html',
                controller: 'StatpageController as vm',
                className: 'ngdialog-theme-default ngdialog-md'
            });
        };
        
        
    	/!**
         * 创建OA流程
         * customParam 扩展参数
         *!/
        
        vm.oaWorkFlow = function(customParam){
 
        	var option={
        		systemlanguage:'7',//中文语言
        		workflowid:'1212'//表示OA的投融资类型
//        		,isagent:'0',
//        		beagenter:'0',
//        		needPopupNewPage:'',
//        		isec:'',
//        		searchwfname:'',
//        		needall:'',
//        		prjid:'',
//        		docid:'',
//        		crmid:'',
//        		hrmid:'',
//        		topage:''
        	};
        	angular.extend(option,customParam);
        	var p = '';
        	for(var key in option){
        		p = p + key +'=' + option[key] + '&';
        	}
        	if(p!=''){
        		p = p.substring(0, p.length-1);
        	}
        	window.open('modules/commons/dialog/fxOA/dialog.oa.html?'+p);
        };
        //baobiao
        vm.oasc = function(){
            ngDialog.open({
                template: 'modules/demo/form/sc.html',
                controller: 'ScController as vm',
                className: 'ngdialog-theme-default ngdialog-md'
            });
        };*/
    }
})();