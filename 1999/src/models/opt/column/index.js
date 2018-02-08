import React from 'react';
import update from 'immutability-helper';
import { setup, getinitstate, resetstate, commonFormTableReducers } from '../../../reducers/commonFormTable';
import { fetchList, fetchDelete } from '../../../reducers/optColumn';

const pagespace = 'optColumn';
const pagepath = '/opt/column';
const tablefetch = 'fetchList';
const columns = [
  '专栏名称',
  '专栏图片',
  '是否启用',
  '排序',
  '关联商品数量',
  '创建时间',
  '操作',
];

const initstate = getinitstate({ columntags: columns });

initstate.req.formFilters = {
  systemId: { value: '0' },
};

initstate.res.isEnable = [
  {
    isEnableName: '全部',
    isEnable: '',
  },
  {
    isEnableName: '已启用',
    isEnable: 'true',
  },
  {
    isEnableName: '未启用',
    isEnable: 'false',
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
    fetchList: (action, { call, put, select }) => fetchList(action, { call, put, select }, pagespace),
    fetchDelete: (action, { call, put, select }) => fetchDelete(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath, tablefetch) },

};
