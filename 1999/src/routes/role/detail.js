import React from 'react';
import { connect } from 'dva';
import FormPage from '../../components/FormPage';

const pagespace = 'roledetail';
const insertrow = 'fetchRoleAdd';
const updaterow = 'fetchRoleEdit';

class EmployeeEmployeeDetail extends React.Component {
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
          adds: '新增岗位',
          edit: '编辑岗位信息',
          view: '查看岗位信息',
        }}
        itemdata={[
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
        ]}
      />
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {};
}

export default connect(null, mapDispatchToProps)(EmployeeEmployeeDetail);
