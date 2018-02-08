import React from 'react';
import { connect } from 'dva';
import FormPage from '../../../components/FormPage';

const pagespace = 'operationcustomServiceConfig';
const updaterow = 'fetchOperationCustomServiceConfigEdit';

class OperationCustomServiceConfig extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FormPage
        namespace={pagespace}
        updaterow={updaterow}
        pagetitle={{
          edit: '编辑客服配置',
        }}
        itemdata={[
          {
            type: 'FormItemGroup',
            label: '基本信息',
          },
          {
            type: 'Input',
            field: 'csc1',
            label: '客服 1',
            required: true,
            requiredmsg: '请输入客服 1',
          },
          {
            type: 'Input',
            field: 'csc2',
            label: '客服 2',
            required: true,
            requiredmsg: '请输入客服 2',
          },
          {
            type: 'Input',
            field: 'csc3',
            label: '客服 3',
            required: true,
            requiredmsg: '请输入客服 3',
          },
        ]}
      />
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    getCustomServiceConfig: () => {
      dispatch({ type: `${pagespace}/fetchOperationCustomServiceConfigList` });
    },
  };
}

export default connect(null, mapDispatchToProps)(OperationCustomServiceConfig);
