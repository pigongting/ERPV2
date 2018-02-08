const Mock = require('mockjs');
const { config } = require('../data/common');

const { apiPrefix } = config;
const classname = 'manager';

module.exports = {
  [`GET ${apiPrefix}/order/areaPictureForCen`](req, res) {
    // 1999区域统计图数据(不统计待付款,手动取消,自动取消,已拒单和已退回的订单)
    /*
    province (string, optional): 省 ,
    salesMoney (number, optional): 销售金额
    */
    const { query } = req;
    const { did } = query;
    const resdata = [];
    console.log(did);

    res.status(200).json({
      code: 1,
      msg: '1999区域统计图数据(不统计待付款,手动取消,自动取消,已拒单和已退回的订单)',
      data: [
        {
          province: '山西',
          salesMoney: '70.00',
        },
        {
          province: '江西',
          salesMoney: '0.54',
        },
        {
          province: '河南',
          salesMoney: '0.20',
        },
        {
          province: '湖北',
          salesMoney: '2.00',
        },
        {
          province: '广东',
          salesMoney: '0.16',
        },
        {
          province: '河北',
          salesMoney: '5913.02',
        },
        {
          province: '山西',
          salesMoney: '4931.00',
        },
        {
          province: '内蒙古',
          salesMoney: '266.30',
        },
        {
          province: '黑龙江',
          salesMoney: '413.10',
        },
        {
          province: '浙江',
          salesMoney: '0.30',
        },
        {
          province: '福建',
          salesMoney: '5144.80',
        },
        {
          province: '湖北',
          salesMoney: '3.60',
        },
        {
          province: '湖南',
          salesMoney: '2355.91',
        },
        {
          province: '广东',
          salesMoney: '0.70',
        },
        {
          province: '广西',
          salesMoney: '31007.31',
        },
        {
          province: '重庆',
          salesMoney: '134.22',
        },
        {
          province: '四川',
          salesMoney: '3.85',
        },
      ],
    });
  },
  [`GET ${apiPrefix}/order/currMonthSalesForCen`](req, res) {
    // 1999首页订单统计(不统计待付款，已取消和自动取消的订单)
    /*
    dt (string, optional): 天 ,
    goodsQty (integer, optional): 商品数量 ,
    orderCount (integer, optional): 订单数目 ,
    salesMoney (number, optional): 销售金额
    */
    const { query } = req;
    const { did } = query;
    const resdata = [];
    console.log(did);

    res.status(200).json({
      code: 1,
      msg: '1999首页订单统计(不统计待付款，已取消和自动取消的订单)',
      data: [
        {
          dt: '本月',
          salesMoney: '210858.80',
          orderCount: 41,
        },
      ],
    });
  },
  [`GET ${apiPrefix}/order/everyDaySumForCen`](req, res) {
    // 1999首页近30天每日订单统计(不统计待付款,手动取消,自动取消,已拒单和已退回的订单)
    /*
    dt (string, optional): 天 ,
    goodsQty (integer, optional): 商品数量 ,
    orderCount (integer, optional): 订单数目 ,
    salesMoney (number, optional): 销售金额
    */
    const { query } = req;
    const { did } = query;
    const resdata = [];
    console.log(did);

    res.status(200).json({
      code: 1,
      msg: '1999首页近30天每日订单统计(不统计待付款,手动取消,自动取消,已拒单和已退回的订单)',
      data: [
        {
          dt: '2018-01-11',
          salesMoney: '561.00',
          goodsQty: 7,
          orderCount: 1,
        },
        {
          dt: '2018-01-18',
          salesMoney: '0.02',
          goodsQty: 2,
          orderCount: 1,
        },
        {
          dt: '2018-01-19',
          salesMoney: '0.03',
          goodsQty: 3,
          orderCount: 3,
        },
        {
          dt: '2018-01-20',
          salesMoney: '0.03',
          goodsQty: 3,
          orderCount: 3,
        },
      ],
    });
  },
  [`GET ${apiPrefix}/order/userTypeSumForCen`](req, res) {
    // 1999首页用户类型统计
    /*
    qty (integer, optional): 数量 ,
    userType (string, optional): 用户类型
    */
    const { query } = req;
    const { did } = query;
    const resdata = [];
    console.log(did);

    res.status(200).json({
      code: 1,
      msg: '1999首页用户类型统计',
      data: [
        {
          userType: '未知',
          qty: 14,
        },
        {
          userType: '未知',
          qty: 7,
        },
        {
          userType: '县区代理',
          qty: 351,
        },
        {
          userType: '市代理',
          qty: 5,
        },
        {
          userType: '省分公司',
          qty: 15,
        },
        {
          userType: '农村电商',
          qty: 31,
        },
        {
          userType: '行业代理',
          qty: 49,
        },
        {
          userType: '校园电商',
          qty: 1,
        },
        {
          userType: '商超',
          qty: 2,
        },
        {
          userType: '工厂',
          qty: 155,
        },
        {
          userType: '批发商',
          qty: 1,
        },
      ],
    });
  },
};
