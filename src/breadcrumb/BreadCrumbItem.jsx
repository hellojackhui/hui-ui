import React from 'react';
import {Component, PropType} from '../../libs/index';
import './BreadCrumb.scss';

export default class BreadCrumbItem extends Component {
  render() {
    const {active, children} = this.props;
    return (
      <span style={this.styles()} className={this.classname('hui-breadcrumb-item', {
        'is-highlight': active,
      })}>
        <span className="hui-breadcrumb-item__wrap" ref="link">{children}</span>
        <span className="hui-breadcrumb-item__seperator">{this.context.seperator}</span>
      </span>
    )
  }
}
  
BreadCrumbItem.contextTypes = {
  seperator: PropType.string,
  active: PropType.bool,
}