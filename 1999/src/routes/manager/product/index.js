import React from 'react';
import { connect } from 'dva';
import { Menu, Dropdown, Modal, Input } from 'antd';
import { getPermissionVoList, getRowPermissionVoList, cutString, imageRealUrl } from '../../../utils/handleData';
import FormTablePage from '../../../components/FormTablePage';

const { TextArea } = Input;

const pagespace = 'managerproduct';
const basemodel = 'manager/product';
const detailname = 'detail';
const tablefetch = 'fetchManagerProductList';
const searchPlaceholder = '请输入搜索关键字...';

class ManagerProduct extends React.Component {
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
            title: '商品名称',
            value: 'name',
          },
          {
            title: '供应商名称',
            value: 'vendorName',
          },
        ]}
        formItems={[
          {
            type: 'Select',
            field: 'onOffState',
            name: 'onOffStateName',
            label: '商品状态',
            width: 120,
          },
          {
            type: 'Select',
            field: 'verifyState',
            name: 'verifyStateName',
            label: '审核状态',
            width: 120,
          },
          {
            type: 'Select',
            field: 'businessType',
            name: 'businessTypeName',
            label: '业务类型',
            width: 120,
          },
          {
            type: 'Select',
            field: 'order',
            name: 'orderName',
            label: '排序字段',
            width: 120,
          },
          {
            type: 'RadioGroup',
            field: 'asc',
          },
        ]}
        columns={[
          {
            title: '商品图片',
            dataIndex: 'pictureUrl',
            render: (text, record, index) => {
              return (
                <div><img src={imageRealUrl(text)} alt={text} width="100" height="100" /></div>
              );
            },
          },
          {
            title: '商品名称',
            dataIndex: 'name',
            render: (text, record, index) => <a href={`/${locale}/${basemodel}/${detailname}?id=${record.id}&frommenu=${path}`} rel="noopener noreferrer" target="_blank" title={text}>{cutString(text, 12)}</a>,
          },
          {
            title: '价格',
            dataIndex: 'vendorPrice',
          },
          {
            title: '供应商',
            dataIndex: 'vendorName',
          },
          {
            title: '发布时间',
            dataIndex: 'createTime',
          },
          {
            title: '审核时间',
            dataIndex: 'rejectedTime',
          },
          {
            title: '审核状态',
            dataIndex: 'verifyState',
          },
          {
            title: '商品状态',
            dataIndex: 'onOffStateText',
          },
          {
            title: '审核备注',
            dataIndex: 'reason',
          },
          {
            title: '操作',
            key: 'operation',
            permission: !permissionOne,
            render: (text, row, index) => {
              const newPermissionArr = [];
              let newPermissionOne = null;
              if (permissionArr && permissionArr.length > 0) {
                permissionArr.map((item) => {
                  if (item.url === 'forceOffShelves') {
                    if (row.onOffState === 1) {
                      newPermissionArr.push(item);
                    }
                  } else if (item.url === 'delete') {
                    if (row.onOffState === 2) {
                      newPermissionArr.push(item);
                    }
                  } else {
                    newPermissionArr.push(item);
                  }
                  return item;
                });
              }

              if (permissionOne.url === 'forceOffShelves') {
                if (row.onOffState === 1) {
                  newPermissionOne = permissionOne;
                }
              } else if (permissionOne.url === 'delete') {
                if (row.onOffState === 2) {
                  newPermissionOne = permissionOne;
                }
              } else {
                newPermissionOne = permissionOne;
              }

              return getRowPermissionVoList(this, row, newPermissionArr, newPermissionOne, basemodel, detailname);
            },
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
      let newLowReason = '';

      const event = e;
      const hrefarr = e.nativeEvent.currentTarget.activeElement.href.split('?');

      switch (operation.url) {
        case 'delete':
          e.preventDefault();
          Modal.confirm({
            title: '您确定要删除这条信息吗？',
            content: '删除后将无法恢复，请谨慎操作！',
            onOk: () => { dispatch({ type: `${pagespace}/fetchManagerProductDelete`, payload: row }); },
          });
          break;
        case 'forceOffShelves':
          e.preventDefault();
          Modal.confirm({
            title: '强制下架商品',
            iconType: '',
            content: (
              <div style={{ marginLeft: '-42px' }}>
                <div>商品名称：{row.name}</div>
                <div style={{ marginTop: '6px' }}>强制下架原因:<TextArea rows={4} onChange={(even) => { newLowReason = even.target.value; }} /></div>
              </div>
            ),
            onOk: () => {
              dispatch({ type: `${pagespace}/fetchManagerProductOffline`, payload: row, lowReason: newLowReason });
            },
          });
          break;
        case 'audit':
          event.nativeEvent.currentTarget.activeElement.href = /(edit=1)/.test(hrefarr[1]) ? e.nativeEvent.currentTarget.activeElement.href : hrefarr.join('?edit=1&');
          break;
        case 'setPromotion':
          event.nativeEvent.currentTarget.activeElement.href = /(edit=1)/.test(hrefarr[1]) ? e.nativeEvent.currentTarget.activeElement.href : hrefarr.join('?edit=1&');
          event.nativeEvent.currentTarget.activeElement.href = event.nativeEvent.currentTarget.activeElement.href.replace(/setPromotion/, 'audit');
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

export default connect(mapStateToProps, mapDispatchToProps)(ManagerProduct);
