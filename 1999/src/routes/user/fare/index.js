import React from 'react';
import { connect } from 'dva';
import { Layout, Button, Input, Select, Cascader, Radio, DatePicker, Checkbox, Table } from 'antd';
// 本页样式
import styles from './index.less';
// antd 组件扩展
const { Header, Content } = Layout;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;

const pagespace = 'userfare';

class UserFare extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { locale, path, pagedata } = this.props;
    const { req, res, set } = pagedata;
    const { rows } = res;

    const fareTable = rows.map((item, index) => {
      const fielditems = [
        {
          title: '计价方式',
          dataIndex: 'chargeType',
          render: (value, row, k) => {
            return {
              children: value,
              props: { rowSpan: (k > 0) ? 0 : item.itemList.length },
            };
          },
        },
        {
          title: '运送到',
          dataIndex: 'shippingRegion',
          width: 200,
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: 200,
          render: (value, row, k) => {
            return {
              children: value,
              props: { rowSpan: (k > 0) ? 0 : item.itemList.length },
            };
          },
        },
      ];

      let specialfields = [];

      if (item.chargeType === 1) {
        specialfields = [
          {
            title: '首件(件)',
            dataIndex: 'startAmount',
          },
          {
            title: '首件运费(元)',
            dataIndex: 'startPrice',
          },
          {
            title: '续件(件)',
            dataIndex: 'additionAmount',
          },
          {
            title: '续件运费(元)',
            dataIndex: 'additionPrice',
          },
          {
            title: '包邮(件)',
            dataIndex: 'freeAmount',
          },
        ];
      } else if (item.chargeType === 2) {
        specialfields = [
          {
            title: '首重(kg)',
            dataIndex: 'startAmount',
          },
          {
            title: '首重运费(元)',
            dataIndex: 'startPrice',
          },
          {
            title: '续重(kg)',
            dataIndex: 'additionAmount',
          },
          {
            title: '续重运费(元)',
            dataIndex: 'additionPrice',
          },
          {
            title: '包邮(kg)',
            dataIndex: 'freeAmount',
          },
        ];
      }

      specialfields.unshift(2, 0);
      Array.prototype.splice.apply(fielditems, specialfields);

      return (
        <div key={item.key}>
          <div className={styles.tempHeader}>
            <div className={styles.headerName}>{item.name}</div>
            <div className={styles.headerDate}>最后修改日期：{item.modifyTime}</div>
          </div>
          <Table dataSource={item.itemList} columns={fielditems} pagination={false} bordered />
        </div>
      );
    });

    return (
      <div className="formPage">
        <Layout className="formPageLayout">
          <Header className="formPageHeader">
            <div className="pageTitle">运费模板列表</div>
          </Header>
          <Content className="formPageContent allPageContent" id="formScrollContent">
            {fareTable}
          </Content>
        </Layout>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {};
}

function mapStateToProps(state, ownProps) {
  return {
    path: state.routing.locationBeforeTransitions.pathname,
    locale: state.ssr.locale,
    pagedata: state[pagespace],
    submenudata: state.pageframe.submenudata,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserFare);
