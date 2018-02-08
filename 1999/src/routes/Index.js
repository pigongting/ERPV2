import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import cs from 'classnames';
// antd 组件
import { Form, Layout, Button, Row, Col, Icon } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { thirtyDays, formatDate } from '../utils/time';
// 本页样式
import styles from './Index.less';

const t1t2 = thirtyDays();
const thirty = [];

for (let i = 0; i < 30; i++) {
  const day = formatDate(new Date(t1t2.t2).getTime() + (i * 86400000));
  const datarr = day.split('-');
  thirty.push(`${datarr[1]}/${datarr[2]}`);
}

// antd 组件扩展
const { Header, Content } = Layout;

const pagespace = 'index';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.props.pagedata.form = this.props.form;
    this.state = {
      mapoption: {},
      baroption: {},
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    const chinaMap = nextProps.pagedata.res.chinaMap;
    const barGraph = nextProps.pagedata.res.barGraph;

    if (chinaMap && chinaMap.length > 0) {
      this.setState({
        mapoption: {
          tooltip: {
            trigger: 'item',
          },
          visualMap: {
            min: 0,
            max: nextProps.pagedata.res.chinaMapMaxValue,
            left: 'left',
            top: 'bottom',
            text: ['高', '低'],
            calculable: true,
            inRange: {
              color: ['#dadcf4', '#3a47d8'],
            },
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
              dataView: { readOnly: false },
              restore: {},
              saveAsImage: {},
            },
          },
          series: [
            {
              name: '销售量',
              type: 'map',
              mapType: 'china',
              roam: false,
              label: {
                normal: {
                  show: true,
                },
                emphasis: {
                  show: true,
                },
              },
              data: chinaMap,
            },
          ],
        },
      });
    }

    if (barGraph && barGraph.salesMoney && barGraph.salesMoney.length > 0) {
      this.setState({
        baroption: {
          tooltip: {},
          legend: {
            data: ['销量额', '商品数量', '订单数量'],
          },
          grid: {
            left: '50',
            right: '0',
            bottom: '0',
            containLabel: true,
          },
          xAxis: {
            data: thirty,
          },
          yAxis: {},
          series: [
            {
              name: '销量额',
              type: 'bar',
              data: barGraph.salesMoney || [],
            },
            {
              name: '商品数量',
              type: 'bar',
              data: barGraph.goodsQty || [],
            },
            {
              name: '订单数量',
              type: 'bar',
              data: barGraph.orderCount || [],
            },
          ],
        },
      });
    }
  }

  render() {
    const { form, pagedata } = this.props;
    const { getFieldDecorator } = form;
    const { req, res, set } = pagedata;
    const { userStatistics, orderStatistics } = res;

    return (
      <Form className="formPage" id="editMode" onSubmit={(e) => { this.props.handleSubmit(form, e); }}>
        <Layout className="formPageLayout">
          <Header className="formPageHeader">
            <div className="pageTitle" />
            <div className="pageOperat">
              <div className={styles.logout} onClick={this.props.handleLogout}><Icon type="logout" />&ensp;退出登录</div>
            </div>
          </Header>
          <Content className={cs('formPageContent', 'allPageContent', styles.indexPageContent)} id="formScrollContent">
            <Row gutter={16}>
              <Col className="gutter-row" span={4}>
                <div className="gutter-box">
                  {orderStatistics ?
                    <div className={styles.statisticsCard}>
                      <div className={styles.title}>收入</div>
                      <div className={styles.lead}>¥ {orderStatistics[0].salesMoney}</div>
                      <div className={styles.vice}>当月收入总数</div>
                    </div>
                  : null}
                </div>
              </Col>
              <Col className="gutter-row" span={4}>
                <div className="gutter-box">
                  {orderStatistics ?
                    <div className={styles.statisticsCard}>
                      <div className={styles.title}>订单</div>
                      <div className={styles.lead}>{orderStatistics[0].orderCount}</div>
                      <div className={styles.vice}>当月付款订单总数</div>
                    </div>
                  : null}
                </div>
              </Col>
              {userStatistics && userStatistics.map((item, key) => {
                return (
                  <Col key={key} className="gutter-row" span={4}>
                    <div className="gutter-box">
                      <div className={styles.statisticsCard}>
                        <div className={styles.title}>{item.userType}</div>
                        <div className={styles.lead}>{item.qty}</div>
                        <div className={styles.vice}>截至时间：{moment(new Date().getTime()).format('YYYY-MM-DD')}</div>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
            {orderStatistics ?
              <div className={styles.barGraphData}>
                <div className={styles.title}>近30天统计</div>
                <div className={styles.bar}>
                  <ReactEcharts option={this.state.baroption} style={{ height: '300px', width: '100%' }} />
                </div>
              </div>
            : null}
            {orderStatistics ?
              <div className={styles.chinaMapData}>
                <div className={styles.title}>区域销售统计</div>
                <div className={styles.map}>
                  <ReactEcharts option={this.state.mapoption} style={{ height: '800px', width: '100%' }} />
                </div>
              </div>
            : null}
          </Content>
        </Layout>
      </Form>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    handleLogout: () => {
      dispatch({ type: `${pagespace}/fetchLoginout` });
    },
  };
}

function mapStateToProps(state, ownProps) {
  return {
    pagedata: state[pagespace],
    locale: state.ssr.locale,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({
  mapPropsToFields(props) {
    const { pagedata } = props;
    const { req, form } = pagedata;
    const { fields } = req;
    // console.log(fields);
    // console.log(form);
    const formdata = form && form.getFieldsValue();
    const newmap = {};

    for (const key in formdata) {
      if (Object.prototype.hasOwnProperty.call(formdata, key)) {
        const formkeyvalue = formdata[key];
        const fieldskeyvalue = fields[key] && fields[key].value;
        const fieldskeycover = fields[key] && fields[key].cover;

        if (formkeyvalue !== undefined) {
          newmap[key] = { value: fieldskeycover ? fieldskeyvalue : formkeyvalue };
        } else if (fieldskeyvalue !== undefined) {
          newmap[key] = fields[key];
        } else {
          newmap[key] = undefined;
        }
      }
    }
    // console.log(newmap);
    return newmap;
  },
})(Index));
