import React from 'react';
import update from 'immutability-helper';
import { setup, getinitstate, resetstate, commonFormTableReducers } from '../../reducers/commonFormTable';
import { fetchOrderCenConPagingAbnormalOrders, fetchDeleteRow } from '../../reducers/order';

const pagespace = 'orderabnormal';
const pagepath = '/order/abnormal';
const tablefetch = 'fetchOrderCenConPagingAbnormalOrders';
const columns = [
  '总代理名称',
  '买家订单编号',
  '异常原因',
  '下单时间',
  '收货地址',
  '联系人',
  '联系方式',
  '商品名称',
  '单价',
  '数量',
  '金额',
  '运费',
  '结算金额',
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
    fetchOrderCenConPagingAbnormalOrders: (action, { call, put, select }) => fetchOrderCenConPagingAbnormalOrders(action, { call, put, select }, pagespace),
    fetchDeleteRow: (action, { call, put, select }) => fetchDeleteRow(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath, tablefetch) },

};
