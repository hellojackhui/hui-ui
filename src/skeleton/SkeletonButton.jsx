import React from 'react';
import {Component, PropType} from '../../libs/index';
import './SkeletonButton.scss';

export default class SkeletonButton extends Component {
  render() {
    const {active, size, shape} = this.props;
    return (
      <span className={this.classnames(
        'hui-skeleton-button', 
        size && `hui-skeleton-button-${size}`, 
        shape && `hui-skeleton-button-${shape}`
      , {
      'is-active': active,
      })}></span>
    )
  }
}
