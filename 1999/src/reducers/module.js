import React from 'react';
import update from 'immutability-helper';
import { message, notification, Modal, Checkbox, Row, Col } from 'antd';
import { changeDataType, changeListData, treeMenu } from '../utils/handleData';
import request from '../utils/request';

/* 模块列表 */
export function *fetchModuleList(action, { call, put, select }, namespace) {
  yield put({ type: 'resetTable' });

  const req = yield select(state => state[namespace].req);

  req.page.page = (action.payload && action.payload.page) ? action.payload.page : req.page.page;
  req.page.limit = (action.payload && action.payload.limit) ? action.payload.limit : req.page.limit;

  const { data, headers } = yield call(() => request({ errormsg: '表格数据请求失败', ...action }, {}, { body: req, method: 'GET', Url: iface.moduleList }));

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

/* 查看模块 */
export function *fetchModuleDetail(action, { call, put, select }, namespace) {
  const { data } = yield call(() => request({ errormsg: '请求失败', ...action }, {}, { body: undefined, method: 'GET', Url: `${iface.moduleDetail}?moduleId=${action.payload}` }));

  const newdata = changeDataType(data, [
    {
      field: 'systemId',
      target: 'number2arraystring',
    },
    {
      field: 'parentId',
      target: 'number2arraystring',
    },
  ]);

  yield put({ type: 'updateFormReq', payload: newdata });
  yield put({ type: 'fetchModuleParentAll', payload: true });
}

/* 新增模块 */
export function *fetchModuleAdd(action, { call, put, select }, namespace) {
  const req = yield select(state => state[namespace].req);
  const { data } = yield call(() => request({ errormsg: '插入失败', ...action }, {}, { body: req, method: 'POST', Url: iface.moduleAdd }));
  message.success('新增模块成功', 1, () => { window.open('', '_self').close(); });
}

/* 修改模块 */
export function *fetchModuleEdit(action, { call, put, select }, namespace) {
  const req = yield select(state => state[namespace].req);
  const { data } = yield call(() => request({ errormsg: '更新失败', ...action }, {}, { body: req, method: 'POST', Url: iface.moduleEdit }));
  message.success('修改模块成功', 1, () => { window.open('', '_self').close(); });
}

/* 上级名称列表 */
export function *fetchModuleParentAll(action, { call, put, select }, namespace) {
  yield put({ type: 'resetTable' });

  const req = yield select(state => state[namespace].req);

  req.fields.systemId = { value: (action.payload === true) ? req.fields.systemId.value : action.payload };

  const { data, headers } = yield call(() => request({ errormsg: '表格数据请求失败', ...action }, {}, { body: req, method: 'GET', Url: iface.moduleParentAll }));

  const newdata = data.map((item, index) => {
    return {
      parentId: `${item.id}`,
      parentName: item.name,
    };
  });

  newdata.unshift({
    parentId: '0',
    parentName: '-- 根节点 --',
  });

  yield put({ type: 'updateModuleParentAll', payload: newdata });
}

// 更新上级名称列表
export function updateModuleParentAll(state, action) {
  return update(state, {
    res: { parentId: { $set: action.payload } },
  });
}

/* 获取设置按钮列表 */
export function *fetchPermissionToSetButton(action, { call, put, select }, namespace) {
  const req = yield select(state => state[namespace].req);
  const options = {
    formFilters: {
      moduleId: {
        value: action.payload.id,
      },
      systemId: {
        value: req.formFilters.systemId.value,
      },
    },
  };
  const { data } = yield call(() => request({ errormsg: '更新失败', ...action }, {}, { body: options, method: 'GET', Url: iface.permissionToSetButton }));

  const alldata = [];
  const choicedata = [];

  data.map((item, index) => {
    alldata.push({
      label: item.name,
      value: item.id,
    });
    if (item.isChoice) {
      choicedata.push(item.id);
    }
    return item;
  });

  action.indispatch({ type: `${namespace}/updateCheckedValue`, payload: choicedata });

  Modal.confirm({
    content: (
      <div className="setButtonBox">
        <Checkbox.Group defaultValue={choicedata} onChange={(checkedValue) => { action.indispatch({ type: `${namespace}/updateCheckedValue`, payload: checkedValue }); }}>
          <Row>{alldata.map((item, index) => <Col key={item.value} span={8}><Checkbox value={item.value}>{item.label}</Checkbox></Col>)}</Row>
        </Checkbox.Group>
      </div>
    ),
    title: '设置按钮',
    iconType: '',
    width: 600,
    onOk: () => { action.indispatch({ type: `${namespace}/fetchModulesetButton`, payload: action.payload }); },
  });
}

// 更新上级名称列表
export function updateCheckedValue(state, action) {
  return update(state, {
    set: { setButtonCheckedValue: { $set: action.payload } },
  });
}

/* 修改设置按钮 */
export function *fetchModulesetButton(action, { call, put, select }, namespace) {
  const set = yield select(state => state[namespace].set);
  const options = {
    fields: {
      moduleId: {
        value: action.payload.id,
      },
      permissionIds: {
        value: set.setButtonCheckedValue,
      },
    },
  };
  const { data } = yield call(() => request({ errormsg: '更新失败', ...action }, {}, { body: options, method: 'POST', Url: iface.modulesetButton }));
  message.success('修改设置按钮成功', 1);
}
