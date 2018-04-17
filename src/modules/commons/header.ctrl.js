(function() {
    'use strict';

    angular
        .module('demo.core')
        .controller('HeaderController', HeaderController);

    /* @ngInject */
    function HeaderController($scope, $timeout, $document,toastr,ngDialog,$translate, $state, $rootScope,SystemRestangular,Restangular) {
        window.toastr = toastr;
        var vm = this;

        vm.showHighSearch=false;


        vm.highSearch={};

        vm.dictionary={};

        vm.dictionary.fileTypes=
            Restangular.all("file/doctype").one("first")
                .getList().$object

        vm.dictionary.fileFirstTypes=[];

        vm.dictionary.quarters=[
            {dataValue:"第一季度",dataCode:'1'},
            {dataValue:"第二季度",dataCode:'2'},
            {dataValue:"第三季度",dataCode:'3'},
            {dataValue:"第四季度",dataCode:'4'},
        ]

        vm.selectFileType=function(){
            vm.highSearch.fileFirstType=null;
            vm.highSearch.year=undefined;
            vm.highSearch.quarter=undefined;
            vm.highSearch.month=undefined;
            vm.highSearch.filedate=undefined;

            if(vm.highSearch.fileType=='001'){
                //根据一级文件类型获取二级文件类型
                vm.dictionary.fileFirstTypes=Restangular.all("file/doctype").one("second").one(vm.highSearch.fileType)
                    .getList().$object
            }
        }

        vm.selectFirstType=function(){
            vm.highSearch.year=undefined;
            vm.highSearch.quarter=undefined;
            vm.highSearch.month=undefined;
            vm.highSearch.filedate=undefined;
        }


        var xbApp = angular.module("xbApp", ["ngCookies"]);

        //var i18n = getCookie("i18n");
        var i18n = getI18NCookieByUserOther();

        $scope.wen2A = i18n == 'zh_CN';
        index = i18n == 'zh_CN' ? 0 : 1;

        vm.translate = function() {
            var qie = ['zh_CN', 'en_US'][++index % 2];
            $translate.use(qie);
            setCookie("i18n",qie);
            getI18NResourse();
            //$state.reload();
            location.reload();
            Restangular.all('xplogin').one('qie').one(qie).get()
                .then(function(data) {
                })
            console.log(window.I18N_RESOURSE);
        };
        vm.translatelx = function(lx) {
            var indexlx=0;
            if('1'==lx){
                indexlx =1;
            }
            if('0'==lx){
                indexlx =0;
            }
            if(indexlx==index){
                index=indexlx;
                vm.translate();
            }
        };

        //2016-11-22 读取后端配置
//        Restangular.all('/CommonControll/getMutilLanCofig')
//        .customGET()
//        .then(function(data){
//        	if(data){
//        		if(data['sys.multi_lang']=='true'){
//        			vm.show_multi_lang=true;
//        		}else{
//        			vm.show_multi_lang=false;
//        		}
//        	}
//        });
        vm.show_multi_lang =Authenticate.checkOpt('LANG', 'LIST') ;//语言资源权限
        
        var menus = [
            //{
            //    name: '我的项目',
            //    children: [
            //        {name: '项目列表'}
            //    ]
            //},
            {
                name: '项目管理',
                children: [
                    {
                        name: '删除项目管理'
                    },
                    {
                        name: '停滞项目管理',
                        children: [
                            {name: '项目停滞期设置'},
                            {name: '停滞项目列表'},
                            {name: '挂起项目列表'}
                        ]
                    },
                    {
                        name: '项目合并管理'
                    },
                    {
                        name: '项目拆分管理'
                    },
                    {
                        name: '项目归档管理',
                        children: [
                            {name: '项目归档申请'},
                            {name: '项目归档审批'}
                        ]
                    }
                ]
            },
            {
                name: '会议管理',
                children: [
                    {
                        name: '上会申请',
                        route: 'root.launchExamineMeeting'
                    },
                    {
                        name: '董事约见',
                        route: 'root.boardappointapply'
                    },
                    {
                        name: '普通会议'
                    }
                ]
            },
            {
                name: '投后管理',
                children: [
                    {
                        name: '现金流及股权变动',
                        children: [
                            {name: '现金流及股权变动查询', route: 'root.casheqqry'},
                            {name: '一级市场数据维护', route: 'root.casheqinfo'},
                            {name: '股票数据查询', route: 'root.stock'},
                            {name: '股票数据上传', route: 'root.stockUpload'},
                            {name: '债卷数据查询', route: 'root.bond'},
                            {name: '债卷数据上传', route: 'root.bondUpload'}
                        ]
                    },
                    {
                        name: '红黄灯风险管理',
                        children: [
                            {name: '红黄灯自评'},
                            {name: '红黄灯发布'},
                            {name: '下次基准日校准'},
                            {name: '历史风险评估记录'},
                            {name: '风险缓释方案'},
                            {name: '历史风险缓释方案查询'},
                            {name: '定期报告'},
                            {name: '历史定期报告查询'}
                        ]
                    },
                    {
                        name: '财务管理'
                    },
                    {
                        name: '项目估值管理',
                        children: [
                            {name: '项目本期估值',route: 'root.projectAppraisal'},
                            {name: '项目现金流记录',route: 'root.projectAppraisal.cashFlow'},
                            {name: '本期估值记录',route: 'root.projectAppraisal'},
                            {name: '估值发布',route: 'root.projectAppraisal.release'},
                            {name: '下次基准日校准',route: 'root.projectAppraisal.baseDate'},
                            {name: '历史估值记录',route: 'root.projectAppraisal.history'}
                        ]
                    }
                ]
            },
            {
                name: '报表管理',
                children: [
                    {
                        name: '报表列表'
                    }
                ]
            },
            {
                name: '系统管理',
                children: [
                    {
                        name: '部门信息'
                    },
                    {
                        name: '人员信息'
                    },
                    {
                        name: '用户管理'
                    },
                    {
                        name: '角色管理'
                    },
                    {
                        name: '岗位管理'
                    }
                ]
            },
            {
                name: '基础数据管理',
                children: [
                    {
                        name: '项目类型维护'
                    },
                    {
                        name: '董事秘书人员信息维护'
                    },
                    {
                        name: '董事约见申请过期配置'
                    },
                    {
                        name: '董事约见邮件发送点配置'
                    },
                    {
                        name: '文档类型维护'
                    },
                    {
                        name: '出资实体维护'
                    },
                    {
                        name: '评估标准类型维护'
                    },
                    {
                        name: '评估风险类别及细则维护'
                    },
                    {
                        name: '内部资源库链接'
                    },
                    {
                        name: '第三方尽调资源维护'
                    }
                ]
            }
        ];
        vm.menus = menus;

        vm.openMenu = function(menu) {
            vm.menus.forEach(function(m) {
                m.selected = false;
            });

            menu.selected = true;
        };

        vm.openMenuBar = function() {
            vm.isMenuBarOpen = !vm.isMenuBarOpen;

            if (vm.isMenuBarOpen) {
                vm.openMenu(vm.menus[0]);
            }
        };


        var dimensions = [
            {
                name: '组织',
                children: [
                    {
                        name: '复星集团',
                        children: [{name: '投资团队'}, {name: '集团职能'}]
                    },
                    {
                        name: '核心企业',
                        children: [{name: '保险板块'}, {name: '产业运营'}, {name: '投资板块'}]
                    }
                ]
            },
            {
                name: '年报板块',
                children: [
                    {
                        name: '综合金融',
                        children: [
                            {name: '保险投资'},
                            {name: '投资', children: [{name: '战略投资'},{name: 'PE/VC投资'},{name: '二级市场投资'},{name: 'LP投资'},{name: '其他投资'}]},
                            {name: '资本管理'},
                            {name: '银行及其其他金融业务'}
                        ]
                    },
                    {
                        name: '产业运营',
                        children: [
                            {name: '健康'},
                            {name: '快乐时尚'},
                            {name: '钢铁'},
                            {name: '房地产销售'},
                            {name: '资源'}
                        ]
                    }
                ]
            },
            {
                name: '管理板块',
                children: [
                    {name: '保险板块'},
                    {name: '投资板块'},
                    {name: '产业运营'}
                ]
            },
            {
                name: '管理产业',
                children: [
                    {name: '大健康产业'},
                    {name: '快乐时尚产业'},
                    {name: '大宗商品产业'},
                    {name: '大金融产业', children: [{name: '保险产业'}, {name: '其他金融产业'}]},
                    {name: '互联网'},
                    {name: '大地产', children: [
                        {name: '健康地产'}, {name: '快乐时尚地产'},{name: '大宗商品地产'}, {name: '金融地产'},
                        {name: '互联网地产'}, {name: '文化地产'},{name: '物流地产'}, {name: '其他地产'}
                    ]},
                    {name: '大文化产业'},
                    {name: '大物流产业'},
                    {name: '其他产业', children: [{name: '健康地产'}, {name: '快乐时尚地产'}]}
                ]
            },
            {
                name: '行业',
                children: [
                    {name: '农、林、牧、渔业'},{name: '制造业'}, {name: '电力、煤气及水的生产和供应业'},{name: '建筑业'},
                    {name: '交通运输、仓储业'},{name: '信息技术业'},{name: '批发和零售贸易'},
                    {name: '金融、保险业'},{name: '房地产业'},{name: '社会服务业'},
                    {name: '传播与文化产业'},{name: '综合类'}
                ]
            },
            {
                name: '项目类别',
                children: [
                    {
                        name: '项目层面',
                        children: [
                            {
                                name: '一级市场-地产类',
                                children: [
                                    {name: '持有类'},
                                    {name: '开发类'},
                                    {name: '平台类'},
                                    {name: '其他'}
                                ]
                            },
                            {
                                name: '一级市场-非地产类',
                                children: [
                                    {name: 'PE已上市'},
                                    {name: '非PE已上市'}
                                ]
                            },
                            {
                                name: '一级半市场'
                            },
                            {
                                name: '二级市场'
                            },
                            {
                                name: '固定收益类',
                                children: [
                                    {name: '债券'},
                                    {name: '定期存款'},
                                    {name: '借款类（含拆借）'},
                                    {name: '其他'}
                                ]
                            }
                        ]
                    },
                    {
                        name: '基金层面',
                        children: [
                            {name: '基金'}, {name: '其他'}
                        ]
                    }
                ]
            },
            {
                name: '股比类型',
                children: [
                    {name: '联营'},
                    {name: '合营'},
                    {name: '控股'},
                    {name: '参股'},
                    {name: '其它'}
                ]
            },
            {
                name: '会计类别',
                children: [
                    {name: '交易性金融资产'},
                    {name: '可供出售金融资产'},
                    {name: '持有至到期投资'},
                    {name: '长期股权投资'}
                ]
            },
            {
                name: '投资地',
                children: [
                    {
                        name: '亚洲',
                        children: [
                            {name: '中东地区'},{name: '东南亚地区'},
                            {name: '东亚地区'},{name: '南亚地区'},
                            {name: '西亚地区'}
                        ]
                    },
                    {
                        name: '欧洲',
                        children: [
                            {name: '东欧地区'},
                            {name: '西欧地区'},{name: '南欧地区'},
                            {name: '北欧地区'}
                        ]
                    },
                    {
                        name: '北美洲'
                    },
                    {
                        name: '南美洲',
                        children: [
                            {name: '中美地区'},
                            {name: '南美洲地区'}
                        ]
                    },
                    {
                        name: '非洲'
                    },
                    {
                        name: '大洋洲'
                    },
                    {
                        name: '南极洲'
                    }
                ]
            },
            {
                name: '出资实体',
                children: [
                    {name: '保险资金'},
                    {name: '非保资金'}
                ]
            },
            {
                name: '币种',
                children: [
                    {name: '本币', children: [{name: '人民币'}]},
                    {
                        name: '原币',
                        children: [
                            {name: '人民币'},{name: '美元'},
                            {name: '港元'},{name: '欧元'},
                            {name: '日元'},{name: '卢比'},
                            {name: '台湾币'},{name: '英镑'},
                            {name: '新西兰元'},{name: '新加坡元'},
                            {name: '泰国铢'},{name: '澳元'},
                            {name: '加拿大元'},{name: '韩元'}
                        ]
                    }
                ]
            },
            {
                name: '项目阶段',
                children: [
                    {
                        name: '投前',
                        children: [
                            {name: '项目池'}, {name: '前期调研'},
                            {name: '立项阶段'}, {name: '尽调阶段'},
                            {name: '预审会'}, {name: '投决会'}
                        ]
                    },
                    {
                        name: '投后',
                        children: [
                            {name: '交易管理'}, {name: '投后管理'},
                            {name: '项目结束'}
                        ]
                    }
                ]
            },
            {
                name: '版本类型',
                children: [
                    {name: '确保'},
                    {name: '力争'},
                    {name: '挑战'},
                    {name: '不分版本'}
                ]
            },

            {
                name: '测试极限多级维度',
                children: [
                    {
                        name: '1级维度',
                        children: [
                            {
                                name: '二级维度',
                                children: [
                                    {
                                        name: '3级维度',
                                        children: [
                                            {name: '4级维度'},
                                            {name: '4级维度'},
                                            {
                                                name: '4级维度',
                                                children: [
                                                    {name: '5级维度'},
                                                    {name: '5级维度'},
                                                    {name: '5级维度'},
                                                    {name: '5级维度', children: [
                                                        {name: '6级维度'},
                                                        {name: '6级维度'},
                                                        {name: '6级维度'},
                                                        {name: '6级维度'},
                                                        {name: '6级维度'}
                                                    ]},
                                                    {name: '5级维度'}
                                                ]
                                            },
                                            {name: '4级维度'},
                                            {name: '4级维度'}
                                        ]
                                    },
                                    {name: '3级维度'},
                                    {name: '3级维度'},
                                    {name: '3级维度'},
                                    {name: '3级维度'}
                                ]
                            },
                            {name: '二级维度'},
                            {name: '二级维度'},
                            {name: '二级维度'}
                        ]
                    },
                    {name: '1级维度'},
                    {name: '1级维度'},
                    {name: '1级维度'}
                ]
            }
        ];
        vm.dimensions = dimensions;

        // 选择维度类型
        vm.selectDimensionsType = function(type) {
            vm.dimensions.forEach(function(obj) {
                obj.selected = false;
            });

            // 待显示的维度
            vm.mainDimensions = [];
            vm.subDimensions.forEach(function(temp) {
                temp.length = 0;
            });

            type.selected = true;

            $timeout(function() {
                vm.mainDimensions = type.children;
            });
        };

        vm.filters = [];

        // 选择维度
        vm.selectDimension = function(obj, index) {
            // 非叶子节点不予响应
            if (obj.children) {

                if (!index) return;

                vm.subDimensions[index - 1].length = 0;
                $timeout(function() {
                    for (var i=index - 1; i<vm.subDimensions.length; i++) {

                        if (i == index - 1) {
                            vm.subDimensions[i] = angular.copy(obj.children);
                        }
                        else {
                            vm.subDimensions[i].length = 0;
                        }
                    }
                });

                return;
            }

            // 可以点击反选
            obj.selected = !obj.selected;

            // 添加
            if (obj.selected) {
                vm.filters.push(obj);
            }
            // 删除
            else {
                var index = -1;
                vm.filters.forEach(function(filter, i) {
                    if (filter.name == obj.name) {
                        index = i;
                        return false;
                    }
                });

                if (index > -1) {
                    vm.filters.splice(index, 1);
                }
            }
        };

        vm.subDimensions = [[], [], [], []];

        // 取消过滤选择
        vm.removeFilter = function(index) {
            var filter = vm.filters.splice(index, 1)[0];

            walkDimensions(function(obj) {
                if (obj.name == filter.name) {
                    obj.selected = false;
                }
            });
        };

        var walkDimensions = function(callback) {
            vm.mainDimensions.forEach(function(node) {
                if (node.children) {
                    node.children.forEach(function(sub) {
                        callback(sub);
                    });
                }
                else {
                    callback(node);
                }
            });

            vm.subDimensions.forEach(function(node) {
                node.forEach(function(sub) {
                    console.log(sub);
                    callback(sub);
                });
            });
        };

        // 去除所有过滤条件
        vm.removeAllFilter = function() {
            vm.filters = [];

            walkDimensions(function(obj) {
                obj.selected = false;
            });
        };

        // 打开/关闭维度选择层
        vm.toggleFilterBar = function() {
            vm.isFilterBarOpen = !vm.isFilterBarOpen;


            if (vm.isFilterBarOpen) {
                $timeout(function() {
                    $document.on('click.dimensions', function(event) {
                        //console.log(angular.element(event.target), angular.element(event.target).closest('.dimensions-container'));

                        if (!angular.element(event.target).closest('.dimensions-container').length) {
                            vm.isFilterBarOpen = false;
                            //console.log('close');
                            $document.off('click.dimensions');
                            $scope.$apply();
                        }
                    });
                });
            }
            else {
                $document.off('click.dimensions');
            }
        };

        /*CacheAPI.one('userdetails').customGET().then(function (data) {
            if (!data) return;

            vm.item = data;
            vm.userCode=data.userCode;
            //console.log(data);
        });*/

        vm.item = Authenticate.getUser();

        // 修改密码
        vm.updatePwd = function() {
            if (!vm.item.userCode) return;
            ngDialog.open({
                template: 'modules/login/changePwd.html',
                controller: 'changePwdController as vm'
                , className: 'ngdialog-theme-default  ngdialog-md'
                //参数
                , resolve:{
                    item:function() {
                        return vm.item;
                    }
                }
            });
        };

        // 修改帐号
        vm.updateAccount = function() {
            if (!vm.item.loginName) return;
            ngDialog.open({
                template: 'modules/login/changeAccount.html',
                controller: 'changeAccountController as vm'
                , className: 'ngdialog-theme-default  ngdialog-md'
                //参数
                , resolve:{
                    item:function() {
                        return vm.item;
                    }
                }
            });
        };

        // 修改企业名称
        vm.updateCompany = function() {
            if (!vm.item.vcCompanyName) return;
            ngDialog.open({
                template: 'modules/login/changeCompany.html',
                controller: 'changeCompanyController as vm'
                , className: 'ngdialog-theme-default  ngdialog-md'
                //参数
                , resolve:{
                    item:function() {
                        return vm.item;
                    }
                }
            });
        };

        // 修改企业名称
        vm.updatePhone = function() {
            if (!vm.item.regCellPhone) return;
            ngDialog.open({
                template: 'modules/login/changePhone.html',
                controller: 'changePhoneController as vm'
                , className: 'ngdialog-theme-default  ngdialog-md'
                //参数
                , resolve:{
                    item:function() {
                        return vm.item;
                    }
                }
            });
        };

        vm.searchFiles = function() {

            var isFileList = ($state.current.name === "root.filelist" || $state.current.name === "root.filefundlist");

            if (!isFileList) {
                $rootScope.$filter$ = {
                    search: vm.fileName,
                    fileType: vm.highSearch.fileType,
                    fileFirstType: vm.highSearch.fileFirstType,
                    year: vm.highSearch.year,
                    quarter: vm.highSearch.quarter,
                    month: vm.highSearch.month,
                    filedate: vm.highSearch.filedate,
                    uploadTimeFrom: vm.highSearch.uploadTimeFrom,
                    uploadTimeTo: vm.highSearch.uploadTimeTo,
                    keyword: vm.highSearch.keyword
                };
                $state.go('root.filelist');
            }
            else {
                $rootScope.$emit('queryFiles', {
                    search: vm.fileName,
                    fileType: vm.highSearch.fileType,
                    fileFirstType: vm.highSearch.fileFirstType,
                    year: vm.highSearch.year,
                    quarter: vm.highSearch.quarter,
                    month: vm.highSearch.month,
                    filedate: vm.highSearch.filedate,
                    uploadTimeFrom: vm.highSearch.uploadTimeFrom,
                    uploadTimeTo: vm.highSearch.uploadTimeTo,
                    keyword: vm.highSearch.keyword
                });
            }

        };

        vm.clearFiles=function(){
            vm.fileName=null;
        }

        vm.keydown = function(event) {
            if (event && event.keyCode == 13) {
                vm.highSearch.fileType=null;
                vm.highSearch.fileFirstType=null;
                vm.highSearch.year=null;
                vm.highSearch.quarter=null;
                vm.highSearch.month=null;
                vm.highSearch.filedate=null;
                vm.highSearch.uploadTimeFrom=undefined;
                vm.highSearch.uploadTimeTo=undefined;
                vm.highSearch.keyword=null;
                vm.searchFiles();
            }
        };

        vm.highSearchKeydown = function(event) {
            if (event && event.keyCode == 13) {
                vm.fileName=null;
                vm.searchFiles();
                vm.showHighSearch=false;
            }
        };

        vm.highSearch=function(){
            vm.fileName=null;
            vm.searchFiles();
            vm.showHighSearch=false;
        }

        vm.hideHighSearch=function(){
            vm.showHighSearch=false
        }

        init();

        ////////////

        function init () {
            _applyNewBreadcrumb($state.current, $state.params);

            $rootScope.$on('$stateChangeSuccess',
                function (event, toState, toParams, fromState, fromParams) {
                    _applyNewBreadcrumb(toState, toParams);
                });
        }

        function _applyNewBreadcrumb (state, params) {
            vm.breadcrumbs = [];
            var name = state.name;
            var stateNames = _getAncestorStates(name);
            stateNames.forEach(function (name) {
                var stateConfig = $state.get(name);
                var breadcrumb = {
                    link: name,
                    text: stateConfig.title
                };
                if (params) {
                    breadcrumb.link = name + '(' + JSON.stringify(params) + ')';
                }
                vm.breadcrumbs.push(breadcrumb);
            });
        }

        function _getAncestorStates (stateName) {
            var ancestors = [];
            var pieces = stateName.split('.');
            if (pieces.length > 1) {
                for (var i = 1; i < pieces.length; i++) {
                    var name = pieces.slice(0, i + 1);
                    ancestors.push(name.join('.'));
                }
            }
            return ancestors;
        }

        var systemMenus;
        SystemRestangular.all("mainframe/menu")
            .getList()
            .then(function(data){
                systemMenus=data;
                showMenuFirst(vm.menus,systemMenus);

                vm.menus = vm.menus.filter(function(o) {
                    return o.showFlag;
                });
                vm.menus.forEach(function(o) {
                    o.children = o.children.filter(function(c) {
                        return c.showFlag;
                    })
                });

                showMenuFirst(vm.menusBB,systemMenus);
                vm.menusBB = vm.menusBB.filter(function(o) {
                    return o.showFlag;
                });

                vm.menusBBStyle = {
                    width: Math.ceil(vm.menusBB.length / 15) * 200
                };

                //console.log(vm.menus);
            });

        //SystemRestangular.all("mainframe/menu")
        //    .getList()
        //    .then(function(data){
        //        systemMenus=data;
        //        showMenuFirst(vm.menusBB,systemMenus);
        //
        //        vm.menusBB = vm.menusBB.filter(function(o) {
        //            return o.showFlag;
        //        });
        //        //vm.menusBB.forEach(function(o) {
        //        //    o.children = o.children.filter(function(c) {
        //        //        return c.showFlag;
        //        //    })
        //        //});
        //
        //        //console.log(vm.menus);
        //    });

        var filterMenuFirst=function(menu,systemMenus){
            var findFLag=false;
            angular.forEach(systemMenus,function(childFilter){
                var childFindFLag=filterMenu(menu,childFilter);
                if(childFindFLag==true){
                    findFLag=childFindFLag;
                }
            })
            if(findFLag==true){
                menu.showFlag=true;
            }
        }


        //菜单过滤 menu={name: '标签人员设置',route: 'root.label'}
        var filterMenu=function(menu,systemMenu){
            var findFLag=false;
            if(angular.equals(systemMenu.id,menu.id)){
                findFLag=true;
            }
            if(findFLag==false&&systemMenu.children!=null&&systemMenu.children.length>0){
                angular.forEach(systemMenu.children,function(childFilter){
                    var childFindFlag=filterMenu(menu,childFilter);
                    if(childFindFlag==true){
                        findFLag=childFindFlag;
                    }
                })
            }

            return findFLag;
        }

        var showMenuFirst=function(menus,systemMenus){
            angular.forEach(menus,function(menu){
                showMenu(menu,systemMenus);
            })
        }

        var showMenu=function(menu,systemMenus){
            filterMenuFirst(menu,systemMenus)

            if(menu.children!=null&&menu.children.length>0){
                angular.forEach(menu.children,function(childMenu){
                    showMenu(childMenu,systemMenus);
                })
            }
        }

        var menus = [

            {
                name: $translate.instant('N005000'),//配置管理
                id: 'SYS_CONFIG',
                children: [
                    {
                        name: $translate.instant('N000153'),//标签人员设置
                        route: 'root.label',
                        id: 'USER_LABEL'
                    },
                    //{
                    //    name: '系统参数设置',
                    //    route: 'root.systemParameter',
                    //    id: 'XTCSSZ'
                    //},
                    {
                        name: $translate.instant('N000432'),//风险评估模板
                        route: 'root.riskStandardType',
                        id: 'RISK_STANDARD_TYPE'
                    },
                    {
                        name: $translate.instant('N000338'),//董事关注项目
                        route: 'root.directorsConcerns',
                        id: 'DSGZXM'
                    },
                    {
                        name: $translate.instant('N000341'),//董事秘书人员信息维护
                        route: 'root.boardSecretaryInfo',
                        id: 'BOARD_SECRETARYINFO'
                    },
                    {
                        name: $translate.instant('N000354'),//董事约见申请过期配置
                        route: 'root.boardAppointOverDaysConfig',
                        id: 'BOARD_APPOINT_OVER_CONF'
                    },
                    {
                        name: $translate.instant('N000357'),//董事约见邮件发送点配置
                        route: 'root.boardAppointMailConfig',
                        id: 'BOARD_APPOINT_MAIL_CONF'
                    },
                    {
                        name: $translate.instant('N000759'),//尽调问题维度设置
                        route: 'root.adjustTypeMaintenance',
                        id: 'ADJUST_TYPE_MAINTENANCE'
                    },

                    {
                        name: $translate.instant('N001440'),//项目停滞设置
                        route: 'root.standstillConfigList',
                        id: 'STANDSTILL_CONFIG'
                    },
                    {
                        name: $translate.instant('N003273'),//流程节点设置
                        route: 'root.processNodeSetup',
                        id: 'PROCESS_NODE_SETUP'
                    },
                    {
                        name: $translate.instant('N000634'),//会议职能意见补充配置
                        route: 'root.meetOpinionConfig',
                        id: 'MEET_OPINION_CONFIG'
                    },
                    {
                        name: $translate.instant('N000620'),//会议检查项配置
                        route: 'root.meetCheckListConfig',
                        id: 'HYJCXPZ'
                    },
                    {
                        name: $translate.instant('N000588'),//过阶段用户权限配置
                        route: 'root.stageUserConfig',
                        id: 'GJDYHQXPZ'
                    },
                    {
                        name: $translate.instant('N003274'),//系统消息配置
                        route: 'root.messageConfig',
                        id: 'SYSMSGCONFIG'
                    },{
                        name: $translate.instant('N001277'),//投资摘要模板配置
                        route: 'root.coverpageTemplateConfig',
                        id: 'TZZYMBPZ'
                    },{
                        name: $translate.instant('N005001'), //尽调人员配置
                        route: 'root.duediligenceuserconfig',
                        id: 'TZZYMBPZ'
                    },{
                        name: $translate.instant('N001400'),//项目关联标签
                        route: 'root.pro-group',
                        id: 'XMGLBQ'
                    },
                    {
                        name: $translate.instant('N005002'),//'事项汇报平台配置'
                        route: 'root.reportDeptConfig',
                        id: 'SXHBPTPZ'
                    },
                    {
                        name: $translate.instant('N003331'),//'折扣比例配置'
                        route: 'root.discountRateSet',
                        id: 'DISCOUNTRATESET'
                    },
                    {
                        name: $translate.instant('N106900'),//'保密协议配置'
                        route: 'root.confidentialityAgreement',
                        id: 'BMXYPZ'
                    },
                    {
                        name: $translate.instant('N005064'),//'下载资源配置'
                        route: 'root.resouceDoc',
                        id: 'resouceDoc'
                    },
                ]
            },
            {
                name: $translate.instant('N005003'), //基础数据
                id: 'DEPLOY',
                children: [
                    {
                        name: $translate.instant('N005004'),//数据字典
                        route: 'root.dataDictionaries',
                        id: 'DICTSET'
                    },
                    {
                        name: $translate.instant('N003275'),//财务科目
                        route: 'root.financialAccount',
                        id: 'CWKM'
                    },
                    {
                        name: $translate.instant('N003276'),//出资实体
                        route: 'root.investmentEntityManage',
                        id: 'INVESTMENT_MAG'
                    },
                    {
                        name: $translate.instant('N001409'),//项目阶段指引信息维护
                        route: 'root.projectPhaseGuidance',
                        id: 'PROJECT_PHASE_GUIDANCE'
                    },
                    {
                        name: $translate.instant('N001510'),//行业标准维护
                        route: 'root.industryStandard',
                        id: 'INDUSTRY_STANDARD'
                    },
                    {
                        name: $translate.instant('N001518'),//行业分类维护
                        route: 'root.industryClassificationMaintenance',
                        id: 'INDUSTRY_CLASSIFICATION'
                    },
                    {
                        name: $translate.instant('N001322'),//'文档类型维护'
                        route: 'root.documentTypeMaintenance',
                        id: 'DOCUMENT_TYPE_MAINTENANCE'
                    },
                    {
                        name: $translate.instant('N000887'),//拟出资平台
                        route: 'root.planFundDept',
                        id: 'PLAN_FUND_DEPT'
                    },
                    {
                        name: $translate.instant('N000306'),//档案系统推送
                        route: 'root.fileSystemPush',
                        id: 'FILE_SYSTEM_PUSH'
                    },
                    {
                        name: $translate.instant('N001608'),//邮件收发
                        route: 'root.mailSend',
                        id: 'MAIL_SEND'
                    },
                    {
                        name: $translate.instant('N000392'),//防骚扰名单
                        route: 'root.harass',
                        id: 'harass'
                    },
                    {
                        name: $translate.instant('N001718'),//专家库
                        route: 'root.murphyInvman',
                        id: 'murphyInvman'
                    }
                ]
            },
            {
                name: $translate.instant('N005006'),// '超级管理员'
                id: 'SYSTEMMAG',
                children: [

                    {
                        name: $translate.instant('N001737'),//资源管理
                        route: 'root.resourceManage',
                        id: 'RESOURCE_MAG'
                    },
                    //{
                    //    name: '复星通部门查询',
                    //    route: 'root.deptManageInterface',
                    //    id: 'DEPT_MAG_INTERFACE'
                    //},
                    //{
                    //    name: '复星通部门确认',
                    //    route: 'root.deptManageInterfaceqr',
                    //    id: 'DEPT_MAG_INTERFACE_QR'
                    //},
                    //{
                    //    name: '复星通人员查询',
                    //    route: 'root.userManageInterface',
                    //    id: 'USER_MAG_INTERFACE'
                    //},
                    //{
                    //    name: '复星通人员确认',
                    //    route: 'root.userManageInterfaceqr',
                    //    id: 'USER_MAG_INTERFACE_QR'
                    //},
                    {
                        name: $translate.instant('N001002'),//全局部门管理
                        route: 'root.deptManage',
                        id: 'UNITMAG'
                    },
                    {
                        name: $translate.instant('N001004'),//全局角色管理
                        route: 'root.roleManage',
                        id: 'ROLEMAG'
                    },
                    {
                        name: $translate.instant('N003277'),//联合团队及人员贡献度维护
                        route: 'root.roleQYManage',
                        id: 'roleQYManage'
                    },
                    {
                        name: $translate.instant('N001006'),//全局用户管理
                        route: 'root.userManage',
                        id: 'USERMAG'
                    },
                    {
                        name: $translate.instant('N000166'),//部门负责人维护
                        route: 'root.deptManager',
                        id: 'DEPTMANAGER'
                    },
                    {
                        name: $translate.instant('N003278'),//项目身份
                        route: 'root.roleProjectManage',
                        id: 'USERPROJECTMAG'
                    },
                    {
                        name: $translate.instant('N001350'),//系统日志
                        route: 'root.sysLog',
                        id: 'OPTLOG'
                    }
                ]
            },
            {
                name: $translate.instant('N005007'),//普通管理员
                id: 'DEPTMAG',
                children: [
                    {
                        //同 部门管理，这里只对用户下级部门管理
                        name: $translate.instant('N000168'),//部门管理
                        route: 'root.deptManagexs',
                        id: 'DEPTPOW'
                    },
                    {
                        name: $translate.instant('N000718'),//角色管理
                        route: 'root.deptRoleManage',
                        id: 'DEPTROLE'
                    },
                    {
                        name: $translate.instant('N001596'),//用户管理
                        route: 'root.deptUserManage',
                        id: 'DEPTUSERINFO'
                    }
                ]
            }
            //,

            //{
            //    name: '测试报表',
            //    route: 'root.baobiao'
            //}
        ]

        vm.menus = menus;

        /*var menusBB = [
         {
         name: '项目阶段统计表',
         route: 'root.baobiao({name: "P_BASE_INFO_2"})',
         id:'P_BASE_INFO_2'
         },
         {
         name: '项目进展通报',
         route: 'root.baobiao({name: "P_BASE_INFO_3"})',
         id:'P_BASE_INFO_3'
         }
         ,
         {
         name: '投后项目财报导入情况',
         //route: 'root.castProRstAfterImport'
         route: 'root.baobiao({name: "castProRstAfterImport"})',
         id:'castProRstAfterImport'
         } ,
         {
         name: '项目尽调问题表',
         route: 'root.baobiaoClob({name: "projectProgremTable"})',
         id:'projectProgremTable'
         } ,
         {
         name: '项目红黄灯自评表',
         route: 'root.baobiao({name: "p_riskwarn_baseinfo"})',
         id:'p_riskwarn_baseinfo'
         },
         {
         name: '人力资源部-项目基本情况表',
         route: 'root.baobiao({name: "hrProjectBaseTable"})',
         id:'hrProjectBaseTable'
         },
         {
         name: '项目风险缓释方案列表',
         route: 'root.baobiao({name: "projectRiskMgPlan"})',
         id:'projectRiskMgPlan'
         },
         {
         name: '内部信息知情人',
         route: 'root.baobiao({name: "SYS_USER_PROJECT_POSITION"})',
         id:'SYS_USER_PROJECT_POSITION'
         }
         ,
         {
         name: '项目最新进展',
         route: 'root.baobiao({name: "P_BASE_INFO4"})',
         id:'P_BASE_INFO4'
         },
         {
         name: '二级市场数据报表',
         route: 'root.baobiao({name: "P_SECONDARY_MARKET_DATA"})',
         id:'P_SECONDARY_MARKET_DATA'
         }
         ,
         {
         name: '项目现金流导入情况检核表',
         route: 'root.baobiao({name: "p_cash_flow_introduction_baseinfo"})',
         id:'p_cash_flow_introduction_baseinfo'
         },
         {
         name: '项目估值表（现金流）',
         route: 'root.baobiao({name: "p_estimate_cash"})',
         id:'p_estimate_cash'
         },
         {
         name: '项目估值表二（不分出资实体）',
         route: 'root.baobiao({name: "p_estimate_bfczst"})',
         id:'p_estimate_bfczst'
         }
         ,
         {
         name: '离职人员工作交接报表',
         route: 'root.baobiao({name: "LEAVE_USER_HANDOVER"})',
         id:'LEAVE_USER_HANDOVER'
         }
         ,
         {
         name: '项目定期报告',
         route: 'root.baobiao({name: "P_AFTER_MANAGEPLAN"})'
         }
         ,
         {
         name: '项目红黄灯自评明细表',
         route: 'root.baobiao({name: "projectRiskDetail"})'
         }
         ,
         {
         name: '红灯项目处置进展汇总列表',
         route: 'root.baobiao({name: "PROJECTRISKPROGRESS"})'
         }
         ,
         {
         name: '百万人民币估值报表',
         route: 'root.baobiao'
         }
         ,
         {
         name: '项目尽调问题表',
         route: 'root.baobiao'
         }
         ,
         {
         name: '项目最新进展',
         route: 'root.baobiao'
         }
         ]*/

        var menusBB = [
            {
                name: $translate.instant('N005008'),//'项目阶段统计表'
                route: 'root.report_1({name: "P_BASE_INFO_2",title:"'+$translate.instant('N005008')+'"})',
                id:'P_BASE_INFO_2'
            },
            {
                name: $translate.instant('N005009'),//'项目进展通报'
                route: 'root.report_2({name: "P_BASE_INFO_3",title:"'+$translate.instant('N005009')+'"})',
                id:'P_BASE_INFO_3'
            }
            ,
            {
                name: $translate.instant('N005010'),//'项目财报导入情况检核表'
                //route: 'root.castProRstAfterImport'
                route: 'root.report_3({name: "castProRstAfterImport",title:"'+$translate.instant('N005010')+'"})',
                id:'castProRstAfterImport'
            } ,
            {
                name: $translate.instant('N005011'),//'项目尽调问题表'
                route: 'root.report_4({name: "projectProgremTable",title:"'+$translate.instant('N005011')+'"})',
                id:'projectProgremTable'
            } ,
            {
                name: $translate.instant('N005012'),//'项目红黄灯自评表'
                route: 'root.report_5({name: "p_riskwarn_baseinfo",title:"'+$translate.instant('N005012')+'"})',
                id:'p_riskwarn_baseinfo'
            },
            {
                name: $translate.instant('N005013'),//'人力资源部-项目基本情况表'
                route: 'root.report_6({name: "hrProjectBaseTable",title:"'+$translate.instant('N005013')+'"})',
                id:'hrProjectBaseTable'
            },
            {
                name: $translate.instant('N005014'),//'项目风险缓释方案列表'
                route: 'root.report_7({name: "projectRiskMgPlan",title:"'+$translate.instant('N005014')+'"})',
                id:'projectRiskMgPlan'
            },
            {
                name: $translate.instant('N005015'),//'内部信息知情人'
                route: 'root.report_8({name: "SYS_USER_PROJECT_POSITION",title:"'+$translate.instant('N005015')+'"})',
                id:'SYS_USER_PROJECT_POSITION'
            }
            ,
            {
                name: $translate.instant('N003269'),//'项目最新进展'
                route: 'root.report_9({name: "P_BASE_INFO4",title:"'+$translate.instant('N003269')+'"})',
                id:'P_BASE_INFO4'
            },
            {
                name: $translate.instant('N005017'),//'二级市场数据报表'
                route: 'root.report_10({name: "P_SECONDARY_MARKET_DATA",title:"'+$translate.instant('N005017')+'"})',
                id:'P_SECONDARY_MARKET_DATA'
            }
            ,
            {
                name: $translate.instant('N005018'),//'项目现金流导入情况检核表'
                route: 'root.report_11({name: "p_cash_flow_introduction_baseinfo",title:"'+$translate.instant('N005018')+'"})',
                id:'p_cash_flow_introduction_base'
            },
            {
                name: $translate.instant('N005019'),//'项目估值表（现金流）'
                route: 'root.report_12({name: "p_estimate_cash",title:"'+$translate.instant('N005019')+'"})',
                id:'p_estimate_cash'
            },
            {
                name: $translate.instant('N005020'),//'项目估值表二（不分出资实体）'
                route: 'root.report_13({name: "p_estimate_bfczst",title:"'+$translate.instant('N005020')+'"})',
                id:'p_estimate_bfczst'
            }
            ,
            {
                name: $translate.instant('N005021'),//'离职人员工作交接报表'
                route: 'root.report_14({name: "LEAVE_USER_HANDOVER",title:"'+$translate.instant('N005021')+'"})',
                id:'LEAVE_USER_HANDOVER'
            }
            ,
            {
                name: $translate.instant('N005022'),//'项目定期报告'
                route: 'root.report_15({name: "P_AFTER_MANAGEPLAN",title:"'+$translate.instant('N005022')+'"})',
                id:'P_AFTER_MANAGEPLAN'
            }
            ,
            {
                name: $translate.instant('N005023'),//'项目红黄灯自评明细表'
                route: 'root.report_16({name: "projectRiskDetail",title:"'+$translate.instant('N005023')+'"})',
                id:'projectRiskDetail'
            }
            ,
            {
                name: $translate.instant('N005024'),//'红灯项目处置进展汇总列表'
                route: 'root.report_17({name: "PROJECTRISKPROGRESS",title:"'+$translate.instant('N005024')+'"})',
                id:'PROJECTRISKPROGRESS'
            }
            ,
            {
                name: $translate.instant('N005025'),//'人力资源—投资人员项目信息盘点表'
                route: 'root.report_18({name: "p_rlzy_tzryxmxxpdb",title:"人力资源—'+$translate.instant('N005025')+'"})',
                id:'p_rlzy_tzryxmxxpdb'
            },
            {
                name: $translate.instant('N005026'),//'项目估值表二（分出资实体）'
                route: 'root.report_19({name: "p_xmgzbr_fczst",title:"'+$translate.instant('N005026')+'"})',
                id:'p_xmgzbr_fczst'
            },
            {
                name: $translate.instant('N005027'),//'主要财务指标分析'
                route: 'root.report_20({name: "p_zycwzbfx",title:"'+$translate.instant('N005027')+'"})',
                id:'p_zycwzbfx'
            },
            {
                name: $translate.instant('N005028'),//'已投成项目预算执行情况'
                route: 'root.report_21({name: "p_ytcxmyszxqk",title:"'+$translate.instant('N005028')+'"})',
                id:'p_ytcxmyszxqk'
            },
            {
                name: $translate.instant('N005029'),//'项目基本情况表'
                route: 'root.report_22({name: "p_xmjbqkb",title:"'+$translate.instant('N005029')+'"})',
                id:'p_xmjbqkb'
            },
            {
                name: $translate.instant('N005030'),//'投后项目文档统计'
                route: 'root.report_23({name: "p_thxmwdtj",title:"'+$translate.instant('N005030')+'"})',
                id:'p_thxmwdtj'
            },
            {
                name: $translate.instant('N005031'),//'项目估值报表检核表'
                route: 'root.report_24({name: "p_xmgzbbjhb",title:"'+$translate.instant('N005031')+'"})',
                id:'p_xmgzbbjhb'
            }
            ,
            {
                name: $translate.instant('N005032'),//'董事关注项目报表'
                route: 'root.report_25({name: "p_directorsConcernsbb",title:"'+$translate.instant('N005032')+'"})',
                id:'p_directorsConcernsbb'
            }
            ,
            {
                name: $translate.instant('N005033'),//'人力资源部-项目财务信息表（净利润指标）'
                route: 'root.report_26({name: "p_resources_projectfinancial",title:"'+$translate.instant('N005033')+'"})',
                id:'p_resources_projectfinancial'
            }
            ,
            {
                name: $translate.instant('N005034'),//'已投成项目主要财务情况'
                route: 'root.report_27({name: "p_castinto_projectfinance",title:"'+$translate.instant('N005034')+'"})',
                id:'p_castinto_projectfinance'
            },{
                name: $translate.instant('N003270'),//'资产负债表'
                route: 'root.report_28({name: "p_assets_liabilities_statement",title:"'+$translate.instant('N003270')+'"})',
                id:'p_assets_liabilities_statement'
            },
            {
                name: $translate.instant('N003271'),//'利润表'
                route: 'root.report_29({name: "p_income_statement",title:"'+$translate.instant('N003271')+'"})',
                id:'p_income_statement'
            },
            {
                name: $translate.instant('N003272'),//'现金流量表'
                route: 'root.report_30({name: "p_cash_flow_statement",title:"'+$translate.instant('N003272')+'"})',
                id:'p_cash_flow_statement'
            },
            {
                name: $translate.instant('N005038'),//'用户项目权限查询'
                route: 'root.report_31({name: "p_user_project_permission",title:"'+$translate.instant('N005038')+'"})',
                id:'p_user_project_permission'
            } ,
            {
                name: $translate.instant('N005039'),//'用户功能权限查询'
                route: 'root.report_32({name: "p_user_function_permission",title:"'+$translate.instant('N005039')+'"})',
                id:'p_user_function_permission'
            },
            {
                name: $translate.instant('N005040'),//'项目基本情况表(不分出资实体)'
                route: 'root.report_33({name: "p_xmjbqkb_bfczst",title:"'+$translate.instant('N005040')+'"})',
                id:'p_xmjbqkb_bfczst'
            },
            {
                name: $translate.instant('N005046'),//'部门负责人信息表'
                route: 'root.report_34({name: "p_deptMa",title:"'+$translate.instant('N005046')+'"})',
                id:'p_deptMa'
            },
            {
                name: $translate.instant('N003205'),//'用户项目权限(带路径)查询'
                route: 'root.report_35({name: "p_user_project_permission_path",title:"'+$translate.instant('N003205')+'"})',
                id:'p_user_project_permission_path'
            },
            {
                name: $translate.instant('N003207'),//'孤儿项目查询'
                route: 'root.report_36({name: "p_orphan_project",title:"'+$translate.instant('N003207')+'"})',
                id:'p_orphan_project'
            },
            {
                name: $translate.instant('N003283'),//'标的自投委托查询'
                route: 'root.report_37({name: "p_target_castOrCommission",title:"'+$translate.instant('N003283')+'"})',
                id:'p_target_castOrCommission'
            },{
                name: $translate.instant('N003284'),//'管理平台分管查询'
                route: 'root.report_38({name: "p_userinfo",title:"'+$translate.instant('N003284')+'"})',
                id:'p_userinfo'
            },{
                name: $translate.instant('N002321'),//'二级市场股票授权及建议申报报表'
                route: 'root.report_39({name: "p_stock_investment_advice",title:"'+$translate.instant('N002321')+'"})',
                id:'p_stock_investment_advice'
            },{
                name: $translate.instant('N003291'),//'在线用户查询'
                route: 'root.report_40({name: "p_online_user_enquiry",title:"'+$translate.instant('N003291')+'"})',
                id:'p_online_user_enquiry'
            },{
                name: $translate.instant('N003296'),//'用户信息查询'
                route: 'root.report_41({name: "p_user_query",title:"'+$translate.instant('N003296')+'"})',
                id:'p_user_query'
            },{
                name: $translate.instant('N002341'),//'汇率导出
                route: 'root.report_42({name: "p_bb_exchange_export",title:"'+$translate.instant('N002341')+'"})',
                id:'p_bb_exchange_export'
            },{
                name: $translate.instant('N003303'),//'项目会议信息表'
                route: 'root.report_43({name: "p_meeting_info",title:"'+$translate.instant('N003303')+'"})',
                id:'p_meeting_info'
            },{
                name: $translate.instant('N003330'),//'项目现金流明细'
                route: 'root.report_44({name: "p_cashFlow",title:"'+$translate.instant('N003330')+'"})',
                id:'p_cashFlow'
            },{
                name: $translate.instant('N003357'),//'项目估值-最近交易法报表'
                route: 'root.report_45({name: "p_valuation_recent",title:"'+$translate.instant('N003357')+'"})',
                id:'p_valuation_recent'
            },{
                name: $translate.instant('N003359'),//'项目估值-对标公司法报表'
                route: 'root.report_46({name: "p_valuation_company",title:"'+$translate.instant('N003359')+'"})',
                id:'p_valuation_company'
            },{
                name: $translate.instant('N003360'),//'项目估值-成本法报表'
                route: 'root.report_47({name: "p_valuation_cost",title:"'+$translate.instant('N003360')+'"})',
                id:'p_valuation_cost'
            },{
                name: $translate.instant('N002395'),//'债券池报表
                route: 'root.report_48({name: "p_bb_bond_author",title:"'+$translate.instant('N002395')+'"})',
                id:'p_bb_bond_author'
            },{
                name: $translate.instant('N106918'),//跟投报表
                route: 'root.report_49({name: "p_investment",title:"'+$translate.instant('N106918')+'"})',
                id:'p_investment'
            },{
                name: $translate.instant('N005069'),//'拥有所有项目权限用户报表
                route: 'root.report_50({name: "p_user_pro_datepower",title:"'+$translate.instant('N005069')+'"})',
                id:'p_user_pro_datepower'
            }
            /*     ,
             {
             name: '百万人民币估值报表',
             route: 'root.baobiao'
             }
             ,
             {
             name: '项目尽调问题表',
             route: 'root.baobiao'
             }
             ,
             {
             name: '项目最新进展',
             route: 'root.baobiao'
             }*/
        ]
        vm.menusBB = menusBB;
        vm.menusBBStyle = {
            width: Math.ceil(vm.menusBB.length / 17) * 200
        };

        vm.popBBExchangeExport = function(){
            ngDialog.open({
                template: 'modules/baobiao/children/p_bb_exchange_export.list.html',
                controller: 'BbExchangeExportListController as vm',
                className: 'ngdialog-theme-default'
            })
        }
    }
})();