import update from 'immutability-helper';
import { message, notification } from 'antd';
import { changeDataType, changeListData, treeMenu } from '../utils/handleData';
import request from '../utils/request';

/* 客服配置-查看 */
export function *fetchOperationCustomServiceConfigList(action, { call, put, select }, namespace) {
  const options = { fields: { userId: { value: action.payload } } };
  const { data } = yield call(() => request({ errormsg: '请求失败', ...action }, {}, { body: options, method: 'GET', Url: iface.operationCustomServiceConfigList }));

  const newdata = {};
  const dataArray = data.split(',');
  for (let i = 0; i < dataArray.length; i++) { newdata[`csc${(i + 1)}`] = dataArray[i]; }

  yield put({ type: 'updateFormReq', payload: newdata });
}

/* 客服配置-更新 */
export function *fetchOperationCustomServiceConfigEdit(action, { call, put, select }, namespace) {
  const req = yield select(state => state[namespace].req);

  const csc1 = { fields: { phone: { value: `${req.fields.csc1.value}` } } };
  const { data: rcsc1 } = yield call(() => request({ errormsg: '更新失败', ...action }, {}, { body: csc1, method: 'GET', Url: iface.optCustomServiceConfigValidatePhone }));
  if (rcsc1 === false) {
    message.error('客服 1 的手机号不正确');
    return false;
  }

  const csc2 = { fields: { phone: { value: `${req.fields.csc2.value}` } } };
  const { data: rcsc2 } = yield call(() => request({ errormsg: '更新失败', ...action }, {}, { body: csc2, method: 'GET', Url: iface.optCustomServiceConfigValidatePhone }));
  if (rcsc2 === false) {
    message.error('客服 2 的手机号不正确');
    return false;
  }

  const csc3 = { fields: { phone: { value: `${req.fields.csc3.value}` } } };
  const { data: rcsc3 } = yield call(() => request({ errormsg: '更新失败', ...action }, {}, { body: csc3, method: 'GET', Url: iface.optCustomServiceConfigValidatePhone }));
  if (rcsc3 === false) {
    message.error('客服 3 的手机号不正确');
    return false;
  }

  const options = { fields: { value: { value: `${req.fields.csc1.value},${req.fields.csc2.value},${req.fields.csc3.value}` } } };
  const { data } = yield call(() => request({ errormsg: '更新失败', ...action }, {}, { body: options, method: 'POST', Url: iface.operationCustomServiceConfigEdit }));
  message.success('修改用户成功', 1);
}
