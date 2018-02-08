const Mock = require('mockjs');
const { config } = require('../data/common');

const { apiPrefix } = config;
const classname = 'manager';

module.exports = {
  [`GET ${apiPrefix}/${classname}/product/detail`](req, res) {
    /*
    ManagerProductDetailVo {
      area (string, optional): 卖家所在县区 ,
      canNotBuy (boolean, optional): true 则表示当前用户不可以购买此商品, 将 加入购物车 和 立即购买 按钮置灰即可 ,
      canNotEditPrice (boolean, optional): true 则表示不能编辑商品 sku 的购买价格. 购买价格不再提供编辑功能, 直接显示即可, 不需要给文本框输入 ,
      city (string, optional): 卖家所在市 ,
      contactPhone (string, optional): 卖家电话 ,
      content (string, optional): 商品详情 ,
      fareTemplateId (integer, optional): 关联的运费模板 ,
      freightType (string, optional): 运费类型. 0:卖家承担运费(包邮), 1:使用运费模板, 2:运费到付 = ['0', '1', '2']
      string
      Enum: "0", "1", "2"
      ,
      id (integer, optional): 商品 id ,
      ladderPriceList (Array[ManagerProductLadderPriceDetailVo], optional),
      listPrice (string, optional): 购买价格(我连网供货价) ,
      marketPrice (string, optional): 市场零售价(划掉的价格) ,
      minBuyNum (integer, optional): 最小起订量 ,
      name (string, optional): 商品名 ,
      onOffState (string, optional): 商品状态. 0:下架, 1:上架, 2:强制下架, 3.草稿 = ['0', '1', '2', '3'],
      path (string, optional): 类目路径 ,
      pictureInfoList (Array[string], optional): 商品图片 ,
      priceType (string, optional): 价格类型. 0:普通价格 1:阶梯价格 = ['0', '1'],
      properties (string, optional): 以 json 存储的 spu 信息. 如: { "品牌":["柒牌"], "产地":["浙江"], "图案":["条纹"], "适合人群":["少年","青年","老年"] } ,
      province (string, optional): 卖家所在省 ,
      relationId (integer, optional): 卖家关联的 黄圣美佳(app) id ,
      skuInfoList (Array[ManagerSkuInfoDetailVo], optional): 将 sku 属性整理成在页面上渲染的格式 ,
      skuMap (inline_model_0, optional): 以 sku 描述为 key, sku 信息为 value. key 可能会是 空字符串 ,
      unitName (string, optional): 商品的计量单位(只、个、条) ,
      vendorId (integer, optional): 卖家ID ,
      vendorLogo (string, optional): 卖家 logo ,
      vendorName (string, optional): 卖家显示名 ,
      vendorPrice (string, optional): 工厂结算价(供货价) ,
      verifyState (string, optional): 审核状态. 0:待审核, 1:已审核, 2:驳回 = ['0', '1', '2']
    }
    ManagerProductLadderPriceDetailVo {
      buyPrice (number, optional): 购买价格(买家下单时基于此值) ,
      minNum (integer, optional): 最小购买数量(包含边界) ,
      vendorPrice (number, optional): 工厂设置的供货价(与卖家结算时基于此值)
    }
    ManagerSkuInfoDetailVo {
      property (string, optional): 属性. 如: 颜色 ,
      values (Array[string], optional): 值. 如: 红色, 黑色
    }
    */
    const { query } = req;
    const { did } = query;
    const resdata = [];
    console.log(did);

    res.status(200).json({
      code: 1,
      msg: '中控查询商品详情',
      data: {
        id: 1032,
        canNotEditPrice: false,
        path: '女装>连衣裙',
        name: '华硕(ASUS) 飞行堡垒三代FX60VM GTX1060 15.6英寸游戏笔记本电脑(i7-6700HQ 8G 128GSSD+1T FHD)黑色',
        vendorId: 414,
        vendorName: '电白区能源供应商',
        vendorLogo: '',
        province: '广东省',
        city: '茂名市',
        area: '电白区',
        contactPhone: '15012340100',
        relationId: 1034293423,
        vendorPrice: '1.00-5.00',
        marketPrice: '1.00',
        listPrice: '1.00',
        pictureInfoList: [
          '/erpv2vendor/2018/01/26/e8cc3282-cd2e-43fc-b7d7-e85b158ffcba.jpg',
        ],
        onOffState: 0,
        verifyState: 0,
        priceType: 0,
        freightType: 1,
        fareTemplateId: 98,
        unitName: '件',
        minBuyNum: 1,
        content: '<p>2222</p>',
        properties: '{"产地":["其他",""],"风格":["运动",""],"工艺":["提花",""],"货号":[""],"款式":[""],"品牌":["其他",""],"图案":["其他",""],"上市年份/季节":[""],"腰型":[""],"裙长":[""],"衣门襟":[""],"裙型":[""],"组合形式":[""],"主图来源":["实拍无模特",""],"货源类别":["订货",""],"面料名称":["222222222211111",""],"里料成分":[""],"主面料成分":["猪皮",""],"里料成分含量":["","%"],"主面料成分的含量":["222222222221","%"],"面料3成分的含量":["","%"],"主面料成分2":[""],"面料2成分":[""],"主面料成分2的含量":["","%"],"面料2成分的含量":["","%"],"面料3成分":[""],"主面料产地是否进口":[""]}',
        skuMap: {
          '{"尺码":"XS","颜色":"乳白色"}': {
            id: '2762',
            properties: '{"尺码":"XS","颜色":"乳白色"}',
            skuNo: '3432',
            saleAmount: 2,
            vendorPrice: '1.00',
            suggestPrice: '1.00',
            marketPrice: '1.00',
            unifiedPrice: null,
            buyPrice: null,
          },
        },
        skuInfoList: [
          {
            property: '尺码',
            values: [
              'XS',
              'XL',
              'XLL',
            ],
          },
          {
            property: '颜色',
            values: [
              '乳白色|/erpv2vendor/2018/01/26/b9dc1767-741b-426b-85bf-11d239bb1955.jpg',
              '红色|/erpv2vendor/2018/01/26/b9dc1767-741b-426b-85bf-11d239bb1955.jpg',
            ],
          },
        ],
        ladderPriceList: [],
      },
    });
  },
};
