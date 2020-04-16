import React from 'react';
import {Component, PropType} from '../../libs/index';
import './Badge.scss';

export default class Badge extends Component {
  getValue = () => {
    const {value, max, isDot} = this.props;
    if (isDot) return null;
    if (typeof value == 'string') return value;
    if (Number.isInteger(value) && value < max) return value;
    else return `${max}+`;
  }
  render() {
    const {isDot, children} = this.props;
    return (
      <div className="hui-badge">
        <span className={this.classname('hui-badge__icon', isDot && 'hui-badge__dot')}>
          {this.getValue()}
        </span>
        {children}
      </div>
    )
  }
}

Badge.propTypes = {
  value: PropType.oneOfType([PropType.number, PropType.string]),
  max: PropType.number,
  isDot: PropType.bool,
}

Badge.defaultProps = {
  isDot: false,
}