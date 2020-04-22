import React from 'react';
import { Component } from '../../libs';

export default class ButtonGroup extends Component {
  render() {
    return (
      <div style={this.styles()} className="hui-button-group">
        {this.props.children}
      </div>
    )
  }
}