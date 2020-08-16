import React from 'react';
import {PropType} from 'libs/index';
import MixinComponent from './MixinComponent';
import './Menu.scss';

export default class MenuItemGroup extends MixinComponent {
  constructor(props) {
    super(props);
    this.instanceType = 'MenuItemGroup';
    this.state = {
      paddingLeft: 20
    }
  }
  componentDidMount() {
    this.initPadding();
  }
  initPadding() {
    let level = 0, parent = this.parent(), component = parent.instanceType;

    while (component !== 'Menu') {
      if (component === 'SubMenu') {
        level++;
      }

      parent = parent.parent();
      component = parent.instanceType;
    }

    this.setState({
      paddingLeft: this.state.paddingLeft + level * 10
    });
  }
  render() {
    const {paddingLeft} = this.state;
    return (
      <li 
        style={this.styles()}
        className={this.classname('hui-menu-item-group')}
      >
        <div 
          className="hui-menu-item-group__title"
          style={{'paddingLeft': `${paddingLeft}px`}}
        >
          {this.props.title}
        </div>
        <ul>
          {this.props.children}
        </ul>
      </li>
    )
  }
}

MenuItemGroup.propTypes = {
  title: PropType.string.isRequired
};