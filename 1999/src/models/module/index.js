import React from 'react';
import update from 'immutability-helper';
import { setup, getinitstate, resetstate, commonFormTableReducers } from '../../reducers/commonFormTable';
import { fetchModuleList, fetchDeleteRow, fetchPermissionToSetButton, fetchModulesetButton, updateCheckedValue } from '../../reducers/module';

const pagespace = 'module';
const pagepath = '/module';
const tablefetch = 'fetchModuleList';
const columns = [
  '模块名称',
  '编码',
  '父级模块',
  '菜单图标',
  '排序',
  '是否菜单',
  '是否启用',
  '操作',
];

const initstate = getinitstate({ columntags: columns });

initstate.req.formFilters = {
  systemId: { value: '0' },
};

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

initstate.res.isMenu = [
  {
    isMenuName: '全部',
    isMenu: '',
  },
  {
    isMenuName: '是',
    isMenu: 'true',
  },
  {
    isMenuName: '否',
    isMenu: 'false',
  },
];

const enumjson = JSON.parse(localStorage.getItem('enum'));

initstate.res.systemId = [];

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
    updateCheckedValue,
  },

  effects: {
    fetchModuleList: (action, { call, put, select }) => fetchModuleList(action, { call, put, select }, pagespace),
    fetchDeleteRow: (action, { call, put, select }) => fetchDeleteRow(action, { call, put, select }, pagespace),
    fetchPermissionToSetButton: (action, { call, put, select }) => fetchPermissionToSetButton(action, { call, put, select }, pagespace),
    fetchModulesetButton: (action, { call, put, select }) => fetchModulesetButton(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath, tablefetch) },

};
