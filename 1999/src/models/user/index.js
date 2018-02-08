import React from 'react';
import update from 'immutability-helper';
import { setup, getinitstate, resetstate, commonFormTableReducers } from '../../reducers/commonFormTable';
import { fetchTableData, fetchDeleteRow } from '../../reducers/user';

const pagespace = 'user';
const pagepath = '/user';
const columns = [
  '所属系统',
  '公司名称',
  '登录名',
  '姓名',
  '电话号码',
  '所在地',
  '激活状态',
  '创建时间',
  '操作',
  '授权',
];

const initstate = getinitstate({ columntags: columns });

const enumjson = JSON.parse(localStorage.getItem('enum'));

initstate.res.ulid = [{ ulidName: '全部', ulid: '' }];

for (const key in enumjson.identity) {
  if (key) {
    initstate.res.ulid.push({
      ulid: `${key}-ulid`,
      ulidName: enumjson.identity[key],
    });
  }
}

for (const key in enumjson['factory-type']) {
  if (key) {
    initstate.res.ulid.push({
      ulid: `${key}-factoryType`,
      ulidName: enumjson['factory-type'][key],
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
    fetchTableData: (action, { call, put, select }) => fetchTableData(action, { call, put, select }, pagespace),
    fetchDeleteRow: (action, { call, put, select }) => fetchDeleteRow(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath) },

};
