/*
 * Tag标签组件
 * @Author: hellojackhui 
 * @Date: 2020-02-23 21:09:17 
 * @Last Modified by: hellojackhui
 * @Last Modified time: 2020-02-23 22:53:36
 */

import React from 'react';
import {Component, PropType, View} from '../libs/index';
import './tag.css';

export default class Tag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    }
  }
  onClose = () => {
    this.setState({
      visible: false,
    }, () => {
      if (this.props.onClose) {
        this.props.onClose()
      }
    })
  }
  render() {
    const {type, closable, hit, color} = this.props;
    return (
      <View show={this.state.visible}>
        <span
          className={this.classname('hui-tag', type && `hui-tag--${type}`, {
            'is-hit': hit
          })}
          style={this.styles({
            'backgroundColor': color
          })}
        >
          {this.props.children}
          {closable && <i className="hui-tag__close hui-icon hui-icon-close" onClick={this.onClose}></i>}
        </span>
      </View>
    )
  }
}

Tag.propTypes = {
  type: PropType.string,
  closable: PropType.bool,
  hit: PropType.bool,
  color: PropType.string,
  onClose: PropType.func,
}

Tag.defaultProps = {
  type: 'primary',
}