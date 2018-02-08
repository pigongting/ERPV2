import update from 'immutability-helper';
import React from 'react';
import { Select } from 'antd';

const Option = Select.Option;

const emptyFn = () => {};

class SearchInput extends React.Component {
  constructor(props) {
    super(props);

    // console.log(this.props);

    this.state = {
      options: this.props.options || [],
      loadData: this.props.loadData || emptyFn,
      field: this.props.field || 'value',
      name: this.props.name || 'text',
      value: (this.props.value) ? { key: this.props.value.key || '', label: this.props.value.label || '' } : { key: '', label: '' },
    };
  }
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    this.setState({
      options: nextProps.options || [],
      loadData: nextProps.loadData || emptyFn,
      field: nextProps.field || 'value',
      name: nextProps.name || 'text',
      value: (nextProps.value) ? { key: nextProps.value.key || '', label: nextProps.value.label || '' } : { key: '', label: '' },
    });

    if (nextProps.value && nextProps.value.label && this.state.options.length < 0) {
      this.state.loadData(nextProps.value.label);
    }
  }
  handleChange = (value) => {
    console.log(value);
    this.props.value.key = value.key;
    this.props.value.label = value.label;
    this.setState({ value });
  }
  handleSearch = (value) => {
    if (value) { this.state.loadData(value); }
  }
  render() {
    const { size } = this.props;
    const state = this.state;
    const options = state.options.map(d => <Option key={d[state.field]}>{d[state.name]}</Option>);
    return (
      <Select
        showSearch
        labelInValue
        filterOption={false}
        notFoundContent={'加载中...'}
        getPopupContainer={() => document.getElementById('formScrollContent')}
        defaultActiveFirstOption={false}
        value={state.value}
        onFocus={(state.options.length > 0) ? emptyFn : state.loadData}
        onChange={this.handleChange}
        onSearch={this.handleSearch}
      >
        {options}
      </Select>
    );
  }
}

export default { SearchInput };
