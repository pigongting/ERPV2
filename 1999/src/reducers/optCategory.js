import React from 'react';
import update from 'immutability-helper';
import { message, notification, Modal, Checkbox, Row, Col } from 'antd';
import { changeDataType, changeListData, treeMenu } from '../utils/handleData';
import request from '../utils/request';

/* 专栏列表 */
export function *fetchList(action, { call, put, select }, namespace) {
  yield put({ type: 'resetTable' });

  const req = yield select(state => state[namespace].req);

  req.page.page = (action.payload && action.payload.page) ? action.payload.page : req.page.page;
  req.page.limit = (action.payload && action.payload.limit) ? action.payload.limit : req.page.limit;

  const { data, headers } = yield call(() => request({ errormsg: '表格数据请求失败', ...action }, {}, { body: req, method: 'GET', Url: iface.optCategoryList }));

  const enumjson = JSON.parse(localStorage.getItem('enum'));

  data.map((item, index) => {
    const newItem = item;
    newItem.systemId = enumjson['system-type'][item.systemId];
    newItem.roleType = enumjson['role-type'][item.roleType];
    return newItem;
  });

  const newdata = changeListData(data, [
    {
      field: 'createTime',
      target: 'timestamp2time',
      format: 'YYYY-MM-DD',
    },
  ]);

  yield put({ type: 'updateTable', payload: newdata });
  yield put({ type: 'updatePages', payload: headers });
}

/* 查看专栏 */
export function *fetchDetail(action, { call, put, select }, namespace) {
  const { data } = yield call(() => request({ errormsg: '请求失败', ...action }, {}, { body: undefined, method: 'GET', Url: `${iface.optCategoryDetail}?id=${action.payload}` }));
  const newdata = changeDataType(data, [
    {
      field: 'createTime',
      target: 'time2moment',
    },
    {
      field: 'sequence',
      target: 'number2string',
    },
  ]);
  yield put({ type: 'updateFormReq', payload: data });
}

/* 新增专栏 */
export function *fetchAdd(action, { call, put, select }, namespace) {
  const req = yield select(state => state[namespace].req);
  if (req.fields.figureUrl && req.fields.figureUrl.value) {
    if (req.fields.figureUrl.value.file) {
      req.fields.figureUrl.value = req.fields.figureUrl.value.file.response.data;
    }
  }
  const { data } = yield call(() => request({ errormsg: '插入失败', ...action }, {}, { body: req, method: 'POST', Url: iface.optCategoryAdd }));
  message.success('新增专栏成功', 1, () => { window.open('', '_self').close(); });
}

/* 修改专栏 */
export function *fetchEdit(action, { call, put, select }, namespace) {
  const req = yield select(state => state[namespace].req);
  if (req.fields.figureUrl && req.fields.figureUrl.value) {
    if (req.fields.figureUrl.value.file) {
      req.fields.figureUrl.value = req.fields.figureUrl.value.file.response.data;
    }
  }
  const { data } = yield call(() => request({ errormsg: '更新失败', ...action }, {}, { body: req, method: 'POST', Url: iface.optCategoryEdit }));
  message.success('修改专栏成功', 1, () => { window.open('', '_self').close(); });
}

/* 删除专栏 */
export function *fetchDelete(action, { call, put, select }, namespace) {
  const options = { fields: { id: { value: action.payload.id } } };
  const { data } = yield call(() => request({ errormsg: '删除失败', ...action }, {}, { body: options, method: 'POST', Url: iface.optCategoryDelete }));
  message.success('删除专栏成功', 1);
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

/* 栏目商品列表 */
export function *fetchOptCategoryProductList(action, { call, put, select }, namespace) {
  const set = yield select(state => state[namespace].set);
  const options = {
    fields: { id: { value: set.id } },
    page: { page: 1, limit: 1000 },
  };

  const { data } = yield call(() => request({ errormsg: '请求失败', ...action }, {}, { body: options, method: 'GET', Url: iface.optCategoryProductList }));

  let dataArr = [];

  if (data) {
    dataArr = data.map((item) => {
      return item.id;
    });
  }

  yield put({ type: 'updateFormReq', payload: { productIds: data || [], choseArr: dataArr } });
}

/* 关联专栏商品映射关系 */
export function *fetchOptCategoryRelation(action, { call, put, select }, namespace) {
  const { fields } = yield select(state => state[namespace].req);
  const { id, choseArr } = fields;

  const options = {
    fields: {
      id: { value: id.value },
      productIds: { value: choseArr.value },
    },
  };

  const { data } = yield call(() => request({ errormsg: '关联专栏商品失败', ...action }, {}, { body: options, method: 'POST', Url: iface.optCategoryRelation }));
  message.success('关联专栏商品成功', 1, () => { window.open('', '_self').close(); });
}
