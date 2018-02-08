import { resetstate, commonFormReducers } from '../../../reducers/commonForm';
import { getinitstate, commonFormTableReducers } from '../../../reducers/commonFormTable';
import { fetchDetail, fetchOptCategoryProductList, fetchOptCategoryRelation } from '../../../reducers/optCategory';
import { fetchManagerProductList } from '../../../reducers/product';
import { fetchSellCategoryList, updateSellCategoryList } from '../../../reducers/category';
import { removelocal, getFromMenu } from '../../../utils/localpath';

const pagespace = 'optcategoryrelation';
const pagepath = '/opt/category/relation';

const initstate = getinitstate({});

initstate.req.fields = {};
initstate.req.fields.cid = { value: [] };

export default {

  namespace: pagespace,

  state: initstate,

  reducers: {
    resetstate: state => resetstate(state, initstate),
    ...commonFormReducers,
    ...commonFormTableReducers,
    updateSellCategoryList,
  },

  effects: {
    fetchDetail: (action, { call, put, select }) => fetchDetail(action, { call, put, select }, pagespace),
    fetchOptCategoryProductList: (action, { call, put, select }) => fetchOptCategoryProductList(action, { call, put, select }, pagespace),
    fetchManagerProductList: (action, { call, put, select }) => fetchManagerProductList(action, { call, put, select }, pagespace),
    fetchSellCategoryList: (action, { call, put, select }) => fetchSellCategoryList(action, { call, put, select }, pagespace),
    fetchOptCategoryRelation: (action, { call, put, select }) => fetchOptCategoryRelation(action, { call, put, select }, pagespace),
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (removelocal(pathname) !== pagepath) {
          dispatch({ type: 'resetstate' });
        } else {
          dispatch({ type: 'saveID', payload: query.id });
          dispatch({ type: 'fetchDetail', payload: query.id });
          dispatch({ type: 'fetchOptCategoryProductList' });
        }
      });
    },
  },

};
