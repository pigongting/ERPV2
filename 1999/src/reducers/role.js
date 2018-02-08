import React from 'react';
import update from 'immutability-helper';
import { message, notification, Checkbox } from 'antd';
import { changeDataType, changeListData, treeMenu } from '../utils/handleData';
import request from '../utils/request';

/* 岗位列表 */
export function *fetchTableData(action, { call, put, select }, namespace) {
  yield put({ type: 'resetTable' });

  const req = yield select(state => state[namespace].req);

  req.page.page = (action.payload && action.payload.page) ? action.payload.page : req.page.page;
  req.page.limit = (action.payload && action.payload.limit) ? action.payload.limit : req.page.limit;

  const { data, headers } = yield call(() => request({ errormsg: '表格数据请求失败', ...action }, {}, { body: req, method: 'GET', Url: iface.roleList }));

  const enumjson = JSON.parse(localStorage.getItem('enum'));

  data.map((item, index) => {
    const newItem = item;
    newItem.systemIdText = enumjson['system-type'][item.systemId];
    newItem.roleType = enumjson['role-type'][item.roleType];
    return newItem;
  });

  yield put({ type: 'updateTable', payload: data });
  yield put({ type: 'updatePages', payload: headers });
}

/* 查看岗位信息 */
export function *fetchRoleDetail(action, { call, put, select }, namespace) {
  const { data } = yield call(() => request({ errormsg: '请求失败', ...action }, {}, { body: undefined, method: 'GET', Url: `${iface.roleDetail}?roleId=${action.payload}` }));
  const newdata = changeDataType(data, [
    {
      field: 'sort',
      target: 'number2string',
    },
    {
      field: 'systemId',
      target: 'number2arraystring',
    },
  ]);
  yield put({ type: 'updateFormReq', payload: newdata });
}

/* 新增岗位 */
export function *fetchRoleAdd(action, { call, put, select }, namespace) {
  const req = yield select(state => state[namespace].req);
  const { data } = yield call(() => request({ errormsg: '插入失败', ...action }, {}, { body: req, method: 'POST', Url: iface.roleAdd }));
  message.success('新增岗位成功', 1, () => { window.open('', '_self').close(); });
}

/* 修改岗位信息 */
export function *fetchRoleEdit(action, { call, put, select }, namespace) {
  const req = yield select(state => state[namespace].req);
  const { data } = yield call(() => request({ errormsg: '更新失败', ...action }, {}, { body: req, method: 'POST', Url: iface.roleEdit }));
  message.success('修改岗位信息成功', 1, () => { window.open('', '_self').close(); });
}

/* 公有权限设置 */
export function *fetchRolePublicList(action, { call, put, select }, namespace) {
  try {
    yield put({ type: 'resetTable' });

    const req = yield select(state => state[namespace].req);

    req.page.page = (action.payload && action.payload.page) ? action.payload.page : req.page.page;
    req.page.limit = (action.payload && action.payload.limit) ? action.payload.limit : req.page.limit;

    const { data, headers } = yield call(() => request({ errormsg: '表格数据请求失败', ...action }, {}, { body: req, method: 'GET', Url: iface.rolePublicList }));

    const enumjson = JSON.parse(localStorage.getItem('enum'));

    data.map((item, index) => {
      const newItem = item;
      newItem.systemIdText = enumjson['system-type'][item.systemId];
      newItem.roleType = enumjson['role-type'][item.roleType];
      return newItem;
    });

    yield put({ type: 'updateTable', payload: data });
    yield put({ type: 'updatePages', payload: headers });
  } catch (e) {
    console.log(e);
  }
}

/* 新增公有岗位 */
export function *fetchRolePublicAdd(action, { call, put, select }, namespace) {
  const req = yield select(state => state[namespace].req);
  const { data } = yield call(() => request({ errormsg: '插入失败', ...action }, {}, { body: req, method: 'POST', Url: iface.rolePublicAdd }));
  message.success('新增岗位成功', 1, () => { window.open('', '_self').close(); });
}

/* 修改公有岗位信息 */
export function *fetchRolePublicEdit(action, { call, put, select }, namespace) {
  const req = yield select(state => state[namespace].req);
  const { data } = yield call(() => request({ errormsg: '更新失败', ...action }, {}, { body: req, method: 'POST', Url: iface.rolePublicEdit }));
  message.success('修改岗位信息成功', 1, () => { window.open('', '_self').close(); });
}

/* 默认权限设置 */
export function *fetchRoleDefaultList(action, { call, put, select }, namespace) {
  yield put({ type: 'resetTable' });

  const req = yield select(state => state[namespace].req);

  req.page.page = (action.payload && action.payload.page) ? action.payload.page : req.page.page;
  req.page.limit = (action.payload && action.payload.limit) ? action.payload.limit : req.page.limit;

  const { data, headers } = yield call(() => request({ errormsg: '表格数据请求失败', ...action }, {}, { body: req, method: 'GET', Url: iface.roleDefaultList }));

  const enumjson = JSON.parse(localStorage.getItem('enum'));

  data.map((item, index) => {
    const newItem = item;
    newItem.systemIdText = enumjson['system-type'][item.systemId];
    newItem.roleType = enumjson['role-type'][item.roleType];
    return newItem;
  });

  yield put({ type: 'updateTable', payload: data });
  yield put({ type: 'updatePages', payload: headers });
}

/* 分配角色 */
export function *fetchRoleDistributeRole(action, { call, put, select }, namespace) {
  const options = { fields: {
    systemId: { value: action.payload.systemId },
    userId: { value: action.payload.userId },
  } };
  const { data } = yield call(() => request({ errormsg: '请求失败', ...action }, {}, { body: options, method: 'GET', Url: iface.roleDistributeRole }));
  const roleIds = { roleIds: [] };
  const newdata = data.map((item, index) => {
    if (item.isChoice === true) { roleIds.roleIds.push(item.id); }
    return { label: item.name, value: item.id };
  });
  yield put({ type: 'updateFormReq', payload: roleIds });
  yield put({ type: 'updateRoleDistributeRole', payload: newdata });
}

// 更新分配角色
export function updateRoleDistributeRole(state, action) {
  return update(state, { res: { roleIds: { $set: action.payload } } });
}

/* 删除岗位 */
export function *fetchRoleDelete(action, { call, put, select }, namespace) {
  const options = { fields: { roleId: { value: action.payload.id } } };
  const { data } = yield call(() => request({ errormsg: '删除失败', ...action }, {}, { body: options, method: 'POST', Url: iface.roleDelete }));
  message.success('删除岗位成功', 1);
  yield put({ type: 'handleDeleteData', payload: action.payload });
}

/* 查看设置权限 */
export function *fetchRoleToSetPermission(action, { call, put, select }, namespace) {
  const req = yield select(state => state[namespace].req);
  const set = yield select(state => state[namespace].set);

  req.formFilters.roleId = { value: action.payload };
  req.formFilters.systemId = { value: set.sid };

  const { data } = yield call(() => request({ errormsg: '请求失败', ...action }, {}, { body: req, method: 'GET', Url: iface.roleToSetPermission }));

  if (data.rows && data.rows.length > 0) {
    data.rows.map((item, index) => {
      const newitem = item;
      newitem.key = item.id;
      newitem.permissionChoseArray = [];
      for (let i = 0; i < item.permissionDataArray.length; i++) {
        const ele = item.permissionDataArray[i];
        if (ele && ele.isChoice === true) {
          newitem.permissionChoseArray.push(true);
        } else if (ele && ele.isChoice === false) {
          newitem.permissionChoseArray.push(false);
        } else {
          newitem.permissionChoseArray.push(null);
        }
      }
      return newitem;
    });
  }

  let newtitle = [];
  if (data.title && data.title.length > 0) {
    newtitle = data.title.map((item, index) => {
      return {
        title: item,
        dataIndex: '',
        width: 44,
        render: (text, record, k) => {
          let permissionSet = null;

          switch (record.permissionChoseArray[index]) {
            case true:
              permissionSet = <Checkbox checked onChange={(e) => { action.indispatch({ type: 'updateSetPermission', payload: 'single', event: e, item: record, key: index }); }} />;
              break;
            case false:
              permissionSet = <Checkbox checked={false} onChange={(e) => { action.indispatch({ type: 'updateSetPermission', payload: 'single', event: e, item: record, key: index }); }} />;
              break;
            default:
              break;
          }

          return permissionSet;
        },
      };
    });
  }

  yield put({ type: 'updateTable', payload: data.rows });
  yield put({ type: 'updateTableHeader', payload: newtitle });
}

export function updateTableHeader(state, action) {
  return update(state, { set: { tableHeader: { $set: action.payload } } });
}

export function updateSetPermission(state, action) {
  const oldrows = state.res.rows;
  const newrows = [];

  for (let i = 0; i < oldrows.length; i++) {
    const item = oldrows[i];
    if (action.payload === 'single') {
      if (item.id === action.item.id) {
        item.permissionChoseArray[action.key] = action.event.target.checked;
      }
    } else if (action.payload === 'batch') {
      if (item.id === action.item.id) {
        item.permissionChoseArray = item.permissionChoseArray.map((ele, k) => {
          return (ele === false || ele === true) ? action.event.target.checked : ele;
        });
      }
    } else if (action.payload === 'all') {
      item.permissionChoseArray = item.permissionChoseArray.map((ele, k) => {
        return (ele === false || ele === true) ? action.event.target.checked : ele;
      });
    } else if (action.payload === 'main') {
      if (item.id === action.item.id) {
        item.isChoice = action.event.target.checked;
      }
    }

    newrows.push(item);
  }

  return update(state, { res: { rows: { $set: newrows } } });
}

export function resetSetPermission(state, action) {
  const oldrows = state.res.rows;
  const newrows = [];

  if (oldrows && oldrows.length > 0) {
    for (let k = 0; k < oldrows.length; k++) {
      const item = oldrows[k];
      item.permissionChoseArray = [];
      for (let i = 0; i < item.permissionDataArray.length; i++) {
        const ele = item.permissionDataArray[i];
        if (ele && ele.isChoice === true) {
          item.permissionChoseArray.push(true);
        } else if (ele && ele.isChoice === false) {
          item.permissionChoseArray.push(false);
        } else {
          item.permissionChoseArray.push(null);
        }
      }
      newrows.push(item);
    }
  }

  return update(state, { res: { rows: { $set: newrows } } });
}

export function *fetchRoleSetPermission(action, { call, put, select }, namespace) {
  const oldrows = yield select(state => state[namespace].res.rows);
  const set = yield select(state => state[namespace].set);

  const options = { fields: { roleId: { value: set.id }, systemId: { value: set.sid }, listJsonStr: { value: [] } } };

  for (let s = 0; s < oldrows.length; s++) {
    const sitem = oldrows[s];
    if (sitem.isChoice === true) {
      options.fields.listJsonStr.value.push({
        moduleId: sitem.id,
      });
    } else {
      for (let ss = 0; ss < sitem.permissionChoseArray.length; ss++) {
        const ssitem = sitem.permissionChoseArray[ss];
        const ssdata = sitem.permissionDataArray[ss];
        if (ssitem === true) {
          options.fields.listJsonStr.value.push({
            moduleId: sitem.id,
            permissionId: ssdata.id,
          });
        }
      }
    }
  }
  console.log(options.fields.listJsonStr.value);
  options.fields.listJsonStr.value = JSON.stringify(options.fields.listJsonStr.value);

  const { data } = yield call(() => request({ errormsg: '请求失败', ...action }, {}, { body: options, method: 'POST', Url: iface.roleSetPermission }));
  message.success('修改权限信息成功', 1, () => { window.open('', '_self').close(); });
}
