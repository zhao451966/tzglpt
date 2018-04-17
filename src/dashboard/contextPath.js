// ** 是否是单点登录（生产环境才能设置成true！！）
window.CAS = true;

// 生产环境
if (window.CAS) {
    // ** 后端路径（根据实际部署情况修改）
    window.ContextPath = '/BatchPlatform/';

    // ** 前台路径（根据实际部署情况修改）
    window.ViewContextPath = '/BatchPlatform/';

    // ** 是否发送统计（生产环境才能设置成true！！开发环境和测试环境是false！！）
    window.Is_Fonova = false;
}
// 开发或测试环境
else {
    // ** 后端路径（根据实际部署情况修改）
    window.ContextPath = '/BatchPlatform/';

    // ** 是否发送统计（生产环境才能设置成true！！开发环境和测试环境是false！！）
    window.Is_Fonova = false;
}

// cas 登录（不用修改）
window.LOGIN_CAS_URL = ContextPath + 'system/mainframe/logincas';

// 普通登录（不用修改）
window.LOGIN_NORMAL_URL = getViewContextPath() + "#/login";

// 实际使用的URL地址（不用修改）
window.LOGIN_URL = window.CAS ? window.LOGIN_CAS_URL : window.LOGIN_NORMAL_URL;

window.I18N = getI18NCookieByUserOther();;


/**
 * 获取ContextPath
 */
function getContextPath() {
    return window.location.origin + window.ContextPath;
}

function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

function setCookie(name,value)
{
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

function getI18NCookieByUser(user) {
    if (!user) return window.I18N;

    if (user&& user.objList[0].paramValue) {
        var lang = user.objList[0].paramValue;
        window.I18N = lang;
    }
    setCookie("i18n",window.I18N);
    getI18NResourse();

    return window.I18N;
}

function getI18NCookieByUserOther(user) {
	var userObject = null;
	if(window.I18N) return window.I18N;
    $.ajax({
        url: ContextPath+"system/usersetting",
        type:"GET",
        dataType:"json",
        async:false,
        complete: function(xhr){
            eval("jsonResult = "+xhr.responseText);
            userObject = jsonResult.data;
            window.I18N = userObject.objList[0].paramValue;
            if(!window.I18N)
                window.I18N="en_US";
        }
    });
    return window.I18N;
}

function getI18NResourse(key) {
    //window.I18N = getCookie('i18n') == 'en_US' ? 'en_US' : 'zh_CN';
	window.I18N = getI18NCookieByUserOther();
    window.I18N_RESOURSE = window.I18N == 'zh_CN' ? window.I18N_ZH : window.I18N_EN;

    if (key) {
        return window.I18N_RESOURSE[key] ?  window.I18N_RESOURSE[key] : key;
    }
}

/**
 * 发送统计
 * @param user
 */
function sendFonova(user) {
    if (!window.Is_Fonova || !user) return;

    try {
        // 未加载脚本，进行初始化
        if (typeof fonova_at !== "object" ) {
            fonova_at = [];

            (function() {
                var configJsFileCacheTimeout = 86400;
                var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                g.type='text/javascript'; g.async=true; g.src='//t.fosun.com/fonovaAnalytics-min.js?' + Math.floor(new Date().getTime()/(configJsFileCacheTimeout * 1000)); s.parentNode.insertBefore(g,s);
            })();
        }

        // 发送的信息
        var fonova_at_sot = 3600; /*需修改:系统超时时间*/
        fonova_at.push(['setHeartBeatTimer', 20, fonova_at_sot]);
        fonova_at.push(['setSessionCookieTimeout', fonova_at_sot]);
        fonova_at.push(['action', 'fosungroup', 'investment', {
            email:user.regEmail,/*需修改:需修改帐号邮箱*/
            key_a:'',key_b:'',key_c:'',key_d:'',key_e:''}
        ]);

    }
    catch(e) {

    }


}

function getViewContextPath() {
   // if (window.CAS) return window.ViewContextPath;

    var base =  window.location.origin;
    var reg = new RegExp("/(.)*?/");
    var r = window.location.pathname.match(reg);
    if(r!=null) return  base + r[0]; return base+'/';
}

function replaceLink() {
    $('a[href]').each(function() {
        var reg = /\{\{ContextPath\}\}/;
        var link = $(this), href = link.attr('href');
        if (href && reg.test(href)) {
            link.attr('href', href.replace(reg, ContextPath));
        }
    });
}

function sleep(numberMillis) {
  var now = new Date();
  var exitTime = now.getTime() + numberMillis;
  while (true) {
    now = new Date();
    if (now.getTime() > exitTime)
      return;
  }
}
