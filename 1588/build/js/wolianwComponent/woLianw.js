layui.define(['layer', 'laypage', "laytpl"], function(exports){
  "use strict";

  var $ = layui.jquery;
  var laytpl = layui.laytpl;
  var laypage = layui.laypage;

  var woLianw = {
    wolianwVen1588: '//ven.1588'+wolianwDomain,
    wolianwDis1588: '//dis.1588'+wolianwDomain,
    wolianw1588: '//1588'+wolianwDomain,
    wolianw1788: '//1788'+wolianwDomain,
    wolianw1988: '//1988'+wolianwDomain,
    wolianw1999: '//1999'+wolianwDomain,
    url: "//"+location.host+"/api",
  };

  /**
   * 登录系统
   * @param url  /login
   * @param formdata  登录信息(登录名、密码、验证码、系统类型)
   * @param 回调函数
   */
  woLianw.login = function (formdata, callback) {
    var _this=this
    var url = "";
    if(formdata.systemId==='3'){
      url = woLianw.wolianwDis1588+"/api/login";
      localStorage.setItem('lastLogin','dis');
    }else{
      url = woLianw.wolianwVen1588+"/api/login";
      localStorage.setItem('lastLogin','ven');
    }
    $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
    $.ajax({
      type:"post",
      data:formdata,
      url: url,
      success:function (response) {
        var d = JSON.stringify(response.data);
        if(response.code == 0) {
          /*登录失败，显示msg给用户看*/
          console.log(response.msg);
          callback(response.msg);
        }else if (response.code == 1) {
          /*登录成功, 操作 data 项或显示 msg 给用户看*/
          if (formdata.systemId == '3') {
            localStorage.removeItem("1988login");
            localStorage.setItem("1788login", d);
            location.href = woLianw.wolianwDis1588+'/dis.html';
           // location.href = '/dis/index.html';
          } else if (formdata.systemId == '4') {
            localStorage.removeItem("1788login");
            localStorage.setItem("1988login", d);
            location.href = woLianw.wolianwVen1588+'/ven.html';
            //location.href = '/ven/index.html';
          }
        }else if(response.code == 10){
          /*未登录，将用户导至登录页*/
          _this.goLoginPage();
        }
      },
      error: function(response){
        console.log(response.statusText);
      }
    })
  };

  /**
   * 跳转到登录页
   */
  woLianw.goLoginPage = function () {
    if (parent) {
      parent.location.href = "/login.html";
    } else {
      window.location.href = "/login.html";
    }
  }

  /**
   * 跳转到1788
   */
  woLianw.goto1788 = function () {
    if (parent) {
      parent.location.href = woLianw.wolianwDis1588;
    } else {
      window.location.href = woLianw.wolianwDis1588;
    }
  }

  /**
   * 跳转到1988
   */
  woLianw.goto1988 = function () {
    if (parent) {
      parent.location.href = woLianw.wolianwVen1588;
    } else {
      window.location.href = woLianw.wolianwVen1588;
    }
  }

  /**
   * 获取验证码图片
   * @param obj:图片对象
   */
  woLianw.getValidateCode = function (obj, sid) {
    var url = (sid === '3') ? woLianw.wolianwDis1588 : woLianw.wolianwVen1588;
    obj.src = url+"api/code?width=120&height=36&"+new Date().getMilliseconds();  //后面添加时间毫秒数 去缓存
  }

  exports('woLianw',  woLianw);
});
