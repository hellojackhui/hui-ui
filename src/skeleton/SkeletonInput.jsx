import React from 'react';
import {Component, PropType} from 'libs/index';
import './SkeletonInput.scss';

export default class SkeletonInput extends Component {
  render() {
    const {size} = this.props;
    return (
      <span className={this.classname('hui-skeleton-input',size && `hui-skeleton-input-${size}`, {
        'is-active': true
      })}></span>
    )
  }
}