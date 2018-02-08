import React from 'react';
import { connect } from 'dva';
import request from '../../utils/request';
import FormPage from '../../components/FormPage';

const pagespace = 'uservenGrantAuth';
const updaterow = 'fetchManagerUserVenGrantAuth';

class UserVenGrantAuth extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showArea: false,
    };
  }

  componentDidMount() {
    // 分级获取地址
    this.props.fetchCommonLinkage();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      showArea: this.state.showArea || nextProps.pagedata.req.fields.isExemptAudit.value,
    });
  }

  exemptAuditChange = (e) => {
    // console.log(e);
    // console.log(e.target);
    this.setState({
      showArea: e.target.value,
    });

    // 分级获取地址
    if (e.target.value === true) { this.props.fetchCommonLinkage(); }
  }

  render() {
    const { showArea } = this.state;

    const fielditems = [
      {
        type: 'FormItemGroup',
        label: '基本信息',
      },
      {
        type: 'Radio',
        field: 'isAutoPaid',
        label: '自动打款',
        options: [{ value: true, name: '是' }, { value: false, name: '否' }],
      },
      {
        type: 'Radio',
        field: 'isExemptAudit',
        label: '是否免审核',
        options: [{ value: true, name: '是' }, { value: false, name: '否' }],
        onChange: this.exemptAuditChange,
      },
    ];

    if (showArea) {
      fielditems.push({
        type: 'TreeCheckbox',
        label: '选择可售区域',
        field: 'districtIds',
        treefield: 'area',
        loadData: this.props.promiseCommonLinkage,
      });
    }

    return (
      <FormPage
        namespace={pagespace}
        updaterow={updaterow}
        pagetitle={{
          adds: '',
          edit: '供应商授权',
          view: '',
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
  return {
    fetchCommonLinkage: (did) => {
      dispatch({ type: `${pagespace}/fetchCommonLinkage`, payload: did });
    },
    promiseCommonLinkage: (treeNode, area) => {
      return new Promise((resolve) => {
        if (treeNode.props.children) {
          resolve();
          return;
        }
        try {
          // console.log(treeNode);
          const options = { fields: { did: { value: treeNode.props.dataRef.key } } };
          request({ errormsg: '分级获取地址失败' }, {}, { body: options, method: 'GET', Url: iface.commonLinkage }).then(({ data }) => {
            // console.log(data);
            treeNode.props.dataRef.children = [];
            for (let s = 0; s < data.length; s++) {
              const sitem = data[s];
              const reg = new RegExp('00$');
              const leaf = reg.test(sitem.did);

              treeNode.props.dataRef.children.push({
                title: sitem.name,
                key: `${sitem.did}`,
                fullname: `${treeNode.props.dataRef.fullname} | ${sitem.name}`,
                fulldid: `${treeNode.props.dataRef.fulldid}-${sitem.did}`,
                isLeaf: !leaf,
              });
            }
            dispatch({ type: `${pagespace}/updateCommonLinkage`, payload: [...area] });
            resolve();
          });
        } catch (e) {
          console.log(e);
        }
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserVenGrantAuth);
