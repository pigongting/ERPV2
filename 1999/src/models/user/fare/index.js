import React from 'react';
import update from 'immutability-helper';
import { setup, getinitstate, resetstate, commonFormTableReducers } from '../../../reducers/commonFormTable';
import { fetchFareList } from '../../../reducers/user';

const pagespace = 'userfare';
const pagepath = '/user/fare';
const tablefetch = 'fetchFareList';

const initstate = getinitstate({});

export default {

  namespace: pagespace,

  state: initstate,

  reducers: {
    resetstate: state => resetstate(state, initstate),
    ...commonFormTableReducers,
  },

  effects: {
    fetchFareList: (action, { call, put, select }) => fetchFareList(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath, tablefetch) },

};
