import React from 'react';
import update from 'immutability-helper';
import { setup, getinitstate, resetstate, commonFormTableReducers } from '../../reducers/commonFormTable';
import { fetchPermissionList, fetchDeleteRow } from '../../reducers/permission';

const pagespace = 'permission';
const pagepath = '/permission';
const tablefetch = 'fetchPermissionList';
const columns = [
  '名称',
  '编号',
  '图标',
  '颜色',
  '排序',
  '描述',
  '是否激活',
  '操作',
];

const initstate = getinitstate({ columntags: columns });

initstate.req.formFilters.systemId = { value: '0' };

const enumjson = JSON.parse(localStorage.getItem('enum'));

initstate.res.systemId = [{ systemName: '全部', systemId: '' }];

for (const key in enumjson['system-type']) {
  if (key) {
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
    fetchPermissionList: (action, { call, put, select }) => fetchPermissionList(action, { call, put, select }, pagespace),
    fetchDeleteRow: (action, { call, put, select }) => fetchDeleteRow(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath, tablefetch) },

};
