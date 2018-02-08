import { removelocal, getFromMenu } from '../utils/localpath';
import { resetstate, getinitstate } from '../reducers/commonFormTable';
import { fetchLoginout } from '../reducers/user';
import {
  fetchOrderAreaPictureForCen,
  fetchOrderCurrMonthSalesForCen,
  fetchOrderAreaDayCen,
  fetchOrderUserTypeSumForCen,
  updateOrderAreaPictureForCen,
  updateOrderCurrMonthSalesForCen,
  updateOrderAreaDayCen,
  updateOrderUserTypeSumForCen,
} from '../reducers/index';

const pagespace = 'index';
const pagepath = '/index';

const initstate = getinitstate({});

export default {

  namespace: pagespace,

  state: initstate,

  reducers: {
    resetstate: state => resetstate(state, initstate),
    updateOrderAreaPictureForCen,
    updateOrderCurrMonthSalesForCen,
    updateOrderAreaDayCen,
    updateOrderUserTypeSumForCen,
  },

  effects: {
    fetchLoginout: (action, { call, put, select }) => fetchLoginout(action, { call, put, select }, pagespace),
    fetchOrderAreaPictureForCen: (action, { call, put, select }) => fetchOrderAreaPictureForCen(action, { call, put, select }, pagespace),
    fetchOrderCurrMonthSalesForCen: (action, { call, put, select }) => fetchOrderCurrMonthSalesForCen(action, { call, put, select }, pagespace),
    fetchOrderAreaDayCen: (action, { call, put, select }) => fetchOrderAreaDayCen(action, { call, put, select }, pagespace),
    fetchOrderUserTypeSumForCen: (action, { call, put, select }) => fetchOrderUserTypeSumForCen(action, { call, put, select }, pagespace),
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (removelocal(pathname) !== pagepath) {
          dispatch({ type: 'resetstate' });
        } else {
          dispatch({ type: 'fetchOrderCurrMonthSalesForCen' });
          dispatch({ type: 'fetchOrderUserTypeSumForCen' });

          if (typeof window !== 'undefined') {
            import(/* webpackChunkName: "china.js" */ 'echarts/map/js/china.js')
            .then((_) => {
              console.log(149174);
              dispatch({ type: 'fetchOrderAreaPictureForCen' });
              dispatch({ type: 'fetchOrderAreaDayCen' });
            })
            .catch(err => console.log('Failed to load moment', err));
          }
        }
      });
    },
  },

};
