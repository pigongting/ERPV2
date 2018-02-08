import { setup, getinitstate, resetstate, commonFormReducers } from '../../reducers/commonForm';
import { fetchRoleDetail, fetchRoleAdd, fetchRoleEdit } from '../../reducers/role';

const pagespace = 'roledetail';
const pagepath = '/role/detail';
const viewedrow = 'fetchRoleDetail';

const initstate = getinitstate();

export default {

  namespace: pagespace,

  state: initstate,

  reducers: {
    resetstate: state => resetstate(state, initstate),
    ...commonFormReducers,
  },

  effects: {
    fetchRoleAdd: (action, { call, put, select }) => fetchRoleAdd(action, { call, put, select }, pagespace),
    fetchRoleDetail: (action, { call, put, select }) => fetchRoleDetail(action, { call, put, select }, pagespace),
    fetchRoleEdit: (action, { call, put, select }) => fetchRoleEdit(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath, viewedrow) },

};
