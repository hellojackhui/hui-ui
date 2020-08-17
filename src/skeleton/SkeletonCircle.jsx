import React from 'react';
import {Component, PropType} from '../../libs/index';
import './SkeletonCircle.scss';

export default class SkeletonCircle extends Component {
  render() {
    const {active, size, shape} = this.props;
    return (
      <span className={this.classname(
        'hui-skeleton-circle', 
        size && `hui-skeleton-circle-${size}`, 
        shape && `hui-skeleton-circle-${shape}`,
        {
        'is-active': active,
        }
      )}></span>
    )
  }
}
