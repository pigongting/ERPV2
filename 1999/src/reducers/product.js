import update from 'immutability-helper';
import { message, notification } from 'antd';
import { changeDataType, changeListData, treeMenu } from '../utils/handleData';
import request from '../utils/request';

/* 商品列表 */
export function *fetchManagerProductList(action, { call, put, select }, namespace) {
  yield put({ type: 'resetTable' });

  const req = yield select(state => state[namespace].req);
  let options = null;

  if (action.other === true) {
    options = action.options;
  } else {
    options = req;
  }

  options.page = options.page || {};
  options.page.page = (action.payload && action.payload.page) ? action.payload.page : options.page.page;
  options.page.limit = (action.payload && action.payload.limit) ? action.payload.limit : options.page.limit;

  const { data, headers } = yield call(() => request({ errormsg: '表格数据请求失败', ...action }, {}, { body: options, method: 'GET', Url: iface.managerProductList }));

  const enumjson = JSON.parse(localStorage.getItem('enum'));

  data.map((item, index) => {
    const newItem = item;
    newItem.onOffStateText = enumjson['product-status'][item.onOffState];
    newItem.verifyState = enumjson['product-verify-status'][item.verifyState];
    return newItem;
  });

  const newdata = changeListData(data, [
    {
      field: 'createTime',
      target: 'timestamp2time',
      format: 'YYYY-MM-DD',
    },
    {
      field: 'rejectedTime',
      target: 'timestamp2time',
      format: 'YYYY-MM-DD',
    },
    {
      field: 'vendorTotalPrice',
      target: 'vendorPrice',
      bit: 2,
      split: '-',
    },
  ]);

  yield put({ type: 'updateTable', payload: newdata });
  yield put({ type: 'updatePages', payload: headers });
}

/* 删除商品 */
export function *fetchManagerProductDelete(action, { call, put, select }, namespace) {
  const options = { fields: { productId: { value: action.payload.id } } };
  const { data } = yield call(() => request({ errormsg: '删除失败', ...action }, {}, { body: options, method: 'POST', Url: iface.managerProductDelete }));
  message.success('删除商品成功', 1);

  // 从表格中删除选中行
  const page = yield select(state => state[namespace].req.page);
  const dataSource = yield select(state => state[namespace].res.rows);
  const newSource = dataSource.filter((item) => {
    return action.payload.key !== item.key;
  });
  yield put({ type: 'updateTable', payload: newSource });
  yield put({
    type: 'updatePages',
    payload: {
      page: page.page,
      limit: page.limit,
      total: page.total - 1,
    },
  });
}

/* 强制下架 */
export function *fetchManagerProductOffline(action, { call, put, select }, namespace) {
  const options = {
    fields: {
      productId: { value: action.payload.id },
      lowReason: { value: action.lowReason },
    },
  };
  const { data } = yield call(() => request({ errormsg: '强制下架失败', ...action }, {}, { body: options, method: 'POST', Url: iface.managerProductOffline }));
  message.success('强制下架商品成功', 1);

  // 修改表格数据
  const enumjson = JSON.parse(localStorage.getItem('enum'));
  const dataSource = yield select(state => state[namespace].res.rows);
  const newSource = dataSource.filter((item) => {
    if (action.payload.key === item.key) {
      item.onOffState = 2;
      item.onOffStateText = enumjson['product-status'][2];
    }
    return item;
  });
  yield put({ type: 'updateTable', payload: newSource });
}

/* 中控审核商品前的详情查询 */
export function *fetchManagerProductVerifyDetail(action, { call, put, select }, namespace) {
  const set = yield select(state => state[namespace].set);
  const options = {
    fields: {
      productId: { value: set.id },
    },
  };
  const { data } = yield call(() => request({ errormsg: '请求失败', ...action }, {}, { body: options, method: 'GET', Url: iface.managerProductVerifyDetail }));

  data.skuList.map((item, index) => {
    item.key = item.id;
    if (data.canNotEditPrice === false) { item.buyPrice = (parseFloat(item.buyPrice)) ? item.buyPrice : item.vendorPrice; }
    return item;
  });

  data.ladderPriceList.map((item, index) => {
    item.key = item.id;
    item.buyPrice = (parseFloat(item.buyPrice)) ? item.buyPrice : item.vendorPrice;
    return item;
  });

  data.isPromotion = data.isPromotion.toString();

  data.hcid = {
    key: (data.categoryHsmj) ? `${data.categoryHsmj.hcid}` : '',
    label: (data.categoryHsmj) ? data.categoryHsmj.path : '',
  };

  yield put({ type: 'updateFormReq', payload: data });
}

/* 中控审核商品 */
export function *fetchManagerProductVerify(action, { call, put, select }, namespace) {
  const msgPrefix = (action.payload === 'pass') ? '审核' : '驳回';
  const req = yield select(state => state[namespace].req);

  if (req.fields.skuList && req.fields.skuList.value) {
    for (let s = 0; s < req.fields.skuList.value.length; s++) {
      const sitem = req.fields.skuList.value[s];
      if (parseFloat(sitem.vendorPrice) > parseFloat(sitem.buyPrice)) {
        message.error(`${sitem.skuDesc}：我连网供货价不能小于出厂价`);
        return;
      }
      if (parseFloat(sitem.buyPrice) > parseFloat(sitem.unifiedPrice)) {
        message.error(`${sitem.skuDesc}：全国统一价不能小于我连网供货价`);
        return;
      }
    }
  }

  const options = {
    fields: {
      productId: req.fields.id,
      verify: { value: (action.payload === 'pass') ? 1 : 2 },
      reason: req.fields.reason,
      hcid: { value: req.fields.hcid.value.key },
      isPromotion: { value: req.fields.isPromotion.value },
      skuInfo: { value: JSON.stringify(req.fields.skuList.value) },
      ladderPriceInfo: { value: JSON.stringify(req.fields.ladderPriceList.value) },
    },
  };
  const { data } = yield call(() => request({ errormsg: `${msgPrefix}失败`, ...action }, {}, { body: options, method: 'POST', Url: iface.managerProductVerify }));
  message.success(`${msgPrefix}成功`, 1, () => { window.open('', '_self').close(); });
}

/* 中控查询商品详情 */
export function *fetchManagerProductDetail(action, { call, put, select }, namespace) {
  const set = yield select(state => state[namespace].set);
  const options = {
    fields: {
      productId: { value: set.id },
    },
  };
  const { data } = yield call(() => request({ errormsg: '中控查询商品详情', ...action }, {}, { body: options, method: 'GET', Url: iface.managerProductDetail }));

  try {
    data.properties = JSON.parse(data.properties);

    // 对象转数组
    const propertiesArr = [];
    for (const key in data.properties) {
      if (data.properties[key][0] !== '') {
        propertiesArr.push({ name: key, value: data.properties[key] });
      }
    }

    // 数组分割
    data.propertiesArr = [];
    for (let i = 0, len = propertiesArr.length; i < len; i += 3) {
      data.propertiesArr.push(propertiesArr.slice(i, i + 3));
    }
  } catch (e) {
    data.properties = {};
  }

  data.mainPicture = data.pictureInfoList[0];

  yield put({ type: 'updateManagerProductDetail', payload: data });
  yield put({ type: 'fetchManagerProductGetFactoryDesc', payload: data.vendorId });
}

/* 更新商品详情 */
export function updateManagerProductDetail(state, action) {
  return update(state, {
    res: { detail: { $set: action.payload } },
  });
}

/* 更新选中属性 */
export function updateChoseProp(state, action) {
  const newDetail = { ...state.res.detail };
  const skumapkey = {};

  newDetail.skuInfoList.map((item, index) => {
    if (item.property === action.payload.property) {
      item.isChose = (item.isChose === action.propvalue) ? false : action.propvalue;
    }

    if (item.isChose) {
      skumapkey[item.property] = item.isChose;
    }

    return item;
  });

  newDetail.skuMapIng = newDetail.skuMap[JSON.stringify(skumapkey)];

  return update(state, {
    res: { detail: { $set: newDetail } },
  });
}

/* 更新主图 */
export function updateMainPicture(state, action) {
  const newDetail = { ...state.res.detail };

  newDetail.mainPicture = action.payload;

  return update(state, {
    res: { detail: { $set: newDetail } },
  });
}

/* 工厂企业信息 */
export function *fetchManagerProductGetFactoryDesc(action, { call, put, select }, namespace) {
  const options = {
    fields: {
      vendorId: { value: action.payload },
    },
  };
  const { data } = yield call(() => request({ errormsg: '工厂企业信息查询失败', ...action }, {}, { body: options, method: 'POST', Url: iface.managerProductGetFactoryDesc }));
  yield put({ type: 'updateManagerProductGetFactoryDesc', payload: data });
}

/* 更新商品详情 */
export function updateManagerProductGetFactoryDesc(state, action) {
  return update(state, {
    res: { factory: { $set: action.payload } },
  });
}
