import React from 'react';
import { connect } from 'dva';
import { Layout, Button, Input, Select, Cascader, Radio, DatePicker, Checkbox, Table } from 'antd';
import { getFromMenu } from '../../utils/localpath';
// antd 组件扩展
const { Header, Content } = Layout;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;

const frommenu = getFromMenu(window.location.search, 'frommenu');
const pagespace = `${frommenu}setPermission`;
console.log(pagespace);
class RoleSetPermission extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { locale, path, pagedata } = this.props;
    const { req, res, set } = pagedata;
    const { rows } = res;

    let allpermissionChoseArray = [];
    if (rows) { for (let i = 0; i < rows.length; i++) { allpermissionChoseArray = allpermissionChoseArray.concat(rows[i].permissionChoseArray); } }

    let allCheckbox = null;
    if (allpermissionChoseArray.includes(true) && allpermissionChoseArray.includes(false)) {
      allCheckbox = <Checkbox indeterminate checked={false} onChange={(e) => { this.props.handleCheckboxChange('all', e); }} />;
    } else if (allpermissionChoseArray.includes(true)) {
      allCheckbox = <Checkbox checked indeterminate={false} onChange={(e) => { this.props.handleCheckboxChange('all', e); }} />;
    } else if (allpermissionChoseArray.includes(false)) {
      allCheckbox = <Checkbox checked={false} indeterminate={false} onChange={(e) => { this.props.handleCheckboxChange('all', e); }} />;
    }

    const fielditems = [
      {
        title: '模块(菜单)名称',
        dataIndex: 'name',
        render: (text, record, index) => {
          let statusEle = null;
          switch (record.level) {
            case 2:
              statusEle = <div>&emsp;┗ {text}</div>;
              break;
            case 3:
              statusEle = <div>&emsp;&emsp;┗ {text}</div>;
              break;
            default:
              statusEle = <div>{text}</div>;
              break;
          }
          return statusEle;
        },
      },
      {
        title: allCheckbox,
        width: 31,
        dataIndex: '',
        render: (text, record, k) => {
          if (record.permissionChoseArray.includes(true) && record.permissionChoseArray.includes(false)) {
            return (<Checkbox indeterminate checked={false} onChange={(e) => { this.props.handleCheckboxChange('batch', e, record); }} />);
          } else if (record.permissionChoseArray.includes(true)) {
            return (<Checkbox checked indeterminate={false} onChange={(e) => { this.props.handleCheckboxChange('batch', e, record); }} />);
          } else if (record.permissionChoseArray.includes(false)) {
            return (<Checkbox checked={false} indeterminate={false} onChange={(e) => { this.props.handleCheckboxChange('batch', e, record); }} />);
          } else {
            return (<Checkbox checked={record.isChoice} onChange={(e) => { this.props.handleCheckboxChange('main', e, record); }} />);
          }
        },
      },
    ];

    return (
      <div className="formPage">
        <Layout className="formPageLayout">
          <Header className="formPageHeader">
            <div className="pageTitle">权限设置</div>
            <div className="pageOperat">
              <Button type="primary" onClick={() => { this.props.handleSubmit(); }}>提交</Button>
              &emsp;
              <Button onClick={() => { this.props.handleReset(); }}>重置</Button>
            </div>
          </Header>
          <Content className="formPageContent allPageContent" id="formScrollContent">
            <Table dataSource={rows} columns={(set.tableHeader) ? fielditems.concat(set.tableHeader) : fielditems} pagination={false} bordered />
          </Content>
        </Layout>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    handleCheckboxChange: (type, e, record) => {
      dispatch({ type: `${pagespace}/updateSetPermission`, payload: type, event: e, item: record });
    },
    handleReset: () => {
      dispatch({ type: `${pagespace}/resetSetPermission` });
    },
    handleSubmit: () => {
      dispatch({ type: `${pagespace}/fetchRoleSetPermission` });
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

export default connect(mapStateToProps, mapDispatchToProps)(RoleSetPermission);
