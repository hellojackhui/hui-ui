import React from 'react';
import {Component, PropType} from '../../libs/index';
import './WaterMask.scss';

export default class WaterMask extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {children} = this.props;
    return (
      <div style={this.styles()} className={this.classname('hui-watermask')}>
        {children}
      </div>
    )
  }
}

WaterMask.propTypes = {
  container: PropType.node,
  width: PropType.oneOfType([PropType.string, PropType.number]),
  height: PropType.oneOfType([PropType.string, PropType.number]),
  textAlign: PropType.string,
  textBaseline: PropType.string,
  font: PropType.string,
  fillStyle: PropType.string,
  content: PropType.string,
  globalAlpha: PropType.number,
  rotate: PropType.number,
  zIndex: PropType.number,
}
