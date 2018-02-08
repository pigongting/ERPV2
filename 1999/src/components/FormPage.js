import React from 'react';
import { connect } from 'dva';
// antd 组件
import { Form, Layout, Button, Input, Select, Cascader, Radio, DatePicker, Checkbox, Tree, Upload, Icon } from 'antd';
// 表单配置
import { formItemLayout, tailFormItemLayout } from '../../config/formConfig';
// 自定义的组件
import { TreeCheckbox } from './TreeCheckbox';
import { EditTable } from './EditTable';
import { SearchInput } from './SearchInput';
// antd 组件扩展
const { Header, Content } = Layout;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
const TreeNode = Tree.TreeNode;

class FormPage extends React.Component {
  constructor(props) {
    super(props);
    this.props.pagedata.form = this.props.form;
  }

  componentDidMount() {
    const { itemdata } = this.props;

    if (itemdata) {
      itemdata.map((item, index) => {
        if (item.asynload) {
          item.asynload(true);
        }
        return item;
      });
    }
  }

  render() {
    const { form, namespace, pagedata, pagetitle, itemdata, cobutton, custnode } = this.props;
    const { req, res, set } = pagedata;
    const { getFieldDecorator } = form;

    const formitem = () => {
      const formItemNode = [];

      itemdata.map((item, index) => {
        switch (item.type) {
          case 'FormItemGroup':
            formItemNode.push(<div key={index} className="formGroup">{item.label}</div>);
            break;
          case 'Text':
            formItemNode.push(<Form.Item {...formItemLayout} key={index} label={item.label} hasFeedback>
              <div className="viewText">{req.fields[item.field] && req.fields[item.field].value}</div>
            </Form.Item>);
            break;
          case 'Input':
            if (item.visible !== false) {
              formItemNode.push(<Form.Item {...formItemLayout} key={index} label={item.label} hasFeedback>
                {
                  (set.mode === 'view')
                  ? <div className="viewText">{req.fields[item.field] && req.fields[item.field].value}</div>
                  : getFieldDecorator(item.field, {
                    rules: [
                      { required: item.required || false, message: item.requiredmsg },
                      { pattern: item.pattern || false, message: item.patternmsg },
                    ],
                  })(<Input disabled={item.disabled} />)
                }
              </Form.Item>);
            }
            break;
          case 'TextArea':
            formItemNode.push(<Form.Item {...formItemLayout} key={index} label={item.label}>
              {
                (set.mode === 'view')
                ? <div className="viewText">{req.fields[item.field] && req.fields[item.field].value}</div>
                : getFieldDecorator(item.field, {
                  rules: [
                    { required: item.required || false, message: item.requiredmsg },
                    { pattern: item.pattern || false, message: item.patternmsg },
                  ],
                })(<TextArea disabled={item.disabled || set.mode === 'view'} autosize={{ minRows: 4, maxRows: 6 }} />)
              }
            </Form.Item>);
            break;
          case 'Select':
            formItemNode.push(<Form.Item {...formItemLayout} key={index} label={item.label}>
              {
                getFieldDecorator(item.field, {
                  rules: [
                    { required: item.required || false, message: item.requiredmsg },
                  ],
                })(<Select
                  placeholder="请选择"
                  notFoundContent="加载中..."
                  onFocus={(res[item.field]) ? () => {} : item.focusload || item.asynload}
                  getPopupContainer={() => document.getElementById('formScrollContent')}
                  disabled={item.disabled || set.mode === 'view'}
                  onChange={item.onChange}
                >
                  {res[item.field] && res[item.field].map((ele, i) =>
                    <Select.Option key={i} value={`${ele[item.field]}`}>{ele[item.name]}</Select.Option>,
                  )}
                </Select>)
              }
            </Form.Item>);
            break;
          case 'Cascader':
            formItemNode.push(<Form.Item {...formItemLayout} key={index} label={item.label}>
              {getFieldDecorator(item.field, {
                rules: [
                  { required: item.required || false, message: item.requiredmsg },
                ],
              })(<Cascader
                getPopupContainer={() => document.getElementById('formScrollContent')}
                placeholder="请选择"
                options={res[item.field]}
                loadData={item.asynload}
                onPopupVisibleChange={(res[item.field] === undefined) ? item.asynload : () => {}}
                changeOnSelect={item.changeOnSelect}
                disabled={item.disabled || set.mode === 'view'}
              />)}
            </Form.Item>);
            break;
          case 'Radio':
            formItemNode.push(<Form.Item {...formItemLayout} key={index} label={item.label}>
              {
                (set.mode === 'view')
                ? <div className="viewText">{
                  item.options.map((ele, i) => {
                    if (req.fields[item.field] && req.fields[item.field].value && req.fields[item.field].value === ele.value) {
                      return ele.name;
                    } else {
                      return null;
                    }
                  })
                }</div>
                : getFieldDecorator(item.field, {
                  rules: [
                    { required: item.required || false, message: item.requiredmsg },
                  ],
                })(<Radio.Group disabled={item.disabled} onChange={item.onChange}>{
                  item.options.map((ele, i) => <Radio key={i} value={ele.value}>{ele.name}</Radio>)
                }</Radio.Group>)
              }
            </Form.Item>);
            break;
          case 'CheckboxGroup':
            formItemNode.push(<Form.Item {...formItemLayout} key={index} label={item.label}>
              {
                (set.mode === 'view')
                ? <div className="viewText">{
                  res[item.field] && res[item.field].map((ele, i) => {
                    if (req.fields[item.field] && req.fields[item.field].value && req.fields[item.field].value.includes(ele.value)) {
                      return (i === 0) ? ele.label : `、${ele.label}`;
                    } else {
                      return null;
                    }
                  })
                }</div>
                : getFieldDecorator(item.field, {})(<CheckboxGroup options={res[item.field]} />)
              }
            </Form.Item>);
            break;
          case 'DatePicker':
            formItemNode.push(<Form.Item {...formItemLayout} key={index} label={item.label}>
              {
                (set.mode === 'view')
                ? <div className="viewText">{req.fields[item.field] && req.fields[item.field].value && req.fields[item.field].value.format('YYYY-MM-DD')}</div>
                : getFieldDecorator(item.field, {})(<DatePicker disabled={item.disabled} />)
              }
            </Form.Item>);
            break;
          case 'TreeCheckbox':
            formItemNode.push(<Form.Item {...formItemLayout} key={index} label={item.label}>
              {
                (set.mode === 'view')
                ? <div className="viewText">
                  {req.fields[item.field] && req.fields[item.field].value && req.fields[item.field].value.map((ele, i) => {
                    return (<div key={ele.value}>{ele.label}</div>);
                  })}
                </div>
                : getFieldDecorator(item.field, {})(
                  <TreeCheckbox
                    treeData={res[item.treefield]}
                    loadData={item.loadData}
                    disabled={item.disabled}
                  />,
                )
              }
            </Form.Item>);
            break;
          case 'EditTable':
            formItemNode.push(<Form.Item key={index}>
              {
                (set.mode === 'view')
                ? <div className="viewText">
                  {req.fields[item.field] && req.fields[item.field].value && req.fields[item.field].value.map((ele, i) => {
                    return (<div key={ele.value}>{ele.label}</div>);
                  })}
                </div>
                : getFieldDecorator(item.field, {})(
                  <EditTable
                    dataSource={item.dataSource}
                    columns={item.columns}
                    custom={item.custom}
                    onChange={item.onChange}
                  />,
                )
              }
            </Form.Item>);
            break;
          case 'SearchInput':
            formItemNode.push(<Form.Item {...formItemLayout} key={index} label={item.label}>
              {
                (set.mode === 'view')
                ? <div className="viewText">
                  {req.fields[item.field] && req.fields[item.field].value && req.fields[item.field].value.map((ele, i) => {
                    return (<div key={ele.value}>{ele.label}</div>);
                  })}
                </div>
                : getFieldDecorator(item.field, {
                  rules: [
                    { required: item.required || false, message: item.requiredmsg },
                  ],
                })(
                  <SearchInput
                    options={res[item.field]}
                    field={item.field}
                    name={item.name}
                    loadData={item.loadData}
                  />,
                )
              }
            </Form.Item>);
            break;
          case 'Upload':
            formItemNode.push(<Form.Item {...formItemLayout} key={index} label={item.label}>
              {
                (set.mode === 'view')
                ? <div className="viewText">{req.fields[item.field] && req.fields[item.field].value}</div>
                : getFieldDecorator(item.field, {})(<Upload {...item.configs}>{item.children()}</Upload>)
              }
            </Form.Item>);
            break;
          default:
            break;
        }

        return item;
      });

      return formItemNode;
    };

    return (
      <Form className="formPage" id={`${set.mode}Mode`} onSubmit={(e) => { this.props.handleSubmit(set.mode, form, e); }}>
        <Layout className="formPageLayout">
          <Header className="formPageHeader">
            <div className="pageTitle">{pagetitle[set.mode]}</div>
            {(cobutton !== false && set.mode !== 'view') ? <div className="pageOperat">
              <Form.Item>
                <Button type="primary" htmlType="submit">提交</Button>
              </Form.Item>
              &emsp;
              <Form.Item>
                <Button onClick={() => { this.props.handleReset(form); }}>重置</Button>
              </Form.Item>
            </div> : null}
          </Header>
          <Content className="formPageContent allPageContent" id="formScrollContent">
            {itemdata && formitem()}
            {custnode || null}
          </Content>
        </Layout>
      </Form>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const { namespace, insertrow, updaterow, beforesubmit } = ownProps;
  return {
    handleSubmit: (mode, form, e) => {
      // 阻止表单提交
      if (e) { e.preventDefault(); }
      // 验证表单
      form.validateFields((err, values) => {
        if (!err) {
          console.log(form.getFieldsValue());
          if (beforesubmit) { beforesubmit(); }
          // 更新表单参数
          dispatch({
            type: `${namespace}/updateFormReq`,
            payload: form.getFieldsValue(),
          });
          if (mode === 'adds') {
            // 插入
            dispatch({
              type: `${namespace}/${insertrow}`,
            });
          } else if (mode === 'edit') {
            // 更新
            dispatch({
              type: `${namespace}/${updaterow}`,
            });
          }
        }
      });
    },
    handleReset: (form) => {
      form.resetFields();
    },
  };
}

function mapStateToProps(state, ownProps) {
  const { namespace } = ownProps;
  return {
    pagedata: state[namespace],
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
})(FormPage));
