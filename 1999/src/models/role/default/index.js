import React from 'react';
import update from 'immutability-helper';
import { setup, getinitstate, resetstate, commonFormTableReducers } from '../../../reducers/commonFormTable';
import { fetchRoleDefaultList, fetchDeleteRow } from '../../../reducers/role';

const pagespace = 'roledefault';
const pagepath = '/role/default';
const tablefetch = 'fetchRoleDefaultList';
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

export default {

  namespace: pagespace,

  state: initstate,

  reducers: {
    resetstate: state => resetstate(state, initstate),
    ...commonFormTableReducers,
  },

  effects: {
    fetchRoleDefaultList: (action, { call, put, select }) => fetchRoleDefaultList(action, { call, put, select }, pagespace),
    fetchDeleteRow: (action, { call, put, select }) => fetchDeleteRow(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath, tablefetch) },

};
