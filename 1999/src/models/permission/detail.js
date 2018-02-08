import { setup, getinitstate, resetstate, commonFormReducers } from '../../reducers/commonForm';
import { fetchPermissionDetail, fetchPermissionAdd, fetchPermissionEdit } from '../../reducers/permission';

const pagespace = 'permissiondetail';
const pagepath = '/permission/detail';
const viewedrow = 'fetchPermissionDetail';

const initstate = getinitstate();

const enumjson = JSON.parse(localStorage.getItem('enum'));

initstate.res.systemId = [];

for (const key in enumjson['system-type']) {
  if (key) {
    initstate.res.systemId.push({
      systemId: key,
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
  },

  effects: {
    fetchPermissionDetail: (action, { call, put, select }) => fetchPermissionDetail(action, { call, put, select }, pagespace),
    fetchPermissionAdd: (action, { call, put, select }) => fetchPermissionAdd(action, { call, put, select }, pagespace),
    fetchPermissionEdit: (action, { call, put, select }) => fetchPermissionEdit(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath, viewedrow) },

};
