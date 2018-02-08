import React from 'react';
import { connect } from 'dva';
import { Menu, Dropdown } from 'antd';
import { getPermissionVoList, getRowPermissionVoList } from '../../utils/handleData';
import FormTablePage from '../../components/FormTablePage';

const pagespace = 'user';
const basemodel = 'user';
const detailname = 'detail';
const searchPlaceholder = '请输入搜索关键字...';

class User extends React.Component {
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
        searchPlaceholder={searchPlaceholder}
        searchOptions={[
          {
            title: '公司名称',
            value: 'companyName',
          },
          {
            title: '电话号码',
            value: 'phone',
          },
        ]}
        formItems={[
          {
            type: 'Select',
            field: 'ulid',
            name: 'ulidName',
            title: 'type',
            label: '用户身份',
            width: 120,
          },
        ]}
        columns={[
          {
            title: '所属系统',
            dataIndex: 'systemIdText',
          },
          {
            title: '公司名称',
            dataIndex: 'companyName',
          },
          {
            title: '登录名',
            dataIndex: 'loginName',
          },
          {
            title: '姓名',
            dataIndex: 'contacts',
          },
          {
            title: '电话号码',
            dataIndex: 'contactPhone',
          },
          {
            title: '所在地',
            dataIndex: '',
            render: (text, record, index) => {
              return (
                <div>{record.province}&ensp;{record.city}&ensp;{record.area}</div>
              );
            },
          },
          {
            title: '激活状态',
            dataIndex: 'enabled',
            render: (text, record, index) => {
              let statusEle = null;
              switch (text) {
                case true:
                  statusEle = <div className="status-running">已激活</div>;
                  break;
                case false:
                  statusEle = <div className="status-disabled">未激活</div>;
                  break;
                default:
                  break;
              }
              return statusEle;
            },
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
          },
          {
            title: '授权',
            key: 'empower',
            render: (text, row, index) => {
              const empower = (row.systemId === 2) ? <a href={`/${locale}/${basemodel}/venGrantAuth?edit=1&id=${row.id}&sid=${row.systemId}&frommenu=${path}`} rel="noopener noreferrer" target="_blank">供应商授权</a> : null;
              return empower;
            },
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
    handleOperation: (e, operation, row) => {
      // e.nativeEvent.stopImmediatePropagation();
      const event = e;
      const hrefarr = e.nativeEvent.currentTarget.activeElement.href.split('?');
      switch (operation.url) {
        case 'editPwd':
          event.nativeEvent.currentTarget.activeElement.href = /(edit=1)/.test(hrefarr[1]) ? e.nativeEvent.currentTarget.activeElement.href : hrefarr.join(`?edit=1&sid=${row.systemId}&`);
          break;
        default:
          break;
      }

      dispatch({ type: `${pagespace}/recordClickedRow`, payload: row.id });
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

export default connect(mapStateToProps, mapDispatchToProps)(User);
