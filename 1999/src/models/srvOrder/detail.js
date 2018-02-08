import { setup, getinitstate, resetstate, commonFormReducers } from '../../reducers/commonForm';
import { fetchSrvOrderDetail, fetchSrvOrderLog, updateSrvOrderLog } from '../../reducers/srvOrder';

const pagespace = 'srvOrderdetail';
const pagepath = '/srvOrder/detail';
const viewedrow = 'fetchSrvOrderDetail';

const initstate = getinitstate();

export default {

  namespace: pagespace,

  state: initstate,

  reducers: {
    resetstate: state => resetstate(state, initstate),
    ...commonFormReducers,
    updateSrvOrderLog,
  },

  effects: {
    fetchSrvOrderDetail: (action, { call, put, select }) => fetchSrvOrderDetail(action, { call, put, select }, pagespace),
    fetchSrvOrderLog: (action, { call, put, select }) => fetchSrvOrderLog(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath, viewedrow) },

};
