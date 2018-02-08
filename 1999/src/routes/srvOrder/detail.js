import React from 'react';
import { connect } from 'dva';
import { Layout, Modal } from 'antd';
import { imageRealUrl, getThousandBit } from '../../utils/handleData';
// 本页样式
import styles from './detail.less';
// antd 组件扩展
const { Header, Content, Sider } = Layout;

const pagespace = 'srvOrderdetail';

function createMarkup(data) { return { __html: data }; }

class SrvOrderDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imgMoalVisible: false,
      imgsrc: '',
    };
  }

  componentDidMount() {
    // 获取售后记录信息
    this.props.handleSrvOrderLog();
  }

  showBigImg(imgurl) {
    this.setState({
      imgMoalVisible: true,
      imgsrc: imgurl,
    });
  }

  hideBigImg = () => {
    this.setState({
      imgMoalVisible: false,
    });
  }

  render() {
    const { imgMoalVisible, imgsrc } = this.state;
    const { pagedata } = this.props;
    const { req, res, set } = pagedata;
    const { fields } = req;
    const { srvOrderLog } = res;

    return (
      <div className="formPage">
        <Layout className="formPageLayout">
          <Header className="formPageHeader">
            <div className="pageTitle">查看退货详情</div>
          </Header>
          <Content className="formPageContent allPageContent" id="formScrollContent">
            <Layout>
              <Content className={styles.returnGoodsContent}>
                {(fields.backState && (fields.backState.value === 16 || fields.backState.value === 22 || fields.backState.value === 23)) ? <dl>
                  <dt>{fields.backStateText && fields.backStateText.value}</dt>
                  <dd>退款时间：{fields.modifyTime && fields.modifyTime.value.format('YYYY-MM-DD HH:mm:ss')}</dd>
                </dl> : null}
                {(fields.backState && (fields.backState.value === 16 || fields.backState.value === 22 || fields.backState.value === 23)) ? <dl>
                  <dt>退款金额：<strong>{fields.totalPrice && fields.totalPrice.value}</strong></dt>
                  <dd>退回账户余额</dd>
                </dl> : null}
                <dl>
                  <dt>协商历史</dt>
                  <dd>
                    {srvOrderLog && srvOrderLog.map((item, index) => {
                      return (
                        <div key={index} className={styles.historyItem}>
                          {((item.createId === fields.disUserId.value) && fields.srvImageUrl.value) ?
                            <ul className={styles.srvImage}>
                              {fields.srvImageUrl.value.split(',').map((ele, i) => {
                                return (
                                  <li key={i}>
                                    <div className={styles.imageListWarp}>
                                      <div className={styles.imageBox}>
                                        <img src={imageRealUrl(ele)} alt="" />
                                      </div>
                                      <div className={styles.textBox} onClick={() => { this.showBigImg(imageRealUrl(ele)); }}>点击查看大图</div>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          : null}
                          <div className="srvInfo">
                            <div className={styles.photo}>
                              {(fields.disUserId && fields.disUserId.value === item.createId) ? <img src={imageRealUrl(fields.disUserLogoImageUrl.value)} alt="" /> : null}
                              {(fields.venUserId && fields.venUserId.value === item.createId) ? <img src={imageRealUrl(fields.venUserLogoImageUrl.value)} alt="" /> : null}
                            </div>
                            <div className={styles.role}>
                              {(fields.disUserId && fields.disUserId.value === item.createId) ? '买家' : null}
                              {(fields.venUserId && fields.venUserId.value === item.createId) ? '卖家' : null}
                            </div>
                            {(item.backState) ? <div className={styles.state}>{item.backState}</div> : null}
                            {(item.remark) ? <div className={styles.remark} dangerouslySetInnerHTML={createMarkup(item.remark)} /> : null}
                            <div className={styles.time}>{item.createTime}</div>
                          </div>
                        </div>
                      );
                    })}
                  </dd>
                </dl>
              </Content>
              {(fields) ? <Sider className={styles.returnGoodsSider} width={300}>
                <div className={styles.product}>
                  <div className={styles.imageUrl}><img src={fields.productImageUrl && `${window.imagesPrefix}${fields.productImageUrl.value}`} alt="" /></div>
                  <div className={styles.name}>{fields.productName && fields.productName.value}</div>
                </div>
                <dl className={styles.returnGoodsItem}>
                  <dt>买家：</dt>
                  <dd>{fields.disCompanyName && fields.disCompanyName.value}</dd>
                </dl>
                <dl className={styles.returnGoodsItem}>
                  <dt>联系方式：</dt>
                  <dd>{fields.disUserPhone && fields.disUserPhone.value}</dd>
                </dl>
                <dl className={styles.returnGoodsItem}>
                  <dt>订单编号：</dt>
                  <dd>{fields.orderItemNo && fields.orderItemNo.value}</dd>
                </dl>
                <dl className={styles.returnGoodsItem}>
                  <dt>订单时间：</dt>
                  <dd>{fields.purchaseTime && fields.purchaseTime.value.format('YYYY-MM-DD HH:mm:ss')}</dd>
                </dl>
                <dl className={styles.returnGoodsItem}>
                  <dt>单价：</dt>
                  <dd>{fields.unitPrice && getThousandBit(fields.unitPrice.value)}</dd>
                </dl>
                <dl className={styles.returnGoodsItem}>
                  <dt>运费：</dt>
                  <dd>{fields.freight && fields.freight.value}</dd>
                </dl>
                <dl className={styles.returnGoodsItem}>
                  <dt>商品总价：</dt>
                  <dd>{fields.unitPrice && fields.quantity && getThousandBit((fields.unitPrice.value * fields.quantity.value).toFixed(2))}</dd>
                </dl>
                <dl className={styles.returnGoodsItem}>
                  <dt>退单编号：</dt>
                  <dd>{fields.orderNo && fields.orderNo.value}</dd>
                </dl>
                <dl className={styles.returnGoodsItem}>
                  <dt>退款金额：</dt>
                  <dd>{fields.totalPrice && fields.totalPrice.value}</dd>
                </dl>
                <dl className={styles.returnGoodsItem}>
                  <dt>原因：</dt>
                  <dd>{fields.goodsReasonCode && fields.goodsReasonCode.value}</dd>
                </dl>
                <dl className={styles.returnGoodsItem}>
                  <dt>订单状态：</dt>
                  <dd>{fields.backStateText && fields.backStateText.value}</dd>
                </dl>
              </Sider> : null }
            </Layout>
          </Content>
        </Layout>
        <Modal
          footer={null}
          visible={imgMoalVisible}
          onCancel={this.hideBigImg}
        >
          <div className={styles.bigImgBox}><img src={imgsrc} alt="" /></div>
        </Modal>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    handleSrvOrderLog: () => {
      dispatch({ type: `${pagespace}/fetchSrvOrderLog` });
    },
  };
}

function mapStateToProps(state, ownProps) {
  return {
    pagedata: state[pagespace],
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SrvOrderDetail);
