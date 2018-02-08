import React from 'react';
import { connect } from 'dva';
import FormPage from '../../components/FormPage';

const pagespace = 'userdetail';
const updaterow = 'fetchUserEdit';

class UserDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FormPage
        namespace={pagespace}
        updaterow={updaterow}
        pagetitle={{
          edit: '编辑用户信息',
          view: '查看用户信息',
        }}
        itemdata={[
          {
            type: 'FormItemGroup',
            label: '基本信息',
          },
          {
            type: 'CheckboxGroup',
            field: 'systemIds',
            label: '所属系统',
            required: true,
            requiredmsg: '请选择所属系统',
          },
          {
            type: 'Input',
            field: 'loginName',
            label: '登录名',
            required: true,
            disabled: true,
            requiredmsg: '请输入登录名',
          },
          {
            type: 'Input',
            field: 'contacts',
            label: '姓名',
            required: false,
            requiredmsg: '请输入姓名',
          },
          {
            type: 'Input',
            field: 'idCard',
            label: '身份证号',
            required: false,
            requiredmsg: '请输入身份证号',
          },
          {
            type: 'Input',
            field: 'email',
            label: '邮箱 ',
            required: false,
            requiredmsg: '请输入邮箱 ',
          },
          {
            type: 'Input',
            field: 'contactPhone',
            label: '手机号码 ',
            required: false,
            requiredmsg: '请输入手机号码 ',
          },
          {
            type: 'Input',
            field: 'companyName',
            label: '公司名称 ',
            required: false,
            requiredmsg: '请输入公司名称 ',
          },
          {
            type: 'Input',
            field: 'homeAddress',
            label: '详细地址 ',
            required: false,
            requiredmsg: '请输入详细地址 ',
          },
          {
            type: 'Radio',
            field: 'enabled',
            label: '激活状态',
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

export default connect(null, mapDispatchToProps)(UserDetail);
