import React from 'react';
import ReactDOM from 'react-dom';
import {Animate, View, PropType} from '../../libs/index';
import MixinComponent from './MixinComponent';
import './Menu.scss';

export default class SubMenu extends MixinComponent {
  constructor(props) {
    super(props);
    this.instanceType = 'SubMenu';
    this.state = {
      active: false
    };
  }
  getChildContext() {
    return {
      component: this
    };
  }
  componentDidMount() {
    this.rootMenu().state.subMenus[this.props.index] = this;
    this.initEvents();
  }
  initEvents = () => {
    if (this.rootMenu().props.mode === 'horizontal' && this.rootMenu().props.menuTrigger === 'hover') {
      let targetnode = ReactDOM.findDOMNode(this);
      targetnode.addEventListener('mouseenter', this.handlerMouseEnter);
      targetnode.addEventListener('mouseleave', this.handleMouseleave);
    } else {
      let targetNode = this.refs['submenu-title'];
      targetNode.addEventListener('click', this.handleClick);
    }
  }
  handlerMouseEnter = () => {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.rootMenu().openMenu(this.props.index, this.indexPath());
    }, 300)
  }
  handleMouseleave = () => {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.rootMenu().closeMenu(this.props.index, this.indexPath());
    }, 300)
  }
  handleClick = () => {
    this.rootMenu().handleSubmenuClick(this.props.index, this.indexPath());
  }
  opened = () => {
    return this.rootMenu().state.openedMenus.indexOf(this.props.index) !== -1;
  }
  onItemSelect(index, indexPath) {
    this.setState({
      active: indexPath.indexOf(this.props.index) !== -1
    });
  }
  render() {
    return (
      <li style={this.styles()} className={this.classname('hui-submenu', {
        'is-active': this.state.active,
        'is-opened': this.opened(),
      })}>
        <div ref="submenu-title" className={this.classname("hui-submenu__title")}>
          {this.props.title}
          <i className={this.classname('hui-submenu__icon', 'hui-icon', {
            'hui-icon-chevron-down': this.rootMenu().props.mode === 'vertical',
            'hui-icon-caret-down': this.rootMenu().props.mode === 'horizontal'
          })}></i>
        </div>
        {
          this.rootMenu().props.mode === 'horizontal' ? (
            <View show={this.opened()}>
              <ul className="hui-menu">
                {this.props.children}
              </ul>
            </View>
          ) : (
            <View show={this.opened()}>
                <ul className="hui-menu">{this.props.children}</ul>
            </View>
          )
        }
      </li>
    )
  }
}

SubMenu.childContextTypes = {
  component: PropType.any
};

SubMenu.propTypes = {
  index: PropType.string.isRequired
};