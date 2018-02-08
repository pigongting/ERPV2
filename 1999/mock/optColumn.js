const Mock = require('mockjs');
const { config } = require('../data/common');

const { apiPrefix } = config;
const classname = 'opt';

module.exports = {
  [`POST ${apiPrefix}/${classname}/column/detail`](req, res) {
    res.status(200).json({
      code: 1,
      msg: '',
      data: {
        "id":2,
        "name":"圣诞专场",
        "figureUrl":"http://uat-wolianw-goods.oss-cn-qingdao.aliyuncs.com/Operation/1_1/2_1/3_1/4_1/1/1f413f74-a37f-4265-a098-9f38d0602a1f.png",
        "isEnable":true,
        "isBanner":false,
        "sequence":5,
        "productAmount":13,
        "createTime":1483429621000,
      },
    });
  },
  [`POST ${apiPrefix}/${classname}/column/product/list`](req, res) {
    res.status(200).json({
      code: 1,
      msg: '',
      data: {
        "total":10,
        "list":[
          {
            "id":145,
            "pictureUrl":"Product/1_1/2_1/3_1/4_1/193/c4de3651-326a-4648-a83e-404d375c1a0d",
            "name":"香蕉",
            "listPrice":"5.00",
            "unitName":"箱",
            "onOffState":1
          },
          {
            "id":254,
            "pictureUrl":"Product/1_1/2_1/3_1/4_2/224/128da4a5-6203-4c56-9fd5-9e10f625440d",
            "name":"恒源祥四件套",
            "listPrice":"0.02",
            "unitName":"套",
            "onOffState":1
          },
          {
            "id":260,
            "pictureUrl":"Product/1_1/2_1/3_1/4_2/246/49e58554-7c4b-4d20-9f63-af54ee712d8b",
            "name":"荔枝--平果原",
            "listPrice":"5.00",
            "unitName":"盒",
            "onOffState":1
          },
          {
            "id":261,
            "pictureUrl":"Product/1_1/2_1/3_1/4_2/246/6b24646f-fc72-402d-adfd-7234b1c0cc89",
            "name":"西瓜--平果原",
            "listPrice":"80.00",
            "unitName":"袋",
            "onOffState":2
          },
          {
            "id":262,
            "pictureUrl":"Product/1_1/2_1/3_1/4_2/246/20b303f2-92ad-4152-850f-60c8140089a8",
            "name":"苹果--平果原",
            "listPrice":"80.00",
            "unitName":"箱",
            "onOffState":1
          },
          {
            "id":267,
            "pictureUrl":"Product/1_1/2_1/3_1/4_2/254/f8ff5b7f-1780-4200-b0cb-2e4ebb29ca16",
            "name":"LED灯LUV吸顶灯",
            "listPrice":"155.00",
            "unitName":"个",
            "onOffState":1
          },
          {
            "id":275,
            "pictureUrl":"Product/1_1/2_1/3_1/4_2/249/e493196d-3cd3-4b2c-ab49-4a5e7aa8e0ca",
            "name":"一把遮阳伞--赵农商",
            "listPrice":"18.00",
            "unitName":"个",
            "onOffState":1
          },
          {
            "id":282,
            "pictureUrl":"Product/1_1/2_1/3_1/4_2/246/a1902596-119a-450b-b101-3f0a43ca3e40",
            "name":"一个芒果三块钱",
            "listPrice":"1.53",
            "unitName":"盒",
            "onOffState":0
          },
          {
            "id":283,
            "pictureUrl":"Product/1_1/2_1/3_1/4_2/246/8d6428fa-d14d-4da8-a05f-909cf572557d",
            "name":"一颗荔枝五毛钱",
            "listPrice":"0.20",
            "unitName":"盒",
            "onOffState":0
          },
          {
            "id":425,
            "pictureUrl":"Product/1_1/2_1/3_1/4_2/326/e9fce6c6-0f33-4d4f-bb9a-9531aacefb07.jpg",
            "name":"嘻嘻哈哈一件衬衫",
            "listPrice":"20.00",
            "unitName":"件",
            "onOffState":1
          },
          {
            "id":259,
            "pictureUrl":"Product/1_1/2_1/3_1/4_2/246/e6649ed9-cb43-4ff7-97a1-e45d45e1660e",
            "name":"芒果--平果原",
            "listPrice":"5.00",
            "unitName":"件",
            "onOffState":1
          },
        ],
      },
    });
  },
};
