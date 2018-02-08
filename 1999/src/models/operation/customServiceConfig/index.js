import { setup, getinitstate, resetstate, commonFormReducers } from '../../../reducers/commonForm';
import { fetchOperationCustomServiceConfigList, fetchOperationCustomServiceConfigEdit } from '../../../reducers/operation';

const pagespace = 'operationcustomServiceConfig';
const pagepath = '/operation/customServiceConfig';
const viewedrow = 'fetchOperationCustomServiceConfigList';

const initstate = getinitstate();

export default {

  namespace: pagespace,

  state: initstate,

  reducers: {
    resetstate: state => resetstate(state, initstate),
    ...commonFormReducers,
  },

  effects: {
    fetchOperationCustomServiceConfigList: (action, { call, put, select }) => fetchOperationCustomServiceConfigList(action, { call, put, select }, pagespace),
    fetchOperationCustomServiceConfigEdit: (action, { call, put, select }) => fetchOperationCustomServiceConfigEdit(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath, viewedrow, ({ pathname, query }) => {
    dispatch({ type: `${viewedrow}`, payload: query.id });
    dispatch({ type: 'updateSetMode', payload: 'edit' });
  }) },

};
