import React from 'react';
import { connect } from 'dva';
import { Menu, Dropdown, Modal, Input } from 'antd';
import { getPermissionVoList, getRowPermissionVoList, imageRealUrl } from '../../../utils/handleData';
import FormTablePage from '../../../components/FormTablePage';

const pagespace = 'optBanner';
const basemodel = 'opt/banner';
const detailname = 'detail';
const tablefetch = 'fetchList';
const searchPlaceholder = '请输入搜索关键字...';

class OptColumn extends React.Component {
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
            title: '轮播名称',
            value: 'name',
          },
        ]}
        formItems={[
          {
            type: 'Select',
            field: 'isEnable',
            name: 'isEnableName',
            label: '启用状态',
            width: 120,
          },
        ]}
        columns={[
          {
            title: '轮播名称',
            dataIndex: 'name',
          },
          {
            title: '轮播图片',
            dataIndex: 'figureUrl',
            render: (text, record, index) => <div><img src={imageRealUrl(text)} alt={text} height={100} /></div>,
          },
          {
            title: '是否启用',
            dataIndex: 'isEnable',
            render: (text, record, index) => {
              let statusEle = null;
              switch (text) {
                case true:
                  statusEle = <div className="status-running">已启用</div>;
                  break;
                case false:
                  statusEle = <div className="status-disabled">未启用</div>;
                  break;
                default:
                  break;
              }
              return statusEle;
            },
          },

          {
            title: '排序',
            dataIndex: 'sequence',
          },
          {
            title: '链接地址',
            dataIndex: 'link',
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
          },
          {
            title: '操作',
            key: 'operation',
            permission: !permissionOne,
            render: (text, row, index) => getRowPermissionVoList(this, row, permissionArr, permissionOne, basemodel, detailname),
          },
        ]}
        headerOperates={(permissionObj && permissionObj.add) ? <div><a href={`/${locale}/${basemodel}/${detailname}?frommenu=${path}`} rel="noopener noreferrer" target="_blank">新增轮播</a></div> : null}
      />
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    handleOperation: (e, operation, row) => {
      // e.nativeEvent.stopImmediatePropagation();
      switch (operation.url) {
        case 'delete':
          e.preventDefault();
          Modal.confirm({
            title: '您确定要删除这条信息吗？',
            content: '删除后将无法恢复，请谨慎操作！',
            onOk: () => { dispatch({ type: `${pagespace}/fetchDelete`, payload: row }); },
          });
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

export default connect(mapStateToProps, mapDispatchToProps)(OptColumn);
