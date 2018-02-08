import update from 'immutability-helper';
import { setup, getinitstate, resetstate, commonFormReducers } from '../../reducers/commonForm';
import { fetchCommonLinkage, updateCommonLinkage } from '../../reducers/common';
import { fetchManagerUserVenGrantAuth, fetchManagerUserToVenGrantAuth, fetchManagerUserPermitSaleArea } from '../../reducers/user';

const pagespace = 'uservenGrantAuth';
const pagepath = '/user/venGrantAuth';
const viewedrow = 'fetchManagerUserToVenGrantAuth';

const initstate = getinitstate();

initstate.req.fields.districtIds = { value: undefined };

export default {

  namespace: pagespace,

  state: initstate,

  reducers: {
    resetstate: state => resetstate(state, initstate),
    ...commonFormReducers,
    updateCommonLinkage,
    saveSID: (state, action) => {
      return update(state, { set: { sid: { $set: action.payload } } });
    },
  },

  effects: {
    fetchManagerUserVenGrantAuth: (action, { call, put, select }) => fetchManagerUserVenGrantAuth(action, { call, put, select }, pagespace),
    fetchManagerUserToVenGrantAuth: (action, { call, put, select }) => fetchManagerUserToVenGrantAuth(action, { call, put, select }, pagespace),
    fetchManagerUserPermitSaleArea: (action, { call, put, select }) => fetchManagerUserPermitSaleArea(action, { call, put, select }, pagespace),
    fetchCommonLinkage: (action, { call, put, select }) => fetchCommonLinkage(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath, viewedrow, ({ pathname, query }) => {
    dispatch({ type: 'saveSID', payload: query.sid });
  }) },

};
