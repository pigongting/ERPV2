import React from 'react';
import update from 'immutability-helper';
import { setup, getinitstate, resetstate, commonFormTableReducers } from '../../reducers/commonFormTable';
import { fetchRoleToSetPermission, updateTableHeader, updateSetPermission, resetSetPermission, fetchRoleSetPermission } from '../../reducers/role';
import { removelocal, getFromMenu } from '../../utils/localpath';

const frommenu = getFromMenu(window.location.search, 'frommenu');
const pagespace = `${frommenu}setPermission`;
const pagepath = '/setPermission';
const tablefetch = 'fetchRoleToSetPermission';
console.log(pagespace);
const initstate = getinitstate({});

initstate.req.page = null;

export default {

  namespace: pagespace,

  state: initstate,

  reducers: {
    resetstate: state => resetstate(state, initstate),
    ...commonFormTableReducers,
    updateTableHeader,
    updateSetPermission,
    resetSetPermission,
    saveSID: (state, action) => {
      return update(state, { set: { sid: { $set: action.payload } } });
    },
  },

  effects: {
    fetchRoleToSetPermission: (action, { call, put, select }) => fetchRoleToSetPermission(action, { call, put, select }, pagespace),
    fetchRoleSetPermission: (action, { call, put, select }) => fetchRoleSetPermission(action, { call, put, select }, pagespace),
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (removelocal(pathname) !== removelocal(`${query.frommenu}${pagepath}`)) {
          dispatch({ type: 'resetstate' });
        } else {
          dispatch({ type: 'saveID', payload: query.id });
          dispatch({ type: 'saveSID', payload: query.sid });
          dispatch({ type: 'fetchRoleToSetPermission', payload: query.id, indispatch: dispatch });
        }
      });
    },
  },

};
