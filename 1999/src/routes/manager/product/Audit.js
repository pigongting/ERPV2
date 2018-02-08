import React from 'react';
import { connect } from 'dva';
import { Form, Button } from 'antd';
import FormPage from '../../../components/FormPage';
import { formItemLayout, tailFormItemLayout } from '../../../../config/formConfig';

const pagespace = 'managerproductaudit';
const insertrow = 'fetchManagerProductVerify';

class ManagerProductAudit extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { req, form } = this.props.pagedata;
    const { fields } = req;
    console.log(req.fields);
    return (
      <FormPage
        namespace={pagespace}
        insertrow={insertrow}
        pagetitle={{
          adds: '审核商品',
          edit: '审核商品',
          view: '审核商品',
        }}
        cobutton={false}
        itemdata={[
          {
            type: 'FormItemGroup',
            label: `SKU列表${(req.fields.canNotEditPrice && (req.fields.canNotEditPrice.value !== undefined) && req.fields.canNotEditPrice.value) ? '（批发商用户不需要编辑我连网供货价）' : ''}`,
          },
          {
            type: 'EditTable',
            field: 'skuList',
            dataSource: (req.fields.skuList && req.fields.skuList.value && req.fields.skuList.value) || [],
            columns: [
              {
                title: '规格',
                dataIndex: 'skuDesc',
              },
              {
                title: '单位',
                dataIndex: '',
                render: () => {
                  return req.fields.unitName && req.fields.unitName.value && req.fields.unitName.value;
                },
              },
              {
                title: '出厂价',
                dataIndex: 'vendorPrice',
              },
              {
                title: '可售数量',
                dataIndex: 'saleAmount',
              },
              {
                title: '建议零售价',
                dataIndex: 'suggestPrice',
              },
              {
                title: <div>
                  我连网供货价&ensp;
                  {(req.fields.canNotEditPrice && (req.fields.canNotEditPrice.value !== undefined) && !req.fields.canNotEditPrice.value) ?
                    <Button size="small" onClick={(e) => { this.props.setEqual('buyPrice', form, e); }}>设置相同</Button>
                  : null}
                </div>,
                dataIndex: 'buyPrice',
                editable: req.fields.canNotEditPrice && req.fields.ladderPriceList && (req.fields.canNotEditPrice.value !== undefined) && !req.fields.canNotEditPrice.value && (!req.fields.ladderPriceList.value || req.fields.ladderPriceList.value.length < 1),
              },
              {
                title: <div>全国统一价格&ensp;<Button size="small" onClick={(e) => { this.props.setEqual('unifiedPrice', form, e); }}>设置相同</Button></div>,
                dataIndex: 'unifiedPrice',
                editable: true,
              },
            ],
          },
          {
            type: 'EditTable',
            field: 'ladderPriceList',
            dataSource: (fields.ladderPriceList && fields.ladderPriceList.value) || [],
            columns: [
              {
                title: '购买数量',
                dataIndex: 'minNum',
              },
              {
                title: <div>出厂价&ensp;</div>,
                dataIndex: 'vendorPrice',
              },
              {
                title: <div>我连网供货价</div>,
                dataIndex: 'buyPrice',
                editable: req.fields.canNotEditPrice && (req.fields.canNotEditPrice.value !== undefined) && !req.fields.canNotEditPrice.value,
              },
            ],
            onChange: (value) => {
              console.log(value);
              this.props.handleSyncData(form);
            },
          },
          {
            type: 'FormItemGroup',
            label: '商品信息',
          },
          {
            type: 'Text',
            field: 'name',
            label: '商品名称',
          },
          {
            type: 'Text',
            field: 'path',
            label: '商品工厂分类名称',
          },
          {
            type: 'SearchInput',
            field: 'hcid',
            name: 'hcidName',
            label: 'APP商品分类',
            loadData: this.props.fetchCommonHsmjCategory,
            required: true,
            requiredmsg: 'APP商品分类',
          },
          {
            type: 'Radio',
            field: 'isPromotion',
            label: '是否特价',
            options: [
              { name: '否', value: 'false' },
              { name: '是', value: 'true' },
            ],
          },
          {
            type: 'FormItemGroup',
            label: '审核信息',
          },
          {
            type: 'TextArea',
            field: 'reason',
            label: '审核备注',
          },
        ]}
        custnode={
          <Form.Item {...tailFormItemLayout}>
            {(req.fields.verifyState && req.fields.verifyState.value !== 2) ?
              <Button type="primary" onClick={(e) => { this.props.handleSubmit('pass', form, e); }}>审核通过</Button>
            : null}
            &emsp;
            {(req.fields.verifyState && req.fields.verifyState.value === 0) ?
              <Button type="danger" onClick={(e) => { this.props.handleSubmit('reject', form, e); }}>驳回</Button>
            : null}
          </Form.Item>
        }
      />
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    fetchCommonHsmjCategory: (value) => {
      console.log(value);
      dispatch({ type: `${pagespace}/fetchCommonHsmjCategory`, payload: value });
    },
    handleSubmit: (type, form, e) => {
      // 阻止表单提交
      if (e) { e.preventDefault(); }
      // 验证表单
      form.validateFields((err, values) => {
        if (!err) {
          console.log(form.getFieldsValue());
          // 更新表单参数
          dispatch({
            type: `${pagespace}/updateFormReq`,
            payload: form.getFieldsValue(),
          });
          // 审核
          dispatch({
            type: `${pagespace}/${insertrow}`,
            payload: type,
          });
        }
      });
    },
    setEqual: (type, form, e) => {
      // 阻止表单提交
      if (e) { e.preventDefault(); }
      // 验证表单
      const fieldsValue = form.getFieldsValue();
      if (fieldsValue.skuList && fieldsValue.skuList.length > 0) {
        fieldsValue.skuList.map((item, index) => {
          if (index > 0) {
            item[type] = fieldsValue.skuList[0][type];
          }
          return item;
        });
      }
      // 更新表单参数
      dispatch({
        type: `${pagespace}/updateFormReq`,
        payload: fieldsValue,
      });
    },
    handleSyncData: (form, e) => {
      // 阻止表单提交
      if (e) { e.preventDefault(); }
      // 验证表单
      const fieldsValue = form.getFieldsValue();

      let fristLadderPrice = null;
      if (fieldsValue.ladderPriceList && fieldsValue.ladderPriceList.length > 0) {
        fieldsValue.ladderPriceList.map((item, index) => {
          if (index === 0) {
            fristLadderPrice = fieldsValue.ladderPriceList[0].buyPrice;
          }
          return item;
        });
      }
      if (fieldsValue.skuList && fieldsValue.skuList.length > 0) {
        fieldsValue.skuList.map((item, index) => {
          item.buyPrice = fristLadderPrice;
          return item;
        });
      }
      // 更新表单参数
      dispatch({
        type: `${pagespace}/updateFormReq`,
        payload: fieldsValue,
      });
    },
  };
}

function mapStateToProps(state, ownProps) {
  return {
    pagedata: state[pagespace],
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManagerProductAudit);
