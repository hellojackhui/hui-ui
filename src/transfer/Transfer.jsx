import React from 'react';
import {Component, PropType} from '../../libs/index';
import TransferPanel from './TransferPanel';

export default class Transfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftlist = this.getLeftlist(props.data),
      rightlist = this.getRightlist(props.data),
      rightIndex = props.value,
    }
  }

  getLeftlist = (props) => {
    const {data, value} = props;
    return data.reduce((prev, next) => value.indexOf(next.key) > -1 ? [...prev] : [...prev, next], [])
  }

  getRightlist = (props) => {
    const {data, value} = props;
    return data.reduce((prev, next) => value.indexOf(next.key) > -1 ? [...prev, next] : [...prev], [])
  }

  render() {
    return (
      <div style={this.styles()} className={this.classname('hui-transfer')}>
        <TransferPanel />
        <div className="hui-tranfer__button"></div>
        <TransferPanel />
      </div>
    )
  }
}

Transfer.propTypes = {
  value: PropType.array,
  data: PropType.array,
  onChange: PropType.func,
}