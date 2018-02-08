import React from 'react';
import { connect } from 'dva';
import { Button, Icon } from 'antd';
import { imageRealUrl } from '../../../utils/handleData';
import FormPage from '../../../components/FormPage';
// 本页样式
import styles from './detail.less';

const pagespace = 'optColumnDetail';
const insertrow = 'fetchAdd';
const updaterow = 'fetchEdit';

class OptColumnDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    fileList: [],
  }

  componentWillReceiveProps(nextProps) {
    const { figureUrl } = nextProps.pagedata.req.fields;
    if (figureUrl && figureUrl.value) {
      const nowUrl = (figureUrl.value.file) ? imageRealUrl(figureUrl.value.file.response.data) : imageRealUrl(figureUrl.value);
      this.setState({
        fileList: [{
          uid: -1,
          name: 'xxx.png',
          status: 'done',
          url: nowUrl,
          thumbUrl: nowUrl,
        }],
      });
    }
  }

  handleChange = (info) => {
    let fileList = info.fileList;

    // 1. Limit the number of uploaded files
    // 1. 限制上传文件的数量
    //    Only to show two recent uploaded files, and old ones will be replaced by the new
    //    只显示两个最近上传的文件，旧的将被新的替换
    fileList = fileList.slice(-1);

    // 2. read from response and show file link
    // 2. 从响应中读取并显示文件链接
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        // 组件将显示file.url作为链接
        file.url = file.response.data;
      }
      return file;
    });

    // 3. filter successfully uploaded files according to response from server
    // 3. 根据服务器的响应过滤成功上传文件
    fileList = fileList.filter((file) => {
      if (file.response) {
        return file.response.code === 1;
      }
      return true;
    });

    this.setState({ fileList });
  }

  render() {
    const { form, pagedata } = this.props;
    const { req, res, set } = pagedata;
    const { fields } = req;

    return (
      <FormPage
        namespace={pagespace}
        insertrow={insertrow}
        updaterow={updaterow}
        pagetitle={{
          adds: '新增专栏',
          edit: '编辑专栏信息',
          view: '查看专栏信息',
        }}
        itemdata={[
          {
            type: 'FormItemGroup',
            label: '基本信息',
          },
          {
            type: 'Input',
            field: 'name',
            label: '专栏名称',
            required: true,
            requiredmsg: '请输入专栏名称',
          },
          {
            type: 'Upload',
            field: 'figureUrl',
            label: '专栏图标',
            required: true,
            requiredmsg: '请输入专栏图标',
            buttonText: '点击上传',
            configs: {
              action: iface.sellProductUploadfile,
              withCredentials: true,
              listType: 'picture',
              accept: '.jpg,.png',
              name: 'file',
              className: styles.uploadList,
              fileList: this.state.fileList,
              onChange: this.handleChange,
            },
            children: () => <Button> <Icon type="upload" /> 上传图片</Button>,
          },
          {
            type: 'Input',
            field: 'sequence',
            label: '排序',
          },
          {
            type: 'Radio',
            field: 'isEnable',
            label: '是否启用',
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

function mapStateToProps(state, ownProps) {
  return {
    pagedata: state[pagespace],
    locale: state.ssr.locale,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OptColumnDetail);
