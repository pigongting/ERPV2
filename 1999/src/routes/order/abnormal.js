import React from 'react';
import { connect } from 'dva';
import { Menu, Dropdown } from 'antd';
import { getPermissionVoList, getRowPermissionVoList, cutString } from '../../utils/handleData';
import FormTablePage from '../../components/FormTablePage';

const pagespace = 'orderabnormal';
const basemodel = 'order/abnormal';
const detailname = 'abnormaldetail';
const tablefetch = 'fetchOrderCenConPagingAbnormalOrders';
const searchPlaceholder = '请输入搜索关键字...';

class OrderAbnormal extends React.Component {
  constructor(props) {
    super(props);

    this.permissionVoList = getPermissionVoList(this);
    console.log(this.permissionVoList);
  }

  render() {
    const { locale, path } = this.props;
    const { permissionArr, permissionOne, permissionObj } = this.permissionVoList;

    return (
      <FormTablePage
        namespace={pagespace}
        tablefetch={tablefetch}
        searchPlaceholder={searchPlaceholder}
        searchOptions={[
          {
            title: '订单编号',
            value: 'orderNo',
          },
          {
            title: '联系人',
            value: 'contactName',
          },
          {
            title: '详细地址',
            value: 'address',
          },
        ]}
        formItems={[
          {
            type: 'RangePicker',
            field: 'createTime',
            label: '订单日期',
          },
        ]}
        columns={[
          {
            title: '总代理名称',
            dataIndex: 'disCompanyName',
          },
          {
            title: '买家订单编号',
            dataIndex: 'orderItemNo',
          },
          {
            title: '异常原因',
            dataIndex: '',
          },
          {
            title: '下单时间',
            dataIndex: 'createTime',
          },
          {
            title: '收货地址',
            dataIndex: 'address',
          },
          {
            title: '联系人',
            dataIndex: 'contact',
          },
          {
            title: '联系方式',
            dataIndex: 'phone',
          },
          {
            title: '商品名称',
            dataIndex: 'productName',
          },
          {
            title: '单价',
            dataIndex: 'unitPrice',
          },
          {
            title: '数量',
            dataIndex: 'quantity',
          },
          {
            title: '金额',
            dataIndex: 'totalPrice',
          },
          {
            title: '运费',
            dataIndex: 'freight',
          },
          {
            title: '结算金额',
            dataIndex: 'vendorTotalPrice',
          },
          {
            title: '操作',
            key: 'operation',
            permission: !permissionOne,
            render: (text, row, index) => getRowPermissionVoList(this, row, permissionArr, permissionOne, basemodel, detailname),
          },
        ]}
        headerOperates={(permissionObj && permissionObj.add) ? <div><a href={`/${locale}/${basemodel}/${detailname}?frommenu=${path}`} rel="noopener noreferrer" target="_blank">新增模块</a></div> : null}
      />
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    handleOperation: (item, key, keyPath, id) => {
      switch (key) {
        case '2':
          dispatch({ type: `${pagespace}/fetchDeleteRow`, payload: [id] });
          break;
        default:
          break;
      }

      dispatch({ type: `${pagespace}/recordClickedRow`, payload: id });
    },
  };
}

function mapStateToProps(state, ownProps) {
  return {
    path: state.routing.locationBeforeTransitions.pathname,
    locale: state.ssr.locale,
    submenudata: state.pageframe.submenudata,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderAbnormal);
