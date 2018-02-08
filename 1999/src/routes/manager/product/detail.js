import cs from 'classnames';
import React from 'react';
import { connect } from 'dva';
import { Form, Layout, Tabs } from 'antd';
import FormPage from '../../../components/FormPage';
import { formItemLayout, tailFormItemLayout } from '../../../../config/formConfig';
import { imageRealUrl, getThousandBit } from '../../../utils/handleData';
import { getFromMenu, getPathEnd } from '../../../utils/localpath';
// 本页样式
import styles from './detail.less';

const { Header, Content } = Layout;

const frommenu = getFromMenu(window.location.search, 'frommenu');
const pathend = getPathEnd(window.location.pathname);
const pagespace = `${frommenu}${pathend}`;

function createMarkup(data) { return { __html: data }; }

class ManagerProductDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      vendorPrice: null,
      suggestPrice: null,
      marketPrice: null,
      unifiedPrice: null,
      buyPrice: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    const detail = nextProps.pagedata.res.detail;

    if (detail) {
      if (detail.skuMapIng) {
        this.setState({
          vendorPrice: getThousandBit(detail.skuMapIng.vendorPrice),
          suggestPrice: getThousandBit(detail.skuMapIng.suggestPrice),
          marketPrice: getThousandBit(detail.skuMapIng.marketPrice),
          unifiedPrice: getThousandBit(detail.skuMapIng.unifiedPrice),
          buyPrice: getThousandBit(detail.skuMapIng.buyPrice),
        });
      } else {
        this.setState({
          vendorPrice: getThousandBit(detail.vendorPrice),
          suggestPrice: getThousandBit(detail.listPrice),
          marketPrice: getThousandBit(detail.marketPrice),
          unifiedPrice: null,
          buyPrice: null,
        });
      }
    }
  }

  render() {
    const { state } = this;
    const { res, form } = this.props.pagedata;
    const { detail, factory } = res;

    return (
      <Form className="formPage">
        <Layout className="formPageLayout">
          <Header className="formPageHeader">
            <div className="pageTitle">订单详情</div>
            <div className="pageOperat" />
          </Header>
          {detail ? <Content className="formPageContent allPageContent" id="formScrollContent">
            <div className={styles.mainInfo}>
              <div className={styles.imageWarp}>
                <div className={styles.mainImage}>
                  <img src={imageRealUrl(detail.mainPicture)} alt="" />
                </div>
                <ul className={styles.thumImage}>
                  {detail.pictureInfoList.map((item, index) => {
                    return (
                      <li key={index} onClick={() => { this.props.handleMainPicture(item); }}><img src={imageRealUrl(item)} alt="" /></li>
                    );
                  })}
                </ul>
              </div>
              <div className={styles.choseWarp}>
                <div className={styles.lead}>{detail.name}</div>
                <ul className={styles.priceWarp}>
                  {(state.vendorPrice !== null) ? <li>出厂价：<strong>{state.vendorPrice}</strong></li> : null}
                  {(state.suggestPrice !== null) ? <li>建议零售价：<strong>{state.suggestPrice}</strong></li> : null}
                  {(state.marketPrice !== null) ? <li>市场零售价：<strong>{state.marketPrice}</strong></li> : null}
                  {(state.unifiedPrice !== null) ? <li>全国统一零售价：<strong>{state.unifiedPrice}</strong></li> : null}
                  {(state.buyPrice !== null) ? <li>我连网供货价：<strong>{state.buyPrice}</strong></li> : null}
                </ul>
                <ul className={styles.skuInfoList}>
                  {detail.skuInfoList.map((item, index) => {
                    return (
                      <li key={index}>
                        <dl>
                          <dt>{item.property}</dt>
                          {item.values.map((ele, i) => {
                            const eleArr = ele.split('|');
                            if (eleArr.length > 1) {
                              return (
                                <dd key={i} className={cs(styles.imgprop, (item.isChose === eleArr[0]) ? styles.chose : '')} onClick={() => { this.props.handleChoseProp(item, eleArr[0], eleArr[1]); }}>
                                  <img src={imageRealUrl(eleArr[1])} alt={eleArr[0]} title={eleArr[0]} />
                                </dd>
                              );
                            } else {
                              return (
                                <dd key={i} className={cs(styles.boxprop, (item.isChose === eleArr[0]) ? styles.chose : '')} onClick={() => { this.props.handleChoseProp(item, eleArr[0]); }}>{eleArr[0]}</dd>
                              );
                            }
                          })}
                        </dl>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className={styles.tabsInfo}>
              <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="图文详情" key="1"><div className={styles.productContent} dangerouslySetInnerHTML={createMarkup(detail.content)} /></Tabs.TabPane>
                <Tabs.TabPane tab="规格型号" key="2">
                  <table className={styles.productProperties}>
                    <tbody>
                      {detail.propertiesArr.map((item, index) => {
                        return (
                          <tr key={index}>
                            {item.map((ele, i) => {
                              let valueText = '';
                              try {
                                valueText = ele.value.join('');
                              } catch (e) {
                                valueText = '';
                              }
                              return (
                                <td key={i}>{ele.name}：{valueText}</td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Tabs.TabPane>
                <Tabs.TabPane tab="工厂企业信息" key="3">
                  <div className={styles.factoryInfo}>
                    <div className={styles.factoryLogo}>
                      <img src={imageRealUrl(detail.vendorLogo)} alt="" />
                    </div>
                    <div className={styles.factoryName}>{detail.vendorName}</div>
                    <ul className={styles.factoryBase}>
                      <li>联系方式：{detail.contactPhone}</li>
                      <li>所在地：{detail.province} {detail.city} {detail.area}</li>
                    </ul>
                    <div className={styles.factoryMsg} dangerouslySetInnerHTML={createMarkup(factory)} />
                  </div>
                </Tabs.TabPane>
              </Tabs>
            </div>
          </Content> : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(ManagerProductDetail);
