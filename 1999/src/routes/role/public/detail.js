import React from 'react';
import { connect } from 'dva';
import FormPage from '../../../components/FormPage';

const pagespace = 'rolepublicdetail';
const insertrow = 'fetchRolePublicAdd';
const updaterow = 'fetchRolePublicEdit';
const fielditems = [
  {
    type: 'FormItemGroup',
    label: '基本信息',
  },
  {
    type: 'Input',
    field: 'name',
    label: '岗位名称',
    required: true,
    requiredmsg: '请输入岗位名称',
  },
  {
    type: 'Input',
    field: 'remark',
    label: '岗位描述',
    required: false,
    requiredmsg: '请输入岗位描述',
  },
  {
    type: 'Input',
    field: 'sort',
    label: '排序 ',
    required: true,
    requiredmsg: '请输入排序',
  },
  {
    type: 'Radio',
    field: 'enabled',
    label: '激活状态',
    required: true,
    requiredmsg: '请选择激活状态',
    options: [{ value: true, name: '是' }, { value: false, name: '否' }],
  },
];

class RolePublicDetail extends React.Component {
  constructor(props) {
    super(props);

    const specialfields = [
      {
        type: 'Select',
        field: 'systemId',
        name: 'systemName',
        label: '所属系统',
        disabled: (this.props.pagedata.set.mode === 'edit') || false,
        required: true,
        requiredmsg: '请选择所属系统',
      },
    ];

    const index = 1;
    specialfields.unshift(index, 0);
    Array.prototype.splice.apply(fielditems, specialfields);
  }

  render() {
    return (
      <FormPage
        namespace={pagespace}
        insertrow={insertrow}
        updaterow={updaterow}
        pagetitle={{
          adds: '新增新增共有权限',
          edit: '编辑新增共有权限信息',
          view: '查看新增共有权限信息',
        }}
        itemdata={fielditems}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  return { pagedata: state[pagespace] };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(RolePublicDetail);
