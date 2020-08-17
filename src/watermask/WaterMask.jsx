import React from 'react';
import {Component, PropType} from '../../libs/index';
import {waterMask} from './waterMask';

export default class WaterMask extends Component {
  constructor(props) {
    super(props);
    this.container = null;
  }
  componentDidMount() {
    const {style, ...options} = this.props;
    waterMask({
      container: this.container,
      ...options,
    })
  }
  render() {
    const {children} = this.props;
    return (
      <div style={this.styles({
        position: 'relative',
      })} className={this.classname('hui-watermask')} ref={(el) => this.container = el}>
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