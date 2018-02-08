import update from 'immutability-helper';
import { notification } from 'antd';
import { changeDataType, changeListData, treeMenu } from '../utils/handleData';
import { thirtyDays, formatDate } from '../utils/time';
import request from '../utils/request';

/* 1999区域统计图数据(不统计待付款,手动取消,自动取消,已拒单和已退回的订单) */
export function *fetchOrderAreaPictureForCen(action, { call, put, select }, namespace) {
  const { data } = yield call(() => request({ errormsg: '获取区域统计图数据失败', ...action }, {}, { body: undefined, method: 'GET', Url: iface.orderAreaPictureForCen }));

  const newdata = data.map((item) => {
    return {
      name: item.province,
      value: parseInt(item.salesMoney, 10),
    };
  });

  yield put({ type: 'updateOrderAreaPictureForCen', payload: newdata });
}

export function updateOrderAreaPictureForCen(state, action) {
  console.log(action.payload);
  let maxvalue = 0;
  action.payload.map((item, index) => {
    if (item.value > maxvalue) {
      maxvalue = item.value;
    }
    return item;
  });
  return update(state, { res: { chinaMap: { $set: action.payload }, chinaMapMaxValue: { $set: maxvalue } } });
}

/* 1999首页订单统计(不统计待付款，已取消和自动取消的订单) */
export function *fetchOrderCurrMonthSalesForCen(action, { call, put, select }, namespace) {
  const { data } = yield call(() => request({ errormsg: '获取订单统计数据失败', ...action }, {}, { body: undefined, method: 'GET', Url: iface.orderCurrMonthSalesForCen }));
  yield put({ type: 'updateOrderCurrMonthSalesForCen', payload: data });
}

export function updateOrderCurrMonthSalesForCen(state, action) {
  return update(state, { res: { orderStatistics: { $set: action.payload } } });
}

/* 1999首页近30天每日订单统计(不统计待付款,手动取消,自动取消,已拒单和已退回的订单) */
export function *fetchOrderAreaDayCen(action, { call, put, select }, namespace) {
  const { data } = yield call(() => request({ errormsg: '获取近30天每日订单统计数据失败', ...action }, {}, { body: undefined, method: 'GET', Url: iface.orderAreaDayCen }));

  const newdata = {
    salesMoney: [],
    goodsQty: [],
    orderCount: [],
  };

  const t1t2 = thirtyDays();
  const thirty = [];

  for (let i = 0; i < 30; i++) {
    const day = formatDate(new Date(t1t2.t2).getTime() + (i * 86400000));
    const datarr = day.split('-');
    thirty.push(`${datarr[0]}-${datarr[1]}-${datarr[2]}`);
  }

  for (let s = 0; s < thirty.length; s++) {
    const sitem = thirty[s];

    let hasitem = false;
    for (let d = 0; d < data.length; d++) {
      const ditem = data[d];
      if (ditem.dt === sitem) { hasitem = d; break; }
    }

    if (hasitem !== false) {
      newdata.salesMoney.push(parseFloat(data[hasitem].salesMoney));
      newdata.goodsQty.push(data[hasitem].goodsQty);
      newdata.orderCount.push(data[hasitem].orderCount);
    } else {
      newdata.salesMoney.push(0);
      newdata.goodsQty.push(0);
      newdata.orderCount.push(0);
    }
  }

  yield put({ type: 'updateOrderAreaDayCen', payload: newdata });
}

export function updateOrderAreaDayCen(state, action) {
  return update(state, { res: { barGraph: { $set: action.payload } } });
}

/* 1999首页用户类型统计 */
export function *fetchOrderUserTypeSumForCen(action, { call, put, select }, namespace) {
  const { data } = yield call(() => request({ errormsg: '获取用户类型统计失败', ...action }, {}, { body: undefined, method: 'GET', Url: iface.orderUserTypeSumForCen }));

  const newdata = [];

  data.map((item) => {
    if (item.userType !== '未知') {
      newdata.push(item);
    }
    return item;
  });

  yield put({ type: 'updateOrderUserTypeSumForCen', payload: newdata });
}

export function updateOrderUserTypeSumForCen(state, action) {
  return update(state, { res: { userStatistics: { $set: action.payload } } });
}
