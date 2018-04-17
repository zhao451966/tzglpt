(function() {
    'use strict';

    angular.module('demo.core')
        .controller('DialogMessageConfigController', DialogMessageConfigController);

    /* @ngInject */
    function DialogMessageConfigController($scope,$timeout,item, Restangular,Confirm,fileAccessAPI ) {
    	
    	 var handler;
    	 var vm = this;
    	 vm.item={};
    	 angular.extend(vm.item,$scope.ngDialogData,item);
    	//内部消息
//    	 vm.item.inner={
//    		content:'\{content\}'
//    	 };
    	 //email
    	 vm.item.email={
					content:'<h1 id="title" style="font-size: 32px; font-weight: bold; border-bottom-color: rgb(204, 204, 204); border-bottom-width: 2px; border-bottom-style: solid; padding: 0px 4px 0px 0px; text-align: center; margin: 0px 0px 20px;">'
			    		+'\{title\}'
			    		+'</h1>'
			    		+'<p id="hello">'
			    		+'\{hello\}:'
			    		+'</p>'
			    		+'<p id="content">&nbsp;&nbsp;&nbsp;&nbsp;\{content\}</p>'
		};
    	//钉钉模板
    	 vm.item.ding={
    	     head:'\{head\}',
			 title:'\{title\}',
			 dingContent:'\{content\}',
			 dingImage:'',
			 sender:'\{sender\}',
			 sendTime:'\{date\}',
			 contentType:'1'
    	 };
    	 
    	 //根据 业务类型编号 查询 各消息类型模板
    	 Restangular.all('messageCenter/sysmessageconf/'+vm.item.vcOptno)
     	 .customGET()
     	 .then(function(data){
     		 if(data){
     			 //消息类型 是否选中
     			 for(var i=0;i<data.length;i++){
     				 var conf = data[i];
     				 //模板选中的
     				 if(conf.vcIsChecked=='1'){
     					 if(conf.vcMsgType=='1'){
     						//vm.item.innerCheck=true;
     					 }else if(conf.vcMsgType=='2'){
     						vm.item.emailCheck=true;
     						if(conf.vcMsgTemplate){
     							vm.item.email={
     								content:conf.vcMsgTemplate
     							};
     						}
     					 }else if(conf.vcMsgType=='3'){
     						vm.item.dingGroupCheck=true;
     					 }else if(conf.vcMsgType=='4'){
     						vm.item.fxfamilyCheck=true;
     					 }else if(conf.vcMsgType=='5'){
     						vm.item.dingOneCheck=true;
     					 }else if(conf.vcMsgType=='6'){
     						vm.item.mobCheck=true;
     						if(conf.vcMsgTemplate){
     							vm.item.inner = {
     									content:conf.vcMsgTemplate
     							};
     						}
     					 }
     					 //钉钉模板
     					 if(conf.vcMsgType=='3' || conf.vcMsgType=='4' || conf.vcMsgType=='5'){
     						vm.item.ding = vm.buildTemplate(conf);
     					 }
     				 }
     			 }
     		 }
     	 });
    	 
    	vm.buildTemplate = function (conf){
    		var fulltemplate = eval('('+conf.vcMsgTemplate+')');
    		var template = fulltemplate.txtImageTemplate;
    		var head ='\{head\}'; 
			var title = '\{title\}';
			var content ='\{content\}'; 
			var image = '';
			var contentType='1';
			if(conf.vcMsgContextType=='1'){
				contentType ='1';//图文
			}else{
				contentType ='0';
			}
			if(template){
				try {
					head = template.oa.head.text;
				} catch (e) {}
				try {
					title = template.oa.body.title;
				} catch (e) {}
				try {
					content = template.oa.body.content;
				} catch (e) {}
				try {
					image = template.oa.body.image;
//					vm.getFileRight({fileId:image});
				} catch (e) {}
			}
			return {
	       	     head:head,
	   			 title:title,
	   			 dingContent:content,
	   			 dingImage:image,
	   			 sender:'\{sender\}',
	   			 sendTime:'\{date\}',
	   			 contentType:contentType
	       	 };
    	};
    	 
    	
    	 //保存
    	 vm.save=function(){
 	   		 //保存更新
 	       	 Restangular.all('messageCenter/sysmessageconf')
 	   		 .post(vm.item)
              .then(function(data) {
                 $scope.closeThisDialog();
              });
    	 };
    	 
      	 //邮件 富文本框初始化配置
         vm.configEmialModel={
             zIndex:'11000',
             initialFrameHeight:200,
             initialFrameWidth: '100%',
             //显示的按钮
             toolbars:[['source', '|', 'undo', 'redo', '|',
                 'bold', 'italic', 'underline','|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                 'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                 'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|','simpleupload','|',
                 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify'
             ]]
         };
    	 //初始化加载完成事件
    	 vm.readyEmailModel=function(){
 
    	 };
    	 
    	 vm.options ={
			 browseFileBtn:'<button class="browse-file" style="'
				 +'width: 220px;height: 120px;padding: 0px;margin: 0px;'
				 +'-webkit-opacity: 0;-moz-opacity: 0;-khtml-opacity: 0;'
				 +'opacity: 0;filter: alpha(opacity=0);'
				 +'-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";'
				 +'filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=0);'
				 +'"></button>',
			 multipleFiles:false ,//单文件上传
			 extFilters: [".jpg", ".jpeg", ".bmp", ".png", ".gif"]
		 };
    	 /**
          * 上传成功事件
          */
         vm.onComplete = function(file) {
             var f = file.msg;
             if(f.fileId){
            	vm.getFileRight(f);
            	vm.item.ding.dingImage=f.fileId;
             }
         };
 
         vm.baseurl = ContextPath+'upload/service/download/';
         /*获取访问权限后 才能访问文件*/
         vm.getFileRight = function(file) {
             if(file.fileId){
                 fileAccessAPI
                 .one('filePath')
                 .customPOST(file)
                 .then(function(data) {
                     vm.dingimgUrl = vm.baseurl + data;
                 });
             }
         };
         
//    	 vm.changeDingImage = function(){
//    		 $("#file1").click();
//    	 };
//    	 window.onDingImageChange = 
//    	 vm.onDingImageChange = function (){
//		 	var x = document.getElementById("file1");//获取上传控件
//			if(x==null || x.value==null){
//				return;
//			}
//			var path = /\.jpg$|\.jpeg$|\.gif$/i;//使用正则判断用户选择的文件类型
//			var file = x.files[0];
//			if(path.test(file.name)){
//				var reader = new FileReader();
//				reader.onload = function(e) {
//				    document.getElementById("dingImage").src = e.target.result; 
//				}
//				reader.readAsDataURL(file);
//			}else{
//				Confirm('请选择jpg、gif格式的图片！', {title: '提示',okText:'关闭',noCancel:true});
//			}
//    	 };
    	 
  
    }
})();
