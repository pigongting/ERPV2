import React from 'react';
import { connect } from 'dva';
import { Menu, Dropdown, Modal, Input } from 'antd';
import { getPermissionVoList, getRowPermissionVoList, cutString } from '../../../utils/handleData';
import FormTablePage from '../../../components/FormTablePage';

const pagespace = 'orderdis';
const basemodel = 'order/dis';
const detailname = 'detail';
const tablefetch = 'fetchOrderCenConPagingAgency';
const searchPlaceholder = '请输入搜索关键字...';

class OrderDis extends React.Component {
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
            title: '商品名称',
            value: 'productName',
          },
          {
            title: '订单编号',
            value: 'orderItemNo',
          },
          {
            title: '总代理名称',
            value: 'agencyName',
          },
          {
            title: '物流单号',
            value: 'orderExpressNo',
          },
        ]}
        formItems={[
          {
            type: 'RangePicker',
            field: 'createTime',
            label: '订单日期',
          },
          {
            type: 'Select',
            field: 'payType',
            name: 'payTypeName',
            label: '支付方式',
            width: 120,
          },
          {
            type: 'Select',
            field: 'orderStatus',
            name: 'orderStatusName',
            label: '订单状态',
            mode: 'multiple',
            allowClear: true,
            dropdownMatchSelectWidth: false,
            dropdownStyle: {
              width: 100,
            },
          },
        ]}
        columns={[
          {
            title: '订单编号',
            dataIndex: 'orderItemNo',
            render: (text, record, index) => <a href={`/${locale}/${basemodel}/${detailname}?id=${record.orderItemNo}&frommenu=${path}`} rel="noopener noreferrer" target="_blank">{text}</a>,
          },
          {
            title: '总代理名称',
            dataIndex: 'buyerName',
          },
          {
            title: '订单状态',
            dataIndex: 'orderStateText',
            render: (text, row, index) => {
              return (
                <div>
                  <div>{text}</div>
                  {row.expressId ? <div className="FareGetOrderTraces" onScroll={this.props.stopScroll} onMouseEnter={(row.fare) ? (e) => { this.props.setPOPPos(e, row); } : (e) => { this.props.FareGetOrderTraces(e, row); }}>
                    查看物流
                    {row.fare ? (() => {
                      const pos = row.fare.pos;
                      const styleObj = {};

                      styleObj.left = `${pos.width - 16}px`;

                      if (pos.top > 500) {
                        styleObj.bottom = '-21px';
                      } else {
                        styleObj.top = '-21px';
                      }

                      return (
                        <div className="FareGetOrderTracesPOP" style={styleObj}>
                          <div className="FareGetOrderTracesBox">
                            <ul className="lead">
                              <li>快递公司：{row.fare.ename}</li>
                              <li>物流单号：{row.fare.LogisticCode}</li>
                            </ul>
                            {row.fare.list.map((item, i) => {
                              return (
                                <dl key={i} className="list">
                                  <dt>{item.AcceptStation}</dt>
                                  <dd>{item.AcceptTime}</dd>
                                </dl>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()
                    : null}
                  </div> : null}
                </div>
              );
            },
          },
          {
            title: '支付方式',
            dataIndex: 'payType',
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
            dataIndex: 'userName',
          },
          {
            title: '联系电话',
            dataIndex: 'phone',
          },
          {
            title: '商品名称',
            dataIndex: 'productName',
            render: (text, record, index) => <a href={`/${locale}/${basemodel}/productdetail?id=${record.productId}&frommenu=${path}`} rel="noopener noreferrer" target="_blank" title={text}>{cutString(text, 12)}</a>,
          },
          {
            title: '单价',
            dataIndex: 'buyPrice',
          },
          {
            title: '数量',
            dataIndex: 'number',
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
            render: (text, row, index) => {
              const newPermissionArr = [];
              let newPermissionOne = null;
              if (permissionArr && permissionArr.length > 0) {
                permissionArr.map((item) => {
                  if (item.url === 'venRefundMoney') {
                    if (row.isRefund === false && (row.orderState === 15 || row.orderState === 20 || row.orderState === 25)) {
                      newPermissionArr.push(item);
                    }
                  } else {
                    newPermissionArr.push(item);
                  }
                  return item;
                });
              } else if (permissionOne.url === 'venRefundMoney') {
                if (row.isRefund === false && (row.orderState === 15 || row.orderState === 20 || row.orderState === 25)) {
                  newPermissionOne = permissionOne;
                }
              } else {
                newPermissionOne = permissionOne;
              }
              return getRowPermissionVoList(this, row, newPermissionArr, newPermissionOne, basemodel, detailname);
            },
          },
        ]}
        headerOperates={(permissionObj && permissionObj.add) ? <div><a href={`/${locale}/${basemodel}/${detailname}?frommenu=${path}`} rel="noopener noreferrer" target="_blank">新增模块</a></div> : null}
      />
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    handleOperation: (e, operation, row) => {
      // e.nativeEvent.stopImmediatePropagation();
      switch (operation.url) {
        case 'venRefundMoney':
          e.preventDefault();
          Modal.confirm({
            title: '您确定要退单吗？',
            content: '退单后将无法恢复，请谨慎操作！',
            onOk: () => { dispatch({ type: `${pagespace}/fetchSellOrderVenRefundMoney`, payload: row }); },
          });
          break;
        default:
          break;
      }

      dispatch({ type: `${pagespace}/recordClickedRow`, payload: row.id });
    },
    FareGetOrderTraces: (e, row) => {
      console.log(e.target.getBoundingClientRect());
      dispatch({ type: `${pagespace}/fetchFareGetOrderTraces`, payload: row, pos: e.target.getBoundingClientRect() });
    },
    setPOPPos: (e, row) => {
      const pos = e.target.getBoundingClientRect();
      const ele = e.target.children[0];

      if (pos.top > 500) {
        ele.style.top = 'auto';
        ele.style.bottom = '-21px';
      } else {
        ele.style.top = '-21px';
        ele.style.bottom = 'auto';
      }
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderDis);
