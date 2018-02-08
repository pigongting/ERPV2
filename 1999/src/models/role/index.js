import React from 'react';
import update from 'immutability-helper';
import { setup, getinitstate, resetstate, commonFormTableReducers } from '../../reducers/commonFormTable';
import { fetchTableData, fetchDeleteRow, fetchRoleDelete } from '../../reducers/role';

const pagespace = 'role';
const pagepath = '/role';
const columns = [
  '岗位名称',
  '岗位描述',
  '排序',
  '激活状态',
  '所属系统',
  '岗位类型',
  '操作',
];

const initstate = getinitstate({ columntags: columns });

initstate.res.enabled = [
  {
    enabledName: '全部',
    enabled: '',
  },
  {
    enabledName: '已激活',
    enabled: 'true',
  },
  {
    enabledName: '未激活',
    enabled: 'false',
  },
];

export default {

  namespace: pagespace,

  state: initstate,

  reducers: {
    resetstate: state => resetstate(state, initstate),
    ...commonFormTableReducers,
  },

  effects: {
    fetchTableData: (action, { call, put, select }) => fetchTableData(action, { call, put, select }, pagespace),
    fetchRoleDelete: (action, { call, put, select }) => fetchRoleDelete(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath) },

};
