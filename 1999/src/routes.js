import React from 'react';
import PageFrame from './routes/PageFrame';

// const env = 'production';
// const env = 'development';

function registerModel(app, model) {
  if (app && !(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
    app.model(model);
  }
}

function Routes(locale, app) {
  return [
    {
      // 登录
      path: `/${locale}/login`,
      getIndexRoute(nextState, cb) {
        if (process.env.NODE_ENV === 'development') {
          import(/* webpackChunkName: "Login" */ './routes/Login')
          .then((data) => {
            registerModel(app, require('./models/login'));
            cb(null, { component: data });
          })
          .catch(err => console.log('Failed to load Login', err));
        } else {
          registerModel(app, require('./models/login'));
          cb(null, { component: require('./routes/Login') });
        }
      },
    },
    {
      path: `/${locale}/index`,
      component: PageFrame,
      getIndexRoute(nextState, cb) {
        // 首页
        if (process.env.NODE_ENV === 'development') {
          import(/* webpackChunkName: "Index" */ './routes/Index')
          .then((data) => {
            registerModel(app, require('./models/index'));
            cb(null, { component: data });
          })
          .catch(err => console.log('Failed to load Index', err));
        } else {
          registerModel(app, require('./models/index'));
          cb(null, { component: require('./routes/Index') });
        }
      },
      childRoutes: [
        {
          // 我的
          path: `/${locale}/mine`,
          getComponent(nextState, cb) {
            if (process.env.NODE_ENV === 'development') {
              import(/* webpackChunkName: "Mine" */ './routes/Mine')
              .then((data) => {
                registerModel(app, require('./models/mine'));
                cb(null, data);
              })
              .catch(err => console.log('Failed to load Mine', err));
            } else {
              registerModel(app, require('./models/mine'));
              cb(null, require('./routes/Mine'));
            }
          },
        },
        {
          path: `/${locale}/role`,
          getIndexRoute(nextState, cb) {
            // 岗位管理
            if (process.env.NODE_ENV === 'development') {
              import(/* webpackChunkName: "role/index" */ './routes/role/index')
              .then((data) => {
                registerModel(app, require('./models/role/index'));
                cb(null, { component: data });
              })
              .catch(err => console.log('Failed to load role/index', err));
            } else {
              registerModel(app, require('./models/role/index'));
              cb(null, { component: require('./routes/role/index') });
            }
          },
          childRoutes: [
            {
              // 添加/编辑/查看岗位
              path: 'detail',
              getComponent(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "role/detail" */ './routes/role/detail')
                  .then((data) => {
                    registerModel(app, require('./models/role/detail'));
                    cb(null, data);
                  })
                  .catch(err => console.log('Failed to load role/detail', err));
                } else {
                  registerModel(app, require('./models/role/detail'));
                  cb(null, require('./routes/role/detail'));
                }
              },
            },
            {
              // 设置权限
              path: 'setPermission',
              getComponent(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "role/setPermission" */ './routes/role/setPermission')
                  .then((data) => {
                    registerModel(app, require('./models/role/setPermission'));
                    cb(null, data);
                  })
                  .catch(err => console.log('Failed to load role/setPermission', err));
                } else {
                  registerModel(app, require('./models/role/setPermission'));
                  cb(null, require('./routes/role/setPermission'));
                }
              },
            },
            {
              path: 'public',
              getIndexRoute(nextState, cb) {
                // 公有权限设置
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "role/public/index" */ './routes/role/public/index')
                  .then((data) => {
                    registerModel(app, require('./models/role/public/index'));
                    cb(null, { component: data });
                  })
                  .catch(err => console.log('Failed to load role/public/index', err));
                } else {
                  registerModel(app, require('./models/role/public/index'));
                  cb(null, { component: require('./routes/role/public/index') });
                }
              },
              childRoutes: [
                {
                  // 新增/查看/编辑公有权限
                  path: 'detail',
                  getComponent(nextState, cb) {
                    if (process.env.NODE_ENV === 'development') {
                      import(/* webpackChunkName: "role/public/detail" */ './routes/role/public/detail')
                      .then((data) => {
                        registerModel(app, require('./models/role/public/detail'));
                        cb(null, data);
                      })
                      .catch(err => console.log('Failed to load role/public/detail', err));
                    } else {
                      registerModel(app, require('./models/role/public/detail'));
                      cb(null, require('./routes/role/public/detail'));
                    }
                  },
                },
                {
                  // 设置权限
                  path: 'setPermission',
                  getComponent(nextState, cb) {
                    if (process.env.NODE_ENV === 'development') {
                      import(/* webpackChunkName: "role/setPermission" */ './routes/role/setPermission')
                      .then((data) => {
                        registerModel(app, require('./models/role/setPermission'));
                        cb(null, data);
                      })
                      .catch(err => console.log('Failed to load role/setPermission', err));
                    } else {
                      registerModel(app, require('./models/role/setPermission'));
                      cb(null, require('./routes/role/setPermission'));
                    }
                  },
                },
              ],
            },
            {
              path: 'default',
              getIndexRoute(nextState, cb) {
                // 默认权限设置
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "role/default/index" */ './routes/role/default/index')
                  .then((data) => {
                    registerModel(app, require('./models/role/default/index'));
                    cb(null, { component: data });
                  })
                  .catch(err => console.log('Failed to load role/default/index', err));
                } else {
                  registerModel(app, require('./models/role/default/index'));
                  cb(null, { component: require('./routes/role/default/index') });
                }
              },
              childRoutes: [
                {
                  // 设置权限
                  path: 'setPermission',
                  getComponent(nextState, cb) {
                    if (process.env.NODE_ENV === 'development') {
                      import(/* webpackChunkName: "role/setPermission" */ './routes/role/setPermission')
                      .then((data) => {
                        registerModel(app, require('./models/role/setPermission'));
                        cb(null, data);
                      })
                      .catch(err => console.log('Failed to load role/setPermission', err));
                    } else {
                      registerModel(app, require('./models/role/setPermission'));
                      cb(null, require('./routes/role/setPermission'));
                    }
                  },
                },
              ],
            },
          ],
        },
        {
          // 权限管理
          path: `/${locale}/permission`,
          getIndexRoute(nextState, cb) {
            if (process.env.NODE_ENV === 'development') {
              import(/* webpackChunkName: "permission/index" */ './routes/permission/index')
              .then((data) => {
                registerModel(app, require('./models/permission/index'));
                cb(null, { component: data });
              })
              .catch(err => console.log('Failed to load permission/index', err));
            } else {
              registerModel(app, require('./models/permission/index'));
              cb(null, { component: require('./routes/permission/index') });
            }
          },
          childRoutes: [
            {
              // 新增/查看/编辑权限
              path: 'detail',
              getComponent(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "permission/detail" */ './routes/permission/detail')
                  .then((data) => {
                    registerModel(app, require('./models/permission/detail'));
                    cb(null, data);
                  })
                  .catch(err => console.log('Failed to load permission/detail', err));
                } else {
                  registerModel(app, require('./models/permission/detail'));
                  cb(null, require('./routes/permission/detail'));
                }
              },
            },
          ],
        },
        {
          // 模块管理
          path: `/${locale}/module`,
          getIndexRoute(nextState, cb) {
            if (process.env.NODE_ENV === 'development') {
              import(/* webpackChunkName: "module/index" */ './routes/module/index')
              .then((data) => {
                registerModel(app, require('./models/module/index'));
                cb(null, { component: data });
              })
              .catch(err => console.log('Failed to load module/index', err));
            } else {
              registerModel(app, require('./models/module/index'));
              cb(null, { component: require('./routes/module/index') });
            }
          },
          childRoutes: [
            {
              // 新增/查看/编辑模块
              path: 'detail',
              getComponent(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "module/detail" */ './routes/module/detail')
                  .then((data) => {
                    registerModel(app, require('./models/module/detail'));
                    cb(null, data);
                  })
                  .catch(err => console.log('Failed to load module/detail', err));
                } else {
                  registerModel(app, require('./models/module/detail'));
                  cb(null, require('./routes/module/detail'));
                }
              },
            },
          ],
        },
        {
          // 用户列表
          path: `/${locale}/user`,
          getIndexRoute(nextState, cb) {
            if (process.env.NODE_ENV === 'development') {
              import(/* webpackChunkName: "user/index" */ './routes/user/index')
              .then((data) => {
                registerModel(app, require('./models/user/index'));
                cb(null, { component: data });
              })
              .catch(err => console.log('Failed to load user/index', err));
            } else {
              registerModel(app, require('./models/user/index'));
              cb(null, { component: require('./routes/user/index') });
            }
          },
          childRoutes: [
            {
              // 查看/编辑用户信息
              path: 'detail',
              getComponent(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "user/detail" */ './routes/user/detail')
                  .then((data) => {
                    registerModel(app, require('./models/user/detail'));
                    cb(null, data);
                  })
                  .catch(err => console.log('Failed to load user/detail', err));
                } else {
                  registerModel(app, require('./models/user/detail'));
                  cb(null, require('./routes/user/detail'));
                }
              },
            },
            {
              // 修改密码
              path: 'editPwd',
              getComponent(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "user/editPwd" */ './routes/user/editPwd')
                  .then((data) => {
                    registerModel(app, require('./models/user/editPwd'));
                    cb(null, data);
                  })
                  .catch(err => console.log('Failed to load user/editPwd', err));
                } else {
                  registerModel(app, require('./models/user/editPwd'));
                  cb(null, require('./routes/user/editPwd'));
                }
              },
            },
            {
              // 供应商授权
              path: 'venGrantAuth',
              getComponent(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "user/venGrantAuth" */ './routes/user/venGrantAuth')
                  .then((data) => {
                    registerModel(app, require('./models/user/venGrantAuth'));
                    cb(null, data);
                  })
                  .catch(err => console.log('Failed to load user/venGrantAuth', err));
                } else {
                  registerModel(app, require('./models/user/venGrantAuth'));
                  cb(null, require('./routes/user/venGrantAuth'));
                }
              },
            },
            {
              // 运费模板列表
              path: 'fare',
              getComponent(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "user/fare/index" */ './routes/user/fare/index')
                  .then((data) => {
                    registerModel(app, require('./models/user/fare/index'));
                    cb(null, data);
                  })
                  .catch(err => console.log('Failed to load user/fare/index', err));
                } else {
                  registerModel(app, require('./models/user/fare/index'));
                  cb(null, require('./routes/user/fare/index'));
                }
              },
            },
            {
              // 员工管理
              path: 'employee',
              getIndexRoute(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "user/employee/index" */ './routes/user/employee/index')
                  .then((data) => {
                    registerModel(app, require('./models/user/employee/index'));
                    cb(null, { component: data });
                  })
                  .catch(err => console.log('Failed to load user/employee/index', err));
                } else {
                  registerModel(app, require('./models/user/employee/index'));
                  cb(null, { component: require('./routes/user/employee/index') });
                }
              },
              childRoutes: [
                {
                  // 添加/查看/编辑员工
                  path: 'detail',
                  getComponent(nextState, cb) {
                    if (process.env.NODE_ENV === 'development') {
                      import(/* webpackChunkName: "user/employee/detail" */ './routes/user/employee/detail')
                      .then((data) => {
                        registerModel(app, require('./models/user/employee/detail'));
                        cb(null, data);
                      })
                      .catch(err => console.log('Failed to load user/employee/detail', err));
                    } else {
                      registerModel(app, require('./models/user/employee/detail'));
                      cb(null, require('./routes/user/employee/detail'));
                    }
                  },
                },
                {
                  // 修改密码
                  path: 'editPwd',
                  getComponent(nextState, cb) {
                    if (process.env.NODE_ENV === 'development') {
                      import(/* webpackChunkName: "user/employee/editPwd" */ './routes/user/employee/editPwd')
                      .then((data) => {
                        registerModel(app, require('./models/user/employee/editPwd'));
                        cb(null, data);
                      })
                      .catch(err => console.log('Failed to load user/employee/editPwd', err));
                    } else {
                      registerModel(app, require('./models/user/employee/editPwd'));
                      cb(null, require('./routes/user/employee/editPwd'));
                    }
                  },
                },
              ],
            },
          ],
        },
        {
          // 订单
          path: `/${locale}/order`,
          childRoutes: [
            {
              // 总代理订单
              path: 'dis',
              getComponent(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "order/dis/index" */ './routes/order/dis/index')
                  .then((data) => {
                    registerModel(app, require('./models/order/dis/index'));
                    cb(null, data);
                  })
                  .catch(err => console.log('Failed to load order/dis/index', err));
                } else {
                  registerModel(app, require('./models/order/dis/index'));
                  cb(null, require('./routes/order/dis/index'));
                }
              },
            },
            {
              // 总代理订单详情
              path: 'dis/detail',
              getComponent(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "order/dis/detail" */ './routes/order/dis/detail')
                  .then((data) => {
                    registerModel(app, require('./models/order/dis/detail'));
                    cb(null, data);
                  })
                  .catch(err => console.log('Failed to load order/dis/detail', err));
                } else {
                  registerModel(app, require('./models/order/dis/detail'));
                  cb(null, require('./routes/order/dis/detail'));
                }
              },
            },
            {
              // 总代理订单 - 商品详情
              path: 'dis/productdetail',
              getComponent(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "manager/product/detail" */ './routes/manager/product/detail')
                  .then((data) => {
                    registerModel(app, require('./models/manager/product/detail'));
                    cb(null, data);
                  })
                  .catch(err => console.log('Failed to load manager/product/detail', err));
                } else {
                  registerModel(app, require('./models/manager/product/detail'));
                  cb(null, require('./routes/manager/product/detail'));
                }
              },
            },
            {
              // 供应商订单
              path: 'ven',
              getComponent(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "order/ven/index" */ './routes/order/ven/index')
                  .then((data) => {
                    registerModel(app, require('./models/order/ven/index'));
                    cb(null, data);
                  })
                  .catch(err => console.log('Failed to load order/ven/index', err));
                } else {
                  registerModel(app, require('./models/order/ven/index'));
                  cb(null, require('./routes/order/ven/index'));
                }
              },
            },
            {
              // 供应商订单详情
              path: 'ven/detail',
              getComponent(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "order/dis/detail" */ './routes/order/dis/detail')
                  .then((data) => {
                    registerModel(app, require('./models/order/dis/detail'));
                    cb(null, data);
                  })
                  .catch(err => console.log('Failed to load order/dis/detail', err));
                } else {
                  registerModel(app, require('./models/order/dis/detail'));
                  cb(null, require('./routes/order/dis/detail'));
                }
              },
            },
            {
              // 供应商订单 - 商品详情
              path: 'ven/productdetail',
              getComponent(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "manager/product/detail" */ './routes/manager/product/detail')
                  .then((data) => {
                    registerModel(app, require('./models/manager/product/detail'));
                    cb(null, data);
                  })
                  .catch(err => console.log('Failed to load manager/product/detail', err));
                } else {
                  registerModel(app, require('./models/manager/product/detail'));
                  cb(null, require('./routes/manager/product/detail'));
                }
              },
            },
            {
              // 异常订单
              path: 'abnormal',
              getComponent(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "order/abnormal" */ './routes/order/abnormal')
                  .then((data) => {
                    registerModel(app, require('./models/order/abnormal'));
                    cb(null, data);
                  })
                  .catch(err => console.log('Failed to load order/abnormal', err));
                } else {
                  registerModel(app, require('./models/order/abnormal'));
                  cb(null, require('./routes/order/abnormal'));
                }
              },
            },
          ],
        },
        {
          // 退货列表
          path: `/${locale}/srvOrder`,
          getIndexRoute(nextState, cb) {
            if (process.env.NODE_ENV === 'development') {
              import(/* webpackChunkName: "srvOrder/index" */ './routes/srvOrder/index')
              .then((data) => {
                registerModel(app, require('./models/srvOrder/index'));
                cb(null, { component: data });
              })
              .catch(err => console.log('Failed to load srvOrder/index', err));
            } else {
              registerModel(app, require('./models/srvOrder/index'));
              cb(null, { component: require('./routes/srvOrder/index') });
            }
          },
          childRoutes: [
            {
              // 退货详情
              path: 'detail',
              getComponent(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "srvOrder/detail" */ './routes/srvOrder/detail')
                  .then((data) => {
                    registerModel(app, require('./models/srvOrder/detail'));
                    cb(null, data);
                  })
                  .catch(err => console.log('Failed to load srvOrder/detail', err));
                } else {
                  registerModel(app, require('./models/srvOrder/detail'));
                  cb(null, require('./routes/srvOrder/detail'));
                }
              },
            },
            {
              // 源订单详情
              path: 'orderdetail',
              getComponent(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "order/dis/detail" */ './routes/order/dis/detail')
                  .then((data) => {
                    registerModel(app, require('./models/order/dis/detail'));
                    cb(null, data);
                  })
                  .catch(err => console.log('Failed to load order/dis/detail', err));
                } else {
                  registerModel(app, require('./models/order/dis/detail'));
                  cb(null, require('./routes/order/dis/detail'));
                }
              },
            },
            {
              // 商品详情
              path: 'productdetail',
              getComponent(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "manager/product/detail" */ './routes/manager/product/detail')
                  .then((data) => {
                    registerModel(app, require('./models/manager/product/detail'));
                    cb(null, data);
                  })
                  .catch(err => console.log('Failed to load manager/product/detail', err));
                } else {
                  registerModel(app, require('./models/manager/product/detail'));
                  cb(null, require('./routes/manager/product/detail'));
                }
              },
            },
          ],
        },
        {
          // 运营管理
          path: `/${locale}/operation`,
          childRoutes: [
            {
              // 客服配置
              path: 'customServiceConfig',
              getIndexRoute(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "operation/customServiceConfig/index" */ './routes/operation/customServiceConfig/index')
                  .then((data) => {
                    registerModel(app, require('./models/operation/customServiceConfig/index'));
                    cb(null, { component: data });
                  })
                  .catch(err => console.log('Failed to load operation/customServiceConfig/index', err));
                } else {
                  registerModel(app, require('./models/operation/customServiceConfig/index'));
                  cb(null, { component: require('./routes/operation/customServiceConfig/index') });
                }
              },
            },
          ],
        },
        {
          // 专栏管理
          path: `/${locale}/opt`,
          childRoutes: [
            {
              // 列表
              path: 'column',
              getIndexRoute(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "opt/column/index" */ './routes/opt/column/index')
                  .then((data) => {
                    registerModel(app, require('./models/opt/column/index'));
                    cb(null, { component: data });
                  })
                  .catch(err => console.log('Failed to load opt/column/index', err));
                } else {
                  registerModel(app, require('./models/opt/column/index'));
                  cb(null, { component: require('./routes/opt/column/index') });
                }
              },
              childRoutes: [
                {
                  // 详情
                  path: 'detail',
                  getComponent(nextState, cb) {
                    if (process.env.NODE_ENV === 'development') {
                      import(/* webpackChunkName: "opt/column/detail" */ './routes/opt/column/detail')
                      .then((data) => {
                        registerModel(app, require('./models/opt/column/detail'));
                        cb(null, data);
                      })
                      .catch(err => console.log('Failed to load opt/column/detail', err));
                    } else {
                      registerModel(app, require('./models/opt/column/detail'));
                      cb(null, require('./routes/opt/column/detail'));
                    }
                  },
                },
                {
                  // 关联商品
                  path: 'relation',
                  getComponent(nextState, cb) {
                    if (process.env.NODE_ENV === 'development') {
                      import(/* webpackChunkName: "opt/column/relation" */ './routes/opt/column/relation')
                      .then((data) => {
                        registerModel(app, require('./models/opt/column/relation'));
                        cb(null, data);
                      })
                      .catch(err => console.log('Failed to load opt/column/relation', err));
                    } else {
                      registerModel(app, require('./models/opt/column/relation'));
                      cb(null, require('./routes/opt/column/relation'));
                    }
                  },
                },
              ],
            },
            {
              // 列表
              path: 'category',
              getIndexRoute(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "opt/category/index" */ './routes/opt/category/index')
                  .then((data) => {
                    registerModel(app, require('./models/opt/category/index'));
                    cb(null, { component: data });
                  })
                  .catch(err => console.log('Failed to load opt/category/index', err));
                } else {
                  registerModel(app, require('./models/opt/category/index'));
                  cb(null, { component: require('./routes/opt/category/index') });
                }
              },
              childRoutes: [
                {
                  // 详情
                  path: 'detail',
                  getComponent(nextState, cb) {
                    if (process.env.NODE_ENV === 'development') {
                      import(/* webpackChunkName: "opt/category/detail" */ './routes/opt/category/detail')
                      .then((data) => {
                        registerModel(app, require('./models/opt/category/detail'));
                        cb(null, data);
                      })
                      .catch(err => console.log('Failed to load opt/category/detail', err));
                    } else {
                      registerModel(app, require('./models/opt/category/detail'));
                      cb(null, require('./routes/opt/category/detail'));
                    }
                  },
                },
                {
                  // 关联商品
                  path: 'relation',
                  getComponent(nextState, cb) {
                    if (process.env.NODE_ENV === 'development') {
                      import(/* webpackChunkName: "opt/category/relation" */ './routes/opt/category/relation')
                      .then((data) => {
                        registerModel(app, require('./models/opt/category/relation'));
                        cb(null, data);
                      })
                      .catch(err => console.log('Failed to load opt/category/relation', err));
                    } else {
                      registerModel(app, require('./models/opt/category/relation'));
                      cb(null, require('./routes/opt/category/relation'));
                    }
                  },
                },
              ],
            },
            {
              // 列表
              path: 'banner',
              getIndexRoute(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "opt/banner/index" */ './routes/opt/banner/index')
                  .then((data) => {
                    registerModel(app, require('./models/opt/banner/index'));
                    cb(null, { component: data });
                  })
                  .catch(err => console.log('Failed to load opt/banner/index', err));
                } else {
                  registerModel(app, require('./models/opt/banner/index'));
                  cb(null, { component: require('./routes/opt/banner/index') });
                }
              },
              childRoutes: [
                {
                  // 详情
                  path: 'detail',
                  getComponent(nextState, cb) {
                    if (process.env.NODE_ENV === 'development') {
                      import(/* webpackChunkName: "opt/banner/detail" */ './routes/opt/banner/detail')
                      .then((data) => {
                        registerModel(app, require('./models/opt/banner/detail'));
                        cb(null, data);
                      })
                      .catch(err => console.log('Failed to load opt/banner/detail', err));
                    } else {
                      registerModel(app, require('./models/opt/banner/detail'));
                      cb(null, require('./routes/opt/banner/detail'));
                    }
                  },
                },
              ],
            },
          ],
        },
        {
          // 商品管理
          path: `/${locale}/manager`,
          childRoutes: [
            {
              // 商品列表
              path: 'product',
              getIndexRoute(nextState, cb) {
                if (process.env.NODE_ENV === 'development') {
                  import(/* webpackChunkName: "manager/product/index" */ './routes/manager/product/index')
                  .then((data) => {
                    registerModel(app, require('./models/manager/product/index'));
                    cb(null, { component: data });
                  })
                  .catch(err => console.log('Failed to load manager/product/index', err));
                } else {
                  registerModel(app, require('./models/manager/product/index'));
                  cb(null, { component: require('./routes/manager/product/index') });
                }
              },
              childRoutes: [
                {
                  // 审核
                  path: 'audit',
                  getComponent(nextState, cb) {
                    if (process.env.NODE_ENV === 'development') {
                      import(/* webpackChunkName: "manager/product/Audit" */ './routes/manager/product/Audit')
                      .then((data) => {
                        registerModel(app, require('./models/manager/product/Audit'));
                        cb(null, data);
                      })
                      .catch(err => console.log('Failed to load manager/product/Audit', err));
                    } else {
                      registerModel(app, require('./models/manager/product/Audit'));
                      cb(null, require('./routes/manager/product/Audit'));
                    }
                  },
                },
                {
                  // 详情
                  path: 'detail',
                  getComponent(nextState, cb) {
                    if (process.env.NODE_ENV === 'development') {
                      import(/* webpackChunkName: "manager/product/detail" */ './routes/manager/product/detail')
                      .then((data) => {
                        registerModel(app, require('./models/manager/product/detail'));
                        cb(null, data);
                      })
                      .catch(err => console.log('Failed to load manager/product/detail', err));
                    } else {
                      registerModel(app, require('./models/manager/product/detail'));
                      cb(null, require('./routes/manager/product/detail'));
                    }
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ];
}

export default Routes;
