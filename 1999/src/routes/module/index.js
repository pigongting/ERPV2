import React from 'react';
import { connect } from 'dva';
import { getPermissionVoList, getRowPermissionVoList } from '../../utils/handleData';
import FormTablePage from '../../components/FormTablePage';

const pagespace = 'module';
const basemodel = 'module';
const detailname = 'detail';
const tablefetch = 'fetchModuleList';
const searchPlaceholder = '请输入搜索关键字...';

class Module extends React.Component {
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
            title: '模块名称',
            value: 'name',
          },
        ]}
        formItems={[
          {
            type: 'Select',
            field: 'isMenu',
            name: 'isMenuName',
            label: '是否菜单',
            width: 120,
          },
          {
            type: 'Select',
            field: 'enabled',
            name: 'enabledName',
            label: '激活状态',
            width: 120,
          },
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
            title: '模块名称',
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
            title: '编码',
            dataIndex: 'url',
          },
          {
            title: '父级模块',
            dataIndex: 'parentId',
          },
          {
            title: '链接地址',
            dataIndex: 'url',
          },
          {
            title: '菜单图标',
            dataIndex: 'icon',
          },
          {
            title: '排序',
            dataIndex: 'sortCode',
          },
          {
            title: '是否菜单',
            dataIndex: 'isMenu',
            render: (text, record, index) => {
              let statusEle = null;
              switch (text) {
                case true:
                  statusEle = <div>是</div>;
                  break;
                case false:
                  statusEle = <div>否</div>;
                  break;
                default:
                  break;
              }
              return statusEle;
            },
          },
          {
            title: '是否启用',
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
            title: '所属系统',
            dataIndex: 'systemId',
          },
          {
            title: '岗位类型',
            dataIndex: 'roleType',
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
      switch (operation.url) {
        case 'setButton':
          e.preventDefault();
          dispatch({ type: `${pagespace}/fetchPermissionToSetButton`, payload: row, indispatch: dispatch });
          break;
        default:
          break;
      }

      dispatch({ type: `${pagespace}/recordClickedRow`, payload: row.id });
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

export default connect(mapStateToProps, mapDispatchToProps)(Module);
