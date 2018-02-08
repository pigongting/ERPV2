import React from 'react';
import { connect } from 'dva';
import FormPage from '../../components/FormPage';

const pagespace = 'usereditPwd';
const updaterow = 'fetchUserEditPwd';

class UserEditPwd extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FormPage
        namespace={pagespace}
        updaterow={updaterow}
        pagetitle={{
          adds: '',
          edit: '修改用户密码',
          view: '',
        }}
        itemdata={[
          {
            type: 'FormItemGroup',
            label: '基本信息',
          },
          {
            type: 'Input',
            field: 'loginName',
            label: '登录名',
            disabled: true,
            required: true,
            requiredmsg: '请输入登录名',
          },
          {
            type: 'Input',
            field: 'name',
            label: '姓名',
            disabled: true,
            required: false,
            requiredmsg: '请输入姓名',
          },
          {
            type: 'Input',
            field: 'email',
            label: '邮箱 ',
            disabled: true,
            required: false,
            requiredmsg: '请输入邮箱 ',
          },
          {
            type: 'Input',
            field: 'loginPwd',
            label: '密码',
            required: true,
            requiredmsg: '请输入密码',
          },
          {
            type: 'Input',
            field: 'confirmPwd',
            label: '确认密码',
            required: true,
            requiredmsg: '请确认密码',
          },
        ]}
      />
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {};
}

export default connect(null, mapDispatchToProps)(UserEditPwd);
