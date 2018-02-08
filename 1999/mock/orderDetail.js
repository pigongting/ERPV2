const Mock = require('mockjs');
const { config } = require('../data/common');

const { apiPrefix } = config;
const classname = 'manager';

module.exports = {
  [`GET ${apiPrefix}/sell/order/venOrderItemByNo`](req, res) {
    const { query } = req;
    const { did } = query;
    const resdata = [];
    console.log(did);

    res.status(200).json({
      code: 1,
      msg: '中控查询商品详情',
      data: {
        id: 1938,
        createTime: 1504935430000,
        orderItemNo: 'D170909133706149801',
        orderState: 35,
        expectedDeliveryTime: 1504886400000,
        remark: '',
        skuNo: '0',
        productName: '越南红心火龙果',
        productImageUrl: 'Product/1_1/2_1/3_1/4_2/246/81abc4ac-b586-4987-9c2f-a7420ed3bfe1',
        skuDesc: '包装规格:散装',
        number: 1,
        unit: '件',
        freight: '0.00',
        vendorPrice: '1.00',
        totalPrice: '1.00',
        vendorTotalPrice: '1.00',
      },
    });
  },
  [`GET ${apiPrefix}/order/buyerInfoById`](req, res) {
    const { query } = req;
    const { did } = query;
    const resdata = [];
    console.log(did);

    res.status(200).json({
      code: 1,
      msg: '中控查询商品详情',
      data: {
        id: 1938,
        orderItemNo: 'D170909133706149801',
        buyerName: '水果商行',
        province: '广东省',
        city: '中山市',
        area: '火炬开发区街道',
        contact: '火炬',
        phone: '15022228602',
        address: '火炬',
        expressCompany: '申通E物流',
        expressNo: '1231312313',
      },
    });
  },
  [`GET ${apiPrefix}/order/buyerOperateInfoById`](req, res) {
    const { query } = req;
    const { did } = query;
    const resdata = [];
    console.log(did);

    res.status(200).json({
      code: 1,
      msg: '中控查询商品详情',
      data: {
        id: 1938,
        orderItemNo: 'D170909133706149801',
        buyerName: '水果商行',
        sellerName: '平果公司',
        confirmTime: 1504935718000,
        sendName: '平果公司',
        sendTime: 1504935783000,
        refuseName: '平果公司',
        refuseTime: null,
        buyer: null,
        receiveTime: 1505014129000,
      },
    });
  },
  [`GET ${apiPrefix}/order/buyerAppraiseInfoById`](req, res) {
    const { query } = req;
    const { did } = query;
    const resdata = [];
    console.log(did);

    res.status(200).json({
      code: 1,
      msg: '中控查询商品详情',
      data: {
        id: 436,
        orderItemNo: 'D170909133706149801',
        complexSatisfaction: '5',
        comments: '好评',
        operateBy: null,
        operateTime: 1505035725000,
      },
    });
  },
};
