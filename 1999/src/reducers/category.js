import update from 'immutability-helper';
import { notification } from 'antd';
import { changeDataType, changeListData, treeMenu } from '../utils/handleData';
import request from '../utils/request';

/* 获取卖家指定类目的下级类目 */
export function *fetchSellCategoryList(action, { call, put, select }, namespace) {
  const res = yield select(state => state[namespace].res);

  const options = { fields: {} };

  if (action.payload) {
    options.fields.cid = { value: action.payload.value };
    action.payload.loading = true;
  }

  const { data } = yield call(() => request({ errormsg: '获取类目', ...action }, {}, { body: options, method: 'GET', Url: iface.sellCategoryList }));

  const newdata = data.map((item, index) => {
    return {
      value: item.id,
      label: item.name,
      path: item.path,
      isLeaf: false,
    };
  });

  let category = res.category;

  if (action.payload) {
    if (newdata.length > 0) {
      action.payload.children = newdata;
    } else {
      action.payload.children = false;
      action.payload.isLeaf = true;
    }
    action.payload.loading = false;
  } else {
    category = newdata;
  }

  yield put({ type: 'updateSellCategoryList', payload: [...category] });
}

// 更新卖家指定类目的下级类目
export function updateSellCategoryList(state, action) {
  return update(state, { res: { category: { $set: action.payload } } });
}
