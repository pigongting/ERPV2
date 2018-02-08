import { setup, getinitstate, resetstate, commonFormReducers } from '../../../reducers/commonForm';
import { fetchDetail, fetchAdd, fetchEdit } from '../../../reducers/optCategory';

const pagespace = 'optCategoryDetail';
const pagepath = '/opt/category/detail';
const viewedrow = 'fetchDetail';

const initstate = getinitstate();

const enumjson = JSON.parse(localStorage.getItem('enum'));


export default {

  namespace: pagespace,

  state: initstate,

  reducers: {
    resetstate: state => resetstate(state, initstate),
    ...commonFormReducers,
  },

  effects: {
    fetchDetail: (action, { call, put, select }) => fetchDetail(action, { call, put, select }, pagespace),
    fetchAdd: (action, { call, put, select }) => fetchAdd(action, { call, put, select }, pagespace),
    fetchEdit: (action, { call, put, select }) => fetchEdit(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath, viewedrow) },

};
