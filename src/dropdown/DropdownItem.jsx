import React from 'react';
import { Component, PropType } from '../../libs';
import './Dropdown.scss';

class DropdownItem extends Component {
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
        onClick={this.handleClick}
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
  command: PropType.string,
  disabled: PropType.bool,
  divided: PropType.bool,
};

export default DropdownItem;