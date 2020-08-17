/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import Popper from 'popper.js';
import { Component, PropType, Transition, View } from '../../libs/index';

class DropdownMenu extends Component {
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

  placement() {
    return `bottom-${this.parent().props.menuAlign}`;
  }

  onEnter = () => {
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

  parent() {
    return this.context.component;
  }

  onAfterLeave = () => {
    this.popperJS.destroy();
  }

  render() {
    return (
      <Transition name="zoom-in-top" onEnter={this.onEnter} onAfterLeave={this.onAfterLeave} onStart={this.onStart}>
        <View show={this.state.showPopper}>
          <ul ref="popper" style={this.styles()} className={this.classnames('hui-dropdown-menu')}>
            {this.props.children}
          </ul>
        </View>
      </Transition>
    )
  }
}

DropdownMenu.contextTypes = {
  component: PropType.any
};

export default DropdownMenu;