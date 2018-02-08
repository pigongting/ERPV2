import { setup, getinitstate, resetstate, commonFormReducers } from '../../../reducers/commonForm';
import { fetchRoleDetail, fetchRolePublicAdd, fetchRolePublicEdit } from '../../../reducers/role';

const pagespace = 'rolepublicdetail';
const pagepath = '/role/public/detail';
const viewedrow = 'fetchRoleDetail';

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
    fetchRolePublicAdd: (action, { call, put, select }) => fetchRolePublicAdd(action, { call, put, select }, pagespace),
    fetchRoleDetail: (action, { call, put, select }) => fetchRoleDetail(action, { call, put, select }, pagespace),
    fetchRolePublicEdit: (action, { call, put, select }) => fetchRolePublicEdit(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath, viewedrow) },

};
