import React from 'react';
import update from 'immutability-helper';
import { setup, getinitstate, resetstate, commonFormTableReducers } from '../../../reducers/commonFormTable';
import { fetchOrderCenConPagingAgency, fetchSellOrderVenRefundMoney, fetchFareGetOrderTraces } from '../../../reducers/order';

const pagespace = 'orderdis';
const pagepath = '/order/dis';
const tablefetch = 'fetchOrderCenConPagingAgency';
const columns = [
  '总代理名称',
  '订单编号',
  '订单状态',
  '支付方式',
  '下单时间',
  '收货地址',
  '联系人',
  '联系电话',
  '商品名称',
  '单价',
  '数量',
  '金额',
  '运费',
  '结算金额',
  '操作',
];

const initstate = getinitstate({ columntags: columns });

const enumjson = JSON.parse(localStorage.getItem('enum'));

initstate.res.payType = [{ payTypeName: '全部', payType: '' }];

for (const key in enumjson['payment-type']) {
  if (key) {
    initstate.res.payType.push({
      payType: key,
      payTypeName: enumjson['payment-type'][key],
    });
  }
}

initstate.res.orderStatus = [
  {
    orderStatus: '15',
    orderStatusName: '待接单',
  },
  {
    orderStatus: '20',
    orderStatusName: '待发货',
  },
  {
    orderStatus: '25',
    orderStatusName: '待收货',
  },
  {
    orderStatus: '30',
    orderStatusName: '待评价',
  },
  {
    orderStatus: '35,40',
    orderStatusName: '已完成',
  },
  {
    orderStatus: '45,55',
    orderStatusName: '已退回',
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
    fetchOrderCenConPagingAgency: (action, { call, put, select }) => fetchOrderCenConPagingAgency(action, { call, put, select }, pagespace),
    fetchSellOrderVenRefundMoney: (action, { call, put, select }) => fetchSellOrderVenRefundMoney(action, { call, put, select }, pagespace),
    fetchFareGetOrderTraces: (action, { call, put, select }) => fetchFareGetOrderTraces(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath, tablefetch) },

};
