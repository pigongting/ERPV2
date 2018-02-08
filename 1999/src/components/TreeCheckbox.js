import update from 'immutability-helper';
import React from 'react';
import { Tree, Checkbox, Button } from 'antd';

import styles from './TreeCheckbox.less';

const TreeNode = Tree.TreeNode;
const CheckboxGroup = Checkbox.Group;

const emptyPromise = new Promise((resolve) => { resolve(); });

class TreeCheckbox extends React.Component {
  constructor(props) {
    super(props);

    // console.log(this.props);

    this.state = {
      options: [],
      treeData: [],
      selectedTreeKeys: [],
      checkedTreeKeys: [],
      loadData: this.props.loadData || emptyPromise,
    };
  }
  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    // if ('value' in nextProps) {
    //   const value = nextProps.value;
    //   this.setState(value);
    // }

    const newValue = nextProps.value || [];

    const nextCheckedTreeKeys = [];
    for (let s = 0; s < newValue.length; s++) {
      const sitem = newValue[s];
      nextCheckedTreeKeys.push(`${sitem.value}`);
    }
    // console.log(nextCheckedTreeKeys);

    this.setState({
      options: [...newValue] || [],
      treeData: nextProps.treeData || [],
      loadData: nextProps.loadData || emptyPromise,
      selectedTreeKeys: [],
      checkedTreeKeys: nextCheckedTreeKeys || [],
    });
  }
  handleNumberChange = (e) => {
    this.props.value.pop();

    console.log(this.props.value);

    this.setState({ value: this.props.value });

    console.log(this.state);
  }
  handleCurrencyChange = (currency) => {
    if (!('value' in this.props)) {
      this.setState({ currency });
    }
    this.triggerChange({ currency });
  }
  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  }
  handleChecked = (checkedValue) => {
    this.setState({
      checkedArr: checkedValue,
    });
  }
  handleCheckTreeNode = (checkedKeys, e) => {
    this.props.value.length = 0;
    const newOptions = [];
    const newCheckedArr = [];
    const compArr = [];

    for (let i = 0; i < checkedKeys.length; i++) {
      const item = checkedKeys[i];
      if (item.slice(2, 6) === '0000') {
        compArr.push(item);
      } else if (item.slice(4, 6) === '00' && !checkedKeys.includes(`${item.slice(0, 2)}0000`)) {
        compArr.push(item);
      } else if (!checkedKeys.includes(`${item.slice(0, 2)}0000`) && !checkedKeys.includes(`${item.slice(0, 4)}00`)) {
        compArr.push(item);
      }
    }

    for (let s = 0; s < e.checkedNodes.length; s++) {
      const sitem = e.checkedNodes[s];
      if (compArr.includes(sitem.props.dataRef.key)) {
        const nitem = {
          label: sitem.props.dataRef.fullname,
          value: sitem.props.dataRef.key,
          did: sitem.props.dataRef.fulldid,
        };
        this.props.value.push(nitem);
        newOptions.push(nitem);
      }
    }

    if (this.state.checkedArr) {
      for (let c = 0; c < this.state.checkedArr.length; c++) {
        const citem = this.state.checkedArr[c];
        if (compArr.includes(citem)) {
          newCheckedArr.push(citem);
        }
      }
    }

    this.setState({
      options: newOptions || [],
      checkedArr: newCheckedArr || [],
      checkedTreeKeys: checkedKeys || [],
    });
  }
  handleSelectTreeNode = (selectedKeys, e) => {
    this.setState({
      selectedTreeKeys: [],
    });
  }
  handleDelete = () => {
    const newOptions = [];
    const newSelectedTreeKeys = [];
    const newCheckedTreeKeys = [];
    this.props.value.length = 0;

    for (let s = 0; s < this.state.options.length; s++) {
      const sitem = this.state.options[s];
      // console.log(sitem);
      if (!this.state.checkedArr.includes(sitem.value)) {
        const nitem = {
          label: sitem.label,
          value: sitem.value,
        };
        this.props.value.push(nitem);
        newOptions.push(nitem);
        newSelectedTreeKeys.push(`${sitem.value}`);
        newCheckedTreeKeys.push(`${sitem.value}`);
      }
    }

    this.setState({
      options: newOptions,
      checkedArr: [],
      selectedTreeKeys: newSelectedTreeKeys,
      checkedTreeKeys: newCheckedTreeKeys,
    });
  }
  handleDeleteAll = () => {
    this.props.value.length = 0;
    this.setState({
      options: [],
      checkedArr: [],
      selectedTreeKeys: [],
      checkedTreeKeys: [],
    });
  }
  renderTreeNodes = (data) => {
    // console.log(data);
    if (Object.prototype.toString.call(data) === '[object Array]') {
      return data.map((item) => {
        if (item.children) {
          return (
            <TreeNode title={item.title} key={item.key} dataRef={item}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode {...item} dataRef={item} />;
      });
    } else {
      return null;
    }
  }
  render() {
    const { size } = this.props;
    const state = this.state;
    return (
      <div className={styles.treeCheckbox}>
        <div className={styles.treeBox}>
          <Tree
            checkable
            loadData={(treeNode) => { return state.loadData(treeNode, state.treeData); }}
            selectedKeys={state.selectedTreeKeys}
            checkedKeys={state.checkedTreeKeys}
            onSelect={this.handleSelectTreeNode}
            onCheck={this.handleCheckTreeNode}
          >
            {this.renderTreeNodes(state.treeData)}
          </Tree>
        </div>
        <div className={styles.checkWarp}>
          <div className={styles.buttonBox}>
            <Button onClick={this.handleDelete}>删除选中</Button>
            <Button onClick={this.handleDeleteAll}>全部删除</Button>
          </div>
          <div className={styles.checkBox}>
            <CheckboxGroup options={state.options} onChange={this.handleChecked} value={state.checkedArr} />
          </div>
        </div>
      </div>
    );
  }
}

export default { TreeCheckbox };
