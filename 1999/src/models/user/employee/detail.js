import update from 'immutability-helper';
import { setup, getinitstate, resetstate, commonFormReducers } from '../../../reducers/commonForm';
import { fetchUserAdd, fetchUserToEdit, fetchUserEmployeeEdit } from '../../../reducers/user';
import { fetchRoleDistributeRole, updateRoleDistributeRole } from '../../../reducers/role';
import { fetchCommonLinkage, updateCommonLinkage } from '../../../reducers/common';
import { fetchManagerUserJurisdic } from '../../../reducers/manager';

const pagespace = 'useremployeedetail';
const pagepath = '/user/employee/detail';
const viewedrow = 'fetchUserToEdit';

const initstate = getinitstate();

initstate.res.systemIds = [];

const enumjson = JSON.parse(localStorage.getItem('enum'));
if (enumjson !== null) {
  for (const key in enumjson['system-type']) {
    if (key && key !== '3' && key !== '4') {
      initstate.res.systemIds.push({
        systemIds: key,
        systemName: enumjson['system-type'][key],
      });
    }
  }
}

initstate.req.fields.districtIds = { value: undefined };
initstate.req.fields.systemIds = { value: ['0'] };
initstate.req.fields.createBy = { value: 'erpadmin' };

export default {

  namespace: pagespace,

  state: initstate,

  reducers: {
    resetstate: state => resetstate(state, initstate),
    ...commonFormReducers,
    updateRoleDistributeRole,
    updateCommonLinkage,
  },

  effects: {
    fetchUserAdd: (action, { call, put, select }) => fetchUserAdd(action, { call, put, select }, pagespace),
    fetchUserToEdit: (action, { call, put, select }) => fetchUserToEdit(action, { call, put, select }, pagespace),
    fetchUserEmployeeEdit: (action, { call, put, select }) => fetchUserEmployeeEdit(action, { call, put, select }, pagespace),
    fetchRoleDistributeRole: (action, { call, put, select }) => fetchRoleDistributeRole(action, { call, put, select }, pagespace),
    fetchCommonLinkage: (action, { call, put, select }) => fetchCommonLinkage(action, { call, put, select }, pagespace),
    fetchManagerUserJurisdic: (action, { call, put, select }) => fetchManagerUserJurisdic(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath, viewedrow) },

};
