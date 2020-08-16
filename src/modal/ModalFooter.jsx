import React from 'react';
import { Component } from 'libs/index';

export default class ModalFooter extends Component {
  render() {
    const {children} = this.props;
    return (
      <div style={this.styles()} className={this.classname('hui-modal__footer')}>
        {children}
      </div>
    )
  }
}