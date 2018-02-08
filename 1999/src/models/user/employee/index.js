import React from 'react';
import update from 'immutability-helper';
import { setup, getinitstate, resetstate, commonFormTableReducers } from '../../../reducers/commonFormTable';
import { fetchEmployeeList, fetchDeleteRow } from '../../../reducers/user';

const pagespace = 'useremployee';
const pagepath = '/user/employee';
const columns = [
  '所属系统',
  '所属用户',
  '公司名称',
  '登录名',
  '姓名',
  '电话号码',
  '激活状态',
  '创建时间',
  '操作',
];

const initstate = getinitstate({ columntags: columns });

const enumjson = JSON.parse(localStorage.getItem('enum'));

initstate.res.systemId = [{ systemName: '全部', systemId: '' }];

for (const key in enumjson['system-type']) {
  if (key && key !== '3' && key !== '4') {
    initstate.res.systemId.push({
      systemId: key,
      systemName: enumjson['system-type'][key],
    });
  }
}

export default {

  namespace: pagespace,

  state: initstate,

  reducers: {
    resetstate: state => resetstate(state, initstate),
    ...commonFormTableReducers,
  },

  effects: {
    fetchEmployeeList: (action, { call, put, select }) => fetchEmployeeList(action, { call, put, select }, pagespace),
    fetchDeleteRow: (action, { call, put, select }) => fetchDeleteRow(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath, 'fetchEmployeeList') },

};
