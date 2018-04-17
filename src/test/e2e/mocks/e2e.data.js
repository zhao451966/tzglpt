// all data used by e2e mock service is here
(function () {
    'use strict';

    angular
        .module('appTest')
        .factory('mockData', mockData);

    function mockData () {
        var _loginStatus = false;
        var service = {
            loginStatus: _loginStatus,
            userInfo: _userInfo,
            userProducts: _userProducts,
            phones: _phones,
            projects: _projects,
            targets: _targets
        };

        return service;
    }

    var _targets = [
        {project: '大连国际5%的股份', company: '中国大连国际合作(集团)股份有限公司', type: '股权类二级市场', code: '24239662-6/000881.SZ',sqjg:'28.8',sqje:'1440万',czpt:'复星创富'},
        {project: '招商地产3%的股份', company: '招商局地产控股股份有限公司', type: '股权类二级市场', code: '61884513-6/00024.SZ',sqjg:'18.6',sqje:'9300万',czpt:'复星创富'}
    ];

    var _projects = [
        {state: '0', id: '1', xmmc: '招商地产项目', bh: '000024.SZ', jc: '招商地产项目', glpt: '复星创富',zfzr:'唐斌', jd: '前期调研'},
        {state: '0', id: '2', xmmc: '润和项目', bh: '000024SZ', jc: '润和项目', glpt: '复星创富',zfzr:'唐斌', jd: '尽调'},
        {state: '0', id: '3', xmmc: '润和项目', bh: '000024SZ', jc: '润和项目', glpt: '复星创富',zfzr:'唐斌', jd: '尽调'},
        {state: '0', id: '4', xmmc: '巴西石油债项目', bh: 'XS0716979249', jc: '巴西石油', glpt: '复星保德信',zfzr:'王中傅', jd: '退出'},
        {state: '0', id: '5', xmmc: '巴西石油债项目', bh: 'US71645WAU53', jc: '巴西石油', glpt: '复星保德信',zfzr:'王中傅', jd: '立项'},
        {state: '0', id: '6', xmmc: '巴西石油债项目', bh: 'XS0835886598', jc: '巴西石油', glpt: '复星保德信',zfzr:'王中傅', jd: '投决'},
        {state: '0', id: '7', xmmc: '巴西石油债项目', bh: 'US71645WAP68', jc: '巴西石油', glpt: '复星保德信',zfzr:'王中傅', jd: '交易'},
        {state: '0', id: '8', xmmc: '巴西石油债项目', bh: 'XS0716979595', jc: '巴西石油', glpt: '复星保德信',zfzr:'王中傅', jd: '预审'}
    ];

    var _userInfo = {
        'name': 'PinkyJie'
    };

    var _userProducts = [
        {
            'name': 'phone',
            'count': 5
        }
    ];

    var _phones = [
        {
            'id': '1',
            'model': 'iPhone 6',
            'os': 'iOS',
            'price': 5288,
            'manufacturer': 'Apple',
            'size': 4.7,
            'releaseDate': _getTimestamp(2014, 10, 9)
        },
        {
            'id': '2',
            'model': 'iPhone 6 Plus',
            'os': 'iOS',
            'price': 6088,
            'size': 5.5,
            'manufacturer': 'Apple',
            'releaseDate': _getTimestamp(2014, 10, 9)
        },
        {
            'id': '3',
            'model': 'Nexus 6',
            'os': 'Android',
            'price': 4400,
            'size': 5.96,
            'manufacturer': 'Motorola',
            'releaseDate': _getTimestamp(2014, 10, 10)
        },
        {
            'id': '4',
            'model': 'Galaxy S6',
            'os': 'Android',
            'price': 5288,
            'size': 5.1,
            'manufacturer': 'Samsung',
            'releaseDate': _getTimestamp(2015, 3, 25)
        },
        {
            'id': '5',
            'model': 'Mi Note',
            'os': 'Android',
            'price': 2299,
            'size': 5.7,
            'manufacturer': 'Xiaomi',
            'releaseDate': _getTimestamp(2015, 1, 18)
        }
    ];

    ///////////////

    function _getTimestamp (year, month, day) {
        var date = new Date();
        date.setFullYear(year);
        date.setMonth(month - 1);
        date.setDate(day);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        return date;
    }

})();
