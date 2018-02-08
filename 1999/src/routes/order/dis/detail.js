import cs from 'classnames';
import moment from 'moment';
import React from 'react';
import { connect } from 'dva';
import { Form, Layout, Tabs } from 'antd';
import { formItemLayout, tailFormItemLayout } from '../../../../config/formConfig';
import { imageRealUrl } from '../../../utils/handleData';
import { getFromMenu, getPathEnd } from '../../../utils/localpath';
// 本页样式
import styles from './detail.less';

const { Header, Content } = Layout;

const frommenu = getFromMenu(window.location.search, 'frommenu');
const pathend = getPathEnd(window.location.pathname);
const pagespace = `${frommenu}${pathend}`;

function createMarkup(data) { return { __html: data }; }

class OrderDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { res, form } = this.props.pagedata;
    const { orderInfo, customerInfo, operateInfo, commentInfo } = res;

    return (
      <Form className="formPage">
        <Layout className="formPageLayout">
          <Header className="formPageHeader">
            <div className="pageTitle">订单详情</div>
            <div className="pageOperat" />
          </Header>
          <Content className="formPageContent allPageContent" id="formScrollContent">
            {orderInfo ? <div className={styles.dataTable}>
              <table>
                <tbody>
                  <tr>
                    <th>订单日期</th>
                    <td>{(orderInfo.createTime) ? moment(orderInfo.createTime).format('YYYY-MM-DD HH:mm:ss') : ''}</td>
                    <th>订单编号</th>
                    <td><span>{orderInfo.orderItemNo}</span></td>
                  </tr>
                  <tr>
                    <th>交易状态</th>
                    <td>{orderInfo.transactionStateText || ''}</td>
                    <th>订单状态</th>
                    <td>{orderInfo.orderStateText || ''}</td>
                  </tr>
                  <tr>
                    <th>预计发货日期</th>
                    <td>{(orderInfo.expectedDeliveryTime) ? moment(orderInfo.expectedDeliveryTime).format('YYYY-MM-DD') : ''}</td>
                    <th>买家备注</th>
                    <td>{orderInfo.remark || ''}</td>
                  </tr>
                </tbody>
              </table>
            </div> : null}
            {orderInfo ? <div className={styles.tabsInfo}>
              <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="商品信息" key="1">
                  {orderInfo ? <div className={styles.goodsInfo}>
                    <table>
                      <tbody>
                        <tr>
                          <th className={styles.imageBoxTh} rowSpan="5">
                            <div className={styles.imageBox}>
                              <img src={imageRealUrl(orderInfo.productImageUrl)} alt="" />
                            </div>
                          </th>
                          <td colSpan="2">商品名称：<span>{orderInfo.productName || ''}</span></td>
                        </tr>
                        <tr>
                          <td>货号：<span>{orderInfo.skuNo || ''}</span></td>
                          <td>规格型号：<span>{orderInfo.skuDesc || ''}</span></td>
                        </tr>
                        <tr>
                          <td>数量：<span>{orderInfo.number || ''}</span></td>
                          <td>单位：<span>{orderInfo.unit || ''}</span></td>
                        </tr>
                        <tr>
                          <td>运费：<span className={styles.money}>{orderInfo.freight || ''}</span></td>
                          <td>单价：<span className={styles.money}>{orderInfo.vendorPrice || ''}</span></td>
                        </tr>
                        <tr>
                          <td>金额：<span className={styles.money}>{orderInfo.totalPrice || ''}</span></td>
                          <td>结算金额：<span className={styles.money}>{orderInfo.vendorTotalPrice || ''}</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div> : null}
                </Tabs.TabPane>
                <Tabs.TabPane tab="客户信息" key="2">
                  {customerInfo ? <div className={styles.dataTable}>
                    <table>
                      <tbody>
                        <tr>
                          <th>买家姓名</th>
                          <td>{customerInfo.buyerName || ''}</td>
                          <th>省</th>
                          <td>{customerInfo.province || ''}</td>
                        </tr>
                        <tr>
                          <th>市</th>
                          <td>{customerInfo.city || ''}</td>
                          <th>区/县</th>
                          <td>{customerInfo.area || ''}</td>
                        </tr>
                        <tr>
                          <th>收货人</th>
                          <td>{customerInfo.contact || ''}</td>
                          <th>电话</th>
                          <td>{customerInfo.phone || ''}</td>
                        </tr>
                        <tr>
                          <th>快递公司</th>
                          <td>{customerInfo.expressCompany || ''}</td>
                          <th>快递单号</th>
                          <td>{customerInfo.expressNo || ''}</td>
                        </tr>
                        <tr>
                          <th>收货地址</th>
                          <td colSpan="3"><p>{customerInfo.address || ''}</p></td>
                        </tr>
                      </tbody>
                    </table>
                  </div> : null}
                </Tabs.TabPane>
                {(orderInfo.orderState !== 15) ?
                  <Tabs.TabPane tab="订单操作信息" key="3">
                    {operateInfo ? <div className={styles.dataTable}>
                      <table>
                        <tbody>
                          {(orderInfo.orderState < 45) ?
                            <tr>
                              <th>接单人</th>
                              <td>{operateInfo.sellerName || ''}</td>
                              <th>接单日期</th>
                              <td>{(operateInfo.confirmTime) ? moment(operateInfo.confirmTime).format('YYYY-MM-DD HH:mm:ss') : ''}</td>
                            </tr>
                          : null}
                          {(orderInfo.orderState > 20 && orderInfo.orderState < 45) ?
                            <tr>
                              <th>发货人</th>
                              <td>{operateInfo.sendName || ''}</td>
                              <th>发货日期</th>
                              <td>{(operateInfo.sendTime) ? moment(operateInfo.sendTime).format('YYYY-MM-DD HH:mm:ss') : ''}</td>
                            </tr>
                          : null}
                          {(orderInfo.orderState > 20 && orderInfo.orderState < 45) ?
                            <tr>
                              <th>收货人</th>
                              <td>{operateInfo.buyerName || ''}</td>
                              <th>收货日期</th>
                              <td>{(operateInfo.receiveTime) ? moment(operateInfo.receiveTime).format('YYYY-MM-DD HH:mm:ss') : ''}</td>
                            </tr>
                          : null}
                          {(orderInfo.orderState > 40) ?
                            <tr>
                              <th>拒单人</th>
                              <td>{operateInfo.refuseName || ''}</td>
                              <th>拒单日期</th>
                              <td>{(operateInfo.refuseTime) ? moment(operateInfo.refuseTime).format('YYYY-MM-DD HH:mm:ss') : ''}</td>
                            </tr>
                          : null}
                          {(orderInfo.orderState > 40) ?
                            <tr style={{ display: 'none' }}>
                              <th>拒单原因</th>
                              <td colSpan="3" />
                            </tr>
                          : null}
                        </tbody>
                      </table>
                    </div> : null}
                  </Tabs.TabPane>
                : null}
                {(orderInfo.orderState === 35 || orderInfo.orderState === 40) ?
                  <Tabs.TabPane tab="评价信息" key="4">
                    {commentInfo ? <div className={styles.dataTable}>
                      <table>
                        <tbody>
                          <tr>
                            <th>评分</th>
                            <td>{(commentInfo.complexSatisfaction) ? `${commentInfo.complexSatisfaction}星` : ''}</td>
                            <th>评价内容</th>
                            <td rowSpan="3">{commentInfo.comments || ''}</td>
                          </tr>
                          <tr>
                            <th>评价人</th>
                            <td>{commentInfo.operateBy || ''}</td>
                          </tr>
                          <tr>
                            <th>评价时间</th>
                            <td>{(commentInfo.operateTime) ? moment(commentInfo.operateTime).format('YYYY-MM-DD HH:mm:ss') : ''}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div> : null}
                  </Tabs.TabPane>
                : null}
              </Tabs>
            </div> : null}
          </Content>
        </Layout>
      </Form>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    handleChoseProp: (item, ele, url) => {
      dispatch({ type: `${pagespace}/updateChoseProp`, payload: item, propvalue: ele });
      if (url) {
        dispatch({ type: `${pagespace}/updateMainPicture`, payload: url });
      }
    },
    handleMainPicture: (url) => {
      dispatch({ type: `${pagespace}/updateMainPicture`, payload: url });
    },
  };
}

function mapStateToProps(state, ownProps) {
  return {
    path: state.routing.locationBeforeTransitions.pathname,
    locale: state.ssr.locale,
    pagedata: state[pagespace],
    submenudata: state.pageframe.submenudata,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail);
