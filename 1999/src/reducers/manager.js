import update from 'immutability-helper';
import { notification } from 'antd';
import { changeDataType, changeListData, treeMenu } from '../utils/handleData';
import request from '../utils/request';

/* 获取用户管辖区域 */
export function *fetchManagerUserJurisdic(action, { call, put, select }, namespace) {
  const options = { fields: {} };

  if (action.payload) { options.fields.userId = { value: action.payload }; }

  const { data } = yield call(() => request({ errormsg: '获取用户管辖区域', ...action }, {}, { body: options, method: 'GET', Url: iface.managerUserJurisdic }));

  const newdata = data.map((item, index) => {
    return {
      label: item.label.split('|').reverse().join(' | '),
      value: item.value,
      did: item.did,
    };
  });

  yield put({ type: 'updateFormReq', payload: { districtIds: newdata } });
}
