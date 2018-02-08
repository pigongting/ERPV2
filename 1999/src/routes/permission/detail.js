import React from 'react';
import { connect } from 'dva';
import FormPage from '../../components/FormPage';

const pagespace = 'permissiondetail';
const insertrow = 'fetchPermissionAdd';
const updaterow = 'fetchPermissionEdit';

class PermissionDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FormPage
        namespace={pagespace}
        insertrow={insertrow}
        updaterow={updaterow}
        pagetitle={{
          adds: '新增权限',
          edit: '编辑权限信息',
          view: '查看权限信息',
        }}
        itemdata={[
          {
            type: 'FormItemGroup',
            label: '基本信息',
          },
          {
            type: 'Select',
            field: 'systemId',
            name: 'systemName',
            label: '所属系统',
            required: true,
            requiredmsg: '请选择所属系统',
          },
          {
            type: 'Input',
            field: 'name',
            label: '名称',
            required: true,
            requiredmsg: '请输入权限名称',
          },
          {
            type: 'Input',
            field: 'sortCode',
            label: '排序',
            required: true,
            requiredmsg: '请输入权限排序',
          },
          {
            type: 'Input',
            field: 'url',
            label: '编码',
            required: false,
            requiredmsg: '请输入权限编码',
          },
          {
            type: 'Input',
            field: 'icon',
            label: '图标',
            required: false,
            requiredmsg: '请输入权限图标',
          },
          {
            type: 'Input',
            field: 'css',
            label: '颜色',
            required: false,
            requiredmsg: '请输入权限颜色',
          },
          {
            type: 'Input',
            field: 'remark',
            label: '描述',
            required: false,
            requiredmsg: '请输入权限描述',
          },
          {
            type: 'Radio',
            field: 'enabled',
            label: '是否启用',
            options: [{ value: true, name: '是' }, { value: false, name: '否' }],
          },
        ]}
      />
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {};
}

export default connect(null, mapDispatchToProps)(PermissionDetail);
