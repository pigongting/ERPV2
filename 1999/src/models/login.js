import { setup, getinitstate, resetstate, commonFormReducers } from '../reducers/commonForm';
import { fetchLogin, updateLoginError } from '../reducers/user';

const pagespace = 'login';
const pagepath = '/login';

const initstate = getinitstate();

initstate.set.loginNum = 0;

initstate.req.fields = {
  loginName: {
    value: '',
  },
  loginPwd: {
    value: '',
  },
  validateCode: {
    value: '',
  },
  systemId: {
    value: 0,
  },
};

export default {

  namespace: pagespace,

  state: initstate,

  reducers: {
    resetstate: state => resetstate(state, initstate),
    ...commonFormReducers,
    updateLoginError,
  },

  effects: {
    fetchLogin: (action, { call, put, select }) => fetchLogin(action, { call, put, select }, pagespace),
  },

  subscriptions: { setup: ({ dispatch, history }) => setup({ dispatch, history }, pagepath) },

};
