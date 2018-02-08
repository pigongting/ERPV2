import update from 'immutability-helper';
import React from 'react';
import { Table, Input } from 'antd';
import { twoDecimal } from '../utils/handleData';

class EditTable extends React.Component {
  constructor(props) {
    super(props);

    // console.log(this.props);

    if (this.props.columns) {
      this.props.columns.map((item) => {
        if (item.editable === true) {
          item.render = (text, record, index) => {
            return (
              <div><Input type="number" value={text} onChange={(e) => { this.handleChangePrice(e, record, item.dataIndex); }} /></div>
            );
          };
        }
        return item;
      });
    }

    this.state = {
      dataSource: this.props.dataSource || [],
      columns: this.props.columns || [],
      custom: this.props.custom || null,
    };
  }
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    if (nextProps.columns) {
      nextProps.columns.map((item) => {
        if (item.editable === true) {
          item.render = (text, record, index) => {
            return (
              <div><Input type="number" value={text} onChange={(e) => { this.handleChangePrice(e, record, item.dataIndex); }} /></div>
            );
          };
        }
        return item;
      });
    }

    this.setState({
      dataSource: nextProps.dataSource || [],
      columns: nextProps.columns || [],
      custom: nextProps.custom || null,
    });
  }
  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(changedValue);
    }
  }
  handleChangePrice = (e, record, field) => {
    if (this.props.value) {
      this.props.value.map((item, index) => {
        if (item.id === record.id) { item[field] = twoDecimal(e.target.value, 2); }
        return item;
      });
    }

    this.state.dataSource.map((item, index) => {
      if (item.id === record.id) {
        item[field] = twoDecimal(e.target.value, 2);
      }
      return item;
    });

    this.setState({
      dataSource: [...this.state.dataSource] || [],
    });

    this.triggerChange([...this.state.dataSource]);
  }
  render() {
    // console.log(this.props.value);
    const state = this.state;
    // console.log(state.dataSource);

    return (
      <div>
        {(state.dataSource.length > 0) ? <Table
          bordered
          size="small"
          pagination={false}
          dataSource={state.dataSource}
          columns={state.columns}
        /> : null}
      </div>
    );
  }
}

export default { EditTable };
