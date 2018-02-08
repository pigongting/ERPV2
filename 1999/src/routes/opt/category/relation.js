import React from 'react';
import { connect } from 'dva';
import cs from 'classnames';
// antd 组件
import { Form, Layout, Button, Input, Cascader, Row, Col, Pagination, Icon } from 'antd';
// 表单配置
import { formItemLayout, tailFormItemLayout } from '../../../../config/formConfig';
import { imageRealUrl } from '../../../utils/handleData';
// 本页样式
import styles from './relation.less';

// antd 组件扩展
const { Header, Content } = Layout;

const pagespace = 'optcategoryrelation';

class OptCategoryRelation extends React.Component {
  constructor(props) {
    super(props);
    this.props.pagedata.form = this.props.form;
  }

  render() {
    const { form, pagedata } = this.props;
    const { req, res } = pagedata;
    const { fields, page } = req;
    const { rows, category } = res;
    const { getFieldDecorator } = form;

    return (
      <Form className="formPage" id="editMode" onSubmit={(e) => { this.props.handleSubmit(form, e); }}>
        <Layout className="formPageLayout">
          <Header className="formPageHeader">
            <div className="pageTitle">关联运营分类商品</div>
            <div className="pageOperat">
              <Form.Item>
                <Button type="primary" htmlType="submit">提交</Button>
              </Form.Item>
            </div>
          </Header>
          <Content className="formPageContent allPageContent" id="formScrollContent">
            <Row>
              <Col span={12}>
                <div className={styles.leftWarp}>
                  <div className={styles.optcolumnInfo}>
                    <div className={styles.imgBox} style={{ backgroundImage: `url(${fields.figureUrl && imageRealUrl(fields.figureUrl.value)})` }} />
                    <div className={styles.textBox}>
                      <div className={styles.lead}>{fields.name && fields.name.value}</div>
                      <div className={styles.vice}>商品数量：{fields.productAmount && fields.productAmount.value}</div>
                      <div className={styles.vice}>创建时间：{fields.createTime && fields.createTime.value.format('YYYY-MM-DD')}</div>
                    </div>
                  </div>
                  <dl className={styles.productChose}>
                    <dt>已关联商品</dt>
                    <dd>
                      {
                        (fields.productIds && fields.productIds.value && fields.productIds.value.length > 0) ?
                        fields.productIds.value.map((item) => {
                          return (
                            <div key={item.id} className={styles.productItem}>
                              <div className={styles.imgBox} style={{ backgroundImage: `url(${imageRealUrl(item.pictureUrl)})` }} />
                              <div className={styles.lead}>{item.listPrice}/{item.unitName}</div>
                              <div className={styles.vice}>{item.name}</div>
                              <div className={styles.icon} onClick={() => { this.props.deleteChose(item, fields); }}><Icon type="close-circle" /></div>
                            </div>
                          );
                        }) : null
                      }
                    </dd>
                  </dl>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.rightWarp}>
                  <div className={styles.productSearch}>
                    <div className="formGroup">搜索并选择关联商品</div>
                    <Form.Item {...formItemLayout} label="选择分类">
                      {getFieldDecorator('cid', {})(<Cascader
                        size="default"
                        allowClear
                        placeholder="请选择"
                        changeOnSelect
                        getPopupContainer={() => document.getElementById('formScrollContent')}
                        options={category}
                        loadData={this.props.asynloadCategory}
                        onPopupVisibleChange={(category === undefined) ? this.props.asynloadCategory : () => {}}
                        onChange={this.props.changeCategory}
                      />)}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="商品名称">
                      {getFieldDecorator('searchkey', {})(<Input />)}
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                      <Button type="primary" onClick={(e) => { this.props.searchProduct(form, e); }}>搜索</Button>
                    </Form.Item>
                  </div>
                  {(rows && rows.length > 0) ?
                    <div className={styles.productHaveList}>
                      <div className={styles.productList}>
                        {rows.map((item) => {
                          return (
                            <div key={item.id} className={styles.productItem}>
                              <div className={styles.imgBox} style={{ backgroundImage: `url(${imageRealUrl(item.pictureUrl)})` }} />
                              <div className={styles.lead}>{item.listPrice}</div>
                              <div className={styles.vice}>{item.name}</div>
                              <div className={cs(styles.icon, fields.choseArr.value.includes(item.id) ? 'chose' : '')} onClick={() => { this.props.switchChose(item, fields); }}><Icon type="check-circle" /></div>
                            </div>
                          );
                        })}
                      </div>
                    </div> :
                    <div className={styles.productNoneList}>暂无数据</div>
                  }
                  <div className={styles.productPage}>
                    <Pagination
                      showQuickJumper
                      defaultCurrent={1}
                      defaultPageSize={20}
                      current={page.page}
                      pageSize={page.limit}
                      total={page.total}
                      onChange={(curpage, pageSize) => { this.props.handlePageChange(this, curpage, pageSize); }}
                      showTotal={(total, range) => { return `第 ${range[0]} - ${range[1]} 行，共 ${total} 行`; }}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Form>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    handleSubmit: (form, e) => {
      // 阻止表单提交
      if (e) { e.preventDefault(); }
      // 验证表单
      form.validateFields((err, values) => {
        if (!err) {
          const formvalue = form.getFieldsValue();
          console.log(formvalue);
          // 更新表单参数
          dispatch({
            type: `${pagespace}/updateFormReq`,
            payload: formvalue,
          });
          // 提交
          dispatch({ type: `${pagespace}/fetchOptCategoryRelation` });
        }
      });
    },
    asynloadCategory: (selectedOptions) => {
      // console.log(selectedOptions);
      let cid = '';
      if (Object.prototype.toString.call(selectedOptions) === '[object Array]') {
        cid = selectedOptions[selectedOptions.length - 1];
      }
      dispatch({ type: `${pagespace}/fetchSellCategoryList`, payload: cid });
    },
    changeCategory: (value, selectedOptions) => {
      // console.log(value);
      // console.log(selectedOptions);
      dispatch({ type: `${pagespace}/updateFormReq`, payload: { cid: value } });
    },
    searchProduct: (form, e) => {
      // 验证表单
      form.validateFields((err, values) => {
        if (!err) {
          const formvalue = form.getFieldsValue();
          // 更新表单参数
          dispatch({
            type: `${pagespace}/updateFormReq`,
            payload: formvalue,
          });
          dispatch({
            type: `${pagespace}/fetchManagerProductList`,
            payload: { page: 1, limit: 20 },
            other: true,
            options: {
              formFilters: {
                name: { value: formvalue.searchkey },
                cid: { value: (formvalue.cid && formvalue.cid.length > 0) ? formvalue.cid[formvalue.cid.length - 1] : undefined },
              },
            },
          });
        }
      });
    },
    // 切换分页
    handlePageChange: (that, curpage, pageSize) => {
      console.log(that);
      const { searchkey, cid } = that.props.pagedata.req.fields;
      dispatch({
        type: `${pagespace}/fetchManagerProductList`,
        payload: { page: curpage, limit: pageSize },
        other: true,
        options: {
          formFilters: {
            name: { value: searchkey.value },
            cid: { value: (cid.value && cid.value.length > 0) ? cid.value[cid.value.length - 1] : undefined },
          },
        },
      });
    },
    deleteChose: (item, fields) => {
      const { productIds } = fields;
      const data = productIds.value;
      const newData = [];
      const newDataArr = [];

      data.map((ele) => {
        if (item.id !== ele.id) {
          newData.push(ele);
          newDataArr.push(ele.id);
        }
        return ele;
      });

      dispatch({
        type: `${pagespace}/updateFormReq`,
        payload: {
          productIds: newData,
          choseArr: newDataArr,
        },
      });
    },
    switchChose: (item, fields) => {
      const { productIds, choseArr } = fields;
      const data = productIds.value;
      const dataArr = choseArr.value;
      let newData = [];
      let newDataArr = [];

      if (dataArr.includes(item.id)) {
        data.map((ele) => {
          if (item.id !== ele.id) {
            newData.push(ele);
            newDataArr.push(ele.id);
          }
          return ele;
        });
      } else {
        data.push(item);
        dataArr.push(item.id);
        newData = [...data];
        newDataArr = [...dataArr];
      }

      dispatch({
        type: `${pagespace}/updateFormReq`,
        payload: {
          productIds: newData,
          choseArr: newDataArr,
        },
      });
    },
  };
}

function mapStateToProps(state, ownProps) {
  return {
    pagedata: state[pagespace],
    locale: state.ssr.locale,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({
  mapPropsToFields(props) {
    const { pagedata } = props;
    const { req, form } = pagedata;
    const { fields } = req;
    // console.log(fields);
    // console.log(form);
    const formdata = form && form.getFieldsValue();
    const newmap = {};

    for (const key in formdata) {
      if (Object.prototype.hasOwnProperty.call(formdata, key)) {
        const formkeyvalue = formdata[key];
        const fieldskeyvalue = fields[key] && fields[key].value;
        const fieldskeycover = fields[key] && fields[key].cover;

        if (formkeyvalue !== undefined) {
          newmap[key] = { value: fieldskeycover ? fieldskeyvalue : formkeyvalue };
        } else if (fieldskeyvalue !== undefined) {
          newmap[key] = fields[key];
        } else {
          newmap[key] = undefined;
        }
      }
    }
    // console.log(newmap);
    return newmap;
  },
})(OptCategoryRelation));
