import clone from 'clone';
import update from 'immutability-helper';
import { message, notification } from 'antd';
import { changeDataType, changeListData, treeMenu } from '../utils/handleData';
import request from '../utils/request';

/* 登录 */
export function *fetchLogin(action, { call, put, select }, namespace) {
  const Base64 = action.payload;
  const base64 = new Base64();

  const req = yield select(state => state[namespace].req);
  const creq = clone(req);

  creq.fields.loginPwd.value = base64.encode(creq.fields.loginPwd.value);

  try {
    const { data } = yield call(() => request({ errormsg: '登录失败', ...action }, {}, { body: creq, method: 'POST', Url: iface.login }));

    localStorage.setItem('moduleList', JSON.stringify(treeMenu(data.moduleList)));

    const { data: enumjson } = yield call(() => request({ errormsg: '获取枚举类型失败', ...action }, {}, { body: undefined, method: 'GET', Url: iface.enum }));

    localStorage.setItem('enum', JSON.stringify(enumjson));

    const { data: orderStatus } = yield call(() => request({ errormsg: '获取枚举类型失败', ...action }, {}, { body: undefined, method: 'GET', Url: iface.orderStatus }));

    localStorage.setItem('orderStatus', JSON.stringify(orderStatus));

    location.href = '/';
  } catch (e) {
    let msg = null;
    try {
      msg = JSON.parse(e.message);
    } catch (error) {
      msg = e.message;
    }

    yield put({ type: 'updateLoginError', payload: msg });
  }
}

// 更新登录错误信息
export function updateLoginError(state, action) {
  return update(state, {
    res: {
      loginError: { $set: action.payload },
    },
    set: {
      loginNum: { $set: state.set.loginNum + 1 },
    },
  });
}

/* 退出登录 */
export function *fetchLoginout(action, { call, put, select }, namespace) {
  const { data } = yield call(() => request({ errormsg: '退出登录失败', ...action }, {}, { body: undefined, method: 'POST', Url: iface.loginout }));
  localStorage.clear();
  location.href = '/zh/login';
}

/* 用户列表 */
export function *fetchTableData(action, { call, put, select }, namespace) {
  yield put({ type: 'resetTable' });

  const oreq = yield select(state => state[namespace].req);
  const req = clone(oreq);

  req.page.page = (action.payload && action.payload.page) ? action.payload.page : req.page.page;
  req.page.limit = (action.payload && action.payload.limit) ? action.payload.limit : req.page.limit;

  const ulid = req.formFilters.ulid;
  if (ulid && ulid.value) {
    const ulidArr = ulid.value.split('-');
    req.formFilters[ulidArr[1]] = { value: ulidArr[0] };

    if (ulidArr[1] !== 'ulid') { delete req.formFilters.ulid; }
  }

  const { data, headers } = yield call(() => request({ errormsg: '表格数据请求失败', ...action }, {}, { body: req, method: 'GET', Url: iface.userList }));

  const enumjson = JSON.parse(localStorage.getItem('enum'));

  data.map((item, index) => {
    const newItem = item;
    newItem.systemIdText = enumjson['system-type'][item.systemId];
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

/* 修改用户 */
export function *fetchUserEdit(action, { call, put, select }, namespace) {
  const req = yield select(state => state[namespace].req);
  const { data } = yield call(() => request({ errormsg: '更新失败', ...action }, {}, { body: req, method: 'POST', Url: iface.userEdit }));
  message.success('修改用户成功', 1, () => { window.open('', '_self').close(); });
}

/* 查看用户/员工信息 */
export function *fetchUserToEdit(action, { call, put, select }, namespace) {
  const options = { fields: { userId: { value: action.payload } } };
  const { data } = yield call(() => request({ errormsg: '请求失败', ...action }, {}, { body: options, method: 'GET', Url: iface.userToEdit }));

  const newdata = changeDataType(data, [
    {
      field: 'systemIds',
      target: 'arraynumber2arraystring',
    },
  ]);
  yield put({ type: 'updateFormReq', payload: newdata });
  yield put({ type: 'fetchRoleDistributeRole', payload: { systemId: newdata.systemIds[0], userId: newdata.id } });
}

/* 员工列表 */
export function *fetchEmployeeList(action, { call, put, select }, namespace) {
  yield put({ type: 'resetTable' });

  const req = yield select(state => state[namespace].req);

  req.page.page = (action.payload && action.payload.page) ? action.payload.page : req.page.page;
  req.page.limit = (action.payload && action.payload.limit) ? action.payload.limit : req.page.limit;

  const { data, headers } = yield call(() => request({ errormsg: '表格数据请求失败', ...action }, {}, { body: req, method: 'GET', Url: iface.userEmployeeList }));

  const enumjson = JSON.parse(localStorage.getItem('enum'));

  data.map((item, index) => {
    const newItem = item;
    newItem.systemIdText = enumjson['system-type'][item.systemId];
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

/* 新增员工 */
export function *fetchUserAdd(action, { call, put, select }, namespace) {
  const req = yield select(state => state[namespace].req);
  if (Object.prototype.toString.call(req.fields.districtIds.value) === '[object Array]') {
    req.fields.districtIds.value = req.fields.districtIds.value.map((item, index) => {
      return item.did;
    });
  }
  const { data } = yield call(() => request({ errormsg: '插入失败', ...action }, {}, { body: req, method: 'POST', Url: iface.userAdd }));
  message.success('新增员工成功', 1, () => { window.open('', '_self').close(); });
}

/* 修改员工信息 */
export function *fetchUserEmployeeEdit(action, { call, put, select }, namespace) {
  const req = yield select(state => state[namespace].req);
  if (Object.prototype.toString.call(req.fields.districtIds.value) === '[object Array]') {
    req.fields.districtIds.value = req.fields.districtIds.value.map((item, index) => {
      return item.did;
    });
  }
  const { data } = yield call(() => request({ errormsg: '更新失败', ...action }, {}, { body: req, method: 'POST', Url: iface.userEmployeeEdit }));
  message.success('修改员工信息成功', 1, () => { window.open('', '_self').close(); });
}

/* 修改用户密码 */
export function *fetchUserEditPwd(action, { call, put, select }, namespace) {
  const req = yield select(state => state[namespace].req);
  const set = yield select(state => state[namespace].set);
  console.log(req);
  const options = {
    fields: {
      id: { value: req.fields.id.value },
      newPassword: { value: req.fields.loginPwd.value },
      confirmPassword: { value: req.fields.confirmPwd.value },
      systemId: { value: set.sid },
    },
  };
  const { data } = yield call(() => request({ errormsg: '更新失败', ...action }, {}, { body: options, method: 'POST', Url: iface.userEditPwd }));
  message.success('修改用户密码成功', 1, () => { window.open('', '_self').close(); });
}

/* 修改员工密码 */
export function *fetchUserEmployeeEditPwd(action, { call, put, select }, namespace) {
  const req = yield select(state => state[namespace].req);
  const set = yield select(state => state[namespace].set);
  console.log(req);
  const options = {
    fields: {
      id: { value: req.fields.id.value },
      newPassword: { value: req.fields.loginPwd.value },
      confirmPassword: { value: req.fields.confirmPwd.value },
      systemId: { value: set.sid },
    },
  };
  const { data } = yield call(() => request({ errormsg: '更新失败', ...action }, {}, { body: options, method: 'POST', Url: iface.userEmployeeEditPwd }));
  message.success('修改员工密码成功', 1, () => { window.open('', '_self').close(); });
}

/* 运费模板列表 */
export function *fetchFareList(action, { call, put, select }, namespace) {
  yield put({ type: 'resetTable' });

  const req = { page: { page: 1, limit: 1000 } };
  const { data, headers } = yield call(() => request({ errormsg: '表格数据请求失败', ...action }, {}, { body: req, method: 'POST', Url: iface.fareList }));

  data.map((item, index) => {
    item.itemList.map((ele, i) => {
      const newEle = ele;
      const regionArray = [];

      if (newEle.shippingRegion) {
        JSON.parse(newEle.shippingRegion).map((obj, j) => {
          regionArray.push(obj.name);
          return obj;
        });
      }

      newEle.shippingRegion = (newEle.shippingRegion === '') ? '全国(除指定地区以外)' : regionArray.join('、');
      newEle.chargeType = (item.chargeType === 1) ? '按数量' : '按重量';
      newEle.freeAmount = (item.chargeType === 1) ? `满 ${newEle.freeAmount} 件包邮` : `满 ${newEle.freeAmount} kg包邮`;
      newEle.remark = item.remark;
      newEle.key = newEle.id;
      return newEle;
    });
    return item;
  });

  const newdata = changeListData(data, [
    {
      field: 'modifyTime',
      target: 'timestamp2time',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  ]);

  yield put({ type: 'updateTable', payload: newdata });
  yield put({ type: 'updatePages', payload: headers });
}

/* 工厂授权查询 */
export function *fetchManagerUserToVenGrantAuth(action, { call, put, select }, namespace) {
  const options = { fields: { userId: { value: action.payload } } };
  const { data } = yield call(() => request({ errormsg: '请求失败', ...action }, {}, { body: options, method: 'GET', Url: iface.managerUserToVenGrantAuth }));

  data.id = action.payload;

  yield put({ type: 'updateFormReq', payload: data });
  yield put({ type: 'fetchManagerUserPermitSaleArea', payload: action.payload });
}

/* 工厂授权编辑 */
export function *fetchManagerUserVenGrantAuth(action, { call, put, select }, namespace) {
  const req = yield select(state => state[namespace].req);
  if (Object.prototype.toString.call(req.fields.districtIds.value) === '[object Array]') {
    req.fields.districtIds.value = req.fields.districtIds.value.map((item, index) => {
      return item.did;
    });
  }
  const { data } = yield call(() => request({ errormsg: '更新失败', ...action }, {}, { body: req, method: 'POST', Url: iface.managerUserVenGrantAuth }));
  message.success('修改供应商授权成功', 1, () => { window.open('', '_self').close(); });
}

/* 查询用户的可售区域 */
export function *fetchManagerUserPermitSaleArea(action, { call, put, select }, namespace) {
  const options = { fields: { userId: { value: action.payload } } };

  const { data } = yield call(() => request({ errormsg: '获取用户管辖区域', ...action }, {}, { body: options, method: 'GET', Url: iface.managerUserPermitSaleArea }));

  const newdata = data.map((item, index) => {
    return {
      label: item.label.split('|').reverse().join(' | '),
      value: item.value,
      did: item.did,
    };
  });

  yield put({ type: 'updateFormReq', payload: { districtIds: newdata } });
}
