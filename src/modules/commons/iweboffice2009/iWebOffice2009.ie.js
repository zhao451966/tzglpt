
(function() {
    'use strict';

    angular.module('demo.core')
        .controller('IWebOfficeController', IWebOfficeController);

    function IWebOfficeController($scope,Restangular,FileUtils, Confirm, toastr,file,fileAccessAPI,Authenticate ) {

        var vm = this;
        vm.baseurl = ContextPath+'upload/service/download/';
        vm.file = angular.extend({},file);
        vm.bowerType='';
        if(/chrome/.test(navigator.userAgent.toLowerCase())){
        	vm.bowerType='chrome';
        }else if(navigator.userAgent.toLowerCase().indexOf("trident")!=-1
        		&& navigator.userAgent.indexOf("rv")!=-1 ){
        	vm.bowerType='ie';//IE 11
        }else if (!!window.ActiveXObject || "ActiveXObject" in window){
        	vm.bowerType='ie';
        }
        
        vm.CurrentUser  = Authenticate.getUser();
        vm.markTxt = '';//水印文字
        vm.markTxt += vm.CurrentUser.userName + ' ' + new Date().toLocaleString();
        
        window.filePermision=vm.file.filePermision;//文件权限对象
        vm.WebOffice={inited:false};//控件是否成功加载

        //按钮权限
        var print = Authenticate.checkOpt('PROJECT_FILE_VIEW', 'FILE_PRINT');
        var down = Authenticate.checkOpt('PROJECT_FILE_VIEW', 'FILE_DOWNLOAD');
        var remove = Authenticate.checkOpt('PROJECT_FILE_VIEW', 'FILE_DELETE');
        if(vm.file.filePermision && vm.file.filePermision != {}){
        	//如果传递了权限控制参数，则以传递的参数为准， 适用与 特殊权限控制，如董事约见
        	window.filePermision = vm.file.filePermision;
        }else{
        	//其他 情况 按权限配置
        	window.filePermision = vm.file.filePermision ={
        			view:print,
        			down:down,
        			remove:remove
        	};
        }
        
    	 
    	/**
    	 * Word添加文字水印 
    	 */
    	window.WaterMark = vm.WaterMark = function (WordObject,markTxt){
    		  try {
				WordObject.Application.Selection.HeaderFooter.Shapes
						.AddTextEffect(0, markTxt, "宋体", 1, false, false, 0, 0)
						.Select();
				WordObject.Application.Selection.ShapeRange.TextEffect.NormalizedHeight = false;
				WordObject.Application.Selection.ShapeRange.Line.Visible = false;
				WordObject.Application.Selection.ShapeRange.Fill.Visible = true;
				WordObject.Application.Selection.ShapeRange.Fill.Solid();
				//填充色 为十进制颜色
				WordObject.Application.Selection.ShapeRange.Fill.ForeColor.RGB = 11513775;
				WordObject.Application.Selection.ShapeRange.Fill.Transparency = 0;
				//0表示水平 315倾斜45度
				WordObject.Application.Selection.ShapeRange.Rotation = 315;
				WordObject.Application.Selection.ShapeRange.LockAspectRatio = true;
				//水印的宽度和高度
    		    WordObject.Application.Selection.ShapeRange.Height= 100;
    		    WordObject.Application.Selection.ShapeRange.Width= 250;
				WordObject.Application.Selection.ShapeRange.WrapFormat.AllowOverlap = true;
				WordObject.Application.Selection.ShapeRange.WrapFormat.Side = 3;
				WordObject.Application.Selection.ShapeRange.WrapFormat.Type = 3;
				WordObject.Application.Selection.ShapeRange.RelativeHorizontalPosition = 0;
				WordObject.Application.Selection.ShapeRange.RelativeVerticalPosition = 0;
				WordObject.Application.Selection.ShapeRange.Left = -999995;
				WordObject.Application.Selection.ShapeRange.Top = -999995;
				WordObject.Application.ActiveWindow.ActivePane.View.SeekView = 0;
			} catch (e) {
				Confirm("当前文档无法加水印！"+e, {title: '提示',okText:'关闭',noCancel:true});
			}
    	};
    	window.warterMarkByType = vm.warterMarkByType = function(){
			try {
				if (webform.WebOffice.FileType == ".doc") {
					var WordObject = webform.WebOffice.WebObject; // 获取当前文档对象
					// 获取文档特殊符号值进行判断
					var n = WordObject.Application.ActiveDocument.PageSetup.DifferentFirstPageHeaderFooter;
					 if (n == "9999999") { // 含有分节符的文档
						WordObject.Application.ActiveWindow.ActivePane.View.SeekView = 2;
						window.WaterMark(WordObject, vm.markTxt); // 添加文字水印
						WordObject.Application.ActiveDocument.Sections(3).Range
								.Select();
						WordObject.Application.ActiveWindow.ActivePane.View.SeekView = 9;
						window.WaterMark(WordObject, vm.markTxt);
						WordObject.Application.ActiveWindow.ActivePane.VerticalPercentScrolled = 2
					} else if (n == "0") { // 含有分栏分页及正常的文档
						WordObject.Application.ActiveWindow.ActivePane.View.SeekView = 9;
						window.WaterMark(WordObject, vm.markTxt);
					} else if (n == "-1") { // 含有分隔符的文档
						WordObject.Application.ActiveWindow.ActivePane.View.SeekView = 2;
						window.WaterMark(WordObject, vm.markTxt);
						WordObject.Application.ActiveWindow.ActivePane.View.SeekView = 1;
						window.WaterMark(WordObject, vm.markTxt);
					}
				} else if (webform.WebOffice.FileType == ".xls") {
					var ExcelObject = webform.WebOffice.WebObject; // 获取当前文档对象
					var sheetCount = ExcelObject.Sheets.Count;
					for (var i = 1; i <= sheetCount; i++) {
						var sheet = ExcelObject.Application.Sheets(i);
						sheet.Shapes.AddTextEffect(12, vm.markTxt,"宋体", 50, 0, 0, 250,250).Select();
						sheet.Shapes( sheet.Shapes.Count ).IncrementRotation(328);
					}
				} else if (webform.WebOffice.FileType == ".ppt") {
					var PPTObject = webform.WebOffice.WebObject; // 获取当前文档对象
					var pptCount = PPTObject.Application.Presentations(1).Slides.Count;
					console.log(pptCount);
					for(var i=1;i<=pptCount;i++){
						var ppt = PPTObject.Application.Presentations(1).Slides(i);
						ppt.Shapes.AddTextEffect(12, vm.markTxt, "宋体", 50, 0, 0, 0, 200).Select();
						ppt.Shapes( ppt.Shapes.Count ).IncrementRotation(-27.98);
					}
				}
			} catch (e) {
				// TODO: handle exception
				alert("当前文档无法加水印！"+e);
			}
		};
		
    	//作用：载入iwebform.WebOffice
    	window.Load = vm.Load = function () {
    		try {
    			
    			//以下属性必须设置，实始化iwebform.WebOffice
    			webform.WebOffice.WebUrl = getContextPath()+"service/weboffice/ExecuteRun"; //WebUrl:系统服务器路径，与服务器文件交互操作，如保存、打开文档，重要文件
    			webform.WebOffice.RecordID = vm.file.fileId; //RecordID:本文档记录编号
    			webform.WebOffice.Template = ""; //Template:模板编号
    			webform.WebOffice.FileName = vm.file.fileName; //FileName:文档名称
    			webform.WebOffice.FileType = vm.file.fileType; //FileType:文档类型  .doc  .xls  .wps
    			webform.WebOffice.UserName = vm.file.userName; //UserName:操作用户名，痕迹保留需要
    			webform.WebOffice.EditType = '1,0'; 
    			webform.WebOffice.MaxFileSize = vm.file.maxFileSize; //最大的文档大小控制，默认是8M。
    			webform.WebOffice.Language = vm.file.language; //Language:多语言支持显示选择   CH简体 TW繁体 EN英文
    			webform.WebOffice.ShowWindow = true;//控制显示打开或保存文档的进度窗口，默认不显示
    			webform.WebOffice.PenColor = "#FF0000"; //PenColor:默认批注颜色
    			webform.WebOffice.PenWidth = "1"; //PenWidth:默认批注笔宽
    			webform.WebOffice.Print = "1"; //Print:默认是否可以打印:1可以打印批注,0不可以打印批注
    			webform.WebOffice.ShowToolBar = "2"; //ShowToolBar:是否显示自定义工具栏:1显示,0不显示
//    			webform.WebOffice.ShowMenu = "1"; //控制整体菜单显示
//    			//以下为自定义菜单↓
    			
//    			webform.WebOffice.AppendMenu("1", "上传文件(&U)");
//    			webform.WebOffice.AppendMenu("2", "打开本地文件(&L)");
//    			webform.WebOffice.AppendMenu("3", "添加水印(&W)");
//    			webform.WebOffice.AppendMenu("4", "保存到本地(&S)");
//    			webform.WebOffice.AppendMenu("5", "保存到服务器(&F)");
//    			webform.WebOffice.AppendMenu("6", "关闭文件(&L)");
//    			webform.WebOffice.AppendMenu("7", "-");
//    			webform.WebOffice.AppendMenu("8", "打印(&P)");
//    			
//    			webform.WebOffice.AppendMenu("1", "添加水印(&W)");
//    			webform.WebOffice.AppendMenu("2", "保存到本地(&S)");
//    			webform.WebOffice.AppendMenu("3", "打印(&P)");
    			webform.WebOffice.ShowMenu = "0"; //控制整体菜单显示 0 不显示
    			//以上为自定义菜单↑ 
    			//禁止某个（些）菜单项多个 以  ; 分割
//    			webform.WebOffice.DisableMenu("上传文件(&U)"); 
    			webform.WebOffice.WebOpen(); //打开该文档    交互OfficeServer  调出文档OPTION="LOADFILE"    调出模板OPTION="LOADTEMPLATE"     <参考技术文档>
    			webform.WebOffice.ShowType = "1"; //文档显示方式  1:表示文字批注  2:表示手写批注  0:表示文档核稿
//    			webform.WebOffice.Active(true);//得到焦点
//    			window.warterMarkByType();//自动加水印
//    			webform.WebOffice.EditType = '0,0'; //改为不可编辑
//    			WebOffice.WebSetProtect(true,"");//保护文档状态
    			vm.WebOffice={inited:true};
    		} catch (e) {
    			vm.WebOffice={inited:false};
    			alert('控件加载异常'+e +"确保webform.WebOffice.WebUrl 地址正确");
    		}
    	};
    	
    	//作用：退出iwebform.WebOffice
    	window.UnLoad = vm.UnLoad =function () {
    		try {
    			 webform.WebOffice.WebClose() ;
    		} catch (e) {
    			alert('控件关闭异常'+e);
    		}
    	};
    	
    	vm.addWaterMark=function(){
    		vm.OnMenuClick("1", "添加水印(&W)");
    	};
    	vm.download=function(){
    		vm.OnMenuClick("2", "保存到本地(&S)");
    	}; 
    	vm.deleteFile=function(){
    		window.UnLoad();
    		$scope.closeThisDialog(true);
    	};
    	vm.print=function(){
    		vm.OnMenuClick("3", "打印(&P)");
    	};
    	
        /*关闭*/
        vm.close = function(){
        	window.UnLoad();
        	$scope.closeThisDialog(vm.isDeleted);
        };
    }
})();
	

 