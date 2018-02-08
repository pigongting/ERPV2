import React from 'react';
import { connect } from 'dva';
import { Menu, Dropdown } from 'antd';
import { getPermissionVoList, getRowPermissionVoList } from '../../utils/handleData';
import FormTablePage from '../../components/FormTablePage';

const pagespace = 'permission';
const basemodel = 'permission';
const detailname = 'detail';
const tablefetch = 'fetchPermissionList';
const searchPlaceholder = '请输入搜索关键字...';

class Permission extends React.Component {
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
            title: '名称',
            value: 'name',
          },
          {
            title: '编号',
            value: 'url',
          },
        ]}
        formItems={[
          {
            type: 'Select',
            field: 'systemId',
            name: 'systemName',
            label: '所属系统',
            width: 120,
          },
        ]}
        columns={[
          {
            title: '名称',
            dataIndex: 'name',
          },
          {
            title: '编号',
            dataIndex: 'url',
          },
          {
            title: '图标',
            dataIndex: 'icon',
          },
          {
            title: '颜色',
            dataIndex: 'css',
          },
          {
            title: '排序',
            dataIndex: 'sortCode',
          },
          {
            title: '描述',
            dataIndex: 'remark',
          },
          {
            title: '是否激活',
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
            title: '操作',
            key: 'operation',
            permission: !permissionOne,
            render: (text, row, index) => getRowPermissionVoList(this, row, permissionArr, permissionOne, basemodel, detailname),
          },
        ]}
        headerOperates={(permissionObj && permissionObj.add) ? <div><a href={`/${locale}/${basemodel}/${detailname}?frommenu=${path}`} rel="noopener noreferrer" target="_blank">新增权限</a></div> : null}
      />
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    handleOperation: (item, key, keyPath, id) => {
      dispatch({ type: `${pagespace}/recordClickedRow`, payload: id });
    },
  };
}

function mapStateToProps(state, ownProps) {
  console.log(state);
  return {
    path: state.routing.locationBeforeTransitions.pathname,
    locale: state.ssr.locale,
    submenudata: state.pageframe.submenudata,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Permission);
