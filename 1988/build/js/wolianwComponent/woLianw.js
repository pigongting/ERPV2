layui.define(['layer', 'laypage', "laytpl", 'element'], function(exports){

    "use strict";

    var $ = layui.jquery;
    var laypage = layui.laypage;
    var laytpl = layui.laytpl;
    var element = layui.element;
    var layer = layui.layer;

    var woLianw = {};
    woLianw.wolianwVen1588 = '//ven.1588'+wolianwDomain,
    woLianw.wolianwDis1588 = '//dis.1588'+wolianwDomain,
    woLianw.wolianw1588 = '//1588'+wolianwDomain;
    woLianw.wolianw1788 = '//1788'+wolianwDomain;
    woLianw.wolianw1988 = '//1988'+wolianwDomain;
    woLianw.wolianw1999 = '//1999'+wolianwDomain;
    woLianw.url = "//"+(parent ? parent.location.host : location.host)+"/api";
    woLianw.src = imagesPrefix+'/';
    woLianw.appDownLink = setAppDownLink;
    woLianw.factoryPCReg = factoryPCReg;
    woLianw.iframe = '/';

    // woLianw.url = woLianw.wolianw1988+"api";

    woLianw.switch = "//"+(parent ? parent.location.host : location.host)+'/dis/index.html';

    /**
     * 获取验证码图片
     * @param obj:图片对象
     */
    woLianw.getValidateCode=function (obj) {
        obj.src = this.url+"/code?width=120&height=36?"+new Date().getMilliseconds();  //后面添加时间毫秒数 去缓存
    }

    /*用户接口开始*/
    
    //获取当前根目录
    function getRootPath(){
        var strFullPath = window.document.location.href;
        var strPath = window.document.location.pathname;
        var pos = strFullPath.indexOf(strPath);
        var prePath = strFullPath.substring(0,pos);
        var postPath = strPath.substring(0,strPath.substr(1).indexOf('/')+1);
        return(prePath+postPath);
   }

    /**
     * 跳转到登录页
     */
    woLianw.goLoginPage = function () {
        var _this = this
        if (location.href.indexOf('ven.') === -1) {
            if (parent) {
                parent.location.href = "/login.html";
            } else {
                window.location.href = "/login.html";
            }
        } else {
            if (parent) {
                parent.location.href = woLianw.wolianw1588+"login.html";
            } else {
                window.location.href = woLianw.wolianw1588+"login.html";
            }
        }
    }
    
    
    /*超时 退出登录*/
    woLianw.overtimeLoginOut = function(){
        var maxTime = 30*60; // seconds [以秒为单位倒计时1800秒是30分钟]
        var time = maxTime;
        $('body').on('keydown mousemove mousedown', function(e){
            time = maxTime; // reset
        });
        var intervalId = setInterval(function(){
            time--;
            //console.log("我是退出登录倒计时，剩余退出时间："+time+"秒！");
            if(time <= 0) {
                woLianw.loginout();
                clearInterval(intervalId);
            }
        }, 1000);
        
    }
    

    /**
     * 登录系统
     * @param url  /login
     * @param formdata  登录信息(登录名、密码、验证码、系统类型)
     * @param 回调函数
     */
    woLianw.login = function (formdata, callback) {
        var _this=this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:"post",
            data:formdata,
            url:_this.url+'/login',
            success:function (response) {
                var d = JSON.stringify(response.data);
                if(response.code == 0) {
                    /*登录失败，显示msg给用户看*/
                    console.log(response.msg);
                    callback(response.msg);
                }else if (response.code == 1) {
                    /*登录成功, 操作 data 项或显示 msg 给用户看*/
                   if(formdata.systemId == 2){
                        localStorage.setItem("1988login", d);
                        localStorage.setItem("1988flag", 'true');
                        location.href = './index.html';
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
     *登出系统
     */
    woLianw.loginout = function () {
        var _this=this;
        $.ajax({
            type:"post",
            url:_this.url + "/loginout",
            data:{},
            success:function (response) {
                if(response.code == 0) {
                    /*失败，显示msg给用户看*/

                }else if (response.code == 1) {
                    /*成功, 操作 data 项或显示 msg 给用户看*/
                    localStorage.removeItem('1988login');
                    if(window.location.href.indexOf('ven') == -1){
                        window.location.href = '/login.html';
                    }else{
                        window.location.href = woLianw.wolianw1588+'login.html';
                    }

                }else if(response.code == 10){
                    //退出登录成功操作以后(就是未登录状态)  code=10, 是进入这里的  删除本地的loaclStorage
                    localStorage.removeItem('1988login');
                    /*将用户导至登录页*/
                    _this.goLoginPage();
                }
            }

        })
    }

    /*切换登录*/
    woLianw.switchLogin = function (id) {
        var _this = this;
        $.ajax({
            type:"post",
            data: {
                systemId:1
            },
            url:_this.url+"/user/token",
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                }else if(response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/
                    var d = JSON.stringify(response.data);
                    if(window.location.href.indexOf('ven') == -1 ){
                        window.location.href = woLianw.wolianw1788+'dis.html?from=1988&sign='+response.data;
                    }else{
                        window.location.href = woLianw.wolianwDis1588+'dis.html?from=1588&sign='+response.data;
                    }

                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 根据用户id查询
     * @param userId (required)
     */
    woLianw.getById = function (userId) {
        var _this = this;
        var userId = userId || "";
        $.ajax({
            type:"post",
            data: userId,
            url:_this.url+"/user/getById",
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                }else if(response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/

                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 根据用户名查询
     * @param name (required)
     */
    woLianw.getByName = function (name) {
        var _this = this
        var name = name || ""
        $.ajax({
            type:"post",
            data: name,
            url: _this.url+'/user/getByName',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                }else if(response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/

                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 查询用户列表
     * @param parameter 参数对象，包含createId、name、enabled、page、limit(全都是可选)
     */
    woLianw.getUserList = function (parameter) {
        var _this = this
        var parameter = parameter || {}
        if(parameter.page &&(parameter.page == "" || parameter.page <=0 || typeof parameter.page != 'number')) {
            parameter.page = 1
        }
        if(parameter.limit &&(parameter.limit == "" || parameter.limit <=0 || parameter.limit > 1000 || typeof parameter.limit != 'number')) {
            parameter.limit = 15
        }
        $.ajax({
            type:'post',
            data:parameter,
            url:_this.url+'/user/list',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                }else if(response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/

                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }


    /**
     * 修改用户密码
     * @param oldPsw 旧密码(required)
     * @param newPsw 新密码(required)
     */
    woLianw.modifyPsw = function (oldPsw,newPsw) {
        var _this = this
        var oldPsw = oldPsw || ""
        var newPsw = newPsw || ""
        $.ajax({
            type:'post',
            data:{
                'oldPsw':oldPsw,
                'newPsw':newPsw
            },
            url: _this.url+'/user/modifyPsw',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                }else if(response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/

                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }


    /**
     * 重置密码
     * @param name (required)
     * @param newPsw (required)
     */
    woLianw.resetPsw = function (name,newPsw) {
        var _this = this
        var name = name
        var newPsw = newPsw
        $.ajax({
            type:'post',
            data:{
                'name':name,
                'newPsw':newPsw
            },
            url:_this.url+'/resetPsw',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                }else if(response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/

                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /*用户接口结束*/


    /*用户地址接口start*/


    /**
     * 获取用户地址列表
     * @param parameter(page,limit,systemType)
     * @param callback 处理数据的回调函数
     */
    woLianw.getAddressList = function (parameter,callback) {
        var _this = this
        if (parameter.page <= 0 || (typeof  parameter.page != 'number')) {
            parameter.page = 1
        }
        if (parameter.limit <= 0 || (typeof  parameter.limit != 'number') || parameter.limit > 1000) {
            parameter.limit = 15
        }
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'get',
            data:parameter,
            url:_this.url+'/address/list',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                }else if(response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/
                    callback(response.data.list)

                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }


    /**
     * 删除某个地址
     * @param addressId  （required）
     * @param callback      删除某个地址后的回调
     */
    woLianw.deleteAddress = function (addressId,callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'post',
            data: {
                addressId:addressId
            },
            url:_this.url+'/address/delete',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                }else if(response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/
                    callback()

                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }

        })
    }


    /**
     * 设置某个用户地址为默认地址
     * @param addressId
     * @param callback
     */
    woLianw.updateAddressDefault = function (addressId,callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'post',
            data:{
                addressId:addressId
            },
            url: _this.url+'/address/setDefault',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    alert('设置默认地址失败，请重新操作！')
                }else if(response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/
                    callback()

                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }


    /**
     * 获取用户地址详情
     * @param id
     * @param callback
     */
    woLianw.getAddressDetail = function (id,callback) {
        var _this = this
        var id = id || ''
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'get',
            data:{
                addressId:id
            },
            url:_this.url+'/address/detail',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                }else if(response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/
                    callback(response.data)

                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 修改用户地址
     * @param parameter
     * @param callback
     */
    woLianw.addressUpdate = function (parameter,callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'post',
            data: parameter,
            url:_this.url+'/address/edit',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                }else if(response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/
                    callback()

                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 新增用户地址
     * @param parameter
     * @param callback
     */
    woLianw.addAddress = function (parameter,callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'post',
            data: parameter,
            url:_this.url+'/address/add',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                }else if(response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/
                    callback()

                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })

    }


    /*用户地址接口end*/



    /*订单接口start*/

    /**
     * 1788首页每月订单数
     * @param callback
     */
    woLianw.everyMonthOrderNumForBuyer = function (callback) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'GET',
            url: _this.url + '/sell/order/everyMonthForSeller',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    /*操作（增加）成功，返回成功信息*/
                    console.log(response);
                    callback(response.data)

                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 1988首页订单数统计
     * @param callback
     */
    woLianw.orderNumForBuyer = function (callback) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'GET',
            /* url: 'http://192.168.3.154:8082/order/orderNumForBuyer',*/
            url: _this.url + '/sell/order/orderSumForSeller',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    /*操作（增加）成功，返回成功信息*/
                    console.log(response);
                    callback(response.data)

                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 1988首页销售数据记录
     * @param callback
     */
    woLianw.purchaseNumForBuyer = function (callback) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'GET',
            /*url:  'http://192.168.3.154:8082/order/purchaseNumForBuyer',*/
            url: _this.url + '/sell/order/salesSumForSeller',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    /*操作（增加）成功，返回成功信息*/
                    console.log(response);
                    callback(response.data)

                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 1988首页采购分类汇总
     * @param callback
     */
    woLianw.purchaseTypeForBuyer = function (callback) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'GET',
            /*url: 'http://192.168.3.154:8082/order/purchaseTypeForBuyer',*/
            url: _this.url + '/sell/order/salesTypeForSeller',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    /*操作（增加）成功，返回成功信息*/
                    console.log(response);
                    callback(response.data)

                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 1988区域统计图数据(不统计待付款,手动取消,自动取消,已拒单和已退回的订单)
     * @param callback
     */
    woLianw.salesPictureForSeller = function (callback) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'GET',
            /*url: 'http://192.168.3.154:8082/order/purchaseTypeForBuyer',*/
            url: _this.url + '/sell/order/salesPictureForSeller',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    /*操作（增加）成功，返回成功信息*/
                    console.log(response);
                    callback(response.data)

                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }



    /*订单接口end*/


    /*菜单(模块接口) start*/

    woLianw.getModuleList = function (parameter,callback) {
        var _this = this
        var parameter = parameter || {
            enabled: "",
            name: "",
            page: "",
            limit: ""
        }
        $.ajax({
            type:'get',
            data: parameter,
            url: _this.url + '/module/list',
            success: function (response) {
                console.log(response)
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                }else if(response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response.data.list);


                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }
    
    /*商品发布一级二级三级类目category     start
    * @param parameter 传递的参数
    * @param callback  回调函数(数据渲染模板)
    * @param templateID  模板ID
    * @param wrapID  盒子ID(数据渲染模板后把模板扔进盒子里)
    */
    woLianw.getCategoryList = function (callback, templateID, wrapID, parameter, nameUrl) {
        var _this = this;
        var parameter = parameter || {};
        //如果有nameUrl参数 调用自己输入的条件查询 ，如果没有的话， 就是点选三级分类查询了 
        if(nameUrl){
            var url = _this.url + "/sell/category/name";
        }else{
            var url = _this.url + '/sell/category/list';
        }
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'get',
            data:parameter || null,
            url: url,
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                }else if(response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response.data, templateID, wrapID);
                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            },
            error: function(response){
               console.log(response.statusText);
            }
        })
    }
    /*商品发布一级二级三级类目category     end*/
    
    /*填写商品信息详情     start
     * @param parameter 传递的参数
     * @param callback  回调函数(数据渲染模板)
     * @param templateID  模板ID
     * @param wrapID  盒子ID(数据渲染模板后把模板扔进盒子里)
     */
    woLianw.getProductInfoList = function (parameter, callback, num) {
        var _this = this;
        var parameter = parameter || {};
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            data: parameter,
            url:  _this.url + '/sell/category/property-value',
            success:function (response) {
             
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                  console.log(response.msg);
                  if(callback){
                    callback(0);
                  }
                }else if(response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                  if(callback && !num) {
                       callback(1);
                   }else if(callback && num) {
                     response.data.parameter = parameter;
                       var d = JSON.stringify(response.data);
                           window.localStorage.setItem("productReleaseData", d);
                           if(num==1){
                               window.location.href = './fillProductInformation.html?releaseType=0';
                           }else if(num==2){
                               window.location.href = './fillProductInformation.html?releaseType=1';
                           }
                   }
                  
                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            },
            error: function(response){
              console.log(response.statusText);
          }
        })
    }
     
     /*填写商品信息详情     end*/
     
    
      
      /*获取区域列表  start*/
     woLianw.getArea = function (parameter) {
          var _this = this;
          $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
          $.ajax({
              type:'post',
              data:parameter,
              url:_this.url+'/user/add',
              success:function (response) {
                  if (response.code == 0) {
                      /*失败，显示msg给用户看*/
                    console.log(response.msg);
                  }else if(response.code == 1) {
                      /*操作（增加）成功，返回成功信息*/
                      console.log(response.msg);
    
                  }else if(response.code == 10) {
                      /*未登录，将用户导至登录页*/
                      _this.goLoginPage();
                  }
              }
          })
      }
      /*获取区域列表  end*/
     
     /*填写商品信息详情  提交    start
      * @param parameter 传递的参数
      * @param callback  回调函数(数据渲染模板)
      */
      woLianw.productInfoSubmit = function (parameter, callback) {
          var _this = this;
          var parameter = parameter || {};http:
          var url = url || _this.url + '/sell/product';
          $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
          $.ajax({
              type: 'post',
              data: parameter,
              url: url,
              success:function (response) {
                
                  if (response.code == 0) {
                      /*失败，显示msg给用户看*/
                    console.log(response.msg);
                    callback(response);
                  }else if(response.code == 1) {
                      /*成功，渲染至页面*/
                    console.log(response.msg);
                    callback(response);
                  }else if(response.code == 10) {
                      /*未登录，将用户导至登录页*/
                      _this.goLoginPage();
                  }
              },
              error: function(response){
                console.log(response.statusText);
              }
          })
      }
      
      /*填写商品信息详情 提交     end*/
    

    /*退货相关接口 start*/

    /**
     * 获取退货列表
     * @param parameter
     * @param callback
     */
    woLianw.getSrvOrderList = function (parameter,callback) {
        var _this = this
        var parameter = parameter || {}
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'get',
            data:parameter,
            url:_this.url+'/srvOrder/list',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                }else if(response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    console.log(response);
                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /*退货相关接口 end*/

    /**
     * 售后详情
     * @param id 退货单id
     * @param callback
     */
    woLianw.getSrvOrderInfo = function (id,callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'get',
            data:{
                srvOrderId:id
            },
            url:_this.url+'/srvOrder/ven/detail/',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                }else if(response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    console.log(response);

                    woLianw.getEnum('',function (state) {
                        console.log(state);
                        var backStateEnum = state['back-state'];
                        var returnReasonStateEnum = state['return-reason'];

                        response.data.backStateText = backStateEnum[response.data.backState];
                        response.data.returnReasonStateText = returnReasonStateEnum[response.data.goodsReasonCode];
                        
                        callback(response.data);
                    });

                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /*获取url指定的参数值*/
    woLianw.GetQueryString = function(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }

    /*查看买家和卖家关于退货的协商历史*/
    woLianw.getSrvOrderLog = function (id,callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'get',
            data:{
                id:id
            },
            url:_this.url+'/srvOrder/log',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                }else if(response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    console.log(response);

                    woLianw.getEnum('',function (state) {
                        console.log(state);
                        var newdata = [];

                        var backStateEnum = state['back-state'];

                        for (var i = 0; i < response.data.length; i++) {
                            var item = response.data[i];
                            item.backStateText = backStateEnum[item.backState];
                            newdata.push(item);
                        }
                        
                        callback(newdata);
                    });

                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }


    /* 同意退货 */
    woLianw.ajaxSrvOrderAgreeToReturn = function (params, callback) {
      var _this = this
      $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
      $.ajax({
        type:'post',
        data: params,
        url: _this.url+'/srvOrder/agreeToReturn',
        success:function (response) {
          if (response.code == 0) {
            /*失败，显示msg给用户看*/
              layer.open({
                  type: 1,
                  title: false,
                  closeBtn: 0,
                  area: ['530px', '500px'],
                  shadeClose: true,
                  content: '<div class="mark-bigBox">\n' +
                  '            <div class="mark-top">\n' +
                  '                <p>开通个人钱包</p>\n' +
                  '            </div>\n' +
                  '            <div class="mark-content">\n' +
                  '                <p class="tip">提示:如果您已经下载我连网APP，扫描二维码可直接进入开通钱包</p>\n' +
                  '            </div>\n' +
                  '            <div class="mark-box">\n' +
                  '                <div id="qrcode" style="width: 200px;height: 200px;"></div>' +
                  '                <p>请扫描二维码下载我连网APP，并开通个人钱包，确保用户资金安全</p>\n' +
                  '            </div>\n' +
                  '        </div>',
                  success:function () {
                      /*二维码*/
                      var qrcode = new QRCode(document.getElementById("qrcode"), {
                          width : 96,//设置宽高
                          height : 96
                      });
                      qrcode.makeCode('http://1788.wolianw.com/qrcode/index.html?url='+response.data);
                  }
              });
          }else if(response.code == 1) {
            /*登录成功，操作data项数据，将菜单渲染至页面*/
            console.log(response);
            callback(response.data);
          }else if(response.code == 10) {
            /*未登录，将用户导至登录页*/
            _this.goLoginPage();
          }
        }
      });
    }

    /* 拒绝退货 */
    woLianw.ajaxSrvOrderRefuseToReturn = function (params, callback) {
      var _this = this
      $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
      $.ajax({
        type:'post',
        data: params,
        url: _this.url+'/srvOrder/refuseToReturn',
        success:function (response) {
          if (response.code == 0) {
            /*失败，显示msg给用户看*/
            console.log(response.msg);
          }else if(response.code == 1) {
            /*登录成功，操作data项数据，将菜单渲染至页面*/
            console.log(response);
            callback(response.data);
          }else if(response.code == 10) {
            /*未登录，将用户导至登录页*/
            _this.goLoginPage();
          }
        }
      });
    }

    /* 卖家确认收货 */
    woLianw.ajaxSrvOrderReceivedGoods = function (params, callback) {
      var _this = this
      $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
      $.ajax({
        type:'post',
        data: params,
        url: _this.url+'/srvOrder/receivedGoods',
        success:function (response) {
          if (response.code == 0) {
            /*失败，显示msg给用户看*/
            console.log(response.msg);
          }else if(response.code == 1) {
            /*登录成功，操作data项数据，将菜单渲染至页面*/
            console.log(response);
            callback(response.data);
          }else if(response.code == 10) {
            /*未登录，将用户导至登录页*/
            _this.goLoginPage();
          }
        }
      });
    }







    /**
     * 将日期转换成以下格式,如: 2017-09-30 15:08
     * @param date 日期，格式不限
     * @returns {string}  返回以下格式的日期字符串，如:2017-09-30 15:08
     */
    woLianw.transDateType=function (date, type) {
        if (date === null) {
        return '';
      }
        var date=new Date(date)
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        var minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        h = h < 10 ? ('0' + h) : h;

        if (type === 'date') {
          return y + '-' + m + '-' + d;
        } else {
          return y + '-' + m + '-' + d+' '+h+':'+minute;
        }
    }


    /**
     * 获取全部商品列表
     */
    woLianw.getAllGoodsLists = function() {
        var that = this;
        var productsHtml = '';

        $.ajax({
            type:"get",
            url: that.url + "/sell/product/list",  //   /order/disPaging
            async: false,
            success: function(data){
                var productsLength = data.length;
                var image, productName, productAddress, price, packageMail, moveHome, focus, listTitle;
                for(var i=0; i < productsLength; i++){
                    productName = data[i].productName;
                    image = data[i].img;
                    productAddress = data[i].address;
                    price = data[i].price;
                    packageMail = data[i].packageMail;
                    moveHome = data[i].moveHome;
                    focus = data[i].focus;
                    listTitle = data[i].productDec;
                    productsHtml += new Product(productName, productAddress, image, price, packageMail, listTitle, moveHome, focus).bindDom();

                }

            },
            error: function(data){
                console.log("链接服务器失败！");
            }
        });

        return productsHtml;

    }


    woLianw.setHeight = function () {
        var windowHeight=$(window).height();
        $(".main.container").css("min-height", windowHeight-120+"px");
        $(".main-content").css("min-height", windowHeight-360+"px");
        
    }
    
      



    /**（限售区域）
     * 省返回所有市, 市返回所有县, 县返回所有镇. 默认(不传或传入非正数)返回所有省
     * @param id 用来查询的id
     * @param callback 回调函数
     * @param templateID 渲染页面的模板id
     * @param wrapID 需要渲染的盒子id
     */
    woLianw.getLinkage = function (id, callback, templateID, wrapID) {
        var _this = this;
        var id = id || "-1";
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'get',
            async:true,
            data:{
                did:id
            },
            url:_this.url+'/manager/user/linkage',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                }else if(response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    if(templateID && wrapID){
                        callback(response.data, templateID, wrapID);
                    }else{
                        callback(response.data);
                    }

                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    };
    /**
     * 省返回所有市, 市返回所有县, 县返回所有镇. 默认(不传或传入非正数)返回所有省
     * @param id 用来查询的id
     * @param callback 回调函数
     * @param templateID 渲染页面的模板id
     * @param wrapID 需要渲染的盒子id
     */
    woLianw.getLinkage1 = function (id, callback, templateID, wrapID) {
        var _this = this;
        var id = id || "-1";
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'get',
            async:true,
            data:{
                did:id
            },
            url:_this.url+'/common/linkage',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                }else if(response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    if(templateID && wrapID){
                        callback(response.data, templateID, wrapID);
                    }else{
                        callback(response.data);
                    }

                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    };
    





    /*获取枚举信息（交易状态）*/
    woLianw.getEnum = function (parameter,callback) {
        var _this = this
        $.ajax({
            type:'get',
            data:{
                type:parameter
            },
            url:_this.url+'/enum',
            success:function (response) {
                if(response.code == 1){
                    console.log(response)
                    callback(response.data)
                }
            }
        })
    }

    /*获取订单状态*/
    woLianw.getOrderEnum = function (callback) {
        var _this = this
        $.ajax({
            type:'get',
            url:_this.url+'/enum-custom/order-status',
            success:function (response) {
                if(response.code == 1){
                    console.log(response)
                    callback(response.data)
                }
            }
        })
    }

    /**
     * 获取工厂（批发商）商品列表
     * @param parameter
     */
    woLianw.sellProductList = function (parameter,callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'get',
            data:parameter,
            url:_this.url+'/sell/product/list',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                }else if(response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    console.log(response)
                    callback(response.data)

                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }

        })
    }

    /**
     * 在用户上查询商品分组信息
     * @param parameter 商品名
     * @param callback
     */
    woLianw.productGroupList = function (parameter,callback) {
        var _this = this
        var parameter = parameter || {}
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'get',
            data:parameter,
            url:_this.url+'/sell/product/group/list',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                }else if(response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    console.log(response)
                    callback(response.data)

                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }

        })
    }

    /**
     * 删除某个商品
     * @param productId
     * @param callback
     */
    woLianw.productDelete = function (productId,callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'post',
            data:{
                productId:productId
            },
            url:_this.url+'/sell/product/delete',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                }else if(response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    console.log(response)
                    callback(response)

                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }

        })
    }

    /**
     * 工厂获取某个商品的sku信息
     * @param productId
     * @param callback
     */
    woLianw.productSku = function (productId,callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'get',
            data:{
                id:productId
            },
            url:_this.url+'/sell/product/sku',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                }else if(response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    console.log(response)
                    callback(response.data)

                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }

        })
    }

    /**
     * 工厂设置商品sku可售数量
     * @param parameter
     * @param callback
     */
    woLianw.productSkuSaleAmount = function (parameter,callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        console.log(parameter)
        $.ajax({
            type:'post',
            data:parameter,
            url:_this.url+'/sell/product/sku-sale-amount',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response)

                }else if(response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    console.log(response)
                    callback(response.msg)

                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }

        })
    }

    /**
     * 工厂添加商品分组
     * @param name 分组名称
     * @param callback
     */
    woLianw.sellProductGroupAdd = function (name,callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'post',
            data:{
                name:name
            },
            url:_this.url+'/sell/product/group',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response)

                }else if(response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    console.log(response)
                    callback(response.data)

                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }

        })
    }

    /**
     * 工厂将商品上下架
     * @param parameter
     * @param callback
     */
    woLianw.sellProductOnline = function (parameter,callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'post',
            data:parameter,
            url:_this.url+'/sell/product/online',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response)

                }else if(response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    console.log(response)
                    callback(response.msg)

                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }

        })
    }

    /*增加商品分组*/
    woLianw.addSellProductGroup1 = function (parameter,callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'post',
            data:parameter,
            url:_this.url+'/sell/product/group/add-product',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response)

                }else if(response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    console.log(response)
                    callback(response.msg)

                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }

        })
    }



    /**
     *  商品发布 获取运费模板
     */
    woLianw.fillProInfoFareList = function (callback) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'get',
            async: true,
            url:_this.url+'/fare/select',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                }else if(response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response.data);
                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }
    /**
     * 获取运费模板
     */
    woLianw.getFareList = function (callback, templateID, wrapID) {
        var _this = this;
         // _this.url = 'http://192.168.3.137:8002';
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'get',
            async: true,
            url:_this.url+'/fare/list',
            // url:'http://192.168.3.137:7015/fare/list',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                }else if(response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    if(templateID && wrapID){
                        for (var i = 0; i < response.data.list.length; i++) {
                            var item = response.data.list[i];
                            for (var k = 0; k < item.itemList.length; k++) {
                                var ele = item.itemList[k];
                                var allregion = '全国(除指定地区以外)';
                                try {
                                    var region = JSON.parse(ele.shippingRegion);
                                    if (region) {
                                        for (var j = 0; j < region.length; j++) {
                                            if (j === 0) {
                                                ele.shippingRegion = region[j].name;
                                            } else {
                                                ele.shippingRegion += '、'+region[j].name;
                                            }
                                        }
                                    } else {
                                        ele.shippingRegion = allregion;
                                    }
                                } catch (e) {
                                    ele.shippingRegion = allregion;
                                }

                                if (item.chargeType === 1) {
                                    ele.startAmount = parseInt(ele.startAmount, 10);
                                    ele.additionAmount = parseInt(ele.additionAmount, 10);
                                    ele.freeAmount = parseInt(ele.freeAmount, 10);
                                } else if (item.chargeType === 2) {
                                    ele.startAmount = parseFloat(ele.startAmount, 10);
                                    ele.additionAmount = parseFloat(ele.additionAmount, 10);
                                    ele.freeAmount = parseFloat(ele.freeAmount, 10);
                                }

                            }
                        }
                        callback(response.data, templateID, wrapID);
                    }else{
                        callback(response.data);
                    }

                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

  
  
    /**
     * 删除运费模板
     */
    woLianw.ajaxFareDelete = function (id, callback) {
        var _this = this;
        // _this.url = 'http://192.168.3.137:8002';
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'post',
            async:true,
            data: {
                id: id
            },
            url:_this.url+'/fare/delete',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                }else if(response.code == 1) {
                    callback && callback();
                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 获取运费地址
     */
    woLianw.getFareArea = function (callback) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'get',
            async:true,
            url:'./datas/fareArea.json',
            success:function (response) {
                callback(response);
            }
        })
    }

    /**
     * 添加运费模板
     */
    woLianw.ajaxFareAdd = function (params) {
        var _this = this;
        // _this.url = 'http://192.168.3.137:8002';
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'post',
            async:true,
            data: params,
            url:_this.url+'/fare/add',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                    layer.open({
                      type: 0, 
                      title: false,
                      anim: 6,
                      icon: 5,
                      closeBtn: 0,
                      btn: false,
                      time: 2000,
                      content: response.msg,
                    });
                }else if(response.code == 1) {
                    location.href = './freight.html';
                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 更新运费模板
     */
    woLianw.ajaxFareUpdate = function (params) {
        var _this = this;
        // _this.url = 'http://192.168.3.137:8002';
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'post',
            async:true,
            data: params,
            url:_this.url+'/fare/edit',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                    layer.open({
                      type: 0, 
                      title: false,
                      anim: 6,
                      icon: 5,
                      closeBtn: 0,
                      btn: false,
                      time: 2000,
                      content: response.msg,
                    });
                }else if(response.code == 1) {
                    location.href = './freight.html';
                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 查看运费模板
     */
    woLianw.ajaxFareShow = function (params, callback, templateID, wrapID) {
        var _this = this;
        // _this.url = 'http://192.168.3.137:8002';
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'get',
            async:true,
            data: params,
            url:_this.url+'/fare/detail',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                }else if(response.code == 1) {
                    for (var i = 0; i < response.data.itemList.length; i++) {
                        var item = response.data.itemList[i];
                        if (response.data.chargeType === 1) {
                            item.startAmount = parseInt(item.startAmount, 10);
                            item.additionAmount = parseInt(item.additionAmount, 10);
                            item.freeAmount = parseInt(item.freeAmount, 10);
                        } else if (response.data.chargeType === 2) {
                            item.startAmount = parseFloat(item.startAmount, 10);
                            item.additionAmount = parseFloat(item.additionAmount, 10);
                            item.freeAmount = parseFloat(item.freeAmount, 10);
                        }
                    }

                    callback([response.data], templateID, wrapID);
                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 运费模板下拉列表
     */
    woLianw.ajaxFareSelect = function (callback, templateID, wrapID) {
        var _this = this;
        // _this.url = 'http://192.168.3.137:8002';
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'get',
            async:true,
            url:_this.url+'/fare/select',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                }else if(response.code == 1) {
                    if (response.data[0]) {
                        callback({
                            list: response.data,
                            chargeType: response.data[0].chargeType,
                            selectedID: response.data[0].id,
                            amount: 0,
                        }, templateID, wrapID);
                    }
                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 运费计算器
     */
    woLianw.ajaxFareCalculate = function (params, callback, templateID, wrapID) {
        var _this = this;
        // _this.url = 'http://192.168.3.137:8002';
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'post',
            data: params,
            url:_this.url+'/fare/calculate',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                }else if(response.code == 1) {
                    callback(response.data);
                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 物流信息详情查询
     */
    woLianw.ajaxFareGetOrderTraces = function (params, success, error) {
        var _this = this;
        // _this.url = 'http://192.168.3.137:8002';
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'get',
            data: params,
            url: _this.url+'/fare/getOrderTraces',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    error && error(response.msg);
                }else if(response.code == 1) {
                    success && success(response.data);
                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 获取运费模板关联的商品
     * @param parameter
     * @param callback
     */
    woLianw.fareProductList = function (parameter,callback) {
        var _this = this;
        // _this.url = 'http://192.168.3.137:8002';
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'get',
            async:true,
            data: parameter,
         /*   url:'http://192.168.3.137:7015/fare/product/list',*/
            url:_this.url+'/fare/product/list',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                }else if(response.code == 1) {
                    callback(response.data);
                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }










    /* 获取指定参数值 */
    woLianw.pathSarchValue = function (pathsearch, key) {
      var searchValue = '';
      var searchArray = pathsearch && pathsearch.substring(1) && pathsearch.substring(1).split('&');

      if (searchArray) {
        for (var i = 0; i < searchArray.length; i++) {
          var item = searchArray[i];
          var itemArray = item.split('=');
          if (itemArray.length > 1 && itemArray[0] === key) {
            searchValue = itemArray[1];
          }
        }
      }

      return searchValue;
    }


    /**
     * 将数值四舍五入(保留2位小数)后格式化成金额形式
     *
     * @param num 数值(Number或者String)
     * @return 金额格式的字符串,如'1,234,567.45'
     * @type String
     */
    woLianw.formatCurrency=function(num) {
        var num = num.toString().replace(/\$|\,/g,'');
        if(isNaN(num))
            num = "0";
        var sign = (num == (num = Math.abs(num)));
        num = Math.floor(num*100+0.50000000001);
        var cents = num%100;
        num = Math.floor(num/100).toString();
        if(cents<10)
            cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
            num = num.substring(0,num.length-(4*i+3))+','+
                num.substring(num.length-(4*i+3));
        return (((sign)?'':'-') + num + '.' + cents);
    }

















  /*列出角色（岗位)  start*/
    woLianw.getRoleList = function (parameter, callback) {
        var _this = this;
        // _this.url = 'http://192.168.3.37/';
        parameter.page ? parameter.page : parameter.page = 1;
        parameter.limit ? parameter.limit : parameter.limit = 10;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'get',
            data:parameter,
            url:_this.url+'/role/list',
            success:function (response) {
              console.log(response);
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                  console.log(response.msg);
                }else if(response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response.data.list);
                    if(response.data.list.length > 0){
                      $("#laypageBox").show();
                      laypage.render({
                  elem : "laypageBox",    //存放分页的div盒子 ID
                  count: response.data.total, //数据总数
                  curr: parameter.page || 1,
                  limit: parameter.limit || 10,   //限制每页显示多少数据
                  limits: [10, 20, 30],  // 定义下拉框里面 可供选择的 每页显示多少条数据
                  theme: '#009688',   //自定义分页样式
                  first: '首页',
                  last: '尾页',
                  layout: ['count', 'skip', "first", 'prev', 'page', 'next', "last", 'limit'],  //分页排版
                  jump: function(obj, first){                           //obj是一个object类型。包括了分页的所有配置信息。
                    if(!first){  //first一个Boolean类，检测页面是否初始加载。非常有用，可避免无限刷新。
                      parameter.page = obj.curr;
                      parameter.limit = obj.limit;
                      _this.getRoleList(parameter, callback);

                    }
                  }
              });
                    }else{
                      $("#laypageBox").hide();
                    }


                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }
   /*列出角色（岗位)  end*/

    /*增加角色(岗位)  start*/
    woLianw.addRole = function (parameter, callback) {
        var _this = this;
        // _this.url = 'http://192.168.3.37/';
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'post',
            data:parameter,
            url:_this.url+'/role/add',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                  console.log(response.msg);
                }else if(response.code == 1) {
                    /*操作（增加）成功，返回成功信息*/
                    console.log(response.msg);
                    callback && callback();
                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }
   /*增加角色(岗位) end*/

   /*修改角色(岗位)  start*/
   woLianw.updateRole = function (parameter, callback) {
      var _this = this;
      // _this.url = 'http://192.168.3.37/';
      $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
      $.ajax({
          type:'post',
          data:parameter,
          url:_this.url+'/role/edit',
          success:function (response) {
              if (response.code == 0) {
                  /*失败，显示msg给用户看*/
                console.log(response.msg);
              }else if(response.code == 1) {
                  /*操作（增加）成功，返回成功信息*/
                  console.log(response.msg);
                  callback && callback();
              }else if(response.code == 10) {
                  /*未登录，将用户导至登录页*/
                  _this.goLoginPage();
              }
          }
      })
    }
   /*修改角色(岗位) end*/

   /*查看岗位信息  start*/
    woLianw.ajaxRoleDetail = function (id, callback) {
        var _this = this;
        // _this.url = 'http://192.168.3.37';
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'get',
            url:_this.url+'/role/detail?roleId='+id,
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                  console.log(response.msg);
                }else if(response.code == 1) {
                  /*操作（增加）成功，返回成功信息*/
                  callback(response.data);
                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }
    /*查看岗位信息(岗位) end*/

  /* 获取权限设置  start*/
  woLianw.ajaxRoleToSetPermission = function (params, callback) {
    var _this = this;

    $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});

    $.ajax({
      type:'get',
      data: params,
      // url: './json/setPermission.json',
      url: _this.url+'/role/toSetPermission',
      success:function (response) {
        if (response.code == 0) {
          /*失败，显示msg给用户看*/
          console.log(response.msg);
        }else if(response.code == 1) {
          /*操作（增加）成功，返回成功信息*/

          for (var s = 0; s < response.data.rows.length; s++) {
            var sitem = response.data.rows[s];
            sitem.permissionChoseArray = [];
            for (var i = 0; i < sitem.permissionDataArray.length; i++) {
              var ele = sitem.permissionDataArray[i];
              if (ele && ele.isChoice === true) {
                sitem.permissionChoseArray.push(true);
              } else if (ele && ele.isChoice === false) {
                sitem.permissionChoseArray.push(false);
              } else {
                sitem.permissionChoseArray.push(null);
              }
            }
          }

          callback(response.data);
        }else if(response.code == 10) {
          /*未登录，将用户导至登录页*/
          _this.goLoginPage();
        }
      }
    })
  }
  /* 获取权限设置 end*/


  /* 获取权限设置  start*/
  woLianw.ajaxRoleSetPermission = function (params, callback) {
    var _this = this;

    $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});

    $.ajax({
      type:'post',
      data: params,
      url: _this.url+'/role/setPermission',
      success:function (response) {
        if (response.code == 0) {
          /*失败，显示msg给用户看*/
          console.log(response.msg);
        }else if(response.code == 1) {
          /*操作（增加）成功，返回成功信息*/
          callback(response.data);
        }else if(response.code == 10) {
          /*未登录，将用户导至登录页*/
          _this.goLoginPage();
        }
      }
    })
  }

    /*list列出员工  start*/
    woLianw.getStaffList = function (parameter, callback) {
        var _this = this;
        // _this.url = 'http://192.168.3.37/';
        parameter.page ? parameter.page : parameter.page = 1;
        parameter.limit ? parameter.limit : parameter.limit = 10;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'get',
            data:parameter,
            url:_this.url+'/user/employee/list',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                  console.log(response.msg);
                }else if(response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response.data.list);
                    if(response.data.list.length > 0){
                      $("#laypageBox").show();
                      laypage.render({
                  elem : "laypageBox",    //存放分页的div盒子 ID
                  count: response.data.total, //数据总数
                  curr: parameter.page || 1,
                  limit: parameter.limit || 10,   //限制每页显示多少数据
                  limits: [10, 20, 30],  //定义下拉框里面 可供选择的 每页显示多少条数据
                  theme: '#009688',   //自定义分页样式
                  first: '首页',
                  last: '尾页',
                  layout: ['count', 'skip', "first", 'prev', 'page', 'next', "last", 'limit'],  //分页排版
                  jump: function(obj, first){                           //obj是一个object类型。包括了分页的所有配置信息。
                    if(!first){  //first一个Boolean类，检测页面是否初始加载。非常有用，可避免无限刷新。
                      parameter.page = obj.curr;
                      parameter.limit = obj.limit;
                      _this.getStaffList(parameter, callback);
                      _this.setHeight();

                    }
                  }
              });
                    }else{
                      $("#laypageBox").hide();
                    }

                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }
    /*list列出员工  end*/

    /*增加员工  start*/
    woLianw.addStaff = function (parameter) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'post',
            data:parameter,
            url:_this.url+'/user/add',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                  console.log(response.msg);
                }else if(response.code == 1) {
                    /*操作（增加）成功，返回成功信息*/
                    console.log(response.msg);

                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }
   /*增加员工 end*/

    /*删除员工  start*/
    woLianw.deleteRole = function (parameter) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'post',
            data:parameter,
            url:_this.url+'/role/delete',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                  console.log(response.msg);
                }else if(response.code == 1) {
                    /*操作（增加）成功，返回成功信息*/
                    console.log(response.msg);

                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }
   /*删除员工 end*/

    /**
     * 查看用户信息
     */
    woLianw.ajaxUserToEdit = function (params, callback) {
        var _this = this;
        // _this.url = 'http://192.168.3.37/';
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'get',
            async: true,
            data: params,
            url:_this.url+'/user/toEdit',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                }else if(response.code == 1) {
                    callback(response.data);
                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 查看用户角色
     */
    woLianw.ajaxRoleDistributeRole = function (params, callback) {
      var _this = this;
      // _this.url = 'http://192.168.3.37/';
      $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
      $.ajax({
        type:'get',
        async: true,
        data: params,
        url:_this.url+'/role/distributeRole',
        success:function (response) {
          if (response.code == 0) {
            /*失败，显示msg给用户看*/
            console.log(response.msg);
          }else if(response.code == 1) {
            callback(response.data);
          }else if(response.code == 10) {
            /*未登录，将用户导至登录页*/
            _this.goLoginPage();
          }
        }
      })
    }

    /**
     * 添加用户
     */
    woLianw.ajaxUserAdd = function (params, callback) {
        var _this = this;
        // _this.url = 'http://192.168.3.37/';
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'post',
            async: true,
            data: params,
            url:_this.url+'/user/add',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                }else if(response.code == 1) {
                    callback(response.data);
                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 编辑员工信息
     */
    woLianw.ajaxUserEmployeeEdit = function (params, callback) {
      var _this = this;
      // _this.url = 'http://192.168.3.37/';
      $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
      $.ajax({
        type:'post',
        async: true,
        data: params,
        url:_this.url+'/user/employee/edit',
        success:function (response) {
          if (response.code == 0) {
            /*失败，显示msg给用户看*/
            console.log(response.msg);
          }else if(response.code == 1) {
            callback(response.data);
          }else if(response.code == 10) {
            /*未登录，将用户导至登录页*/
            _this.goLoginPage();
          }
        }
      })
    }

    /**
     * 删除员工
     */
    woLianw.ajaxUserDelete = function (params, callback) {
      var _this = this;
      // _this.url = 'http://192.168.3.37/';
      $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
      $.ajax({
        type:'post',
        async: true,
        data: params,
        url:_this.url+'/user/delete',
        success:function (response) {
          if (response.code == 0) {
            /*失败，显示msg给用户看*/
            console.log(response.msg);
          }else if(response.code == 1) {
            callback(response.data);
          }else if(response.code == 10) {
            /*未登录，将用户导至登录页*/
            _this.goLoginPage();
          }
        }
      })
    }


    /* 待接受订单 */
    woLianw.ajaxOrderAccept = function (params, callback, templateID, wrapID) {
      var _this = this;
      // _this.url = 'http://192.168.3.37/';
      $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
      $.ajax({
        type:'get',
        async: true,
        data: params,
        url: _this.url+'/sell/order/waitConfirm/list',
        success:function (response) {
          if (response.code == 0) {
            /*失败，显示msg给用户看*/
            console.log(response.msg);
          }else if(response.code == 1) {
            callback(response.data, templateID, wrapID);
          }else if(response.code == 10) {
            /*未登录，将用户导至登录页*/
            _this.goLoginPage();
          }
        }
      })
    }


    /* 待接受订单 */
    woLianw.ajaxSellOrderWaitSendList = function (params, callback, templateID, wrapID) {
      var _this = this;
      // _this.url = 'http://192.168.3.154:8082/';
      $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
      $.ajax({
        type:'get',
        async: true,
        data: params,
        url: _this.url+'/sell/order/waitSend/list',
        success:function (response) {
          if (response.code == 0) {
            /*失败，显示msg给用户看*/
            console.log(response.msg);
          }else if(response.code == 1) {
            callback(response.data, templateID, wrapID);
          }else if(response.code == 10) {
            /*未登录，将用户导至登录页*/
            _this.goLoginPage();
          }
        }
      })
    }


    /* 全部订单 */
    woLianw.ajaxSellOrderAllOrderList = function (params, callback, templateID, wrapID) {
      var _this = this;
      // _this.url = 'http://192.168.3.154:8082/';
      $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
      $.ajax({
        type:'get',
        async: true,
        data: params,
        url: _this.url+'/sell/order/allOrder/list',
        success:function (response) {
          if (response.code == 0) {
            /*失败，显示msg给用户看*/
            console.log(response.msg);
          }else if(response.code == 1) {

            woLianw.getOrderEnum(function (state) {
                console.log(state);
                var newdata = [];

                for (var i = 0; i < response.data.list.length; i++) {
                    var item = response.data.list[i];
                    item.orderStateText = state[item.orderState] ? state[item.orderState].order : null;
                    item.transactionStateText = state[item.orderState] ? state[item.orderState].transaction : null;
                    newdata.push(item);
                }
                
                callback({list: newdata, total: response.data.total }, templateID, wrapID);
            });

          }else if(response.code == 10) {
            /*未登录，将用户导至登录页*/
            _this.goLoginPage();
          }
        }
      })
    }


    /* 待退货列表 */
    woLianw.ajaxSrvOrderList = function (params, callback, templateID, wrapID) {
      var _this = this;
      // _this.url = 'http://192.168.3.37/';
      $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
      $.ajax({
        type:'get',
        async: true,
        data: params,
        url: _this.url+'/srvOrder/list',
        success:function (response) {
          if (response.code == 0) {
            /*失败，显示msg给用户看*/
            console.log(response.msg);
          }else if(response.code == 1) {
            woLianw.getEnum('',function (state) {
                console.log(state);
                var newdata = [];

                var returnReasonEnum = state['return-reason'];
                var backStateEnum = state['back-state'];

                for (var i = 0; i < response.data.list.length; i++) {
                    var item = response.data.list[i];
                    item.goodsReasonText = returnReasonEnum[item.goodsReasonCode];
                    item.backStateText = backStateEnum[item.backState];
                    newdata.push(item);
                }
                
                callback({list: newdata, total: response.data.total }, templateID, wrapID);
            });
          }else if(response.code == 10) {
            /*未登录，将用户导至登录页*/
            _this.goLoginPage();
          }
        }
      })
    }


    /* 待收货列表 */
    woLianw.ajaxSrvOrderReceiveList = function (params, callback, templateID, wrapID) {
      var _this = this;
      // _this.url = 'http://192.168.3.37/';
      $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
      $.ajax({
        type:'get',
        async: true,
        data: params,
        url: _this.url+'/srvOrder/receive/list',
        success:function (response) {
          if (response.code == 0) {
            /*失败，显示msg给用户看*/
            console.log(response.msg);
          }else if(response.code == 1) {
            woLianw.getEnum('',function (state) {
                console.log(state);
                var newdata = [];

                var returnReasonEnum = state['return-reason'];
                var backStateEnum = state['back-state'];

                for (var i = 0; i < response.data.list.length; i++) {
                    var item = response.data.list[i];
                    item.goodsReasonText = returnReasonEnum[item.goodsReasonCode];
                    item.backStateText = backStateEnum[item.backState];
                    newdata.push(item);
                }
                
                callback({list: newdata, total: response.data.total }, templateID, wrapID);
            });
          }else if(response.code == 10) {
            /*未登录，将用户导至登录页*/
            _this.goLoginPage();
          }
        }
      })
    }

    /**
     * 获取快递公司
     */
    woLianw.ajaxSellOrderExpressList = function (params, callback, templateID, wrapID) {
      var _this = this;
      $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
      $.ajax({
        type:'get',
        async: true,
        data: params,
        url: _this.url+'/common/expressList',
        success:function (response) {
          if (response.code == 0) {
            /*失败，显示msg给用户看*/
          }else if(response.code == 1) {
            callback(response.data);
          }else if(response.code == 10) {
            /*未登录，将用户导至登录页*/
            _this.goLoginPage();
          }
        }
      })
    }


    /* 全部退货单 */
    woLianw.ajaxSrvOrderAllList = function (params, callback, templateID, wrapID) {
      var _this = this;
      // _this.url = 'http://192.168.3.37/';
      $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
      $.ajax({
        type:'get',
        async: true,
        data: params,
        url: _this.url+'/srvOrder/all/list',
        success:function (response) {
          if (response.code == 0) {
            /*失败，显示msg给用户看*/
            console.log(response.msg);
          }else if(response.code == 1) {
            woLianw.getEnum('',function (state) {
                console.log(state);
                var newdata = [];

                var returnReasonEnum = state['return-reason'];
                var backStateEnum = state['back-state'];

                for (var i = 0; i < response.data.list.length; i++) {
                    var item = response.data.list[i];
                    item.goodsReasonText = returnReasonEnum[item.goodsReasonCode];
                    item.backStateText = backStateEnum[item.backState];
                    newdata.push(item);
                }
                
                callback({list: newdata, total: response.data.total }, templateID, wrapID);
            });
          }else if(response.code == 10) {
            /*未登录，将用户导至登录页*/
            _this.goLoginPage();
          }
        }
      })
    }

    /**
     * 退货单详情
     * @param callback
     */
    woLianw.srvOrderDetail = function (params, callback) {
        var _this = this
        $.ajaxSetup({ crossDomain: true, xhrFields: { withCredentials: true } });
        $.ajax({
            type: 'get',
            data: params,
            url: _this.url + '/srvOrder/ven/detail',
            success: function (response) {
                console.log(response)
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    console.log(response);
                    callback(response.data)
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 退货单客户信息
     * @param callback
     */
    woLianw.srvOrderCustomerDetail = function (params, callback) {
        var _this = this
        $.ajaxSetup({ crossDomain: true, xhrFields: { withCredentials: true } });
        $.ajax({
            type: 'get',
            data: params,
            url: _this.url + '/srvOrder/customer/detail',
            success: function (response) {
                console.log(response)
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    console.log(response);
                    callback(response.data)
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 退货单操作信息
     * @param callback
     */
    woLianw.srvOrderCustomerLog = function (params, callback) {
        var _this = this
        $.ajaxSetup({ crossDomain: true, xhrFields: { withCredentials: true } });
        $.ajax({
            type: 'get',
            data: params,
            url: _this.url + '/srvOrder/customer/log',
            success: function (response) {
                console.log(response)
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    console.log(response);
                    callback(response.data)
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 退货单统计
     * @param callback
     */
    woLianw.srvOrderStatistic = function (callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            url: _this.url + '/srvOrder/statistic',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    console.log(response);
                    callback(response.data)
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /*  订单详情 */
    woLianw.ajaxSellOrderVenOrderItemByNo = function (params, callback) {
      var _this = this;
      // _this.url = 'http://192.168.3.154:8082';
      $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
      $.ajax({
        type:'get',
        async: true,
        data: params,
        url: _this.url+'/sell/order/venOrderItemByNo',
        success:function (response) {
          if (response.code == 0) {
            /*失败，显示msg给用户看*/
            console.log(response.msg);
          }else if(response.code == 1) {

            woLianw.getOrderEnum(function (state) {
                response.data.orderStateText = state[response.data.orderState] ? state[response.data.orderState].order : null;
                response.data.transactionStateText = state[response.data.orderState] ? state[response.data.orderState].transaction : null;
                
                callback(response.data);
            });

          }else if(response.code == 10) {
            /*未登录，将用户导至登录页*/
            _this.goLoginPage();
          }
        }
      })
    }

    /* 订单详情 - 客户信息 */
    woLianw.ajaxOrderBuyerInfoById = function (params, callback) {
      var _this = this;
      // _this.url = 'http://192.168.3.154:8082';
      $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
      $.ajax({
        type:'get',
        async: true,
        data: params,
        url: _this.url+'/order/buyerInfoById',
        success:function (response) {
          if (response.code == 0) {
            /*失败，显示msg给用户看*/
            console.log(response.msg);
          }else if(response.code == 1) {
            callback(response.data);
          }else if(response.code == 10) {
            /*未登录，将用户导至登录页*/
            _this.goLoginPage();
          }
        }
      })
    }

    /* 订单详情 - 订单操作信息 */
    woLianw.ajaxOrderBuyerOperateInfoById = function (params, callback) {
      var _this = this;
      // _this.url = 'http://192.168.3.154:8082';
      $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
      $.ajax({
        type:'get',
        async: true,
        data: params,
        url: _this.url+'/order/buyerOperateInfoById',
        success:function (response) {
          if (response.code == 0) {
            /*失败，显示msg给用户看*/
            console.log(response.msg);
          }else if(response.code == 1) {
            callback(response.data);
          }else if(response.code == 10) {
            /*未登录，将用户导至登录页*/
            _this.goLoginPage();
          }
        }
      })
    }

    /* 订单详情 - 评价信息 */
    woLianw.ajaxOrderBuyerAppraiseInfoById = function (params, callback) {
      var _this = this;
      // _this.url = 'http://192.168.3.154:8082';
      $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
      $.ajax({
        type:'get',
        async: true,
        data: params,
        url: _this.url+'/order/buyerAppraiseInfoById',
        success:function (response) {
          if (response.code == 0) {
            /*失败，显示msg给用户看*/
            console.log(response.msg);
          }else if(response.code == 1) {
            callback(response.data);
          }else if(response.code == 10) {
            /*未登录，将用户导至登录页*/
            _this.goLoginPage();
          }
        }
      })
    }

    /*  待发货订单 - 发货 */
    woLianw.ajaxSellOrderVenSendGoods = function (params, callback) {
      var _this = this;
      // _this.url = '//192.168.3.154:8082';
      $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
      $.ajax({
        type:'post',
        async: true,
        data: params,
        url: _this.url+'/sell/order/venSendGoods',
        success:function (response) {
          if (response.code == 0) {
            /*失败，显示msg给用户看*/
            console.log(response.msg);
          }else if(response.code == 1) {
            callback(response.data);
          }else if(response.code == 10) {
            /*未登录，将用户导至登录页*/
            _this.goLoginPage();
          }
        }
      })
    }

    /*  全部订单 - 修改物流信息 */
    woLianw.ajaxSellOrderVenUpdateOrderExpress = function (params, callback) {
      var _this = this;
      // _this.url = '//192.168.3.154:8082';
      $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
      $.ajax({
        type:'post',
        async: true,
        data: params,
        url: _this.url+'/sell/order/venUpdateOrderExpress',
        success:function (response) {
          if (response.code == 0) {
            /*失败，显示msg给用户看*/
            console.log(response.msg);
          }else if(response.code == 1) {
            callback(response.data);
          }else if(response.code == 10) {
            /*未登录，将用户导至登录页*/
            _this.goLoginPage();
          }
        }
      })
    }

    /*  待接受订单 - 接单 */
    woLianw.ajaxSellOrderVenAcceptOrders = function (params, callback) {
      var _this = this;
      $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
      $.ajax({
        type:'post',
        async: true,
        data: params,
        url: _this.url+'/sell/order/venAcceptOrders',
        success:function (response) {
          if (response.code == 0) {
            /*失败，显示msg给用户看*/
            layer.msg(response.msg);
          }else if(response.code == 1) {
            callback(response.data);
          }else if(response.code == 10) {
            /*未登录，将用户导至登录页*/
            _this.goLoginPage();
          }
        }
      })
    }

    /*  待接受订单 - 拒单 */
    woLianw.ajaxSellOrderVenRefuseOrders = function (params, callback) {
      var _this = this;
      $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
      $.ajax({
        type:'post',
        async: true,
        data: params,
        url: _this.url+'/sell/order/venRefuseOrders',
        success:function (response) {
          if (response.code == 0) {
            /*失败，显示msg给用户看*/
            console.log(response.msg);
          }else if(response.code == 1) {
            callback(response.data);
          }else if(response.code == 10) {
            /*未登录，将用户导至登录页*/
            _this.goLoginPage();
          }
        }
      })
    }



    /*商品编辑     start
     * @param productId 商品id
     * @param callback  回调函数(数据渲染模板)
     */
     woLianw.productEditor = function (parameter, callback) {
         var _this = this;
         $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
         $.ajax({
             type: 'get',
             data: parameter,
             url:  _this.url + '/sell/product/edit',
             success:function (response) {

                 if (response.code == 0) {
                     /*失败，显示msg给用户看*/
                    console.log(response.msg);
                 }else if(response.code == 1) {
                     /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response.data);

                 }else if(response.code == 10) {
                     /*未登录，将用户导至登录页*/
                     _this.goLoginPage();
                 }
             },
             error: function(response){
                console.log(response.statusText);
             }
         })
     }

     /*商品编辑     end*/
     
     
     /*选择对应APP商品分类编辑     start
      * @param productId 商品id
      * @param callback  回调函数(数据渲染模板)
      */
      woLianw.getHsmjCategory = function (parameter, callback, first) {
          var _this = this;
          //var first = first;
          $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
          $.ajax({
              type: 'get',
              data: parameter,
              url:  _this.url + '/sell/product/hsmj-category',
              success:function (response) {
                
                  if (response.code==0) {
                      /*失败，显示msg给用户看*/
                    console.log(response);
                    localStorage.setItem("ischeckUser", false);
                  }else if(response.code == 1) {
                      /*登录成功，操作data项数据，将菜单渲染至页面*/
                      if(first){ //是否第一次调用
                          localStorage.setItem("ischeckUser", true);
                          callback(response.data.list, first)
                      }else{
                          callback(response.data.list);
                      }
                               
                  }else if(response.code == 10) {
                      /*未登录，将用户导至登录页*/
                      _this.goLoginPage();
                  }
              },
              error: function(response){
                console.log(response.statusText);
             }
          })
      }
      
      /*选择对应APP商品分类    end*/
    
    
    /*上传图片     start
     * @param productId 商品id
     * @param callback  回调函数(数据渲染模板)
     */
     woLianw.uploadPicter = function (parameter, callback) {
         var _this = this;
         // _this.url = "192.168.3.76";
         $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
         $.ajax({
             type: 'post',
             data: parameter,
             url:  _this.url + '/sell/product/uploadfile',
             success:function (response) {
                
                 if (response.code == 0) {
                     /*失败，显示msg给用户看*/
                    console.log(response.msg);
                 }else if(response.code == 1) {
                     /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response.data);
                     
                 }else if(response.code == 10) {
                     /*未登录，将用户导至登录页*/
                     _this.goLoginPage();
                 }
                 
             },
             error: function(response){
                console.log(response.statusText);
             }
         })
     }
     
     /*上传图片     end*/
     

     /*通过laytpl模板引擎将数据渲染到页面 start*/
     /*
      * @param data 数据
      * @param templateID 模板ID
      * @param wrapID 装模板的盒子ID
      * */
     woLianw.renderDataHtml = function (data, templateID, wrapID) {
       var template = document.getElementById(templateID).innerHTML;
       var wrap = document.getElementById(wrapID);
       laytpl(template).render(data, function (html){
           wrap.innerHTML = html;
       });
     }
     /*通过laytpl模板引擎将数据渲染到页面 end*/





































    /**
     * 工厂查询商品统计
     * @param callback
     */
    woLianw.productVerifyCount = function (callback) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'get',
            async: true,
            url: _this.url+'/sell/product/count',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                }else if(response.code == 1) {
                    callback(response.data);
                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }


    /*******************************************商品分组开始********************************************/

    /**
     * 获取商品分组列表
     * @param parameter(page,limit,systemType)
     * @param callback 处理数据的回调函数
     */
    woLianw.getProductGroupList = function(parameter, callback) {
        var _this = this
        if(parameter.page <= 0 || (typeof parameter.page != 'number')) {
            parameter.page = 1
        }
        if(parameter.limit <= 0 || (typeof parameter.limit != 'number') || parameter.limit > 1000) {
            parameter.limit = 15
        }
        $.ajaxSetup({
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        });
        $.ajax({
            type: 'get',
            data: parameter,
            url: _this.url + '/sell/product/group/list',
            success: function(response) {
                if(response.code == 0) {
                    /*失败，显示msg给用户看*/

                } else if(response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/
                    callback(response.data)

                } else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }


    /*增加商品分组*/
    woLianw.addSellProductGroup = function(parameter, callback) {
        var _this = this
        $.ajaxSetup({
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        });
        $.ajax({
            type: 'post',
            data: parameter,
            url: _this.url + '/sell/product/group/add',
            success: function(response) {
                if(response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response)

                } else if(response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    console.log(response)
                    callback(response.msg)

                } else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }

        })
    }

    //删除商品分组
    woLianw.deleteProductGroup = function(id, callback) {
        var _this = this
        $.ajaxSetup({
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        });
        $.ajax({
            type: 'post',
            data: {
                id: id
            },
            url: _this.url + '/sell/product/group/delete',
            success: function(response) {
                if(response.code == 0) {
                    /*失败，显示msg给用户看*/

                } else if(response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/
                    callback()

                } else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }

        })
    }


    /**
     * 修改商品分组
     * @param parameter
     * @param callback
     */
    woLianw.productGroupUpdate = function(parameter, callback) {
        var _this = this
        $.ajaxSetup({
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        });
        $.ajax({
            type: 'post',
            data: parameter,
            url: _this.url + '/sell/product/group/edit',
            success: function(response) {
                if(response.code == 0) {
                    /*失败，显示msg给用户看*/

                } else if(response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/
                    callback()

                } else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /*******************************************商品分组结束********************************************/
    /**
     * 客服配置
     *
     *
     */
    woLianw.getService = function (callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            url: _this.url + '/user/getServiceAccount',
            async: false,
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                } else if (response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/
                    callback(response.data)

                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }

        })
    }


    /**
     * 读取未读消息
     *
     *
     */
    woLianw.getUnReadMsgNum = function (callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            url: _this.url + '/chat/supply-getIMOffLineMsg',
            async: false,
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                } else if (response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/
                    callback(response.msg)

                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }

        })
    }

    /**
     * 将数值四舍五入(保留2位小数)后格式化成金额形式
     *
     * @param num 数值(Number或者String)
     * @return 金额格式的字符串,如'1,234,567.45'
     * @type String
     */
    woLianw.formatCurrency = function (num) {
        var num = num.toString().replace(/\$|\,/g, '');
        if (isNaN(num)) {
            num = "0";
        }
        if (num == null || num == "") {
            return "0.00";
        }
        var sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * 100 + 0.50000000001);
        var cents = num % 100;
        num = Math.floor(num / 100).toString();
        if (cents < 10) {
            cents = "0" + cents;
        }
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
            num = num.substring(0, num.length - (4 * i + 3)) + ',' +
                num.substring(num.length - (4 * i + 3));
        }
        return (((sign) ? '' : '-') + num + '.' + cents);
    }


     /**
     * 获取买家的购物车商品总数
     * @param callback
     */
    woLianw.buyCartSum = function (callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            url: _this.url + '/buy/cart/sum',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                } else if (response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/
                    callback(response)

                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }

        })
    }

     /**
     * 获取 商品详情数据
     * @param parameter 传递的参数
     * @param callback  回调函数
     */
    woLianw.getProductDetail = function (parameter, callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            data: parameter,
            url: _this.url + '/sell/product/detail',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                    layer.msg(response.msg)
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response.data)
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

   


     /*获取商品三级分类 有无叶子节点     start
     * @param parameter 传递的参数
     * @param callback  回调函数(数据渲染模板)
     */
    woLianw.getProductInfoList2 = function (callback, parameter) {
        var _this = this;
        var parameter = parameter || {};
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            data: parameter,
            url:  _this.url + '/sell/category/property-value',
            success:function (response) {
             
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                  console.log(response.msg);
                  if(callback){
                    callback(0);
                  }
                }else if(response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(1);
                  
                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            },
            error: function(response){
              console.log(response.statusText);
          }
        })
    }
     
     /*获取商品三级分类 有无叶子节点        end*/

    /**
     * 获取商品详情的运费模板
     * @param callback
     */
    woLianw.getStoreShipping = function (callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            /*url: '//192.168.3.37/pay/open',*/
            url: _this.url + '/moving/getStoreShipping',
            /*url: _this.url + '/opt/cbList',*/
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                    layer.msg(response.msg)
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response.data)
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }


     /**
     * 商品详情 获取 工厂详情
     * @param parameter
     * @param callback
     */
    woLianw.getFactoryDetail = function (callback) {
        var _this = this;
       // _this.url = "//192.168.3.59:7015";
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            url: _this.url + '/user/getFactoryDesc',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                    layer.msg(response.msg);
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                     callback(response.msg);
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            },
            error: function (response) {
                console.log(response.statusText);
            }
        })
    }

    /**
     * 商品详情 获取 店铺热销
     * @param parameter
     * @param callback
     */
    woLianw.getHotSell = function (parameter, callback) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: parameter,
            url: _this.url + '/buy/product/list',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                    layer.msg(response.msg);
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                     callback(response.data);
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            },
            error: function (response) {
                console.log(response.statusText);
            }
        })
    }

    /**
     * 商品详情 获取的快递公司
     * @param callback
     */
    woLianw.getExpressList = function (callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            url: _this.url + '/common/expressList',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                    layer.msg(response.msg);
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                     callback(response.data);
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }


     

     //获取图片链接拼接
     woLianw.getImgUrl = function(endUrl){
        if(endUrl && endUrl.length>6){
            if(endUrl.substr(0,7) == "http://"){
                return endUrl;
            }
            else if(endUrl.substr(0,1) == "/"){
                return  imagesPrefix+endUrl
            }else{
                return  imagesPrefix+"/"+endUrl
            }
        } else {
            return '';
        }
    }

    /**
     * 工厂联系代理
     * @param callback
     */
    woLianw.ajaxChatSupplyChatWithCust = function (params, callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            data: params,
            url: _this.url + '/chat/supplyChatWithCust',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                    layer.msg(response.msg);
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response.msg);
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 发短信
     */
    woLianw.ajaxSmsSend = function (params, success, error) {
        var _this = this;
        console.log(params);
        params.mobile = params.phone;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'POST',
            data: params,
            url: _this.url+'/sms/send',
           /* url: 'http://192.168.3.137:7015/sms/send',*/
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    error && error(response.msg);
                } else if (response.code == 1) {
                    success && success(response.msg);
                }
            },
            error:function (res) {
                debugger
                console.log(res)
            },
            beforeSend:function () {
                debugger
                console.log(params)
            }
        })
    }

    /**
     * 验证身份
     */
    woLianw.ajaxSmsCheck = function (params, success, error) {
        var _this = this;
        params.mobile = params.phone;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'POST',
            data: params,
            url: _this.url+'/sms/check',
            /*url: 'http://192.168.3.137:7015/sms/check',*/
            // url: 'http://192.168.3.137:7015/sms/check',
            // url: 'http://192.168.3.137:7015/sms/check',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    error && error(response.msg);
                } else if (response.code == 1) {
                    success && success(response.data);
                }
            }
        })
    }

    /**
     * 修改密码
     */
    woLianw.ajaxUserEmployeeEditPwd = function (params, success, error) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'POST',
            data: params,
            url: _this.url+'/user/employee/editPwd',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    error && error(response.msg);
                }else if(response.code == 1) {
                    success && success(response.data);
                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 忘记密码
     */
    woLianw.ajaxUserSelfForgetPwd = function (params, success, error) {
        console.log(params);
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'POST',
            data: params,
            url: _this.url+'/user/self/forgetPwd',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    error && error(response.msg);
                }else if(response.code == 1) {
                    success && success(response.data);
                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 修改密码
     */
    woLianw.ajaxUserSelfEditPwd = function (params, success, error) {
        console.log(params);
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'POST',
            data: params,
            url: _this.url+'/user/self/editPwd',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    error && error(response.msg);
                }else if(response.code == 1) {
                    success && success(response.data);
                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }


    /**
     * 工厂修改商品基础信息
     * @param parameter
     * @param callback
     */
    woLianw.productUpdate = function (parameter,callback) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'POST',
            data: parameter,
            url: _this.url+'/sell/product/update',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    layer.msg(response.msg)
                }else if(response.code == 1) {
                    callback(response.msg)
                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /*更新商品关联的运费模板id*/
    woLianw.fareAppointFare = function (parameter,callback) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'POST',
            data: parameter,
           /* url: 'http://192.168.3.137:7015/fare/appointFare',*/
            url: _this.url+'/fare/appointFare',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    layer.msg(response.msg)
                }else if(response.code == 1) {
                    callback(response.msg)
                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /*余额查询*/
    woLianw.payBalanceQuery = function (callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            url: _this.url + '/pay/balanceQuery',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                    layer.msg(response.msg)
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response.data)
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 查询余额
     */
    woLianw.ajaxPayOldBalance = function (params, success, error) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'GET',
            url: _this.url+'/pay/oldBalance',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    error && error(response.msg);
                }else if(response.code == 1) {
                    success && success(response.data);
                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 提现
     */
    woLianw.ajaxPayWithCash = function (params, success, error) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'POST',
            data: params,
            url: _this.url+'/pay/withCash',
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    error && error(response.msg);
                }else if(response.code == 1) {
                    success && success(response.data);
                }else if(response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }
    
    // 千分位
    function singleThousandBit(numString, maxbit) {
      var numArray = numString.split('.');

      var decNum = null;
      var intNum = numArray[0];
      var result = '';

      if (maxbit) {
        decNum = (numArray.length > 1) ? numArray[1].substring(0, maxbit) : null;
      } else {
        decNum = (numArray.length > 1) ? numArray[1] : null;
      }

      while (intNum.length > 3) {
        result = ',' + intNum.slice(-3) + result;
        intNum = intNum.slice(0, intNum.length - 3);
      }

      if (intNum) {
        result = intNum + result;
      }

      if (decNum !== null) {
        result = result + '.' + decNum;
      }

      result = (decNum === '') ? result + '.' : result;

      return result;
    }

    woLianw.thousandBit = function(num, maxbit, split) {
      if (num === '' || num === null || num === undefined) { return null; }

      var numString = num + '';

      var result = '';

      if (split) {
        var splitArr = numString.split(split);
        splitArr.map(function(item, index) {
          result += (index > 0) ? split + singleThousandBit(numString, maxbit) : singleThousandBit(numString, maxbit);
          return item;
        });
      } else {
        result = singleThousandBit(numString, maxbit);
      }

      return result;
    }

    exports('woLianw',  woLianw);
});
