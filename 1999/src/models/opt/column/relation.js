import { resetstate, commonFormReducers } from '../../../reducers/commonForm';
import { getinitstate, commonFormTableReducers } from '../../../reducers/commonFormTable';
import { fetchDetail, fetchOptColumnProductList, fetchOptColumnRelation } from '../../../reducers/optColumn';
import { fetchManagerProductList } from '../../../reducers/product';
import { fetchSellCategoryList, updateSellCategoryList } from '../../../reducers/category';
import { removelocal, getFromMenu } from '../../../utils/localpath';

const pagespace = 'optcolumnrelation';
const pagepath = '/opt/column/relation';

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
    fetchOptColumnProductList: (action, { call, put, select }) => fetchOptColumnProductList(action, { call, put, select }, pagespace),
    fetchManagerProductList: (action, { call, put, select }) => fetchManagerProductList(action, { call, put, select }, pagespace),
    fetchSellCategoryList: (action, { call, put, select }) => fetchSellCategoryList(action, { call, put, select }, pagespace),
    fetchOptColumnRelation: (action, { call, put, select }) => fetchOptColumnRelation(action, { call, put, select }, pagespace),
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (removelocal(pathname) !== pagepath) {
          dispatch({ type: 'resetstate' });
        } else {
          dispatch({ type: 'saveID', payload: query.id });
          dispatch({ type: 'fetchDetail', payload: query.id });
          dispatch({ type: 'fetchOptColumnProductList' });
        }
      });
    },
  },

};
