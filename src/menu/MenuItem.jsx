import React from 'react';
import { PropType } from '../../libs';
import MixinComponent from './MixinComponent';
import './Menu.scss';

export default class MenuItem extends MixinComponent {
  constructor(props) {
    super(props);
    this.instanceType = 'MenuItem';
  }
  componentDidMount() {
    this.rootMenu().state.menuItems[this.props.index] = this;
  }
  handleClick() {
    this.rootMenu().handleSelect(this.props.index, this.indexPath(), this);
  }
  active() {
    return this.props.index === this.rootMenu().state.activeIndex;
  }
  render() {
    const {disabled, children} = this.props; 
    return (
      <li
        style={this.styles()}
        className={this.classname('hui-menu-item', {
          'is-active': this.active(),
          'is-disabled': disabled,
        })}
        onClick={this.handleClick.bind(this)}
      >
        {children}
      </li>
    )
  }
}

MenuItem.propTypes = {
  index: PropType.string.isRequired,
  disabled: PropType.bool
};
