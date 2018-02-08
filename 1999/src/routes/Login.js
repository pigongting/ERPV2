import React from 'react';
import cs from 'classnames';
import { connect } from 'dva';
import { Layout, Form, Input, Button, Icon, Alert } from 'antd';
import styles from './Login.less';

const { Content } = Layout;

const pagespace = 'login';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.props.pagedata.form = this.props.form;
    this.state = {
      showVCode: false,
      loginError: null,
      fieldsError: null,
    };
  }

  componentDidMount() {
    this.props.form.validateFields();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pagedata.set.loginNum > this.props.pagedata.set.loginNum && nextProps.pagedata.set.loginNum >= 1) {
      this.setState({
        showVCode: true,
      });
    }

    if (nextProps.pagedata.res.loginError !== null) {
      this.setState({
        loginError: (this.showError === false) ? { ...nextProps.pagedata.res.loginError } : null,
      });

      nextProps.pagedata.res.loginError = null;

      if (this.showError === false) { this.showError = true; }
    }
  }

  showError = false;

  changeFormData = () => {
    this.showError = false;
    this.setState({
      loginError: null,
    });
  }

  changeVcode = (e) => {
    e.target.src = `${window.apiPrefix}code?${new Date().getTime()}`;
  }

  render() {
    const { form, pagedata } = this.props;
    const { req, res, set } = pagedata;
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = form;
    const { showVCode, loginError, fieldsError } = this.state;

    // Only show error after a field is touched.
    let usernameError = null;
    let passwordError = null;
    let validateCodeError = null;

    if (fieldsError) {
      usernameError = getFieldError('loginName');
      passwordError = getFieldError('loginPwd');
      validateCodeError = getFieldError('validateCode');
    } else {
      usernameError = isFieldTouched('loginName') && getFieldError('loginName');
      passwordError = isFieldTouched('loginPwd') && getFieldError('loginPwd');
      validateCodeError = isFieldTouched('validateCode') && getFieldError('validateCode');
    }

    return (
      <Layout className={styles.loginPage}>
        <Content className={styles.loginContent}>
          <div className={styles.formWarp}>

            <div className={styles.formBox}>
              <div className={styles.formPosition}>

                <Form onSubmit={(e) => { this.props.submitForm(set.mode, form, e, this); }}>

                  <Form.Item
                    validateStatus={usernameError ? 'error' : ''}
                    help={usernameError || ''}
                  >
                    {getFieldDecorator('loginName', {
                      rules: [{ required: true, message: '请输入登录名！' }],
                    })(
                      <Input prefix={<i className={styles.nameicon} />} placeholder="登录名" onChange={this.changeFormData} />,
                    )}
                  </Form.Item>

                  <input type="password" className={styles.hidePassword} tabIndex={-1} />

                  <Form.Item
                    validateStatus={passwordError ? 'error' : ''}
                    help={passwordError || ''}
                  >
                    {getFieldDecorator('loginPwd', {
                      rules: [{ required: true, message: '请输入登录密码！' }],
                    })(
                      <Input prefix={<i className={styles.passwordicon} />} type="password" placeholder="登录密码" onChange={this.changeFormData} />,
                    )}
                  </Form.Item>

                  {showVCode ?
                    <Form.Item
                      validateStatus={validateCodeError ? 'error' : ''}
                      help={validateCodeError || ''}
                    >
                      {getFieldDecorator('validateCode', {
                        rules: [{ required: true, message: '请输入验证码！' }],
                      })(
                        <Input className={styles.vcode} prefix={<i className={styles.vcodeicon} />} placeholder="验证码" onChange={this.changeFormData} />,
                      )}
                      <div className={styles.vcodeimg}>
                        <img src={`${window.apiPrefix}code`} alt="验证码" onClick={this.changeVcode} />
                      </div>
                    </Form.Item>
                    : null}

                  <Form.Item className={styles.submitWarp}>
                    <Button
                      className={styles.submitButton}
                      type="primary"
                      size="large"
                      htmlType="submit"
                    >登录</Button>
                  </Form.Item>

                </Form>
                {loginError && loginError.message ? <Alert message={loginError.message} type="error" showIcon /> : null}
              </div>
            </div>

            <div className={styles.footerWarp}>
              <ul className={styles.friendLink}>
                <li><a href={window.wolianw1988}>我连战略联盟供应中心</a></li>
                <li><a href={window.wolianw1588}>我连农村电商服务中心</a></li>
                <li><a href={window.wolianw1588}>我连农场服务中心</a></li>
                <li><a href={window.wolianw1788}>我连商超服务中心</a></li>
                <li><a href={window.wolianw1788}>我连智慧生活馆</a></li>
              </ul>
              <dl className={styles.copyright}>
                <dt>Copyright©2015wolianw.com,All Rights Reserved  使用本网站即表示接受我和网用户协议。版权所有 深圳我和网科技有限公司</dt>
                <dd>粤公网安备 44010602002564号 粤ICP备13011817号-5  ICP经营许可证：粤B2-20160462</dd>
              </dl>
            </div>

          </div>
        </Content>
      </Layout>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    hasErrors: (fieldsError) => {
      return Object.keys(fieldsError).some(field => fieldsError[field]);
    },
    submitForm: (mode, form, e, that) => {
      // 阻止表单提交
      e.preventDefault();
      // 验证表单
      form.validateFields((error, values) => {
        if (!error) {
          // 更新表单参数
          dispatch({
            type: `${pagespace}/updateFormReq`,
            payload: form.getFieldsValue(),
          });

          if (typeof window !== 'undefined') {
            import(/* webpackChunkName: "base64.js" */ '../utils/base64.js')
            .then(({ Base64 }) => {
              // 请求接口
              dispatch({
                type: `${pagespace}/fetchLogin`,
                payload: Base64,
              });
            })
            .catch(err => console.log('Failed to load moment', err));
          }
        } else {
          that.setState({
            fieldsError: error,
          });
        }
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

    for (const key in fields) {
      if (Object.prototype.hasOwnProperty.call(fields, key)) {
        const fieldskeyvalue = fields[key].value;
        const formkeyvalue = formdata && formdata[key];

        if (fieldskeyvalue !== undefined) {
          newmap[key] = fields[key];
        } else if (formkeyvalue !== undefined) {
          newmap[key] = { value: formkeyvalue };
        } else {
          newmap[key] = undefined;
        }
      }
    }
    // console.log(newmap);
    return newmap;
  },
})(Login));
