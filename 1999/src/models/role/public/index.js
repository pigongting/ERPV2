import React from 'react';
import update from 'immutability-helper';
import { setup, getinitstate, resetstate, commonFormTableReducers } from '../../../reducers/commonFormTable';
import { fetchRolePublicList, fetchDeleteRow, fetchRoleDelete } from '../../../reducers/role';

const pagespace = 'rolepublic';
const pagepath = '/role/public';
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
    fetchRolePublicList: (action, { call, put, select }) => fetchRolePublicList(action, { call, put, select }, pagespace),
    fetchRoleDelete: (action, { call, put, select }) => fetchRoleDelete(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath, 'fetchRolePublicList') },

};
