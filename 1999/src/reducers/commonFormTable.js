import update from 'immutability-helper';
import { removelocal } from '../utils/localpath';

// 建立
export function setup({ dispatch, history }, pagepath, dispatchtype) {
  return history.listen(({ pathname, query }) => {
    if (removelocal(pathname) !== pagepath) {
      dispatch({ type: 'resetstate' });
    } else {
      dispatch({ type: dispatchtype || 'fetchTableData', payload: { page: 1, limit: 20 } });
    }
  });
}

// 初始状态
export function getinitstate({ columntags }) {
  return {
    req: {
      page: { page: 1, limit: 20, total: 20 },
      orders: {},
      formFilters: {},
      tableFilters: {},
    },
    res: { rows: [] },
    set: { fullColumns: columntags, showColumns: columntags, clickedRows: [], selectedRows: [] },
  };
}

// 恢复初始状态
export function resetstate(state, initstate) {
  return update(state, { $set: initstate });
}

// 保存ID
function saveIDFn(state, action) {
  return update(state, { set: { id: { $set: action.payload } } });
}

// 清除表格数据
function clearAllFiltersAndOrdersFn(state, action) {
  return update(state, { req: { orders: { $set: {} }, formFilters: { $set: {} }, tableFilters: { $set: {} } } });
}

// 清除表格数据
function resetTableFn(state, action) {
  // return update(state, { res: { rows: { $set: [] } } }); 做局部更新时屏蔽的
  return update(state, { res: { rows: { $set: [...state.res.rows] } } });
}

// 更新表格数据
function updateTableFn(state, action) {
  return update(state, { res: { rows: { $set: action.payload } } });
}

// 更新分页数据
function updatePagesFn(state, action) {
  return update(state, { req: { page: { $set: action.payload } } });
}

// 设置表格显示列
function setTableColumnsFn(state, action) {
  return update(state, { set: { showColumns: { $set: (action.payload) ? action.payload : state.set.fullColumns } } });
}

// 记录点击行
function recordClickedRowFn(state, action) {
  if (state.set.clickedRows.includes(action.payload)) {
    return update(state, { set: { clickedRows: { $push: [] } } });
  } else {
    return update(state, { set: { clickedRows: { $push: [action.payload] } } });
  }
}

// 记录选中行
function recordSelectedRowFn(state, action) {
  return update(state, { set: { selectedRows: { $set: action.payload } } });
}

// 清空点击行选中行
function emptyClickedSelectedRowFn(state, action) {
  return update(state, { set: { clickedRows: { $set: [] }, selectedRows: { $set: [] } } });
}

// 更新表格筛选请求参数
function updateTableFillterFn(state, action) {
  console.log(action);

  return update(state, {
    req: {
      tableFilters: { $set: (() => {
        const newTableFilters = {};
        for (const key in action.tableFilters) { if (key) { newTableFilters[key] = action.tableFilters[key]; } }
        return newTableFilters;
      })() },
      orders: { $set: (() => {
        if (action.tableSorter.field) {
          return { [action.tableSorter.field]: action.tableSorter.order };
        } else {
          return {};
        }
      })() },
    },
  });
}

// 更新表单筛选请求参数
function updateFormFillterFn(state, action) {
  const newFormFilters = { ...state.req.formFilters };

  for (const key in action.payload) {
    if (key) {
      newFormFilters[key] = { value: action.payload[key] };
    }
  }

  return update(state, { req: { formFilters: { $set: newFormFilters } } });
}

// 处理删除后的数据变化
function handleDeleteDataFn(state, action) {
  const page = state.req.page;
  const dataSource = state.res.rows;
  const clickedRows = state.set.clickedRows;
  const selectedRows = state.set.selectedRows;

  let compare = null;

  if (Object.prototype.toString.call(action.payload) === '[object Array]') {
    compare = action.payload;
  } else {
    compare = [action.payload.id];
  }

  const newSource = dataSource.filter((item) => {
    return !compare.includes(item.id);
  });

  const newClickedRows = clickedRows.filter((item) => {
    return !compare.includes(item);
  });

  const newSelectedRows = selectedRows.filter((item) => {
    return !compare.includes(item);
  });

  return update(state, {
    res: {
      rows: { $set: newSource },
    },
    req: {
      page: { $set: { page: page.page, limit: page.limit, total: page.total - 1 } },
    },
    set: {
      clickedRows: { $set: newClickedRows },
      selectedRows: { $set: newSelectedRows },
    },
  });
}

export const commonFormTableReducers = {
  saveID: saveIDFn,
  resetTable: resetTableFn,
  updateTable: updateTableFn,
  updatePages: updatePagesFn,
  setTableColumns: setTableColumnsFn,
  recordClickedRow: recordClickedRowFn,
  recordSelectedRow: recordSelectedRowFn,
  emptyClickedSelectedRow: emptyClickedSelectedRowFn,
  updateFormFillter: updateFormFillterFn,
  updateTableFillter: updateTableFillterFn,
  clearAllFiltersAndOrders: clearAllFiltersAndOrdersFn,
  handleDeleteData: handleDeleteDataFn,
};
