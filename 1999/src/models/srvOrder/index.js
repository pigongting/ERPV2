import React from 'react';
import update from 'immutability-helper';
import { setup, getinitstate, resetstate, commonFormTableReducers } from '../../reducers/commonFormTable';
import { fetchSrvOrderList, fetchDeleteRow } from '../../reducers/srvOrder';
import { fetchFareGetOrderTraces } from '../../reducers/order';

const pagespace = 'srvOrder';
const pagepath = '/srvOrder';
const tablefetch = 'fetchSrvOrderList';
const columns = [
  '退货单日期',
  '总代理名称',
  '供应商名称',
  '退货状态',
  '退货单编号',
  '源单编号',
  '源单日期',
  '商品名称',
  '商品规格',
  '数量',
  '我连网供货价',
  '出厂价',
  '损耗费',
  '收款金额',
  '我连网退款金额',
  '工厂退货金额',
];

const initstate = getinitstate({ columntags: columns });

const enumjson = JSON.parse(localStorage.getItem('enum'));

initstate.res.backState = [
  {
    backStateName: '全部',
    backState: '',
  },
  {
    backState: '18',
    backStateName: '等待卖家同意',
  },
  {
    backState: '19',
    backStateName: '等待买家退货',
  },
  {
    backState: '20',
    backStateName: '等待卖家收货',
  },
  {
    backState: '22',
    backStateName: '退款成功',
  },
  {
    backState: '23',
    backStateName: '卖家已拒单',
  },
  {
    backState: '16',
    backStateName: '已取消',
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
    fetchSrvOrderList: (action, { call, put, select }) => fetchSrvOrderList(action, { call, put, select }, pagespace),
    fetchDeleteRow: (action, { call, put, select }) => fetchDeleteRow(action, { call, put, select }, pagespace),
    fetchFareGetOrderTraces: (action, { call, put, select }) => fetchFareGetOrderTraces(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath, tablefetch) },

};
