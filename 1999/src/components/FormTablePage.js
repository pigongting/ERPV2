import React from 'react';
import update from 'immutability-helper';
import cs from 'classnames';
import { connect } from 'dva';
// antd 组件
import { Form, Table, Layout, Button, Input, Select, Cascader, Radio, DatePicker, Pagination, Dropdown, Modal, Checkbox, Row, Col, Menu, Icon } from 'antd';
// antd 组件扩展
const { Header, Content } = Layout;
const { RangePicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

// 获取当前列
const getNowColumns = (columns, showColumns, req) => {
  const nowColumns = [];
  columns.map((item, index) => {
    if (showColumns.includes(item.title) || item.key === 'operation') {
      const newitem = item;
      if (newitem.sorter) { newitem.sortOrder = req.orders[newitem.dataIndex] || null; }
      if (newitem.filters) { newitem.filteredValue = req.tableFilters[newitem.dataIndex] || null; }
      if (newitem.key === 'operation') { newitem.className = newitem.className || 'operationColumn'; }
      if (!newitem.permission) { nowColumns.push(newitem); }
    }
    return item;
  });
  return nowColumns;
};

class FormTablePage extends React.Component {
  constructor(props) {
    super(props);
    const { pagedata, form, columns } = this.props;
    const { showColumns } = pagedata.set;

    pagedata.form = form;

    this.state = {
      nowColumns: getNowColumns(columns, showColumns, pagedata.req),
      tableSize: 'middle',
      setColumnModalVisible: false,
      localUpdate: false,
    };
  }

  componentDidMount() {
    const { formItems } = this.props;

    if (formItems) {
      formItems.map((item, index) => {
        if (item.asynload) {
          item.asynload(true);
        }
        return item;
      });
    }

    document.addEventListener('visibilitychange', this.listenVisibilityChange);
  }

  componentWillReceiveProps(nextProps) {
    const { req: nextreq, res: nextres, set: nextset } = nextProps.pagedata;
    const { req, res, set } = this.props.pagedata;
    const { columns } = this.props;

    // 外部数据变化时，显示列数据变化时，重新渲染表单
    if (nextset.showColumns !== set.showColumns || nextreq.orders !== req.orders) {
      this.setState(update(this.state, { nowColumns: { $set: getNowColumns(columns, nextset.showColumns, nextreq) } }));
    }
  }

  componentWillUnmount() {
    document.removeEventListener('visibilitychange', this.listenVisibilityChange);
  }

  listenVisibilityChange = () => {
    if (document.hidden === false) {
      // console.log('重载列表');
      this.props.handleLocalUpdate(this);
    }
  }

  /* 表格设置菜单 */
  operateTableSetMenu({ item, key, keyPath }) {
    switch (key) {
      case '0':
        this.setState(update(this.state, { tableSize: { $set: 'default' } }));
        break;
      case '1':
        this.setState(update(this.state, { tableSize: { $set: 'middle' } }));
        break;
      case '2':
        this.setState(update(this.state, { tableSize: { $set: 'small' } }));
        break;
      case '3':
        this.switchSetColumnModalVisible();
        break;
      default:
        break;
    }
  }

  /* 切换设置列模态框可见性 */
  switchSetColumnModalVisible() {
    this.setState(update(this.state, { setColumnModalVisible: { $set: !this.state.setColumnModalVisible } }));
  }

  /* 生成表格设置菜单 */
  generateTabelSetMenu() {
    const { tableSize } = this.state;
    return (
      <Menu onClick={params => this.operateTableSetMenu(params)}>
        <Menu.ItemGroup title="显示密度">
          <Menu.Item key="0" className={(tableSize === 'default') ? 'checkmark' : ''}>标准</Menu.Item>
          <Menu.Item key="1" className={(tableSize === 'middle') ? 'checkmark' : ''}>适中</Menu.Item>
          <Menu.Item key="2" className={(tableSize === 'small') ? 'checkmark' : ''}>紧凑</Menu.Item>
        </Menu.ItemGroup>
        <Menu.Divider />
        <Menu.Item key="3">配置表格列</Menu.Item>
      </Menu>
    );
  }

  /* 生成表单项 */
  generateFormItem() {
    const { form, pagedata, formItems } = this.props;
    const { res } = pagedata;
    const { getFieldDecorator } = form;

    return formItems.map((item, index) => {
      switch (item.type) {
        case 'Select':
          return (<Form.Item key={index} label={item.label}>
            {
              getFieldDecorator(item.field, {
                rules: [
                  { required: item.required || false, message: item.requiredmsg },
                ],
              })(<Select
                mode={item.mode}
                allowClear={item.allowClear}
                dropdownStyle={item.dropdownStyle}
                dropdownMatchSelectWidth={item.dropdownMatchSelectWidth}
                placeholder="请选择"
                notFoundContent="加载中..."
                onFocus={(res[item.field]) ? () => {} : item.asynload}
                getPopupContainer={() => document.getElementById('formScrollContent')}
                disabled={item.disabled}
                style={{ width: item.width }}
                size="default"
                labelInValue={item.labelInValue}
              >
                {res[item.field] && res[item.field].map((ele, i) =>
                  <Select.Option key={i} value={`${ele[item.field]}`}>{ele[item.name]}</Select.Option>,
                )}
              </Select>)
            }
          </Form.Item>);
        case 'Cascader':
          return (<Form.Item key={index} label={item.label}>
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
              disabled={item.disabled}
              style={{ width: item.width }}
              size="default"
            />)}
          </Form.Item>);
        case 'RangePicker':
          return (<Form.Item key={index} label={item.label}>
            {getFieldDecorator(item.field, {
              rules: [
                { required: item.required || false, message: item.requiredmsg },
              ],
            })(<RangePicker size="default" disabled={item.disabled} />)}
          </Form.Item>);
        case 'RadioGroup':
          return (<Form.Item key={index} label={item.label}>
            {getFieldDecorator(item.field, {
              rules: [
                { required: item.required || false, message: item.requiredmsg },
              ],
            })(<RadioGroup options={res[item.field]} />)}
          </Form.Item>);
        default:
          return null;
      }
    });
  }

  /* 生成批量操作 */
  generateBatch(selectedRows, tableSize) {
    if (selectedRows.length > 0) {
      return (
        <div className={cs('batchOperation', tableSize)}>
          <Button type="danger" onClick={() => { this.props.handleBatchDelete(selectedRows); }} icon="delete" autoFocus>删除</Button>
        </div>
      );
    }
    return null;
  }

  /* 清空搜索值 */
  emptySearchValue = () => {
    this.props.form.resetFields(['searchvalue']);
  }

  /* 更新局部更新状态 */
  updateLocalUpdate = (that, value) => {
    that.setState(update(that.state, { localUpdate: { $set: value } }));
  }

  render() {
    const { nowColumns, tableSize, setColumnModalVisible, localUpdate } = this.state;
    const { form, pagedata, loading, searchOptions, searchPlaceholder, headerOperates, formItems, rowSelection } = this.props;
    const { req, res, set } = pagedata;
    const { page } = req;
    const { rows } = res;
    const { fullColumns, showColumns, clickedRows, selectedRows } = set;
    const { getFieldDecorator } = form;
    const formData = form.getFieldsValue();

    return (
      <Form className="formTablePage" onSubmit={(e) => { this.props.handleSubmit(this, form, e); }}>
        <Layout className="tablePage">
          <Header className="tableHeader">
            {searchOptions ? <div className="search">
              <Form.Item>
                {getFieldDecorator('searchkey', {
                  initialValue: searchOptions[0].value,
                })(<Select size="default" dropdownMatchSelectWidth={false}>
                  { searchOptions.map((item, index) => <Select.Option key={index} value={item.value}>{item.title}</Select.Option>) }
                </Select>)}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('searchvalue', {
                })(<Input size="default" placeholder={searchPlaceholder} suffix={formData.searchvalue ? <Icon type="close-circle" onClick={this.emptySearchValue} /> : null} onPressEnter={(e) => { this.props.handleSubmit(this, form); }} />)}
              </Form.Item>
            </div> : null}
            <div className="operate">{headerOperates}</div>
            <div className="pagination">
              <Pagination
                defaultCurrent={1}
                defaultPageSize={20}
                current={page.page}
                pageSize={page.limit}
                total={page.total}
                onChange={(curpage, pageSize) => { this.props.handlePageChange(this, curpage, pageSize); }}
                showTotal={(total, range) => { return `第 ${range[0]} - ${range[1]} 行，共 ${total} 行`; }}
              />
              <Button className="tableReload" style={{ marginLeft: 8 }} onClick={() => { this.props.handleReload(this); }}>
                <i className="tableReloadIcon" />
              </Button>
              <Dropdown overlay={(() => this.generateTabelSetMenu())()} trigger={['click']} placement="bottomRight">
                <Button className="tableSet" style={{ marginLeft: 8 }}><i className="tableSetIcon" /><Icon type="down" /></Button>
              </Dropdown>
              <Modal
                title="配置表格列"
                wrapClassName="columnModal"
                footer={null}
                visible={setColumnModalVisible}
                onCancel={params => this.switchSetColumnModalVisible(params)}
              >
                <Checkbox.Group value={showColumns} onChange={this.props.handleShowColumns}>
                  <Row>
                    {fullColumns.map((item, index) => <Col key={index} span={8}>
                      <Checkbox value={item} disabled={(index < 3)}>{item}</Checkbox>
                    </Col>)}
                  </Row>
                </Checkbox.Group>
              </Modal>
            </div>
          </Header>
          <Content className="tableContent allPageContent" id="formScrollContent">
            {(formItems && formItems.length > 0) ?
              <div className="tableFillter">
                <div className="fillterTitle">筛选项</div>
                {(() => this.generateFormItem())()}
                <div className="fillterOperate">
                  <Form.Item>
                    <Button type="primary" htmlType="submit" size="default">开始筛选</Button>
                  </Form.Item>
                  &emsp;
                  <Form.Item>
                    <Button size="default" onClick={() => { this.props.handleClear(this); }}>清空</Button>
                  </Form.Item>
                </div>
              </div>
            : <div className="tableNoFillter" />}
            {(() => this.generateBatch(selectedRows, tableSize))()}
            <Table
              rowSelection={(rowSelection) ? {
                type: rowSelection.type,
                selections: rowSelection.selections,
                selectedRowKeys: selectedRows,
                onChange: params => this.props.handleSelectedRows(params),
              } : null}
              pagination={false}
              size={tableSize}
              dataSource={rows}
              columns={nowColumns}
              rowClassName={(record) => { return (clickedRows.includes(record.key)) ? 'clicked' : ''; }}
              loading={{ size: 'default', spinning: (localUpdate) ? !localUpdate : loading }}
              locale={{ filterTitle: '筛选', filterConfirm: '确定', filterReset: '重置', emptyText: '暂无数据' }}
              onChange={(pagination, filters, sorter) => { this.props.handleTableChange(this, pagination, filters, sorter); }}
              onRowClick={params => this.props.handleClickedRows(params.key)}
            />
            <div className="tablePagination">
              <Pagination
                showSizeChanger
                showQuickJumper
                defaultCurrent={1}
                defaultPageSize={20}
                current={page.page}
                pageSize={page.limit}
                total={page.total}
                onChange={(curpage, pageSize) => { this.props.handlePageChange(this, curpage, pageSize); }}
                onShowSizeChange={(curpage, pageSize) => { this.props.handlePageChange(this, curpage, pageSize); }}
                showTotal={(total, range) => { return `第 ${range[0]} - ${range[1]} 行，共 ${total} 行`; }}
              />
            </div>
          </Content>
        </Layout>
      </Form>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const { namespace } = ownProps;
  return {
    handleSubmit: (that, form, e) => {
      // 阻止表单提交
      if (e) { e.preventDefault(); }

      // 获取快速跳转页数
      let curpage = 1;
      try {
        const quickJumperValue = parseInt(document.getElementsByClassName('ant-pagination-options-quick-jumper')[0].children[0].value, 10);
        if (!isNaN(quickJumperValue)) { curpage = quickJumperValue; }
      } catch (err) {
        console.log(err);
      }

      // 验证表单
      form.validateFields((err, values) => {
        if (!err) {
          that.props.emptyChoseLine(that);
          console.log('handleSubmit---------------------------->');
          dispatch({ type: `${namespace}/updateFormFillter`, payload: form.getFieldsValue() });
          dispatch({ type: `${namespace}/${that.props.tablefetch || 'fetchTableData'}`, payload: { page: curpage } });
        }
      });
    },
    handleClear: (that) => {
      that.props.emptyChoseLine(that);
      console.log('handleClear---------------------------->');
      dispatch({ type: `${namespace}/clearAllFiltersAndOrders` });
      dispatch({ type: `${namespace}/${that.props.tablefetch || 'fetchTableData'}`, payload: { page: 1 } });
    },
    // 重载当前页
    handleReload: (that) => {
      that.props.emptyChoseLine(that);
      console.log('handleReload---------------------------->');
      dispatch({ type: `${namespace}/${that.props.tablefetch || 'fetchTableData'}` });
    },
    // 局部更新
    handleLocalUpdate: (that) => {
      that.updateLocalUpdate(that, true);
      console.log('handleLocalUpdate---------------------------->');
      dispatch({ type: `${namespace}/${that.props.tablefetch || 'fetchTableData'}` });
    },
    // 切换分页
    handlePageChange: (that, curpage, pageSize) => {
      that.props.emptyChoseLine(that);
      console.log('handlePageChange---------------------------->');
      dispatch({ type: `${namespace}/${that.props.tablefetch || 'fetchTableData'}`, payload: { page: curpage, limit: pageSize } });
    },
    // 表格自带筛选，排序
    handleTableChange: (that, pagination, filters, sorter) => {
      that.props.emptyChoseLine(that);
      console.log('handleTableChange---------------------------->');
      dispatch({ type: `${namespace}/updateTableFillter`, tableFilters: filters, tableSorter: sorter });
      dispatch({ type: `${namespace}/${that.props.tablefetch || 'fetchTableData'}`, payload: { page: 1 } });
    },
    // 设置显示的表格列
    handleShowColumns: (checkedValue) => {
      dispatch({ type: `${namespace}/setTableColumns`, payload: checkedValue });
    },
    // 删除当前选中的行
    handleBatchDelete: (selectedRows) => {
      dispatch({ type: `${namespace}/fetchDeleteRow`, payload: selectedRows });
    },
    // 点击行
    handleClickedRows: (key) => {
      dispatch({ type: `${namespace}/recordClickedRow`, payload: key });
    },
    // 选择行
    handleSelectedRows(selectedRowKeys) {
      dispatch({ type: `${namespace}/recordSelectedRow`, payload: selectedRowKeys });
    },
    // 清空选中行和点击行
    emptyChoseLine: (that) => {
      that.setState(update(that.state, {
        localUpdate: { $set: false },
      }));
      dispatch({ type: `${namespace}/emptyClickedSelectedRow` });
    },
  };
}

function mapStateToProps(state, ownProps) {
  const { namespace, tablefetch } = ownProps;

  return {
    pagedata: state[namespace],
    loading: state.loading.effects[`${namespace}/${tablefetch || 'fetchTableData'}`],
    locale: state.ssr.locale,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({
  mapPropsToFields(props) {
    const { pagedata } = props;
    const { req, form } = pagedata;
    const { formFilters } = req;
    // console.log(formFilters);
    // console.log(form);
    const formNoMapData = form && form.getFieldsValue();
    const newmap = {};

    for (const key in formFilters) {
      if (Object.prototype.hasOwnProperty.call(formFilters, key)) {
        const formFiltersKeyValue = formFilters[key].value;
        const formNoMapKey = formNoMapData && formNoMapData[key];

        if (formFiltersKeyValue !== undefined) {
          newmap[key] = formFilters[key];
        } else if (formNoMapKey !== undefined) {
          newmap[key] = { value: formNoMapKey };
        } else {
          newmap[key] = undefined;
        }
      }
    }
    // console.log(newmap);
    return newmap;
  },
})(FormTablePage));
