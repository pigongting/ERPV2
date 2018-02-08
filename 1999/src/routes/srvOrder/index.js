import React from 'react';
import { connect } from 'dva';
import { Menu, Dropdown } from 'antd';
import { getPermissionVoList, getRowPermissionVoList, cutString } from '../../utils/handleData';
import FormTablePage from '../../components/FormTablePage';

const pagespace = 'srvOrder';
const basemodel = 'srvOrder';
const detailname = 'detail';
const tablefetch = 'fetchSrvOrderList';
const searchPlaceholder = '请输入搜索关键字...';

class SrvOrder extends React.Component {
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
            title: '总代理名称',
            value: 'disCompanyName',
          },
          {
            title: '供应商名称',
            value: 'venCompanyName',
          },
          {
            title: '商品名称',
            value: 'productName',
          },
          {
            title: '退货单编号',
            value: 'orderNo',
          },
        ]}
        formItems={[
          {
            type: 'RangePicker',
            field: 'createTime',
            label: '申请时间',
          },
          {
            type: 'Select',
            field: 'backState',
            name: 'backStateName',
            label: '退货单状态',
            width: 220,
          },
        ]}
        columns={[
          {
            title: '退货单日期',
            dataIndex: 'createTime',
            width: 80,
          },
          {
            title: '总代理名称',
            dataIndex: 'disCompanyName',
          },
          {
            title: '供应商名称',
            dataIndex: 'venCompanyName',
          },
          {
            title: '退货状态',
            dataIndex: 'backState',
            render: (text, row, index) => {
              return (
                <div>
                  <div>{text}</div>
                  {row.expressId ? <div className="FareGetOrderTraces" onMouseEnter={(row.fare) ? (e) => { this.props.setPOPPos(e, row); } : (e) => { this.props.FareGetOrderTraces(e, row); }}>
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
            title: '退货单编号',
            dataIndex: 'orderNo',
            render: (text, record, index) => <a href={`/${locale}/${basemodel}/${detailname}?id=${record.id}&frommenu=${path}`} rel="noopener noreferrer" target="_blank">{text}</a>,
          },
          {
            title: '源单编号',
            dataIndex: 'orderItemNo',
            render: (text, record, index) => <a href={`/${locale}/${basemodel}/orderdetail?id=${record.orderItemNo}&frommenu=${path}`} rel="noopener noreferrer" target="_blank">{text}</a>,
          },
          {
            title: '源单日期',
            dataIndex: 'purchaseTime',
            width: 88,
          },
          {
            title: '商品名称',
            dataIndex: 'productName',
            render: (text, record, index) => <a href={`/${locale}/${basemodel}/productdetail?id=${record.productId}&frommenu=${path}`} rel="noopener noreferrer" target="_blank" title={text}>{cutString(text, 12)}</a>,
          },
          {
            title: '商品规格',
            dataIndex: 'skuDesc',
          },
          {
            title: '数量',
            dataIndex: 'quantity',
          },
          {
            title: '我连网供货价',
            dataIndex: 'unitPrice',
            width: 84,
          },
          {
            title: '出厂价',
            dataIndex: 'venPrice',
            width: 84,
          },
          {
            title: '损耗费',
            dataIndex: 'lossCost',
            width: 84,
          },
          {
            title: '收款金额',
            dataIndex: 'totalPrice',
            width: 84,
          },
          {
            title: '我连网退款金额',
            dataIndex: 'wlTotalPrice',
            width: 84,
          },
          {
            title: '工厂退货金额',
            dataIndex: 'venTotalPrice',
            width: 84,
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

export default connect(mapStateToProps, mapDispatchToProps)(SrvOrder);
