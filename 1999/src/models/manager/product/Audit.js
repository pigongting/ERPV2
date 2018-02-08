import { setup, getinitstate, resetstate, commonFormReducers } from '../../../reducers/commonForm';
import { fetchManagerProductVerifyDetail, fetchManagerProductVerify } from '../../../reducers/product';
import { fetchCommonHsmjCategory, updateCommonHsmjCategory } from '../../../reducers/common';

const pagespace = 'managerproductaudit';
const pagepath = '/manager/product/audit';
const viewedrow = 'fetchManagerProductVerifyDetail';

const initstate = getinitstate();

initstate.req.fields.reason = { value: undefined };
initstate.req.fields.flag = { value: 'false' };
initstate.req.fields.hcid = { value: { key: '', label: '' } };

export default {

  namespace: pagespace,

  state: initstate,

  reducers: {
    resetstate: state => resetstate(state, initstate),
    ...commonFormReducers,
    updateCommonHsmjCategory,
  },

  effects: {
    fetchManagerProductVerifyDetail: (action, { call, put, select }) => fetchManagerProductVerifyDetail(action, { call, put, select }, pagespace),
    fetchManagerProductVerify: (action, { call, put, select }) => fetchManagerProductVerify(action, { call, put, select }, pagespace),
    fetchCommonHsmjCategory: (action, { call, put, select }) => fetchCommonHsmjCategory(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath, viewedrow) },

};
