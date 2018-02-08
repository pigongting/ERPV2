import moment from 'moment';
import update from 'immutability-helper';
import { notification } from 'antd';
import { changeDataType, changeListData, treeMenu } from '../utils/handleData';
import request from '../utils/request';

/* 退货列表 */
export function *fetchSrvOrderList(action, { call, put, select }, namespace) {
  yield put({ type: 'resetTable' });

  const req = yield select(state => state[namespace].req);

  req.page.page = (action.payload && action.payload.page) ? action.payload.page : req.page.page;
  req.page.limit = (action.payload && action.payload.limit) ? action.payload.limit : req.page.limit;

  if (req.formFilters && req.formFilters.createTime && req.formFilters.createTime.value) {
    req.formFilters.createTimeStart = { value: moment(req.formFilters.createTime.value[0]).format('YYYY-MM-DD') };
    req.formFilters.createTimeEnd = { value: moment(req.formFilters.createTime.value[1]).format('YYYY-MM-DD') };
  }

  const { data, headers } = yield call(() => request({ errormsg: '表格数据请求失败', ...action }, {}, { body: req, method: 'GET', Url: iface.srvOrderList }));

  const enumjson = JSON.parse(localStorage.getItem('enum'));

  data.map((item, index) => {
    const newItem = item;
    newItem.backState = enumjson['back-state'][item.backState];
    return newItem;
  });

  const newdata = changeListData(data, [
    {
      field: 'createTime',
      target: 'timestamp2time',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    {
      field: 'purchaseTime',
      target: 'timestamp2time',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    {
      field: 'unitPrice',
      target: 'thousandBit',
      bit: 2,
    },
    {
      field: 'venPrice',
      target: 'thousandBit',
      bit: 2,
    },
    {
      field: 'lossCost',
      target: 'thousandBit',
      bit: 2,
    },
    {
      field: 'totalPrice',
      target: 'thousandBit',
      bit: 2,
    },
    {
      field: 'wlTotalPrice',
      target: 'thousandBit',
      bit: 2,
    },
    {
      field: 'venTotalPrice',
      target: 'thousandBit',
      bit: 2,
    },
  ]);

  yield put({ type: 'updateTable', payload: newdata });
  yield put({ type: 'updatePages', payload: headers });
}

/* 总代理售后详情 */
export function *fetchSrvOrderDetail(action, { call, put, select }, namespace) {
  const id = yield select(state => state[namespace].set.id);
  const { data } = yield call(() => request({ errormsg: '请求失败', ...action }, {}, { body: undefined, method: 'GET', Url: `${iface.srvOrderDetail}?srvOrderId=${id}` }));

  const enumjson = JSON.parse(localStorage.getItem('enum'));
  data.backStateText = (data.backState === null) ? null : enumjson['back-state'][data.backState];
  data.goodsReasonCode = enumjson['return-reason'][data.goodsReasonCode];

  const newdata = changeDataType(data, [
    {
      field: 'totalPrice',
      target: 'thousandBit',
    },
    {
      field: 'modifyTime',
      target: 'time2moment',
    },
    {
      field: 'purchaseTime',
      target: 'time2moment',
    },
  ]);

  yield put({ type: 'updateFormReq', payload: newdata });
}

/* 售后记录 */
export function *fetchSrvOrderLog(action, { call, put, select }, namespace) {
  const passId = yield select(state => state[namespace].set.id);
  const options = { fields: { id: { value: passId } } };
  const { data } = yield call(() => request({ errormsg: '请求失败', ...action }, {}, { body: options, method: 'GET', Url: iface.srvOrderLog }));

  const enumjson = JSON.parse(localStorage.getItem('enum'));

  data.map((item, index) => {
    const newItem = item;
    newItem.backState = enumjson['back-state'][item.backState];
    return newItem;
  });

  const newdata = changeListData(data, [
    {
      field: 'createTime',
      target: 'timestamp2time',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  ]);
  yield put({ type: 'updateSrvOrderLog', payload: newdata });
}

// 更新售后记录
export function updateSrvOrderLog(state, action) {
  return update(state, { res: { srvOrderLog: { $set: action.payload } } });
}
