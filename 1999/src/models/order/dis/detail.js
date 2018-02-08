import { removelocal, getFromMenu, getPathEnd } from '../../../utils/localpath';
import { setup, getinitstate, resetstate, commonFormReducers } from '../../../reducers/commonForm';
import {
  fetchSellOrderVenOrderItemByNo,
  fetchOrderBuyerInfoById,
  fetchOrderBuyerOperateInfoById,
  fetchOrderBuyerAppraiseInfoById,
  updateSellOrderVenOrderItemByNo,
  updateOrderBuyerInfoById,
  updateOrderBuyerOperateInfoById,
  updateOrderBuyerAppraiseInfoById,
} from '../../../reducers/order';

const frommenu = getFromMenu(window.location.search, 'frommenu');
const pathend = getPathEnd(window.location.pathname);
const pagespace = `${frommenu}${pathend}`;
const pagepath = `/${pathend}`;
const viewedrow = 'fetchSellOrderVenOrderItemByNo';

const initstate = getinitstate();

export default {

  namespace: pagespace,

  state: initstate,

  reducers: {
    resetstate: state => resetstate(state, initstate),
    ...commonFormReducers,
    updateSellOrderVenOrderItemByNo,
    updateOrderBuyerInfoById,
    updateOrderBuyerOperateInfoById,
    updateOrderBuyerAppraiseInfoById,
  },

  effects: {
    fetchSellOrderVenOrderItemByNo: (action, { call, put, select }) => fetchSellOrderVenOrderItemByNo(action, { call, put, select }, pagespace),
    fetchOrderBuyerInfoById: (action, { call, put, select }) => fetchOrderBuyerInfoById(action, { call, put, select }, pagespace),
    fetchOrderBuyerOperateInfoById: (action, { call, put, select }) => fetchOrderBuyerOperateInfoById(action, { call, put, select }, pagespace),
    fetchOrderBuyerAppraiseInfoById: (action, { call, put, select }) => fetchOrderBuyerAppraiseInfoById(action, { call, put, select }, pagespace),
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
