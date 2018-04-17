(function() {
    'use strict';

    angular.module('demo.sample')
        .controller('SampleDialogController', SampleDialogController);

    /* @ngInject */
    function SampleDialogController(DialogFundInfo,DialogindustryStandard,DialogAddress,DialogEnterprise, DialogProject,DialogUser,DialogDeptUser,DialogUserFxt,DialogUnit,DialogRole,DialogExchange,DialogGlpt,DialogUserGlpt,DialogCompany,DialogPrdtrd,UserIUnitTreeExchangeController,UserUnitTreeExchangeController) {
        var vm = this;

        vm.item = {};

        //出资实体 单选
        vm.item.fundinfo={};
		vm.selectFundInfo=function(){
			var selected = '';
        	var option ={
        		"selectionMode":"single",
        	};
        	if(vm.item.fundinfo && vm.item.fundinfo.id){
        		selected = new Array();
        		selected[0] = vm.item.fundinfo.id;
        	}
        	DialogFundInfo(selected,option)
                .closePromise
                .then(function(data) {
                    if (angular.isObject(data.value)) {
                    	vm.item.fundinfo = data.value[0];
                    }
                });
        };
        
        //出资实体 多选
        vm.item.fundinfoM=[];
		vm.selectFundInfoM=function(){
			var selected = '';
        	var option ={
        		"selectionMode":"multiple",
        	};
        	if(vm.item.fundinfoM.length>0){
        		selected = new Array();
        		selected = vm.item.fundinfoM.map(function(obj){
        			return obj.id;
        		});
        	}
        	DialogFundInfo(selected,option)
                .closePromise
                .then(function(data) {
                    if (angular.isObject(data.value)) {
                    	vm.item.fundinfoM = data.value;
                    }
                });
        };
        
        //选择行业
        vm.item.industry={};
        vm.selectIndustry=function(){
        	var option ={
        			//默认加载
//                    industryStandard:{id:''},//行业标准 id,vcStandardCode,vcStandardName
//                    industryCategoryI:{code:''},//所属行业I   code,name
//                    industryCategoryII:{code:''},//所属行业II
//                    industryCategoryIII:{code:''}//所属行业III
            	};
        	option = vm.item.industry;
        	
        	DialogindustryStandard(option)
            .closePromise
            .then(function(data) {
                if (angular.isObject(data.value)) {
                    //用户选择 的国家，省，市
                    vm.item.industry=data.value;
                    console.log(data.value);
                    //返回值 ：
//                    {
//                        industryStandard:{id:''},//行业标准 id,vcStandardCode,vcStandardName
//                        industryCategoryI:{code:''},//所属行业I   vcCategoryCode,vcCategoryName
//                        industryCategoryII:{code:''},//所属行业II
//                        industryCategoryIII:{code:''}//所属行业III
//                    }
                }
            });
        };
        
        //选择 国家，省，市
        vm.item.address={};
        vm.selectAddress=function(){
        	var option ={
    			//默认加载的 国家，省，市
//    	        "vcAppCountry":{VC_COUNTRY_ID:'',VC_COUNTRY_NAME:''},
//    	        "vcAppProvince":{VC_PROVIN_ID:'',VC_PROVIN_NAME:''},
//    	        "vcAppCity":{VC_CITY_ID:'',VC_CITY_NAME:''}
        	};
        	option = vm.item.address;
        	DialogAddress(option)
            .closePromise
            .then(function(data) {
                if (angular.isObject(data.value)) {
                    //用户选择 的国家，省，市
                    vm.item.address=data.value;
                    //返回值 ：
//                    "vcAppCountry":{VC_COUNTRY_ID:'xx',VC_COUNTRY_NAME:'xx'},
//              		"vcAppProvince":{VC_PROVIN_ID:'xx',VC_PROVIN_NAME:'xx'},
//              		"vcAppCity":{VC_CITY_ID:'xx',VC_CITY_NAME:'xx'},
//              		"addressCodes":'xx-xx-xx',
//              		"addressNames":'中国-江苏-南京'
                }
            });
        };
        
        //选择企业单选
        vm.item.company ={};
        vm.selectCompany = function(){
        	var selected = '';
        	var option ={
        			"selectionMode":"single",
        			//默认加载的 国家，省，市
        	        "vcAppCountry":{VC_COUNTRY_ID:'',VC_COUNTRY_NAME:''},
        	        "vcAppProvince":{VC_PROVIN_ID:'',VC_PROVIN_NAME:''},
        	        "vcAppCity":{VC_CITY_ID:'',VC_CITY_NAME:''}
        	};
        	if(vm.item.company.vcId){
        		selected = new Array();
        		selected[0] = vm.item.company.vcId;
        	}
            DialogCompany(selected,option)
                .closePromise
                .then(function(data) {
                	/*data :{
                	"address":{
                   		"selectCountry":$scope.ngDialogData.vcAppCountry,
                  		"selectProvince":$scope.ngDialogData.vcAppProvince,
                  		"selectCity":$scope.ngDialogData.vcAppCity
                  	},
                  	"selectedRows":$scope.$$selectedRows
                	}*/
                    if (angular.isObject(data.value)) {
                    	var selectedRows=data.value.selectedRows;//数组
                    	var address = data.value.address;//对象
                        vm.item.company ={
                        	//companyInfo 所有字段均可获取
                        	vcId:selectedRows[0].vcId,
                            vcCompanyCode: selectedRows[0].vcCompanyCode,
                            vcCompanyName: selectedRows[0].vcCompanyName
                        };
                        //用户选择 的国家，省，市
           	        	vm.address=address;
                    }
                });
        };
        //选择企业多选
        vm.item.companys =[];
        vm.selectCompanys = function(){
        	var selected = '';
        	var option ={
        			"selectionMode":"multiple",
        			//默认加载的 国家，省，市
        	        "vcAppCountry":{VC_COUNTRY_ID:'',VC_COUNTRY_NAME:''},
        	        "vcAppProvince":{VC_PROVIN_ID:'',VC_PROVIN_NAME:''},
        	        "vcAppCity":{VC_CITY_ID:'',VC_CITY_NAME:''}
        	};
        	if(vm.item.companys.length>0){
        		selected = new Array();
        		selected = vm.item.companys.map(function(obj){
        			return obj.vcId;
        		});
        	}
            DialogCompany(selected,option)
                .closePromise
                .then(function(data) {
                    if (angular.isObject(data.value)) {
                    	var selectedRows=data.value.selectedRows;//数组
                    	var address = data.value.address;//对象
                        vm.item.companys = selectedRows.map(function(obj){
                        	return {
                        		//companyInfo 所有字段均可获取
                            	vcId:obj.vcId,
                                vcCompanyCode: obj.vcCompanyCode,
                                vcCompanyName: obj.vcCompanyName
                        	}
                        });
                       //用户选择 的国家，省，市
           	        	vm.address=address;
                    }
                });
        };
        //选择证券多选
        vm.item.prdtrds =[];
        vm.selectPrdtrds = function(){
            var selected = '';
            var option ={
                "selectionMode":"multiple"
            };
            if(vm.item.prdtrds.length>0){
                selected = new Array();
                selected = vm.item.prdtrds.map(function(obj){
                    return obj.vcTrdCode;
                });
            }
            DialogPrdtrd(selected,option)
                .closePromise
                .then(function(data) {
                    if (angular.isObject(data.value)) {
                        vm.item.prdtrds = data.value.map(function(obj){
                            return {
                                //companyInfo 所有字段均可获取
                                vcId:obj.vcId,
                                vcTrdCode: obj.vcTrdCode,
                                vcCompanyName: obj.vcSecuSht
                            }
                        });
                    }
                });
        };
      //管理平台
        vm.item.glpts=[];
        vm.queryGlpts=function(){
        	var selected = '';
        	var option ={
        			"selectionMode":"multiple"
        	};
        	if(vm.item.glpts.length > 0){
        		selected = new Array();
        		selected = vm.item.glpts.map(function(obj){
            		return obj.unitCode;
            	});
        	}
        	DialogGlpt(selected,option).closePromise
            .then(function(data) {
                if (angular.isObject(data.value)) {
                	 vm.item.glpts = data.value.map(function(obj) {
                         return {
                        	 unitName:obj.unitName,
                             unitCode:obj.unitCode
                         }
                     });
                }
            });
        };
        vm.item.glpt={};
        vm.queryGlpt=function(){
        	var selected = '';
        	var option ={
        			"selectionMode":"single"
        	};
        	if(vm.item.glpt.userUnitId){
        		selected = new Array();
        		selected [0] = vm.item.glpt.unitCode;
        	}
        	DialogGlpt(selected,option).closePromise
            .then(function(data) {
                if (angular.isObject(data.value)) {
                	vm.item.glpt = {
            			unitName:data.value[0].unitName,
                        unitCode:data.value[0].unitCode
                    };
                }
            });
        };
        //用户管理平台
        vm.item.userglpts=[];
        vm.queryuserGlpts=function(){
        	var selected = '';
        	var option ={
        			"selectionMode":"multiple"
        	};
        	if(vm.item.userglpts.length > 0){
        		selected = new Array();
        		selected = vm.item.userglpts.map(function(obj){
            		return obj.userUnitId;
            	});
        	}
        	DialogUserGlpt(selected,option).closePromise
            .then(function(data) {
                if (angular.isObject(data.value)) {
                	 vm.item.userglpts = data.value.map(function(obj) {
                         return {
                        	 glptName:obj.glptName,
                             glptCode:obj.glptCode,
                             userUnitId:obj.userUnitId
                         }
                     });
                }
            });
        };
        vm.item.userglpt={};
        vm.queryuserGlpt=function(){
        	var selected = '';
        	var option ={
        			"selectionMode":"single"
        	};
        	if(vm.item.userglpt.userUnitId){
        		selected = new Array();
        		selected [0] = vm.item.userglpt.userUnitId;
        	}
        	DialogUserGlpt(selected,option).closePromise
            .then(function(data) {
                if (angular.isObject(data.value)) {
                	vm.item.userglpt = {
            			glptName:data.value[0].glptName,
                        glptCode:data.value[0].glptCode,
                        userUnitId:data.value[0].userUnitId
                    };
                }
            });
        };
        
        vm.item.project={};
        // 选择项目(单选)
        vm.queryProject = function() {
        	var selected = '';
        	var option ={
        			"selectionMode":"single"
        	};
        	if(vm.item.project.projectCode){
        		selected = new Array();
        		selected [0] = vm.item.project.vcProId;
        	}
        	DialogProject(selected,option).closePromise
            .then(function(data) {
                if (angular.isObject(data.value)) {
                	vm.item.project = {
            			projectName:data.value[0].vcProName,
                        projectCode:data.value[0].vcProNo,
                        vcProId:data.value[0].vcProId
                    };
                }
            });
        };
        //项目多选
        vm.item.projects =[];
        vm.queryProjects = function(){
        	var selected = '';
        	var option ={
        			"selectionMode":"multiple"
        	};
        	if(vm.item.projects.length > 0){
        		selected = new Array();
        		selected = vm.item.projects.map(function(obj){
            		return obj.vcProId;
            	});
        	}
        	DialogProject(selected,option).closePromise
            .then(function(data) {
                if (angular.isObject(data.value)) {
                	 vm.item.projects = data.value.map(function(obj) {
                         return {
                        	 projectName:obj.vcProName,
                             projectCode:obj.vcProNo,
                             vcProId:obj.vcProId
                         }
                     });
                }
            });
        };

        vm.item.selusers=[];
        // 选择用户（多选）
        vm.queryUser = function() {
        	var selected = '';
        	var option ={
        			"selectionMode":"multiple"
        	};
        	if(vm.item.selusers.length > 0){
        		selected = new Array();
        		selected = vm.item.selusers.map(function(obj){
            		return obj.userCode;
            	});
        	}
            DialogUser(selected,option).closePromise
                .then(function(data) {
                    if (angular.isObject(data.value)) {
                        vm.item.selusers = data.value.map(function(obj) {
                        	if(obj.userCode){
                        		return {
                                    userCode: obj.userCode,
                                    userName: obj.userName
                                }
                        	}
                        });
                    }
                });
        };

        vm.item.seluser={};
        // 选择用户（单选）
        vm.queryUserSingle = function() {
        	var selected = '';
        	var option ={
        			"selectionMode":"single"
        	};
        	if(vm.item.seluser.userCode){
        		selected = new Array();
        		selected [0] = vm.item.seluser.userCode;
        	}
            DialogUser(selected,option).closePromise
                .then(function(data) {
                    var user = data.value[0];
                    if (angular.isObject(user)) {
                        vm.item.seluser = {
                            userCode: user.userCode,
                            userName: user.userName
                        };
                    }
                });
        };
        
        vm.item.selusersFxt=[];
        // 选择复星通人员（多选）
        vm.queryUserFxt = function() {
        	var selected = '';
        	var option ={
        			"selectionMode":"multiple"
        	};
        	if(vm.item.selusersFxt.length > 0){
        		selected = new Array();
        		selected = vm.item.selusersFxt.map(function(obj){
            		return obj.userCode;
            	});
        	}
        	DialogUserFxt(selected,option).closePromise
                .then(function(data) {
                    if (angular.isObject(data.value)) {
                        vm.item.selusersFxt = data.value.map(function(obj) {
                            return {
                                userCode: obj.userCode,
                                userName: obj.userName
                            }
                        });
                    }
                });
        };

        vm.item.seluserFxt={};
        // 选择复星通人员（单选）
        vm.queryUserSingleFxt = function() {
        	var selected = '';
        	var option ={
        			"selectionMode":"single"
        	};
        	if(vm.item.seluserFxt.userCode){
        		selected = new Array();
        		selected [0] = vm.item.seluserFxt.userCode;
        	}
        	DialogUserFxt(selected,option).closePromise
                .then(function(data) {
                    var user = data.value[0];
                    if (angular.isObject(user)) {
                        vm.item.seluserFxt = {
                            userCode: user.userCode,
                            userName: user.userName
                        };
                    }
                });
        };
        
        //树形部门 -- 用户(多选)
        vm.item.usersT =[];
        vm.deptTrreeQueryUser=function(){
        	var selected = '';
        	var option ={
        			"selectionMode":"multiple"
        	};
        	if(vm.item.usersT.length > 0){
        		selected = new Array();
        		selected = vm.item.usersT.map(function(obj){
            		return obj.userCode;
            	});
        	}
        	DialogDeptUser(selected,option).closePromise
            .then(function(data) {
                 if (angular.isObject(data.value)) {
                	 vm.item.usersT = data.value.map(function(obj) {
                        return {
                            userCode: obj.userCode,
                            userName: obj.userName
                        }
                    });
                } 
            });
        };
        
        //树形部门 -- 用户(单选)
        vm.item.userT={};
        vm.deptTrreeQueryUserSingle=function(){
        	var selected = '';
        	var option ={
        			"selectionMode":"single"
        	};
        	if(vm.item.userT.userCode){
        		selected = new Array();
        		selected [0] = vm.item.userT.userCode;
        	}
        	DialogDeptUser(selected,option).closePromise
            .then(function(data) {
                 if (angular.isObject(data.value)) {
                	 vm.item.userT = 
                	 {
                            userCode: data.value[0].userCode,
                            userName: data.value[0].userName
                     };
                } 
            });
        };
        
        // 部门（多选）
        vm.item.units=[];
        vm.queryUnit = function() {
        	var selected = '';
        	var option ={
        			"selectionMode":"multiple"
        	};
        	if(vm.item.units.length > 0){
        		selected = new Array();
        		selected = vm.item.units.map(function(obj){
            		return obj.unitCode;
            	});
        	}
            DialogUnit(selected,option).closePromise
                .then(function(data) {
                    if (angular.isObject(data.value)) {
                        vm.item.units = data.value.map(function(obj) {
                            return {
                                unitCode: obj.unitCode,
                                unitName: obj.unitName
                            }
                        });
                    }
                });
        };
      
        //部门单选
        vm.item.unit={};
        vm.queryUnitSingle=function(){
        	var selected = '';
        	var option ={
        			"selectionMode":"single"
        	};
        	if(vm.item.unit.unitCode){
        		selected = new Array();
        		selected[0] = vm.item.unit.unitCode;
        	}
        	 DialogUnit(selected , option).closePromise
             .then(function(data) {
                 if (angular.isObject(data.value)) {
                     vm.item.unit = 
                     	{
                             unitCode: data.value[0].unitCode,
                             unitName: data.value[0].unitName
                         }
                 }
             });
        };
      
        
        // 角色（多选）
        vm.item.roles=[];
        vm.queryRoles = function() {
        	var selected = '';
        	var option ={
        			"selectionMode":"multiple"
        	};
        	if(vm.item.roles.length > 0){
        		selected = new Array();
        		selected = vm.item.roles.map(function(obj){
            		return obj.roleCode;
            	});
        	}
            DialogRole(selected, option).closePromise
                .then(function(data) {
                    if (angular.isObject(data.value)) {
                        vm.item.roles = data.value.map(function(obj) {
                            return {
                                roleCode: obj.roleCode,
                                roleName: obj.roleName
                            }
                        });
                    }
                });
        };
        //单选
        vm.item.role ={};
        vm.queryRole = function() {
        	var selected = '';
        	var option ={
        			"selectionMode":"single"
        	};
        	if(vm.item.role.roleCode){
        		selected = new Array();
        		selected[0] = vm.item.role.roleCode;
        	}
            DialogRole(selected ,option).closePromise
                .then(function(data) {
                    if (angular.isObject(data.value)) {
                        vm.item.role =
                        	{
                                roleCode: data.value[0].roleCode,
                                roleName: data.value[0].roleName
                            }
                    }
                });
        };
         vm.item.exchanges ={};
        //选择汇率
        vm.selectExchange = function(){
            var target = vm.item;
            DialogExchange()
                .closePromise
                .then(function(data) {
                    if (angular.isObject(data.value)) {
                        vm.item.exchanges =
                        {
                            exchange: data.value.exchange,
                            exchangeDate: data.value.exchangeDate,
                            vcCurrency: data.value.fromExchange
                        }
                    }
                });
        };

        vm.item.userIUnitTree ={};
        //选择管理平台
        vm.userIUnitTree = function(){
            var selected = [];
            if(vm.item.userIUnitTree.VCID) {
                    selected.VCID = vm.item.userIUnitTree.VCID
            }
            selected.USERCODE = 'U0001013'
            var option ={};
            UserIUnitTreeExchangeController(selected,option)
                .closePromise
                .then(function(data) {
                    if (angular.isObject(data.value)) {
                        vm.item.userIUnitTree =
                        {
                            VCID: data.value.VCID,
                            DEPTNAME: data.value.DEPTNAME,
                        }
                    }
                });
        };

        vm.item.unitsTree ={};
        //选择管理平台
        vm.userUnitTree = function(){
            var selected = [];
            if(vm.item.unitsTree.length > 0){
                selected = new Array();
                selected = vm.item.unitsTree.map(function(obj){
                    return obj.unitCode;
                });
            }
            var option ={};
            UserUnitTreeExchangeController(selected,option)
                .closePromise
                .then(function(data) {
                    if (angular.isObject(data)) {
                        vm.item.unitsTree = data.value.map(function(obj) {
                            return {
                                unitCode: obj.unitCode,
                                unitName: obj.unitName
                            }
                        });
                    }
                });
        };


    }
})();