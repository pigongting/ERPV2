import React from 'react';
import update from 'immutability-helper';
import { setup, getinitstate, resetstate, commonFormTableReducers } from '../../../reducers/commonFormTable';
import { fetchManagerProductList, fetchManagerProductDelete, fetchManagerProductOffline } from '../../../reducers/product';

const pagespace = 'managerproduct';
const pagepath = '/manager/product';
const tablefetch = 'fetchManagerProductList';
const columns = [
  '商品图片',
  '商品名称',
  '价格',
  '供应商',
  '发布时间',
  '审核时间',
  '审核状态',
  '商品状态',
  '审核备注',
  '操作',
];

const initstate = getinitstate({ columntags: columns });

initstate.req.formFilters.asc = { value: '1' };

initstate.res.onOffState = [{ onOffStateName: '全部', onOffState: '' }];
initstate.res.verifyState = [{ verifyStateName: '全部', verifyState: '' }];
initstate.res.businessType = [
  { businessTypeName: '全部', businessType: '' },
  { businessTypeName: '预售', businessType: '1' },
  { businessTypeName: '特价', businessType: '2' },
  { businessTypeName: '常规', businessType: '3' },
];
initstate.res.order = [
  { orderName: '全部', order: '' },
  { orderName: '发布时间', order: '1' },
  { orderName: '审核时间', order: '2' },
];
initstate.res.asc = [
  { label: '降序', value: '1' },
  { label: '升序', value: '2' },
];

const enumjson = JSON.parse(localStorage.getItem('enum'));
if (enumjson) {
  for (const key in enumjson['product-status']) {
    if (key) {
      initstate.res.onOffState.push({
        onOffState: key,
        onOffStateName: enumjson['product-status'][key],
      });
    }
  }
  for (const key in enumjson['product-verify-status']) {
    if (key) {
      initstate.res.verifyState.push({
        verifyState: key,
        verifyStateName: enumjson['product-verify-status'][key],
      });
    }
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
    fetchManagerProductList: (action, { call, put, select }) => fetchManagerProductList(action, { call, put, select }, pagespace),
    fetchManagerProductDelete: (action, { call, put, select }) => fetchManagerProductDelete(action, { call, put, select }, pagespace),
    fetchManagerProductOffline: (action, { call, put, select }) => fetchManagerProductOffline(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath, tablefetch) },

};
