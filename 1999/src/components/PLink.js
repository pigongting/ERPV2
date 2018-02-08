import update from 'immutability-helper';
import React from 'react';

const emptyFn = () => {};

class PLink extends React.Component {
  constructor(props) {
    super(props);

    // console.log(this.props);

    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    // this.setState({
    //   options: nextProps.options || [],
    //   loadData: nextProps.loadData || emptyFn,
    //   field: nextProps.field || 'value',
    //   name: nextProps.name || 'text',
    //   value: (nextProps.value) ? { key: nextProps.value.key || '', label: nextProps.value.label || '' } : { key: '', label: '' },
    // });

    // if (nextProps.value.label && this.state.options.length < 0) {
    //   this.state.loadData(nextProps.value.label);
    // }
  }

  render() {
    return (
      <div>46454</div>
    );
  }
}

export default { PLink };
