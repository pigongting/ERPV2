import { setup, getinitstate, resetstate, commonFormReducers } from '../../reducers/commonForm';
import { fetchUserToEdit, fetchUserEdit } from '../../reducers/user';

const pagespace = 'userdetail';
const pagepath = '/user/detail';
const viewedrow = 'fetchUserToEdit';

const initstate = getinitstate();

const enumjson = JSON.parse(localStorage.getItem('enum'));

initstate.res.systemIds = [];

for (const key in enumjson['system-type']) {
  if (key) {
    if (key !== '3' && key !== '4') {
      initstate.res.systemIds.push({
        label: enumjson['system-type'][key],
        value: key,
      });
    }
  }
}

export default {

  namespace: pagespace,

  state: initstate,

  reducers: {
    resetstate: state => resetstate(state, initstate),
    ...commonFormReducers,
  },

  effects: {
    fetchUserToEdit: (action, { call, put, select }) => fetchUserToEdit(action, { call, put, select }, pagespace),
    fetchUserEdit: (action, { call, put, select }) => fetchUserEdit(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath, viewedrow) },

};
