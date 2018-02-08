import React from 'react';
import { connect } from 'dva';
import FormPage from '../../../components/FormPage';
import request from '../../../utils/request';

const pagespace = 'useremployeedetail';
const insertrow = 'fetchUserAdd';
const updaterow = 'fetchUserEmployeeEdit';
const fielditems = [
  {
    type: 'FormItemGroup',
    label: '基本信息',
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
  {
    type: 'FormItemGroup',
    label: '分配角色',
  },
  {
    type: 'CheckboxGroup',
    field: 'roleIds',
    label: '选择角色',
    required: false,
    requiredmsg: '请选择角色',
  },
];

class EmployeeEmployeeDetail extends React.Component {
  constructor(props) {
    super(props);
    let specialfields = [];
    if (this.props.pagedata.set.mode === 'adds') {
      specialfields = [
        {
          type: 'Select',
          field: 'systemIds',
          name: 'systemName',
          label: '所属系统',
          required: true,
          requiredmsg: '请选择所属系统',
          onChange: (value) => { this.props.fetchRoleDistributeRole(value); },
        },
        {
          type: 'Input',
          field: 'createBy',
          label: '所属用户',
          required: true,
          requiredmsg: '请输入所属用户',
        },
        {
          type: 'Input',
          field: 'loginName',
          label: '登录名',
          required: true,
          requiredmsg: '请输入登录名',
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
      ];
    } else if (this.props.pagedata.set.mode === 'edit' || this.props.pagedata.set.mode === 'view') {
      specialfields = [
        {
          type: 'Select',
          field: 'systemIds',
          name: 'systemName',
          label: '所属系统',
          disabled: true,
          required: true,
          requiredmsg: '请选择所属系统',
        },
        {
          type: 'Input',
          field: 'createBy',
          label: '所属用户',
          disabled: true,
          required: true,
          requiredmsg: '请输入所属用户',
        },
        {
          type: 'Input',
          field: 'companyName',
          label: '公司名称',
          disabled: true,
          required: false,
          requiredmsg: '请输入公司名称',
        },
        {
          type: 'Input',
          field: 'loginName',
          label: '登录名',
          disabled: true,
          required: true,
          requiredmsg: '请输入登录名',
        },
      ];
    }

    const index = 1;
    specialfields.unshift(index, 0);
    Array.prototype.splice.apply(fielditems, specialfields);

    fielditems.push({
      type: 'FormItemGroup',
      label: '管辖区域',
    });

    fielditems.push({
      type: 'TreeCheckbox',
      label: (this.props.pagedata.set.mode === 'view') ? '已选择的管辖区域' : '选择管辖区域',
      field: 'districtIds',
      treefield: 'area',
      loadData: this.props.promiseCommonLinkage,
    });
  }

  componentDidMount() {
    // 获取角色数据
    if (this.props.pagedata.set.mode === 'adds') { this.props.fetchRoleDistributeRole(0); }
    // 分级获取地址
    this.props.fetchCommonLinkage();
    // 获取管辖区域
    if (this.props.pagedata.set.mode !== 'adds') {
      this.props.fetchManagerUserJurisdic();
    } else {
      this.props.emptyManagerUserJurisdic();
    }
  }

  render() {
    return (
      <FormPage
        namespace={pagespace}
        insertrow={insertrow}
        updaterow={updaterow}
        pagetitle={{
          adds: '新增员工',
          edit: '编辑员工信息',
          view: '查看员工信息',
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
  const { location } = ownProps;
  const { query } = location;
  const { id } = query;

  return {
    fetchRoleDistributeRole: (sid) => {
      dispatch({ type: `${pagespace}/fetchRoleDistributeRole`, payload: { systemId: sid } });
    },
    fetchCommonLinkage: (did) => {
      dispatch({ type: `${pagespace}/fetchCommonLinkage`, payload: did });
    },
    fetchManagerUserJurisdic: () => {
      dispatch({ type: `${pagespace}/fetchManagerUserJurisdic`, payload: id });
    },
    emptyManagerUserJurisdic: () => {
      dispatch({ type: `${pagespace}/updateFormReq`, payload: { districtIds: [] } });
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

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeEmployeeDetail);
