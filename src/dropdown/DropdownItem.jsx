import React from 'react';
import { Component, PropType } from '../../libs';


export default class DropdownItem extends Component {
  handleClick = () => {
    return this.context.component.handleMenuItemClick(this.props.command, this);
  }
  render() {
    const { disabled, divided } = this.props;
    return (
      <li 
        style={this.styles()} 
        className={this.classname('hui-dropdown-item', {
          'is-disabled': disabled,
          'hui-dropdown-item__divided': divided,
        })}
      >
        {this.props.children}
      </li>
    )
  }
}

DropdownItem.contextTypes = {
  component: PropType.any,
}

DropdownItem.propTypes = {
  command: PropTypes.string,
  disabled: PropTypes.bool,
  divided: PropTypes.bool,
};