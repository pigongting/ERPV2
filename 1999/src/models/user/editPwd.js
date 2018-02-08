import update from 'immutability-helper';
import { setup, getinitstate, resetstate, commonFormReducers } from '../../reducers/commonForm';
import { fetchUserEditPwd, fetchUserToEdit } from '../../reducers/user';

const pagespace = 'usereditPwd';
const pagepath = '/user/editPwd';
const viewedrow = 'fetchUserToEdit';

const initstate = getinitstate();

const enumjson = JSON.parse(localStorage.getItem('enum'));

initstate.res.systemIds = [];

for (const key in enumjson['system-type']) {
  if (key) {
    initstate.res.systemIds.push({
      systemIds: key,
      systemName: enumjson['system-type'][key],
    });
  }
}

export default {

  namespace: pagespace,

  state: initstate,

  reducers: {
    resetstate: state => resetstate(state, initstate),
    ...commonFormReducers,
    saveSID: (state, action) => {
      return update(state, { set: { sid: { $set: action.payload } } });
    },
  },

  effects: {
    fetchUserEditPwd: (action, { call, put, select }) => fetchUserEditPwd(action, { call, put, select }, pagespace),
    fetchUserToEdit: (action, { call, put, select }) => fetchUserToEdit(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath, viewedrow, ({ pathname, query }) => {
    dispatch({ type: 'saveSID', payload: query.sid });
  }) },

};
