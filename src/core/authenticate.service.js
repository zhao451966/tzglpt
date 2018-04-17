(function() {
    'use strict';

    angular.module('demo.core')
        .factory('Authenticate', Authenticate);

    /* @ngInject */
    function Authenticate($rootScope, SystemRestangular, Restangular, $q, CacheAPI, UserInfoAPI, $translate) {
        var _user, _roles, _opts, _pros, _csrf;

        // 先从localStorage中读取用户
        //_getUser();

        var api = {
            reload: _reload,
            clearUser: _clearUser,
            checkLogin: _checkLogin,
            checkQYLogin:_checkQYLogin,
            checkJJLogin:_checkJJLogin,
            getUser: _getUser,
            setUser: _setUser,
            checkRole: _checkRole,
            checkOpt: _checkOpt,
            checkPro: _checkPro,
            loadPro: _loadPro,
            checkIsPublic: _checkIsPublic,
            setCSRF: function(csrf) {
                _csrf = csrf;
            },
            getCSRF: function() {
                return _csrf;
            }
        };

        $rootScope.Authenticate = api;

        return api;

        function _checkIsPublic() {


            return _checkLogin()
                .then(function(user) {
                    var roles = user.userRoleCodes;

                    // 系统登录后，判断如果当用登录的用户没有角色或者只有G-public（公共角色），系统跳转到一个新的页面（页面内容待定）；否则跳转到真正的投管页面
                    if (!roles || roles.every(function(r) {
                            return 'G-public' == r;
                        })) {
                        return $q.reject('ERROR_ONLY_PUBLIC');
                    }

                    return $q.resolve(roles);
                });

        }

        ////////////////////////////////////////////////

        function _reload() {
            _clearUser();
            return _checkLogin();
        }

        // 销户
        function _clearUser() {
            _user = null;

            if (!angular.isUndefined(localStorage)) {
                localStorage.removeItem('user');
            }
        }

        // 校验登录
        function _checkLogin() {

            // 已存在，直接返回
            if (_user) {
                return $q.resolve(_user);
            }

            // 从localStorage中取用户
            //if (!angular.isUndefined(localStorage) && localStorage.getItem('user')) {
            //    var user = JSON.parse(localStorage.getItem('user'));
            //
            //    _setUser(user);
            //    return $q.resolve(user);
            //}

            // 发送请求读
            return CacheAPI
                .one('userdetails')
                .customGET()
                .then(function(data) {
                    if (data) {
                        // 干净的，不含restangular的对象
                        data = data.plain();
                        _setUser(data);

                        return SystemRestangular.oneUrl('mainframe/currentuser')
                            .get();

                        //return Restangular.all('proidentity/proidentity')
                        //    .customGET('currentuser');
                    }

                    return $q.reject('ERROR_REQUIRE_LOGIN');
                })
                .then(function(res) {
                   if (res && res.accessToken && _user) {
                       _user.accessToken = res.accessToken;
                   }

                   var lang = getI18NCookieByUserOther(_user);
                   $translate.use(lang);

                    return $q.resolve(_user);
                });
                //.then(function(data) {
                //    var user = _getUser();
                //
                //    user.proidentity = data || [];
                //
                //    _setUser(user);
                //    return $q.resolve(user);
                //});
        }

        // 获得用户信息
        function _getUser() {
            if (!angular.isUndefined(localStorage) && localStorage.getItem('user')) {
                var user = JSON.parse(localStorage.getItem('user'));

                _setUser(user);
            }

            return _user;
        }

        // 设置用户信息
        function _setUser(user) {
            window._user = _user = user;
            //$cookies.put('user', JSON.stringify(user));
            if (!angular.isUndefined(localStorage)) {
                localStorage.setItem('user', JSON.stringify(user));
            }

            // 角色编码
            _roles = {};
            var userRoleCodes = user.userRoleCodes;
            if (userRoleCodes) {
                userRoleCodes.forEach(function(code) {
                    _roles[code] = true;
                });
            }

            // 操作权限
            _opts = user.userOptList;

            // 项目权限编码
            //_pros = {};
            //var proidentity = user.proidentity;
            //if (proidentity) {
            //    proidentity.forEach(function(pro) {
            //        _pros[pro.projectcode + '-' + pro.optid + '-' + pro.optmethod] = true;
            //    });
            //}
        }

        // 角色权限校验
        function _checkRole(roles) {
            if (angular.isString(roles)) {
                roles = [roles];
            }

            if (!_roles) return false;

            // 任何一个角色符合条件
            return roles.some(function(role) {
                return _roles[role];
            })
        }

        // 操作权限校验
        function _checkOpt(opt, method) {
            if (!_opts) return false;

            return !!_opts[opt + '-' + method];
        }

        // 读取项目权限
        function _loadPro(id) {

            return UserInfoAPI.one(id)
                .customGET('hasRight')
                .then(function(res) {
                    // 没有项目权限
                    if (!res.state) {
                        return $q.reject('ERROR_PROJECT_NOT_ALLOW');
                    }

                    return Restangular.all('proidentity/proidentity')
                        .customGET('currentuser', {
                            id: id
                        });
                })
                .then(function(proidentity) {
                    _pros = _pros || {};

                    if (proidentity) {
                        proidentity.forEach(function(pro) {
                            _pros[pro.projectcode + '-' + pro.optid + '-' + pro.optmethod] = true;
                        });
                    }
                });
        }

        // 项目权限校验
        function _checkPro(id, opt, method) {
            if (!_pros) return false;

            var result = _pros[id + '-' + opt + '-' + method];

            if (result) {
                return result;
            }

            // 特殊的默认权限，对所有工程均有效
            // 对应后台：ProIdentityManagerImpl.getPowerByUser
            return _pros['*-' + opt + '-' + method];
        }


        // 校验企业用户登录
        function _checkQYLogin() {
            return _checkLogin()
                .then(function(user) {
                    var userType = user.userType;

                    // 已存在，直接返回
                    if (!(userType=='3')) {
                        return $q.reject('ERROR_ONLY_FUND');
                    }

                    return $q.resolve(userType);
                });
        }

        // 校验基金用户登录
        function _checkJJLogin() {
            return _checkLogin()
                .then(function(user) {
                    var userType = user.userType;

                    // 已存在，直接返回
                    if (!(userType=='0'||userType=='1'||userType=='2')) {
                        return $q.reject('ERROR_ONLY_COMPANY');
                    }

                    return $q.resolve(userType);
                });

        }
    }
})();