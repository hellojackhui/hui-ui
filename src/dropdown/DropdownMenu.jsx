/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import Popper from 'popper.js';
import { Component, PropType, Animate, View } from '../../libs';

export default class DropdownMenu extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showPopper: false
    }
  }

  onVisibleChange(visible) {
    this.setState({
      showPopper: visible
    })
  }

  onStart = () => {
    const parent = ReactDOM.findDOMNode(this.parent());
    this.popperJS = new Popper(parent, this.refs.popper, {
        placement: this.placement(),
        modifiers: {
          computeStyle: {
            gpuAcceleration: false
          }
        }
      });
  }

  onEnd = () =>  {
    this.popperJS.destroy();
  }

  parent() {
    return this.context.component;
  }

  placement() {
    return `bottom-${this.parent().props.menuAlign}`;
  }

  render() {
    return (
      <Animate visible={this.state.showPopper} onEnterName={'hui-dropdown__zoomin'} onLeaveName={'hui-dropdown__zoomout'} onStart={this.onStart} onEnd={this.onEnd}>
        {
          ({classNameType}) => {
            <ul ref="popper" style={this.style()} className={this.className('hui-dropdown-menu', classNameType)}>
              {this.props.children}
            </ul>
          }
        }
      </Animate>
    )
  }
}

DropdownMenu.contextTypes = {
  component: PropTypes.any
};
