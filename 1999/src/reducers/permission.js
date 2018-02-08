import update from 'immutability-helper';
import { message, notification } from 'antd';
import { changeDataType, changeListData, treeMenu } from '../utils/handleData';
import request from '../utils/request';

/* 权限列表 */
export function *fetchPermissionList(action, { call, put, select }, namespace) {
  yield put({ type: 'resetTable' });

  const req = yield select(state => state[namespace].req);

  req.page.page = (action.payload && action.payload.page) ? action.payload.page : req.page.page;
  req.page.limit = (action.payload && action.payload.limit) ? action.payload.limit : req.page.limit;

  const { data, headers } = yield call(() => request({ errormsg: '表格数据请求失败', ...action }, {}, { body: req, method: 'GET', Url: iface.permissionList }));

  const enumjson = JSON.parse(localStorage.getItem('enum'));

  data.map((item, index) => {
    const newItem = item;
    newItem.systemId = enumjson['system-type'][item.systemId];
    newItem.roleType = enumjson['role-type'][item.roleType];
    return newItem;
  });

  yield put({ type: 'updateTable', payload: data });
  yield put({ type: 'updatePages', payload: headers });
}

/* 新增权限 */
export function *fetchPermissionAdd(action, { call, put, select }, namespace) {
  const req = yield select(state => state[namespace].req);
  const { data } = yield call(() => request({ errormsg: '插入失败', ...action }, {}, { body: req, method: 'POST', Url: iface.permissionAdd }));
  message.success('新增权限成功', 1, () => { window.open('', '_self').close(); });
}

/* 修改权限 */
export function *fetchPermissionEdit(action, { call, put, select }, namespace) {
  const req = yield select(state => state[namespace].req);
  const { data } = yield call(() => request({ errormsg: '更新失败', ...action }, {}, { body: req, method: 'POST', Url: iface.permissionEdit }));
  message.success('修改权限成功', 1, () => { window.open('', '_self').close(); });
}

/* 查看权限 */
export function *fetchPermissionDetail(action, { call, put, select }, namespace) {
  const { data } = yield call(() => request({ errormsg: '请求失败', ...action }, {}, { body: undefined, method: 'GET', Url: `${iface.permissionDetail}?permissionId=${action.payload}` }));

  const newdata = changeDataType(data, [
    {
      field: 'systemId',
      target: 'number2arraystring',
    },
  ]);

  yield put({ type: 'updateFormReq', payload: newdata });
}
