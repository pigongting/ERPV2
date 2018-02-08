/* eslint-disable */
window.wolianw1588 = '//1588'+wolianwDomain;
window.wolianw1788 = '//1788'+wolianwDomain;
window.wolianw1988 = '//1988'+wolianwDomain;
window.wolianw1999 = '//1999'+wolianwDomain;

window.apiPrefix = wolianw1999+'api/';
window.apiNexfix = '';

window.iface = {
  // 枚举
  enum: apiPrefix+'enum'+apiNexfix,
  orderStatus: apiPrefix+'enum-custom/order-status'+apiNexfix,
  // 用户
  login: apiPrefix+'login'+apiNexfix, // 登录
  loginout: apiPrefix+'loginout'+apiNexfix, // 退出登录
  userList: apiPrefix+'user/list'+apiNexfix, // 用户列表
  userToEdit: apiPrefix+'user/toEdit'+apiNexfix, // 查看用户信息
  userEdit: apiPrefix+'user/edit'+apiNexfix, // 编辑用户信息
  userEmployeeList: apiPrefix+'user/employee/list'+apiNexfix, // 员工列表
  userAdd: apiPrefix+'user/add'+apiNexfix, // 添加员工
  userEditPwd: apiPrefix+'user/editPwd'+apiNexfix, // 修改用户密码
  userEmployeeEditPwd: apiPrefix+'user/employee/editPwd'+apiNexfix, // 修改员工密码
  userEmployeeEdit: apiPrefix+'user/employee/edit'+apiNexfix, // 编辑员工信息
  fareList: apiPrefix+'fare/list'+apiNexfix, // 运费模板列表
  fareGetOrderTraces: apiPrefix+'fare/getOrderTraces'+apiNexfix, // 物流信息详情查询
  // 角色(岗位)
  roleList: apiPrefix+'role/list'+apiNexfix, // 岗位列表
  roleDetail: apiPrefix+'role/detail'+apiNexfix, // 查看岗位
  roleAdd: apiPrefix+'role/add'+apiNexfix, // 添加岗位
  roleEdit: apiPrefix+'role/edit'+apiNexfix, // 修改岗位
  roleDelete: apiPrefix+'role/delete'+apiNexfix, // 删除岗位
  rolePublicList: apiPrefix+'role/public/list'+apiNexfix, // 公有权限设置
  rolePublicAdd: apiPrefix+'role/public/add'+apiNexfix, // 添加公有岗位
  rolePublicEdit: apiPrefix+'role/public/edit'+apiNexfix, // 修改公有岗位
  roleDefaultList: apiPrefix+'role/default/list'+apiNexfix, // 默认权限设置
  roleDistributeRole: apiPrefix+'role/distributeRole'+apiNexfix, // 分配角色
  roleToSetPermission: apiPrefix+'role/toSetPermission'+apiNexfix, // 查看设置权限
  roleSetPermission: apiPrefix+'role/setPermission'+apiNexfix, // 修改设置权限
  // 权限
  permissionList: apiPrefix+'permission/list'+apiNexfix, // 权限管理
  permissionAdd: apiPrefix+'permission/add'+apiNexfix, // 新增权限
  permissionDetail: apiPrefix+'permission/detail'+apiNexfix, // 查看权限
  permissionEdit: apiPrefix+'permission/edit'+apiNexfix, // 修改权限
  permissionToSetButton: apiPrefix+'permission/toSetButton'+apiNexfix, // 获取设置按钮列表
  // 菜单(模块)
  moduleList: apiPrefix+'module/list'+apiNexfix, // 模块管理
  moduleAdd: apiPrefix+'module/add'+apiNexfix, // 新增模块
  moduleDetail: apiPrefix+'module/detail'+apiNexfix, // 查看模块
  moduleEdit: apiPrefix+'module/edit'+apiNexfix, // 编辑模块
  moduleParentAll: apiPrefix+'module/parent/all'+apiNexfix, // 上级名称列表
  modulesetButton: apiPrefix+'module/setButton'+apiNexfix, // 设置按钮
  // 订单
  orderCenConPagingAgency: apiPrefix+'order/dis/list'+apiNexfix, // 总代理订单
  orderCenConPagingSupplier: apiPrefix+'order/ven/list'+apiNexfix, // 供应商订单
  orderCenConPagingAbnormalOrders: apiPrefix+'order/cenConPagingAbnormalOrders'+apiNexfix, // 异常订单
  sellOrderVenRefundMoney: apiPrefix+'order/cenRefundMoney'+apiNexfix, // 总代理订单-退单
  orderCenNowPay: apiPrefix+'order/cenNowPay'+apiNexfix, // 供应商订单-及时打款
  
  sellOrderVenOrderItemByNo: apiPrefix+'sell/order/venOrderItemByNo'+apiNexfix, // 订单信息
  orderBuyerInfoById: apiPrefix+'order/buyerInfoById'+apiNexfix, // 客户信息
  orderBuyerOperateInfoById: apiPrefix+'order/buyerOperateInfoById'+apiNexfix, // 订单操作信息
  orderBuyerAppraiseInfoById: apiPrefix+'order/buyerAppraiseInfoById'+apiNexfix, // 评价信息

  // 退货
  srvOrderList: apiPrefix+'srvOrder/list'+apiNexfix, // 退货列表
  srvOrderDetail: apiPrefix+'srvOrder/detail'+apiNexfix, // 总代理售后详情
  srvOrderLog: apiPrefix+'srvOrder/log'+apiNexfix, // 售后记录信息
  // 商品
  managerProductList: apiPrefix+'manager/product/list'+apiNexfix, // 商品列表
  managerProductDelete: apiPrefix+'manager/product/delete'+apiNexfix, // 删除商品
  managerProductOffline: apiPrefix+'manager/product/offline'+apiNexfix, // 强制下架
  managerProductVerifyDetail: apiPrefix+'manager/product/verify/detail'+apiNexfix, // 中控审核商品前的详情查询
  managerProductVerify: apiPrefix+'manager/product/verify'+apiNexfix, // 中控审核商品
  managerProductPromotion: apiPrefix+'manager/product/promotion'+apiNexfix, // 中控设置商品为特价
  managerProductDetail: apiPrefix+'manager/product/detail'+apiNexfix, // 中控查询商品详情
  managerProductGetFactoryDesc: apiPrefix+'manager/product/getFactoryDesc'+apiNexfix, // 工厂企业信息
  // 运营管理
  operationCustomServiceConfigList: apiPrefix+'opt/customServiceConfig/list'+apiNexfix, // 客服配置列表
  operationCustomServiceConfigEdit: apiPrefix+'opt/customServiceConfig/edit'+apiNexfix, // 更新客服配置
  optCustomServiceConfigValidatePhone: apiPrefix+'opt/customServiceConfig/validatePhone'+apiNexfix, // 验证客服配置时的手机号码
  // 运营商品管理
  optColumnList: apiPrefix+'opt/column/list'+apiNexfix, // 专栏列表
  optColumnAdd: apiPrefix+'opt/column/add'+apiNexfix, // 添加专栏
  optColumnDetail: apiPrefix+'opt/column/detail'+apiNexfix, // 专栏详情
  optColumnEdit: apiPrefix+'opt/column/edit'+apiNexfix, // 编辑专栏
  optColumnDelete: apiPrefix+'opt/column/delete'+apiNexfix, // 删除专栏
  optColumnProductList: apiPrefix+'opt/column/product/list'+apiNexfix, // 栏目商品列表
  optColumnRelation: apiPrefix+'opt/column/relation'+apiNexfix, // 关联专栏商品映射关系

  optCategoryList: apiPrefix+'opt/category/list'+apiNexfix, // 专栏列表
  optCategoryAdd: apiPrefix+'opt/category/add'+apiNexfix, // 添加专栏
  optCategoryDetail: apiPrefix+'opt/category/detail'+apiNexfix, // 专栏详情
  optCategoryEdit: apiPrefix+'opt/category/edit'+apiNexfix, // 编辑专栏
  optCategoryDelete: apiPrefix+'opt/category/delete'+apiNexfix, // 删除专栏
  optCategoryProductList: apiPrefix+'opt/category/product/list'+apiNexfix, // 栏目商品列表
  optCategoryRelation: apiPrefix+'opt/category/relation'+apiNexfix, // 关联专栏商品映射关系

  optBannerList: apiPrefix+'opt/banner/list'+apiNexfix, // 轮播列表
  optBannerAdd: apiPrefix+'opt/banner/add'+apiNexfix, // 添加轮播
  optBannerDetail: apiPrefix+'opt/banner/detail'+apiNexfix, // 专栏详情
  optBannerEdit: apiPrefix+'opt/banner/edit'+apiNexfix, // 编辑轮播
  optBannerDelete: apiPrefix+'opt/banner/delete'+apiNexfix, // 删除轮播
  // 公共
  commonLinkage: apiPrefix+'common/linkage'+apiNexfix, // 分级获取地区
  commonHsmjCategory: apiPrefix+'common/hsmj-category'+apiNexfix, // app 类目的查询
  sellProductUploadfile: apiPrefix+'sell/product/uploadfile'+apiNexfix, // 图片上传
  // 用户区域限制
  managerUserJurisdic: apiPrefix+'manager/user/jurisdic'+apiNexfix, // 查询用户的管辖区域
  managerUserToVenGrantAuth: apiPrefix+'manager/user/toVenGrantAuth'+apiNexfix, // 工厂授权查询
  managerUserVenGrantAuth: apiPrefix+'manager/user/venGrantAuth'+apiNexfix, // 工厂授权编辑
  managerUserPermitSaleArea: apiPrefix+'manager/user/permitSaleArea'+apiNexfix, // 查询用户的可售区域
  // 卖家(工厂)类目接口
  sellCategoryList: apiPrefix+'sell/category/list'+apiNexfix, // 获取卖家指定类目的下级类目
  // 首页
  orderAreaPictureForCen: apiPrefix+'order/areaPictureForCen'+apiNexfix, // 1999区域统计图数据(不统计待付款,手动取消,自动取消,已拒单和已退回的订单)
  orderCurrMonthSalesForCen: apiPrefix+'order/currMonthSalesForCen'+apiNexfix, // 1999首页订单统计(不统计待付款，已取消和自动取消的订单)
  orderAreaDayCen: apiPrefix+'order/everyDaySumForCen'+apiNexfix, // 1999首页近30天每日订单统计(不统计待付款,手动取消,自动取消,已拒单和已退回的订单)
  orderUserTypeSumForCen: apiPrefix+'order/userTypeSumForCen'+apiNexfix, // 1999首页用户类型统计
};
