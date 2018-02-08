import update from 'immutability-helper';
import { notification } from 'antd';
import { changeDataType, changeListData, treeMenu } from '../utils/handleData';
import request from '../utils/request';

/* 分级获取地址 */
export function *fetchCommonLinkage(action, { call, put, select }, namespace) {
  const newdata = [];
  const options = { fields: {} };

  if (action.payload) { options.fields.did = { value: action.payload }; }

  const { data } = yield call(() => request({ errormsg: '分级获取地址失败', ...action }, {}, { body: options, method: 'GET', Url: iface.commonLinkage }));

  for (let s = 0; s < data.length; s++) {
    const sitem = data[s];
    newdata.push({
      title: sitem.name,
      key: `${sitem.did}`,
      fullname: sitem.name,
      fulldid: `${sitem.did}`,
      isLeaf: false,
    });
  }

  yield put({ type: 'updateCommonLinkage', payload: newdata });
}

// 更新分配角色
export function updateCommonLinkage(state, action) {
  return update(state, { res: { area: { $set: action.payload } } });
}

/* 获取 app 类目 */
export function *fetchCommonHsmjCategory(action, { call, put, select }, namespace) {
  const options = {
    page: {
      page: 1,
      limit: 200,
    },
    formFilters: {
      name: { value: action.payload },
    },
  };

  const { data } = yield call(() => request({ errormsg: '获取 app 类目失败', ...action }, { mode: 'stop' }, { body: options, method: 'GET', Url: iface.commonHsmjCategory }));

  const newdata = data.map((item, index) => {
    return {
      hcidName: item.path,
      hcid: item.id,
    };
  });

  yield put({ type: 'updateCommonHsmjCategory', payload: newdata });
}

// 更新 app 类目
export function updateCommonHsmjCategory(state, action) {
  return update(state, { res: { hcid: { $set: action.payload } } });
}
