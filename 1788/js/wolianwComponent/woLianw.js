layui.define(['layer', 'laypage', 'laytpl', 'element'], function (exports) {

    "use strict";

    var $ = layui.jquery;
    var laypage = layui.laypage;
    var layer = layui.layer;
    var laytpl = layui.laytpl;
    var element = layui.element;

    var woLianw = {
        wolianwVen1588: '//ven.1588'+wolianwDomain,
        wolianwDis1588: '//dis.1588'+wolianwDomain,
        wolianw1588: '//1588'+wolianwDomain,
        wolianw1788: '//1788'+wolianwDomain,
        wolianw1988: '//1988'+wolianwDomain,
        wolianw1999: '//1999'+wolianwDomain,
        url: "//"+location.host+"/api",
        src: imagesPrefix+'/',
        appDownLink: setAppDownLink,
    };

    // woLianw.url = woLianw.wolianw1788+"api";
    woLianw.switch = "//"+location.host+'/ven/index.html';

    /**
     * 获取验证码图片
     * @param obj:图片对象
     */
    woLianw.getValidateCode = function (obj) {
        var _this = this;
        obj.src = _this.url + "/code?width=120&height=36?" + new Date().getMilliseconds();  //后面添加时间毫秒数 去缓存
    };

    /*用户接口开始*/
    function getRootPath() {
        var strFullPath = window.document.location.href;
        var strPath = window.document.location.pathname;
        var pos = strFullPath.indexOf(strPath);
        var prePath = strFullPath.substring(0, pos);
        var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
        return (prePath + postPath);
    }

    /**
     * 跳转到登录页
     */
    woLianw.goLoginPage = function () {
        if (location.href.indexOf('dis.') === -1) {
            window.location.href= "/login.html";
        } else {
            window.location.href= woLianw.wolianw1588+"login.html";
        }
    };


    /*超时 退出登录*/
    woLianw.overtimeLoginOut = function () {
        var maxTime = 30 * 60; // seconds [以秒为单位倒计时1800秒是30分钟]
        var time = maxTime;
        $('body').on('keydown mousemove mousedown', function (e) {
            time = maxTime; // reset
        });
        var intervalId = setInterval(function () {
            time--;
            if (time <= 0) {
                woLianw.loginout();
                clearInterval(intervalId);
            }
        }, 1000);
    };


    /**
     * 登录系统
     * @param url  /login
     * @param formdata  登录信息(登录名、密码、验证码、系统类型)
     */
    woLianw.login = function (formdata, callback) {
        var _this = this;
        // _this.url = 'http://192.168.3.37';
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: "post",
            data: formdata,
            url: _this.url + '/login',
            success: function (response) {
                var d = JSON.stringify(response.data);
                if (response.code == 0) {
                    /*登录失败，显示msg给用户看*/
                    console.log(response.msg);
                    callback(response.msg)
                } else if (response.code == 1) {
                    /*登录成功, 操作 data 项或显示 msg 给用户看*/
                    if (formdata.systemId == 1) {
                        window.localStorage.setItem("1788login", d);
                        window.localStorage.setItem("1788flag", 'true');
                        window.location.href = './home.html'
                    }
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            },
            error: function (response) {
                console.log(response.statusText);
            }
        })
    };

    /*切换登录*/
    woLianw.switchLogin = function () {
      var _this = this;
      $.ajax({
        type:"post",
        data: {
          systemId: 2
        },
        url:_this.url+"/user/token",
        success:function (response) {
          if (response.code == 0) {
              /*失败，显示msg给用户看*/
          }else if(response.code == 1) {
              /*成功，操作data项或显示msg给用户看*/
              var d = JSON.stringify(response.data);
              if(window.location.href.indexOf('dis') == -1){
                  window.location.href = woLianw.wolianw1988+'ven.html?from=1788&sign='+response.data;
              }else{
                  window.location.href = woLianw.wolianwVen1588+'ven.html?from=1588&sign='+response.data;
              }
          }else if(response.code == 10) {
              /*未登录，将用户导至登录页*/
              _this.goLoginPage();
          }
        }
      })
    }

    /**
     *登出系统
     */
    woLianw.loginout = function () {
        var _this = this;
        $.ajax({
            type: "post",
            url: _this.url + "/loginout",
            data: {},
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    /*成功, 操作 data 项或显示 msg 给用户看*/
                    localStorage.removeItem('1788login');
                    if(window.location.href.indexOf('dis') == -1){
                        // 本系统
                        window.location.href = '/login.html';
                    }else{
                        // 作为1588的内容
                        window.location.href = woLianw.wolianw1588+'login.html';
                    }
                } else if (response.code == 10) {
                    //退出登录成功操作以后(就是未登录状态)  code=10, 是进入这里的  删除本地的loaclStorage
                    localStorage.removeItem('1788login');
                    /*将用户导至登录页*/
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
            type: "post",
            data: userId,
            url: _this.url + "/user/getById",
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                } else if (response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/

                } else if (response.code == 10) {
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
            type: "post",
            data: name,
            url: _this.url + '/user/getByName',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                } else if (response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/

                } else if (response.code == 10) {
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
        if (parameter.page && (parameter.page == "" || parameter.page <= 0 || typeof parameter.page != 'number')) {
            parameter.page = 1
        }
        if (parameter.limit && (parameter.limit == "" || parameter.limit <= 0 || parameter.limit > 1000 || typeof parameter.limit != 'number')) {
            parameter.limit = 15
        }
        $.ajax({
            type: 'post',
            data: parameter,
            url: _this.url + '/user/list',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                } else if (response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/

                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 获取个人信息
     */
    woLianw.personalInfo = function (callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
            url: _this.url + '/user/personalInfo',
            success: function (response) {
                console.log(response)
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
     * 修改个人信息
     * @param parameter
     * @param callback
     */
    woLianw.updatePersonalInfo = function (parameter, callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
            data: parameter,
            url: _this.url + '/user/updatePersonalInfo',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                } else if (response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/
                    callback()

                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }
    /**
     * 验证用户名是否已经存在
     * @param name 用户名
     * @param callback
     */
    woLianw.checkName = function (name, callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: {
                name: name
            },
            url: _this.url + '/user/checkName',
            success: function (response) {
                console.log(response)
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    callback(response.msg)

                } else if (response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/
                    /*callback()*/

                } else if (response.code == 10) {
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
    woLianw.getAddressList = function (parameter, callback) {
        var _this = this
        if (parameter.page <= 0 || (typeof  parameter.page != 'number')) {
            parameter.page = 1
        }
        if (parameter.limit <= 0 || (typeof  parameter.limit != 'number') || parameter.limit > 1000) {
            parameter.limit = 15
        }

        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            data: parameter,
            cache:false,
            url: _this.url + '/address/list',
            success: function (response) {
                console.log(response)
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response)
                    _this.goLoginPage();
                } else if (response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/
                    callback(response.data.list)

                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            },
            error: function (response) {
                console.log(response)
                _this.goLoginPage();
            }
        })
    }


    /**
     * 删除某个地址
     * @param addressId  （required）
     * @param callback      删除某个地址后的回调
     */
    woLianw.deleteAddress = function (addressId, callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: {
                addressId: addressId
            },
            url: _this.url + '/address/delete',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                } else if (response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/
                    callback()

                } else if (response.code == 10) {
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
    woLianw.updateAddressDefault = function (addressId, callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: {
                addressId: addressId
            },
            url: _this.url + '/address/setDefault',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    alert('设置默认地址失败，请重新操作！')
                } else if (response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/
                    callback()

                } else if (response.code == 10) {
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
    woLianw.getAddressDetail = function (id, callback) {
        var _this = this
        var id = id || ''
        console.log(id)
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
            data: {
                addressId: id
            },
            url: _this.url + '/address/detail',
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
     * 修改用户地址
     * @param parameter
     * @param callback
     */
    woLianw.addressUpdate = function (parameter, callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: parameter,
            url: _this.url + '/address/edit',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                } else if (response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/
                    callback()

                } else if (response.code == 10) {
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
    woLianw.addAddress = function (parameter, callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: parameter,
            url: _this.url + '/address/add',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                } else if (response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/
                    callback()

                } else if (response.code == 10) {
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
            url: _this.url + '/order/everyMonthOrderNumForBuyer',
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
     * 1788首页订单数统计
     * @param callback
     */
    woLianw.orderNumForBuyer = function (callback) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'GET',
            /* url: 'http://192.168.3.154:8082/order/orderNumForBuyer',*/
            url: _this.url + '/order/orderNumForBuyer',
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
     * 1788首页采购数据记录
     * @param callback
     */
    woLianw.purchaseNumForBuyer = function (callback) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'GET',
            /*url:  'http://192.168.3.154:8082/order/purchaseNumForBuyer',*/
            url: _this.url + '/order/purchaseNumForBuyer',
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
     * 1788首页采购分类汇总
     * @param callback
     */
    woLianw.purchaseTypeForBuyer = function (callback) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'GET',
            /*url: 'http://192.168.3.154:8082/order/purchaseTypeForBuyer',*/
            url: _this.url + '/order/purchaseTypeForBuyer',
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
     * 拆单之后的订单查询
     * @param parameter
     * @param callback
     */
    woLianw.orderDisPaging = function (parameter, callback) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'GET',
            data: parameter,
            url: _this.url + '/order/buyerOrder/list',
            /*url:'http://192.168.3.154:8002/baseOrder/buyerOrderList',*/
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
     * 未拆单之前的订单查询
     * @param parameter
     * @param callback
     */
    woLianw.orderDisPaging2 = function (parameter, callback) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
            data: parameter,
            url: _this.url + '/order/buyerWaitToPayOrder',
            /*url:'http://192.168.3.154:8002/baseOrder/waitToPayOrder',*/
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

    /*取消订单*/
    woLianw.cancleOrder = function (parameter, callback) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: parameter,
            url: _this.url + '/order/buyerCancelOrder',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);

                } else if (response.code == 1) {
                    /*操作（增加）成功，返回成功信息*/
                    console.log(response);
                    callback(response.msg)

                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 1788订单删除
     * @param orderItemId
     * @param callback
     */
    woLianw.buyerOrderDelete = function (orderItemId, callback) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: {
                orderItemId: orderItemId
            },
            url: _this.url + '/order/buyerOrderDelete',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);

                } else if (response.code == 1) {
                    /*操作（增加）成功，返回成功信息*/
                    console.log(response);
                    callback(response.msg)

                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 确认收货
     * @param parameter
     * @param callback
     */
    woLianw.ensureReceiveGoods = function (parameter, callback) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: parameter,
            url: _this.url + '/order/buyerReceiveGoods',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                    layer.msg(response.msg)
                } else if (response.code == 1) {
                    /*操作（增加）成功，返回成功信息*/
                    console.log(response);
                    callback(response.msg)

                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /*获取买家订单的订单详情*/
    woLianw.orderQueryOrderItem = function (orderId, callback) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
            data: {
                orderItemId: orderId
            },
            /* url: 'http://192.168.3.154:8082/order/buyerOrderItemById',*/
            url: _this.url + '/order/buyerOrderItemById',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    layer.msg(response.msg)
                } else if (response.code == 1) {
                    /*操作（增加）成功， 返回成功信息*/
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
     * 订单详情(退货时获取订单的信息)
     * @param orderItemId
     * @param callback
     */
    woLianw.orderItemAndSales = function (orderItemId, callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
            data: {
                orderItemId: orderItemId
            },
            url: _this.url + '/order/orderItemAndSales',
            /*url: 'http://10.10.11.22:8082/order/orderItemAndSales?orderItemId=1',*/
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看 */
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
     * 1788评价订单
     * @param parameter
     * @param callback
     */
    woLianw.buyerOrderAppraise = function (parameter,callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: parameter,
            url: _this.url + '/order/buyerOrderAppraise',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看 */
                    console.log(response.msg);
                    layer.msg(response.msg)
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    console.log(response);
                    callback(response.msg)
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }




    /*订单接口end*/


    /*菜单(模块接口) start*/

    woLianw.getModuleList = function (parameter, callback) {
        var _this = this
        var parameter = parameter || {
            enabled: "",
            name: "",
            page: "",
            limit: ""
        }
        $.ajax({
            type: 'get',
            data: parameter,
            cache:false,
            url: _this.url + '/module/list',
            success: function (response) {
                console.log(response)
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response.data.list);


                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /*读取缓存的菜单数据，渲染左侧菜单树*/
    woLianw.renderModule = function () {
        var _this = this
        if (localStorage.getItem("1788login")) {
            var datas = JSON.parse(window.localStorage.getItem('1788login'));
            var moduleList = datas.moduleList;
            var kk = laytpl([
                '<ul class="layui-nav layui-nav-tree layui-nav-side">',
                '{{# layui.each(d,function(index,item){ }}',
                '{{# if(item.level==1){ }}',
                '<li class="layui-nav-item">',
                '{{# if(!item.url){ }}',
                '<a href="javasript:;">',
                '<i class="icon fa fa-{{ item.icon }} {{ item.icon }}">  </i>',
                '<span> {{ item.name }} </span>',
                '</a>',
                '{{# } }}',
                '{{# if(item.url && item.level==1){ }}',
                '<a href="/{{ item.url }}/index.html" target="_blank">',
                '<i class="fa fa-{{ item.icon }} icon {{ item.icon }}">  </i>',
                '<span> {{ item.name }} </span>',
                '</a>',
                '{{# } }}',
                '{{# if(!item.url && item.level==1){ }}',
                '<dl class="layui-nav-child">',

                '<dt>{{ item.name }}</dt>',
                '{{# layui.each(d,function(index2,item2){ }}',
                '{{# if(item.id==item2.parentId && item2.level==2){ }}',
                '<dd><a href="/{{ item2.url }}/index.html"> {{ item2.name }} </a> </dd>',
                '{{# } }}',
                '{{# }) }}',
                '</dl>',
                '{{# } }}',
                '</li>',
                '{{# } }}',
                '{{# }) }}',
                '</ul>'
            ].join(''))
            kk.render(moduleList, function (html) {
                document.getElementById('leftNavList').innerHTML = html
            })
        } else {
            woLianw.getModuleList({}, function (moduleList) {
                var kk = laytpl([
                    '<ul class="layui-nav layui-nav-tree layui-nav-side">',
                    '{{# layui.each(d,function(index,item){ }}',
                    '{{# if(item.level==1){ }}',
                    '<li class="layui-nav-item">',
                    '{{# if(!item.url){ }}',
                    '<a href="javasript:;">',
                    '<i class="fa fa-{{ item.icon }}">  </i>',
                    '<span> {{ item.name }} </span>',
                    '</a>',
                    '{{# } }}',
                    '{{# if(item.url && item.level==1){ }}',
                    '<a href="/{{ item.url }}/index.html" target="_blank">',
                    '<i class="fa fa-{{ item.icon }}">  </i>',
                    '<span> {{ item.name }} </span>',
                    '</a>',
                    '{{# } }}',
                    '{{# if(!item.url && item.level==1){ }}',
                    '<dl class="layui-nav-child">',

                    '<dt>{{ item.name }}</dt>',
                    '{{# layui.each(d,function(index2,item2){ }}',
                    '{{# if(item.id==item2.parentId && item2.level==2){ }}',
                    '<dd><a href="/{{ item2.url }}/index.html"> {{ item2.name }} </a> </dd>',
                    '{{# } }}',
                    '{{# }) }}',
                    '</dl>',
                    '{{# } }}',
                    '</li>',
                    '{{# } }}',
                    '{{# }) }}',
                    '</ul>'
                ].join(''))
                kk.render(moduleList, function (html) {
                    document.getElementById('leftNavList').innerHTML = html
                })
            })
        }
    }

    /*菜单(模块接口) end*/


    /*列出角色（岗位)  start*/
    woLianw.getRoleList = function (parameter, callback) {
        var _this = this;
        // _this.url = 'http://192.168.3.37/';
        parameter.page ? parameter.page : parameter.page = 1;
        parameter.limit ? parameter.limit : parameter.limit = 10;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            data: parameter,
            cache:false,
            url: _this.url + '/role/list',
            success: function (response) {
                console.log(response);
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response.data.list);
                    if (response.data.list.length > 0) {
                        $("#laypageBox").show();
                        laypage.render({
                            elem: "laypageBox",    //存放分页的div盒子 ID
                            count: response.data.total, //数据总数
                            curr: parameter.page || 1,
                            limit: parameter.limit || 10,   //限制每页显示多少数据
                            limits: [10, 20, 30],  // 定义下拉框里面 可供选择的 每页显示多少条数据
                            theme: '#009688',   //自定义分页样式
                            first: '首页',
                            last: '尾页',
                            layout: ['count', 'skip', "first", 'prev', 'page', 'next', "last", 'limit'],  //分页排版
                            jump: function (obj, first) {                           //obj是一个object类型。包括了分页的所有配置信息。
                                if (!first) {  //first一个Boolean类，检测页面是否初始加载。非常有用，可避免无限刷新。
                                    parameter.page = obj.curr;
                                    parameter.limit = obj.limit;
                                    _this.getRoleList(parameter, callback);

                                }
                            }
                        });
                    } else {
                        $("#laypageBox").hide();
                    }


                } else if (response.code == 10) {
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
            type: 'post',
            data: parameter,
            url: _this.url + '/role/add',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    /*操作（增加）成功，返回成功信息*/
                    console.log(response.msg);
                    callback && callback();
                } else if (response.code == 10) {
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
            type: 'post',
            data: parameter,
            url: _this.url + '/role/edit',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    /*操作（增加）成功，返回成功信息*/
                    console.log(response.msg);
                    callback && callback();
                } else if (response.code == 10) {
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
            type: 'get',
            cache:false,
            data: {
                roleId: id
            },
            url: _this.url + '/role/detail/',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    /*操作（增加）成功，返回成功信息*/
                    callback(response.data);
                } else if (response.code == 10) {
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
            type: 'get',
            cache:false,
            data: params,
            // url: './json/setPermission.json',
            url: _this.url + '/role/toSetPermission',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
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
                } else if (response.code == 10) {
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
            type: 'post',
            data: params,
            url: _this.url + '/role/setPermission',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    /*操作（增加）成功，返回成功信息*/
                    callback(response.data);
                } else if (response.code == 10) {
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
            type: 'get',
            cache:false,
            data: parameter,
            url: _this.url + '/user/employee/list',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response.data.list);
                    if (response.data.list.length > 0) {
                        $("#laypageBox").show();
                        laypage.render({
                            elem: "laypageBox",    //存放分页的div盒子 ID
                            count: response.data.total, //数据总数
                            curr: parameter.page || 1,
                            limit: parameter.limit || 10,   //限制每页显示多少数据
                            limits: [10, 20, 30],  //定义下拉框里面 可供选择的 每页显示多少条数据
                            theme: '#009688',   //自定义分页样式
                            first: '首页',
                            last: '尾页',
                            layout: ['count', 'skip', "first", 'prev', 'page', 'next', "last", 'limit'],  //分页排版
                            jump: function (obj, first) {                           //obj是一个object类型。包括了分页的所有配置信息。
                                if (!first) {  //first一个Boolean类，检测页面是否初始加载。非常有用，可避免无限刷新。
                                    parameter.page = obj.curr;
                                    parameter.limit = obj.limit;
                                    _this.getStaffList(parameter, callback);
                                    _this.setHeight();

                                }
                            }
                        });
                    } else {
                        $("#laypageBox").hide();
                    }

                } else if (response.code == 10) {
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
            type: 'post',
            data: parameter,
            url: _this.url + '/user/add',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    /*操作（增加）成功，返回成功信息*/
                    console.log(response.msg);

                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }
    /*增加员工 end*/

    /*删除员工  start*/
    woLianw.deleteRole = function (parameter, callback) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: parameter,
            url: _this.url + '/role/delete',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    /*操作（增加）成功，返回成功信息*/
                    console.log(response.msg);
                    callback && callback();
                } else if (response.code == 10) {
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
            type: 'get',
            cache:false,
            async: true,
            data: params,
            url: _this.url + '/user/toEdit',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    callback(response.data);
                } else if (response.code == 10) {
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
            type: 'get',
            async: true,
            cache:false,
            data: params,
            url: _this.url + '/role/distributeRole',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    callback(response.data);
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 添加用户
     */
    woLianw.ajaxUserAdd = function (params, callback, errcallback) {
        var _this = this;
        // _this.url = 'http://192.168.3.37/';
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            async: true,
            data: params,
            url: _this.url + '/user/add',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                    errcallback && errcallback(response.msg);
                } else if (response.code == 1) {
                    callback(response.data);
                } else if (response.code == 10) {
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
            type: 'post',
            async: true,
            data: params,
            url: _this.url + '/user/employee/edit',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    callback(response.data);
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 修改员工密码
     */
    woLianw.ajaxUserEmployeeEditPwd = function (params, callback) {
        var _this = this;
        // _this.url = 'http://192.168.3.37/';
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            async: true,
            data: params,
            url: _this.url + '/user/employee/editPwd',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    layer.msg(response.msg)
                } else if (response.code == 1) {
                    callback(response.data);
                } else if (response.code == 10) {
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
            type: 'post',
            async: true,
            data: params,
            url: _this.url + '/user/delete',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    callback(response.data);
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }


    /*退货相关接口 start*/


    /**
     * 获取退货列表
     * @param parameter
     * @param callback
     */
    woLianw.getSrvOrderList = function (parameter, callback) {
        var _this = this
        var parameter = parameter || {}
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
            data: parameter,
            url: _this.url + '/srvOrder/list',
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

    /**
     * 售后详情
     * @param id 退货单id
     * @param callback
     */
    woLianw.getSrvOrderInfo = function (id, callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
            data: {
                srvOrderId: id
            },
            url: _this.url + '/srvOrder/detail/',
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

    /*查看买家和卖家关于退货的协商历史*/
    woLianw.getSrvOrderLog = function (id, callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
            data: {
                id: id
            },
            url: _this.url + '/srvOrder/log',
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

    /*申请退货退款*/
    woLianw.applyForReturns = function (parameter, callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: parameter,
            url: _this.url + '/srvOrder/applyForReturns',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    console.log(response);
                    callback(response.msg)
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
            cache:false,
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


    /*退货相关接口 end*/


    /**
     * 将日期转换成以下格式,如: 2017-09-30 15:08
     * @param date 日期，格式不限
     * @returns {string}  返回以下格式的日期字符串，如:2017-09-30 15:08
     */
    woLianw.transDateType = function (date) {
        var date = new Date(date)
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        var minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
    }

    /*买家商品列表*/
    woLianw.buyProductList = function (parameter, callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: parameter,
            /*url: 'http://192.168.3.76:7015/buy/product/list',*/
            url: _this.url + '/buy/product/list',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response.data)

                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    /*_this.goLoginPage();*/
                }
            }
        })
    }

    /**
     * 一键搬家商品列表
     * @param parameter
     * @param callback
     */
    woLianw.buyProductMove2app = function (parameter, callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: parameter,
           /* url: 'http://192.168.3.76:7015/buy/product/move2app/list',*/
            url: _this.url + '/buy/product/move2app/list',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response.data)

                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    /*_this.goLoginPage();*/
                }
            }
        })
    }

    /**
     * 一键搬家的操作
     * @param parameter
     * @param callback
     */
    woLianw.movingDomoving = function (parameter, callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: parameter,
            /* url:'http://192.168.3.137:8002/moving/domoving',*/
            url: _this.url + '/moving/domoving',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    layer.msg(response.msg)
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response)

                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    /*_this.goLoginPage();*/
                }
            }
        })
    }

    /**
     * 获取全部商品列表
     */
    woLianw.getAllGoodsLists = function () {
        var _this = this;
        var productsHtml = '';

        $.ajax({
            type: "get",
            cache:false,
            url: _this.url + "/sell/product/list",  //  /order/disPaging
            async: false,
            success: function (data) {
                var productsLength = data.length;
                var image, productName, productAddress, price, packageMail, moveHome, focus, listTitle;
                for (var i = 0; i < productsLength; i++) {
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
            error: function (data) {
                console.log("链接服务器失败！");
            }
        });

        return productsHtml;

    }


    woLianw.setHeight = function () {
        var windowHeight = $(window).height();
        $(".main.container").css("min-height", windowHeight - 120 + "px");
        $(".main-content").css("min-height", windowHeight - 360 + "px");

    }


    /**
     * 省返回所有市, 市返回所有县, 县返回所有镇. 默认(不传或传入非正数)返回所有省
     * @param id
     * @param callback
     */
    woLianw.getLinkage = function (id, callback) {
        var _this = this
        var id = id || -1
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
            data: {
                did: id
            },
            url: _this.url + '/common/linkage',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

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


    /*获取url指定的参数值*/
    woLianw.GetQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var link = decodeURI(window.location.search)
        var r = link.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }


    /*获取枚举信息（交易状态）*/
    woLianw.getEnum = function (parameter, callback) {
        var _this = this
        $.ajax({
            type: 'get',
            cache:false,
            data: {
                type: parameter
            },
            url: _this.url + '/enum',
            success: function (response) {
                if (response.code == 1) {
                    callback(response.data)
                }
            }
        })
    }


    /*用户业务接口模块 start*/

    /**
     * 获取关注的工厂列表
     * @param parameter
     * @param callback
     */
    woLianw.followVendor = function (parameter, callback) {
        var _this = this
        var parameter = parameter || {}
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
            data: parameter,
            /*url:'//192.168.3.137:8002/follow/vendor/list',*/
            url: _this.url + '/follow/vendor/list',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
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

    /*取消关注的工厂或者商品*/
    woLianw.followCancel = function (parameter, callback) {
        var _this = this
        var parameter = parameter || {}
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: parameter,
            url: _this.url + '/follow/cancel',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback()
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }

        })
    }


    /**
     * 获取关注的商品列表
     * @param parameter
     * @param callback
     */
    woLianw.followProduct = function (parameter, callback) {
        var _this = this
        var parameter = parameter || {}
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
            data: parameter,
            url: _this.url + '/follow/product/list',
            /*url:'//192.168.3.137:8002/follow/product/list',*/
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
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
     * 对某个商品或者工厂添加关注
     * @param parameter ： itemIds 商品 Id, 多个用逗号隔开，disFollowType:关注类型. 1:工厂, 2:商品
     * @param callback
     */
    woLianw.followAdd = function (parameter, callback) {
        var _this = this
        /*_this.url='//192.168.3.137:8002'*/
        var parameter = parameter || {}
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: parameter,
            url: _this.url + '/follow/add',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response.msg)
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }
    /**
     * 取消对某个工厂或者商品的关注
     * @param parameter
     * @param callback
     */
    woLianw.followCancel = function (parameter, callback) {
        var _this = this
        /*   _this.url='//192.168.3.137:8002'*/
        var parameter = parameter || {}
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: parameter,
            url: _this.url + '/follow/cancel',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response.msg)
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }


    /*用户业务接口模块 end*/

    /*输入页面url，返回url相应的权限列表*/
    woLianw.screenPermissionVoList = function (moduleList, pageUrl) {
        var length = moduleList.length
        console.log(length)
        console.log(pageUrl)
        for (var i = 0; i < length; i++) {
            if (moduleList[i].url == pageUrl) {
                console.log(moduleList[i].url)
                return moduleList[i].permissionVoList
            }
        }
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
     * 购物车（进货单）
     * @param callback
     */
    woLianw.buyCartList = function (callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
            url: _this.url + '/buy/cart/list',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response)
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }

        })
    }

    /*买家添加商品到购物车*/
    woLianw.buyCartAdd = function (parameter, callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: parameter,
            url: _this.url + '/buy/cart/add',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                    layer.msg(response.msg)
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response)
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /*删除购物车（进货单中的某个商品）*/
    woLianw.buyCartDelete = function (skuIds, callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        console.log(skuIds)
        $.ajax({
            type: 'post',
            data: {
                skuIds: skuIds
            },
            url: _this.url + '/buy/cart/delete',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response.msg)
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /*买家清除购物车中的下架商品*/
    woLianw.buyCartClearOffline = function (skuIds, callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
            data: {
                skuIds: skuIds
            },
            url: _this.url + '/buy/cart/clear-offline',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response.msg)
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /*买家修改商品购买数量到购物车*/
    woLianw.buyCartUpdate = function (parameter, callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: parameter,
            url: _this.url + '/buy/cart/update',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response)
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 买家勾选购物车(进货单)中的多个商品后点击结算
     * @param skuIds
     * @param callback
     */
    woLianw.buyOrderCartbuy = function (skuIds, callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: {
                skuIds: skuIds
            },
            url: _this.url + '/buy/order/cart-buy',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                    layer.msg(response.msg)
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response)
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 订单运费计算
     * @param parameter
     * @param callback
     */
    woLianw.fareOrderFreight = function (parameter, callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: parameter,
            /* url: '//192.168.3.137:8002/fare/orderFreight',*/
            url: _this.url + '/fare/orderFreight',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
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
     * 根据skuid订单运费计算
     * @param parameter
     * @param callback
     */
    woLianw.fareOrderSkuFreight = function (parameter, callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: parameter,
            url: _this.url + '/fare/orderSkuFreight',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
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

    /*保存订单*/
    woLianw.buyOrderSubmit = function (parameter, callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: parameter,
            url: _this.url + '/buy/order/submit',
            /*url:_this.url+'/fare/orderFreight',*/
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                    layer.msg(response.msg)
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response)
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 下单请求收银台
     * @param orderNo
     * @param callback
     */
    woLianw.payOpen = function (orderNo,callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: {
                orderNo: orderNo
            },
            /*url: '//192.168.3.37/pay/open',*/
            url: _this.url + '/pay/open',
            success: function (response) {
                if (response.code == 0) {
                    /*未开户，弹出我连app下载二维码*/
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

                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    window.open(response.data)
                    callback ? callback() : '';
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /*支付订单查询*/
    woLianw.payQueryOrder = function (orderNo) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: {
                orderNo: orderNo
            },
            /*url: '//192.168.3.37/pay/open',*/
            url: _this.url + '/pay/queryOrder',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                    layer.msg(response.msg)
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    console.log(response)
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /* for(var i=0;i<19;i++){
         woLianw.buyCartAdd({
             skuId:126+i,
             num:25+i
         },function () {

         })
     }*/

    /*运营模块--轮播 start*/

    /**
     * 获取轮播图的信息
     * @param callback
     */
    woLianw.optCbList = function (callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
            /*url: '//192.168.3.37/pay/open',*/
            /*url: 'http://192.168.3.137:8002/opt/banner/cList',*/
            url: _this.url + '/opt/banner/cList',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                    layer.msg(response.msg)
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response.data.list)
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }


    /**
     * 获取专栏列表
     * @param callback
     */
    woLianw.optColumnList = function (callback) {
        var _this = this

        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
            data: {
                limit: 4
            },
            //url: 'http://192.168.3.137:8002/opt/column/clist',
            url: _this.url + '/opt/column/cList',
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

    /*栏目商品列表*/
    woLianw.columnProductList = function (parameter, callback) {
        var _this = this

        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
            data: parameter,
            //url: 'http://192.168.3.137:8002/opt/category/product/list',
            url: _this.url + '/opt/column/product/list',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                    layer.msg(response.msg)
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response.data.list)
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 获取运营分类列表
     * @param callback
     */
    woLianw.optCategoryList = function (callback) {
        var _this = this

        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
            //url: 'http://192.168.3.137:8002/opt/category/cList',
            url: _this.url + '/opt/category/cList',
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
     * 获取运营分类商品的信息
     * @param callback
     */
    woLianw.optCategoryDetail = function (id, callback) {
        var _this = this

        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
            data: {
                id: id
            },
            //url: 'http://192.168.3.137:8002/opt/category/detail',
            url: _this.url + '/opt/category/detail',
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
     * 运营分类商品列表
     * @param id
     * @param callback
     */
    woLianw.optCategoryProductList = function (parameter, callback) {
        var _this = this

        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
            data: parameter,
            //url: 'http://192.168.3.137:8002/opt/category/product/list',
            url: _this.url + '/opt/category/product/list',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                    layer.msg(response.msg)
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response.data.list)
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }
    /*运营模块--专栏商品 end*/
    /**
     * 获取app端运费模板
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
     * 获取app端运费模板
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
     * 获取 商品详情数据
     * @param parameter 传递的参数
     * @param callback  回调函数
     */
    woLianw.getProductDetail = function (parameter, callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
            data: parameter,
            url: _this.url + '/buy/product/detail',
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

    /* 一级二级三级类目category     start
    * @param parameter 传递的参数
    * @param callback  回调函数(传回数据)
    */
    woLianw.getCategoryList = function (callback, parameter) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
            data: parameter || "",
            url: _this.url + '/sell/category/list',
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
    /*发布一级二级三级类目category     end*/


     /*获取商品三级分类 有无叶子节点     start
     * @param parameter 传递的参数
     * @param callback  回调函数(数据渲染模板)
     */
    woLianw.getProductInfoList = function (callback, parameter) {
        var _this = this;
        var parameter = parameter || {};
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
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
     * 商品详情 获取的快递公司
     * @param callback
     */
    woLianw.getExpressList = function (callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
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
     * 商品详情 关注供应商
     * @param parameter
     * @param callback
     */
    woLianw.focusSuppliers = function (parameter, callback) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: parameter,
            url: _this.url + '/follow/add',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                   // layer.msg(response.msg);
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                     callback(response);
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
     * 商品详情 商品收藏的状态（用来回显 是否收藏）
     * @param parameter
     * @param callback
     */
    woLianw.focusSuppliersStatus = function (parameter, callback) {
        var _this = this;
       // _this.url = "//192.168.3.137:7015";
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
            data: parameter,
            url: _this.url + '/follow/product/status',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                     callback(response);
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
     * 商品详情 关注供应商的状态（用来回显 是否关注供应商）
     * @param parameter
     * @param callback
     */
    woLianw.focusVendorStatus = function (parameter, callback) {
        var _this = this;
       // _this.url = "//192.168.3.137:7015";
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
            data: parameter,
            url: _this.url + '/follow/vendor/status',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                     callback(response);
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
     * 商品详情 取消关注供应商
     * @param parameter
     * @param callback
     */
    woLianw.cancelFocusSuppliers = function (parameter, callback) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: parameter,
            url: _this.url + '/follow/cancel',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                    //layer.msg(response.msg);
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                     callback(response);

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
     * 商品详情 获取 工厂详情
     * @param parameter
     * @param callback
     */
    woLianw.getFactoryDetail = function (parameter, callback) {
        var _this = this;
       // _this.url = "//192.168.3.59:7015";
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: parameter,
            url: _this.url + '/user/agentGetFactoryDesc',
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
     * 商品详情 联系供应商
     * @param parameter
     * @param callback
     */
    woLianw.contactSupplier = function (parameter) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            data: parameter,
            cache:false,
            url: _this.url + '/chat/agentChatWithBuss',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                    layer.msg(response.msg);
                } else if (response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/
                    var url = response.msg;
                    console.log(url)
                    var iWidth = 900;
                    var iHeight = 600;
                    var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
                    var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
                    var name = 'nwin';

                    window.open(url, name, 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=0,titlebar=no', true);

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
     * 商品详情页 加入购物车
     * @param parameter 传递的参数
     * @param callback  回调函数
     */
    woLianw.addToCarts = function (parameter, callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: parameter,
            async: true,
            url: _this.url + '/buy/cart/add-more',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log("加入购物车： "+response.msg);
                    layer.msg(response.msg);
                    callback(response);
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response);
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 商品详情页 立即购买
     * @param parameter 传递的参数
     * @param callback  回调函数
     */
    woLianw.buyNow = function (parameter, callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: parameter,
            async: false,
            url: _this.url + '/buy/order/buy-more',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                    //layer.msg(response.msg);
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response);
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }


    /*通过laytpl模板引擎将数据渲染到页面 start*/
    /*
     * @param data 数据
     * @param templateID 模板ID
     * @param wrapID 装模板的盒子ID
     * */
    woLianw.renderDataHtml = function (data, templateID, wrapID) {
        var template = document.getElementById(templateID).innerHTML;
        var wrap = document.getElementById(wrapID);
        laytpl(template).render(data, function (html) {
            wrap.innerHTML = html;
        });
    }
    /*通过laytpl模板引擎将数据渲染到页面 end*/


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
            cache:false,
            url: _this.url + '/user/getServiceAccount',
            async: false,
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                } else if (response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/
                    //callback(response.data)

                    //显示客服个数
                    var str=response.data;
                    var ids = str.split(',')
                    var str ='<dl class="layui-nav-child">'
                    for (var i = 0; i < ids.length; i++) {
                        str += '<dd> <a href="javascript:void(0)" class="kefu" data-id="' + ids[i] + '"><i class="iconfont">&#xe625;</i>客服  ' + (i + 1) + '</a></dd>';
                    }
                    str += "</dl>"
                    if($('#commonHeader li.kefu').length >0){
                        $('#commonHeader li.kefu').append(str)
                        console.log($('#commonHeader li.kefu'))
                    }else if($('#headerRight li.kefu').length > 0){
                        $('#headerRight li.kefu').append(str)

                    }

                    element.init()

                }
                $('#commonHeader').on('click','a.kefu',function () {
                    var id = $(this).attr('data-id')
                    woLianw.chartWithWoLianService(id)
                })
                $('#headerRight').on('click','a.kefu',function () {
                    var id = $(this).attr('data-id')
                    woLianw.chartWithWoLianService(id)
                })
            }

        })
    }

    /*根据客服id调出相应客服的im*/
    woLianw.chartWithWoLianService = function(id) {
        console.log(1)
        $.ajaxSetup({
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        });
        $.ajax({
            type: "get",
            cache:false,
            data: {
                id: id
            },
            url: woLianw.url + "/chat/agentChatWithWoLian",
            async: false,
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                } else if (response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/
                    var url = response.msg;
                    var iWidth = 900;
                    var iHeight = 600;
                    var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
                    var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
                    var name = 'nwin';

                    window.open(url, name, 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=0,titlebar=no', true);

                }
            }
        });
    }

    /**
     * 读取未读消息
     *
     *
     */
    woLianw.getUnReadMsg = function (callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
            url: _this.url + '/chat/buy-getIMOffLineMsg',
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

    /*每隔60秒，获取一次我信的未读消息*/
    woLianw.realGetUnReadMsg = function () {
        setInterval(function () {
            debugger;
            woLianw.getUnReadMsg(function (data) {
                //{"code":1,"msg":"{\"size\":0,\"userId\":\"1087308\",\"status\":\"success\"}"}
                var jsonStr = JSON.parse(data)
                console.log(jsonStr.size)
                $("#msgNum").text(jsonStr.size);
            })
        }, 60 * 1000)
    }


    /*点击我信，打开我信*/
    woLianw.checkUnReadMsg = function () {

        $.ajaxSetup({
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        });
        $.ajax({
            type: "get",
            cache:false,
            url: woLianw.url + "/chat/buy-check-unReadMsg",
            async: false,
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                } else if (response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/
                    var url = response.msg;
                    var iWidth = 900;
                    var iHeight = 600;
                    var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
                    var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;

                    window.open(url, name, 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=0,titlebar=no', true);

                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    woLianw.goLoginPage();
                }
            }
        });
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
            cache:false,
            url: _this.url + '/buy/cart/sum',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/

                } else if (response.code == 1) {
                    /*成功，操作data项或显示msg给用户看*/
                    callback(response)
                    if($('#buyCartSum')){
                        $('#buyCartSum').text(response.data)
                    }

                } else if (response.code == 10) {
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
     * 获取快递公司列表
     * @param callback
     */
    woLianw.commonExpressList = function (callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
            url: _this.url + '/common/expressList',
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
     * 买家退货，填写物流信息
     * @param parameter
     * @param callback
     */
    woLianw.srvOrderFillInExpress = function (parameter, callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'post',
            data: parameter,
            url: _this.url + '/srvOrder/fillInExpress',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                    layer.msg(response.msg)
                } else if (response.code == 1) {
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response.msg)
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /**
     * 买家工作台商品推荐
     * @param callback
     */
    woLianw.userCenterRecommend = function (parameter,callback) {
        var _this = this
        var parameter = parameter || {}
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
            data:parameter,
            url: _this.url + '/buy/product/user-center-recommend',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response.msg);
                    layer.msg(response.msg)
                } else if (response.code == 1) {
                    console.log(response.data)
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
     * 进货单推荐商品
     * @param callback
     */
    woLianw.cartRecommend = function (parameter,callback) {
        var _this = this
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type: 'get',
            cache:false,
            data:parameter,
            url: _this.url + '/buy/product/cart-recommend',
            success: function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    console.log(response);
                    layer.msg(response.msg)
                } else if (response.code == 1) {
                    console.log(response)
                    /*登录成功，操作data项数据，将菜单渲染至页面*/
                    callback(response)
                } else if (response.code == 10) {
                    /*未登录，将用户导至登录页*/
                    _this.goLoginPage();
                }
            }
        })
    }

    /*创建公共头部*/
    woLianw.createHeader = function () {
        var _this = this
        var str = ' <li class="layui-nav-item">\n' +
            '            <a href="/home.html"><img src="//1788.wolianw.com/img/gongzuotai_icon1.png" alt="">我的工作台</a>\n' +
            '        </li>\n' +
            '        <li class="layui-nav-item">\n' +
            '            <a href="/followModule/product/index.html"><img src="//1788.wolianw.com/img/wenjianjia_cion1.png" alt=""> 收藏夹</a>\n' +
            '        </li>\n' +
            '        <li class="layui-nav-item">\n' +
            '            <a href="/buyCartModule/cart/index.html"><img src="//1788.wolianw.com/img/jinhuodan_icon1.png" alt=""> 进货单</a>\n' +
            '        </li>\n' +


            '        <li class="layui-nav-item kefu">\n' +
            '            <a href="javascript:void(0)"><img src="//1788.wolianw.com/img/kefu_icon1.png" alt=""> 联系客服</a>\n' +
            '        </li>\n'+
            '        <li class="layui-nav-item">\n' +
            '            <a href="javascript:void(0)" class="woxin"><img src="//1788.wolianw.com/img/icon_woxin1.png" alt=""> 我信消息<span class="layui-badge" id="msgNum">0</span></a>\n' +
            '        </li>\n'
            $('#commonHeader').append(str)

        element.init()
        //显示客服
        if((window.location.href.indexOf('dis.html') == -1) && (window.location.href.indexOf('login.html') == -1)){
            this.getService()
        }
        /*注册我信的点击事件*/
        $('#commonHeader').on('click', '.woxin', function () {
            _this.checkUnReadMsg()
        })
        if((window.location.href.indexOf('dis.html') == -1) && (window.location.href.indexOf('login.html') == -1)){
            _this.realGetUnReadMsg()
        }
    }

    /*页头用户信息部分*/
    woLianw.userCenterInfo = function () {
        debugger
        var _this = this
        var loginInfo = JSON.parse(window.localStorage.getItem('1788login'))
        if(!loginInfo){
            return false
        }
        var userNmae = loginInfo.loginName
        var str = '<a href=""><i class="fa fa-user fa-fw" aria-hidden="true"></i> '+ userNmae +'</a>\n' +
            '                    <dl class="layui-nav-child" style="text-align: center">\n' +
            '                        <dd><a href="/serverModule/updatePsw/change.html" target="_blank"><i class="fa fa-gear" aria-hidden="true"></i>&emsp;修改密码</a></dd>\n' +
            '                        <dd><a href="javascript:;" id="logOut"><i class="fa fa-sign-out" aria-hidden="true"></i>&emsp;注销</a></dd>\n' +
            '                    </dl>'
        $('#userCenter').append(str)
        element.init()
        $('body').on('click','#logOut',function () {
            _this.loginout()
        })
    }

    //获取图片链接拼接
    woLianw.getImgUrl = function(endUrl){
        if(endUrl && endUrl.length>6){
            if(endUrl.substr(0,7) == "http://"){
                return endUrl;
            }
            else if(endUrl.substr(0,1) == "/"){
                return  imagesPrefix+endUrl;
            }else{
                return  imagesPrefix+"/"+endUrl
            }
        }else if(!endUrl){
            return  '/img/placeholder.jpg';
        }
        else {
            return '';
        }
    }


    //logo + 搜索 +进货单  isIndex:1 是首页 默认不填
    woLianw.search = function (parameter){
        //repeat_search
        //../img//product-LOGO.png
        // var pictUrl = "/erpv2vendor/2018/01/27/ca0be5f4-27d0-421b-8348-f11aa30301af.png";
        // var loginUrl = woLianw.getImgUrl(pictUrl);
        if(parameter == undefined){
            parameter = {}
        }
        var isCenter = parameter.isCenter || 0;
        var key = parameter.key || '';
        var category = parameter.category || '全部分类'
        var loginUrl = "/img/product-LOGO.png";
        if(isCenter){
            loginUrl = '/img/center-logo.png';
        }

        var str =  '\
                <div class="grid_wrap">\
                <div class="grid_logo">\
                    <a href="javascript:;"><img src="'+loginUrl+'" /></a>\
                </div>\
                <div class="grid_search">\
                    <div class="search_box">\
                        <div class="chooseCategory" id="chooseCategory">\
                            <button class="layui-btn" id="choosecateBtn">\
                                <span id="choosecateBtnSpan">'+category+'</span>\
                                <i class="fa fa-caret-down"></i>\
                            </button>\
                            <div class="layui-row CategoryStep">\
                                <!--1,2,3级分类容器 start-->\
                                <div class="layui-col-sm12 layui-hide" id="category-body">\
                                    <!--一级分类 start-->\
                                    <div class="layui-col-sm4 category category1">\
                                        <div class="ibox ibox-border">\
                                            <div class="ibox-title">\
                                                <h5>一级分类</h5>\
                                            </div>\
                                            <div class="ibox-content">\
                                                <div class="treeview">\
                                                    <ul id="category1" class="list-group"></ul>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <!--一级分类 end-->\
                                    <!--2级分类 start-->\
                                    <div class="layui-col-sm4 category category2 layui-hide">\
                                        <div class="ibox ibox-border">\
                                            <div class="ibox-title">\
                                                <h5>二级分类</h5>\
                                            </div>\
                                            <div class="ibox-content">\
                                                <div class="treeview">\
                                                    <ul id="category2" class="list-group"></ul>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <!--2级分类 end-->\
                                    <!--3级分类  start-->\
                                    <div class="layui-col-sm4 category category3 layui-hide">\
                                        <div class="ibox ibox-border">\
                                            <div class="ibox-title">\
                                                <h5>三级分类</h5>\
                                            </div>\
                                            <div class="ibox-content">\
                                                <div class="treeview">\
                                                    <ul id="category3" class="list-group"></ul>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <!--3级分类  end-->\
                                </div>\
                                <!--1,2,3级分类容器 end-->\
                            </div>\
                        </div>\
                        <form class="layui-form">\
                            <input type="text" id="searchkey" class="layui-input search-content-word" value="'+key+'">\
                            <input type="button" value="搜索" id="searchBtn" class="layui-btn search-content-btn">\
                        </form>\
                    </div>\
                    <div class="shopping-cart">\
                    <a href="/buyCartModule/cart/index.html" target="_blank">\
                        <i class="fa fa-shopping-cart"></i>\
                        <span>我的进货单</span>\
                        <span class="layui-badge" id="buyCartSum">0</span>\
                    </a>\
                    </div>\
                </div>\
            </div>';
        $("#repeat_search").append(str);
        element.init();
    }







    /**
     * 物流信息详情查询
     */
    woLianw.ajaxFareGetOrderTraces = function (params, success, error) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'get',
            cache:false,
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
     * 发短信
     */
    woLianw.ajaxSmsSend = function (params, success, error) {
        var _this = this;
        params.mobile = params.phone;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'POST',
            data: params,
            url: _this.url+'/sms/send',
          /*  url: '//192.168.3.59:7015/sms/send',*/
            success:function (response) {
                if (response.code == 0) {
                    /*失败，显示msg给用户看*/
                    error && error(response.msg);
                } else if (response.code == 1) {
                    success && success(response.msg);
                }
            },
            error:function (res) {
                console.log(res)
            },
            beforeSend:function () {
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
    woLianw.ajaxUserEditPwd = function (params, success, error) {
        var _this = this;
        $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        $.ajax({
            type:'POST',
            data: params,
            url: _this.url+'/user/editPwd',
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


    
    // 在登录切换页不执行
    if ((location.href.indexOf('dis.html') === -1) && (location.href.indexOf('login.html') === -1)) {
        woLianw.createHeader();
        woLianw.userCenterInfo();
    }

    exports('woLianw', woLianw);
});



