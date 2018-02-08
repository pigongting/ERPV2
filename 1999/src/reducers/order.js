import moment from 'moment';
import update from 'immutability-helper';
import { message, notification } from 'antd';
import { changeDataType, changeListData, treeMenu } from '../utils/handleData';
import request from '../utils/request';

/* 总代理订单 */
export function *fetchOrderCenConPagingAgency(action, { call, put, select }, namespace) {
  yield put({ type: 'resetTable' });

  const req = yield select(state => state[namespace].req);

  req.page.page = (action.payload && action.payload.page) ? action.payload.page : req.page.page;
  req.page.limit = (action.payload && action.payload.limit) ? action.payload.limit : req.page.limit;

  if (req.formFilters && req.formFilters.createTime && req.formFilters.createTime.value) {
    req.formFilters.st = { value: moment(req.formFilters.createTime.value[0]).format('YYYY-MM-DD') };
    req.formFilters.et = { value: moment(req.formFilters.createTime.value[1]).format('YYYY-MM-DD') };
  }

  const { data, headers } = yield call(() => request({ errormsg: '表格数据请求失败', ...action }, {}, { body: req, method: 'GET', Url: iface.orderCenConPagingAgency }));

  const enumjson = JSON.parse(localStorage.getItem('enum'));
  const orderStatus = JSON.parse(localStorage.getItem('orderStatus'));

  data.map((item, index) => {
    const newItem = item;
    newItem.payType = enumjson['payment-type'][item.payType];
    newItem.orderStateText = orderStatus[item.orderState].order;
    return newItem;
  });

  const newdata = changeListData(data, [
    {
      field: 'createTime',
      target: 'timestamp2time',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    {
      field: 'buyPrice',
      target: 'thousandBit',
      bit: 2,
    },
    {
      field: 'totalPrice',
      target: 'thousandBit',
      bit: 2,
    },
    {
      field: 'freight',
      target: 'thousandBit',
      bit: 2,
    },
    {
      field: 'vendorTotalPrice',
      target: 'thousandBit',
      bit: 2,
    },
  ]);

  yield put({ type: 'updateTable', payload: newdata });
  yield put({ type: 'updatePages', payload: headers });
}

/* 供应商订单 */
export function *fetchOrderCenConPagingSupplier(action, { call, put, select }, namespace) {
  yield put({ type: 'resetTable' });

  const req = yield select(state => state[namespace].req);

  req.page.page = (action.payload && action.payload.page) ? action.payload.page : req.page.page;
  req.page.limit = (action.payload && action.payload.limit) ? action.payload.limit : req.page.limit;

  if (req.formFilters && req.formFilters.createTime && req.formFilters.createTime.value) {
    req.formFilters.st = { value: moment(req.formFilters.createTime.value[0]).format('YYYY-MM-DD') };
    req.formFilters.et = { value: moment(req.formFilters.createTime.value[1]).format('YYYY-MM-DD') };
  }

  const { data, headers } = yield call(() => request({ errormsg: '表格数据请求失败', ...action }, {}, { body: req, method: 'GET', Url: iface.orderCenConPagingSupplier }));

  const orderStatus = JSON.parse(localStorage.getItem('orderStatus'));

  data.map((item, index) => {
    const newItem = item;
    newItem.orderStateText = orderStatus[item.orderState].order;
    newItem.transactionStateText = orderStatus[item.orderState].transaction;
    if (item.isPrepaid === true) {
      newItem.orderStateText += '-已打款';
    }
    return newItem;
  });

  const newdata = changeListData(data, [
    {
      field: 'createTime',
      target: 'timestamp2time',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    {
      field: 'vendorPrice',
      target: 'thousandBit',
      bit: 2,
    },
    {
      field: 'totalPrice',
      target: 'thousandBit',
      bit: 2,
    },
    {
      field: 'freight',
      target: 'thousandBit',
      bit: 2,
    },
    {
      field: 'vendorTotalPrice',
      target: 'thousandBit',
      bit: 2,
    },
  ]);

  yield put({ type: 'updateTable', payload: newdata });
  yield put({ type: 'updatePages', payload: headers });
}

/* 异常订单 */
export function *fetchOrderCenConPagingAbnormalOrders(action, { call, put, select }, namespace) {
  yield put({ type: 'resetTable' });

  const req = yield select(state => state[namespace].req);

  req.page.page = (action.payload && action.payload.page) ? action.payload.page : req.page.page;
  req.page.limit = (action.payload && action.payload.limit) ? action.payload.limit : req.page.limit;

  if (req.formFilters && req.formFilters.createTime && req.formFilters.createTime.value) {
    req.formFilters.st = { value: moment(req.formFilters.createTime.value[0]).format('YYYY-MM-DD') };
    req.formFilters.et = { value: moment(req.formFilters.createTime.value[1]).format('YYYY-MM-DD') };
  }

  const { data, headers } = yield call(() => request({ errormsg: '表格数据请求失败', ...action }, {}, { body: req, method: 'POST', Url: iface.orderCenConPagingAbnormalOrders }));

  const enumjson = JSON.parse(localStorage.getItem('enum'));

  data.map((item, index) => {
    const newItem = item;
    newItem.payType = enumjson['payment-type'][item.payType];
    newItem.orderStatusCode = enumjson['order-state'][item.orderStatusCode];
    return newItem;
  });

  const newdata = changeListData(data, [
    {
      field: 'createTime',
      target: 'timestamp2time',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  ]);

  yield put({ type: 'updateTable', payload: newdata });
  yield put({ type: 'updatePages', payload: headers });
}

/* 总代理订单-退单 */
export function *fetchSellOrderVenRefundMoney(action, { call, put, select }, namespace) {
  const options = {
    fields: {
      orderItemId: { value: action.payload.id },
    },
  };
  const { data } = yield call(() => request({ errormsg: '退单失败', ...action }, {}, { body: options, method: 'POST', Url: iface.sellOrderVenRefundMoney }));
  message.success('商品退单成功', 1);

  // 修改表格数据
  const dataSource = yield select(state => state[namespace].res.rows);
  const newSource = dataSource.filter((item) => {
    if (action.payload.key === item.key) {
      item.orderState = 50;
      item.orderStateText = '已退回';
    }
    return item;
  });
  yield put({ type: 'updateTable', payload: newSource });
}

/* 供应商订单-及时打款 */
export function *fetchOrderCenNowPay(action, { call, put, select }, namespace) {
  const options = {
    fields: {
      orderItemId: { value: action.payload.id },
      verifyCode: { value: action.lowReason },
    },
  };
  const { data } = yield call(() => request({ errormsg: '及时打款失败', ...action }, {}, { body: options, method: 'POST', Url: iface.orderCenNowPay }));
  message.success('及时打款成功', 1);

  // 修改表格数据
  const dataSource = yield select(state => state[namespace].res.rows);
  const newSource = dataSource.filter((item) => {
    if (action.payload.key === item.key) {
      item.orderStateText += '-已打款';
      item.isPrepaid = true;
    }
    return item;
  });
  yield put({ type: 'updateTable', payload: newSource });
}

/* 订单跟踪 */
export function *fetchFareGetOrderTraces(action, { call, put, select }, namespace) {
  const options = {
    fields: {
      shipperId: { value: (action.payload.expressId) ? action.payload.expressId : '' },
      logisticCode: { value: (action.payload.expressNumber) ? action.payload.expressNumber : '' },
    },
  };

  const { data } = yield call(() => request({ errormsg: '订单跟踪查询失败', ...action }, {}, { body: options, method: 'GET', Url: iface.fareGetOrderTraces }));

  // 修改表格数据
  const dataSource = yield select(state => state[namespace].res.rows);
  const newSource = dataSource.filter((item) => {
    if (action.payload.key === item.key) {
      item.fare = {
        ename: action.payload.expressName,
        LogisticCode: action.payload.expressNumber,
        list: JSON.parse(data).Traces || [],
        pos: action.pos,
      };
    }
    return item;
  });
  yield put({ type: 'updateTable', payload: newSource });
}

/* 订单信息 */
export function *fetchSellOrderVenOrderItemByNo(action, { call, put, select }, namespace) {
  const set = yield select(state => state[namespace].set);
  const options = { fields: { orderItemNo: { value: set.id } } };
  const { data } = yield call(() => request({ errormsg: '订单信息查询失败', ...action }, {}, { body: options, method: 'GET', Url: iface.sellOrderVenOrderItemByNo }));

  const orderStatus = JSON.parse(localStorage.getItem('orderStatus'));

  data.orderStateText = orderStatus[data.orderState].order;
  data.transactionStateText = orderStatus[data.orderState].transaction;

  const newdata = changeDataType(data, [
    {
      field: 'freight',
      target: 'thousandBit',
    },
    {
      field: 'vendorPrice',
      target: 'thousandBit',
    },
    {
      field: 'totalPrice',
      target: 'thousandBit',
    },
    {
      field: 'vendorTotalPrice',
      target: 'thousandBit',
    },
  ]);

  yield put({ type: 'updateSellOrderVenOrderItemByNo', payload: newdata });
  yield put({ type: 'fetchOrderBuyerInfoById', payload: data.id });
  yield put({ type: 'fetchOrderBuyerOperateInfoById', payload: data.id });
  yield put({ type: 'fetchOrderBuyerAppraiseInfoById', payload: data.id });
}

export function updateSellOrderVenOrderItemByNo(state, action) {
  return update(state, { res: { orderInfo: { $set: action.payload } } });
}

/* 客户信息 */
export function *fetchOrderBuyerInfoById(action, { call, put, select }, namespace) {
  const options = { fields: { orderItemId: { value: action.payload } } };
  const { data } = yield call(() => request({ errormsg: '客户信息查询失败', ...action }, {}, { body: options, method: 'GET', Url: iface.orderBuyerInfoById }));
  yield put({ type: 'updateOrderBuyerInfoById', payload: data });
}

export function updateOrderBuyerInfoById(state, action) {
  return update(state, { res: { customerInfo: { $set: action.payload } } });
}

/* 订单操作信息 */
export function *fetchOrderBuyerOperateInfoById(action, { call, put, select }, namespace) {
  const options = { fields: { orderItemId: { value: action.payload } } };
  const { data } = yield call(() => request({ errormsg: '订单操作信息查询失败', ...action }, {}, { body: options, method: 'GET', Url: iface.orderBuyerOperateInfoById }));
  yield put({ type: 'updateOrderBuyerOperateInfoById', payload: data });
}

export function updateOrderBuyerOperateInfoById(state, action) {
  return update(state, { res: { operateInfo: { $set: action.payload } } });
}

/* 评价信息 */
export function *fetchOrderBuyerAppraiseInfoById(action, { call, put, select }, namespace) {
  const options = { fields: { orderItemId: { value: action.payload } } };
  const { data } = yield call(() => request({ errormsg: '评价信息查询失败', ...action }, {}, { body: options, method: 'GET', Url: iface.orderBuyerAppraiseInfoById }));
  yield put({ type: 'updateOrderBuyerAppraiseInfoById', payload: data });
}

export function updateOrderBuyerAppraiseInfoById(state, action) {
  return update(state, { res: { commentInfo: { $set: action.payload } } });
}
