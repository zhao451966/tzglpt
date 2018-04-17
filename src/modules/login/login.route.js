(function() {
    'use strict';

    angular.module('demo.login')
        .run(LoginRun);

    /* @ngInject */
    function LoginRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'root.login',
                config: {
                    url: '/login',
                    views: {
                        'main@': {
                        	 templateUrl: 'modules/login/xplogin.html',
                             controller: 'xpLoginController as vm'
                        },
                        'header@': '',
                        'menu@': '',
                        'breadcrumb@': ''
                    },
                    title: '登录',
                    data: {
                        requireLogin: false
                    }
                }

            },
            {
                state: 'root.zxlogin',
                config: {
                    url: '/zxlogin',
                    views: {
                        'main@': {
                            templateUrl: 'modules/login/zxlogin.html',
                            controller: 'zxLoginController as vm'
                        },
                        'header@': '',
                        'menu@': '',
                        'breadcrumb@': ''
                    },
                    title: '登录',
                    data: {
                        requireLogin: false
                    }
                }

            },
            {
                state: 'root.register',
                config: {
                    url: '/register',
                    views: {
                        'main@': {
                            templateUrl: 'modules/login/register.html',
                            controller: 'registerController as vm'
                        },
                        'header@': '',
                        'menu@': '',
                        'breadcrumb@': ''
                    },
                    title: '首次登录'
                }

            },
            {
                state: 'root.yjregister',
                config: {
                    url: '/register/:LoginName/:password/:vcCompanyName/:vcCreditCode',
                    views: {
                        'main@': {
                            templateUrl: 'modules/login/register.html',
                            controller: 'registerController as vm'
                        },
                        'header@': '',
                        'menu@': '',
                        'breadcrumb@': ''
                    },
                    title: '注册页面',
                    data: {
                        requireLogin: false
                    }
                }

            },
            {
                state: 'root.enterpriseAssociateUser',
                config: {
                    url: '/enterpriseAssociateUser/:LoginName/:password/:vcCompanyName/:vcCreditCode',
                    views: {
                        'main@': {
                        	templateUrl: 'modules/login/enterpriseAssociateUser.html',
                            controller: 'enterpriseAssociateUserController as vm'
                        },
                        'header@': '',
                        'menu@': '',
                        'breadcrumb@': ''
                    },
                    title: '注册页面',
                    data: {
                        requireLogin: false
                    }
                }

            },{
                state: 'root.backPassword',
                config: {
                    url: '/backPassword/:LoginName/:password',
                    views: {
                        'main@': {
                        	templateUrl: 'modules/login/backPassword.html',
                            controller: 'backPasswordController as vm'
                        },
                        'header@': '',
                        'menu@': '',
                        'breadcrumb@': ''
                    },
                    title: '找回密码',
                    data: {
                        requireLogin: false
                    }
                }

            },
            {
                state: 'root.validateRegEmail',
                config: {
                    url: '/validateRegEmail',
                    views: {
                        'main@': {
                            templateUrl: 'modules/login/validateRegEmail.html',
                            controller: 'validateRegEmailController as vm'
                        },
                        'header@': '',
                        'menu@': '',
                        'breadcrumb@': ''
                    },
                    title: '验证邮箱',
                    data: {
                        requireLogin: false
                    }
                }

            },
            {
                state: 'root.validateCompanyCredit',
                config: {
                    url: '/validateCompanyCredit/:regEmail/:regCellPhone',
                    views: {
                        'main@': {
                            templateUrl: 'modules/login/validateCompanyCredit.html',
                            controller: 'validateCompanyCreditController as vm'
                        },
                        'header@': '',
                        'menu@': '',
                        'breadcrumb@': ''
                    },
                    title: '验证机构名称和统一社会信用代码',
                    data: {
                        requireLogin: false
                    }
                }

            },{
                state: 'root.sendRegEmailCompanyName',
                config: {
                    url: '/sendRegEmailCompanyName/:regEmail/:vcCompanyName',
                    views: {
                        'main@': {
                            templateUrl: 'modules/login/send.html',
                            controller: 'sendController as vm'
                        },
                        'header@': '',
                        'menu@': '',
                        'breadcrumb@': ''
                    },
                    title: '发送',
                    data: {
                        requireLogin: false
                    }
                }

            },{
                state: 'root.send',
                config: {
                    url: '/send/:regEmail',
                    views: {
                        'main@': {
                            templateUrl: 'modules/login/send.html',
                            controller: 'sendController as vm'
                        },
                        'header@': '',
                        'menu@': '',
                        'breadcrumb@': ''
                    },
                    title: '发送',
                    data: {
                        requireLogin: false
                    }
                }

            },{
                state: 'root.sendSucceed',
                config: {
                    url: '/sendSucceed/:regEmail',
                    views: {
                        'main@': {
                            templateUrl: 'modules/login/sendSucceed.html',
                            controller: 'sendSucceedController as vm'
                        },
                        'header@': '',
                        'menu@': '',
                        'breadcrumb@': ''
                    },
                    title: '发送成功',
                    data: {
                        requireLogin: false
                    }
                }

            },
            {
                state: 'root.logout',
                config: {
                    url: '/logout',
                    views: {
                        'main@': {
                            //templateUrl: 'modules/login/casLogout.html'
                            templateUrl: 'modules/login/xplogin.html',
                            controller: 'xpLoginController as vm'
                        },
                        'header@': '',
                        'menu@': '',
                        'breadcrumb@': ''
                    },
                    title: '登录',
                    data: {
                        requireLogin: false
                    }
                }

            },
            {
                state: 'root.cas',
                config: {
                    url: '/cas',
                    views: {
                        'main@': {
                            templateUrl: 'modules/login/cas.html'
                        },
                        'header@': '',
                        'menu@': '',
                        'breadcrumb@': ''
                    },
                    title: '登录',
                    data: {
                        requireLogin: false
                    }
                }
            },{
                state: 'root.zxbg',
                config: {
                    url: '/zxbg',
                    views: {
                        'main@': {
                        	 templateUrl: 'modules/zxbg/zxbg.html',
                             controller:'zxbgController as vm'
                        },
                        'header@': '',
                        'menu@': '',
                        'breadcrumb@': ''
                    }
                }

            },{
            	state: 'root.zxdata',
                config: {
                    url: '/data/:challenge/:validate/:seccode/:searchValue',
                    views: {
                        'main@': {
                        	 templateUrl: 'modules/zxbg/data.html',
                             controller:'dataController as vm'
                        },
                        'header@': '',
                        'menu@': '',
                        'breadcrumb@': ''
                    }
                }
            },{
                state: 'root.zxbgxq',
                config: {
                    url: '/zxbgxq/:entid/:name',
                    views: {
                        'main@': {
                        	 templateUrl: 'modules/zxbg/zxbgxq.html',
                             controller:'zxbgxqController as vm'
                        },
                        'header@': '',
                        'menu@': '',
                        'breadcrumb@': ''
                    }
                }
            }
        ];
    }
})();
