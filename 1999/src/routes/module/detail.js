import React from 'react';
import { connect } from 'dva';
import FormPage from '../../components/FormPage';

const pagespace = 'moduledetail';
const insertrow = 'fetchModuleAdd';
const updaterow = 'fetchModuleEdit';

class ModuleDetail extends React.Component {
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
          adds: '新增模块',
          edit: '编辑模块信息',
          view: '查看模块信息',
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
            onChange: value => this.props.handleModuleParentAll(value),
          },
          {
            type: 'Select',
            field: 'parentId',
            name: 'parentName',
            label: '上级名称',
            required: true,
            requiredmsg: '请选择上级名称',
          },
          {
            type: 'Input',
            field: 'name',
            label: '模块名称',
            required: true,
            requiredmsg: '请输入模块名称',
          },
          {
            type: 'Input',
            field: 'icon',
            label: '菜单图标',
            required: false,
            requiredmsg: '请输入模块图标',
          },
          {
            type: 'Input',
            field: 'url',
            label: '链接地址',
            required: false,
            requiredmsg: '请输入链接地址',
          },
          {
            type: 'Input',
            field: 'backUrl',
            label: '后端地址',
            required: false,
            requiredmsg: '请输入后端地址',
          },
          {
            type: 'Input',
            field: 'sortCode',
            label: '排序',
          },
          {
            type: 'Radio',
            field: 'isMenu',
            label: '是否菜单',
            options: [{ value: true, name: '是' }, { value: false, name: '否' }],
          },
          {
            type: 'Radio',
            field: 'enabled',
            label: '是否激活',
            options: [{ value: true, name: '是' }, { value: false, name: '否' }],
          },
        ]}
      />
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    handleModuleParentAll: value => dispatch({ type: `${pagespace}/fetchModuleParentAll`, payload: value }),
  };
}

export default connect(null, mapDispatchToProps)(ModuleDetail);
