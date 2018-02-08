import { setup, getinitstate, resetstate, commonFormReducers } from '../../reducers/commonForm';
import { fetchModuleDetail, fetchModuleAdd, fetchModuleEdit, fetchModuleParentAll, updateModuleParentAll } from '../../reducers/module';

const pagespace = 'moduledetail';
const pagepath = '/module/detail';
const viewedrow = 'fetchModuleDetail';

const initstate = getinitstate();

const enumjson = JSON.parse(localStorage.getItem('enum'));

initstate.req.fields.systemId = { value: ['0'] };
initstate.req.fields.parentId = { value: ['0'], cover: true };

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
    updateModuleParentAll,
  },

  effects: {
    fetchModuleDetail: (action, { call, put, select }) => fetchModuleDetail(action, { call, put, select }, pagespace),
    fetchModuleAdd: (action, { call, put, select }) => fetchModuleAdd(action, { call, put, select }, pagespace),
    fetchModuleEdit: (action, { call, put, select }) => fetchModuleEdit(action, { call, put, select }, pagespace),
    fetchModuleParentAll: (action, { call, put, select }) => fetchModuleParentAll(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath, viewedrow) },

};
