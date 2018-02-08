const Mock = require('mockjs');
const { config } = require('../data/common');

const { apiPrefix } = config;
const classname = 'manager';

module.exports = {
  [`GET ${apiPrefix}/common/aliyun/oss`](req, res) {
    const { query } = req;
    const { did } = query;
    const resdata = [];
    console.log(did);

    res.status(200).json({
      code: 1,
      msg: 'oss',
      data: {
        appKey: 'LTAITcyQT3mb1UVF',
        appSecret: 'E9emtyKEtkfCzQ5ILc20kHJEG1k39M',
        endpoint: 'oss-cn-qingdao.aliyuncs.com',
        bucketName: 'uat-wolianw-goods',
      },
    });
  },
};
