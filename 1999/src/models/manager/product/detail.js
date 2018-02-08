import { removelocal, getFromMenu, getPathEnd } from '../../../utils/localpath';
import { setup, getinitstate, resetstate, commonFormReducers } from '../../../reducers/commonForm';
import {
  fetchManagerProductDetail,
  updateManagerProductDetail,
  updateChoseProp,
  updateMainPicture,
  fetchManagerProductGetFactoryDesc,
  updateManagerProductGetFactoryDesc,
} from '../../../reducers/product';

const frommenu = getFromMenu(window.location.search, 'frommenu');
const pathend = getPathEnd(window.location.pathname);
const pagespace = `${frommenu}${pathend}`;
const pagepath = `/${pathend}`;
const viewedrow = 'fetchManagerProductDetail';

console.log(pathend);

const initstate = getinitstate();

export default {

  namespace: pagespace,

  state: initstate,

  reducers: {
    resetstate: state => resetstate(state, initstate),
    ...commonFormReducers,
    updateManagerProductDetail,
    updateChoseProp,
    updateMainPicture,
    updateManagerProductGetFactoryDesc,
  },

  effects: {
    fetchManagerProductDetail: (action, { call, put, select }) => fetchManagerProductDetail(action, { call, put, select }, pagespace),
    fetchManagerProductGetFactoryDesc: (action, { call, put, select }) => fetchManagerProductGetFactoryDesc(action, { call, put, select }, pagespace),
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (removelocal(pathname) !== removelocal(`${query.frommenu}${pagepath}`)) {
          dispatch({ type: 'resetstate' });
        } else if (query.id) {
          if (query.edit === '1') {
            dispatch({ type: 'updateSetMode', payload: 'edit' });
          } else {
            dispatch({ type: 'updateSetMode', payload: 'view' });
          }
          dispatch({ type: 'saveID', payload: query.id });
          dispatch({ type: viewedrow, payload: query.id });
        } else {
          dispatch({ type: 'updateSetMode', payload: 'adds' });
        }
      });
    },
  },

};
