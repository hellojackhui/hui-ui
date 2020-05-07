import React from 'react';
import {Component, PropType} from '../../libs/index';
import './Menu.scss';

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.instanceType = 'Menu';
    this.state = {
      activeIndex: props.defaultActive,
      openedMenus: props.defaultOpeneds ? props.defaultOpeneds.slice[0] : [],
      menuItems: {},
      subMenus: {},
    }
  }
  getChildContext() {
    return {
      component: this
    };
  }
  componentDidMount() {
    this.openActiveItemMenus();
  }
  componentWillReceiveProps(nextprops) {
    if (nextprops.defaultActive !== this.props.defaultActive || nextprops.defaultActive !== this.state.activeIndex) {
      this.defaultActiveChanged(nextprops.defaultActive);
    }
    if (nextprops.defaultOpeneds !== this.props.defaultOpeneds) {
      this.defaultOpenedsChanged(nextprops.defaultOpeneds);
    }
  }
  openMenu(index, indexPath) {
    let {openedMenus} = this.state;
    if (openedMenus.indexOf(index) !== -1) return;
    if (this.props.uniqueOpened) {
      openedMenus = openedMenus.filter(index => {
        return indexPath.indexOf(index) !== -1;
      });
    }
    openedMenus.push(index);
    this.setState({ openedMenus });
  }
  closeMenu(index) {
    const {openedMenus} = this.state;
    openedMenus.splice(openedMenus.indexOf(index), 1);
    this.setState({openedMenus});
  }
  handleSubmenuClick(index, indexPath) {
    let isOpened = this.state.openedMenus.indexOf(index) !== -1;

    if (isOpened) {
      this.closeMenu(index);

      if (this.props.onClose) {
        this.props.onClose(index, indexPath);
      }
    } else {
      this.openMenu(index, indexPath);

      if (this.props.onOpen) {
        this.props.onOpen(index, indexPath);
      }
    }
  }
  defaultOpenedsChanged(value) {
    this.setState({
      openedMenus: value
    });
  }
  defaultActiveChanged(value) {
    const {menuItems} = this.state;
    this.setState({activeIndex: value}, () => {
      if (!menuItems[value]) return;
      let menuItem = menuItems[value];
      let indexPath = menuItem.indexPath();
      this.handleSelect(value, indexPath, menuItem);
    })
  }
  handleSelect(index, indexPath, instance) {
    let { activeIndex, openedMenus, submenus } = this.state;

    activeIndex = index;

    if (this.props.onSelect) {
      this.props.onSelect(index, indexPath, instance);
    }

    if (this.props.mode === 'horizontal') {
      for (const key in submenus) {
        submenus[key].onItemSelect(index, indexPath);
      }

      openedMenus = [];
    }

    this.setState({ activeIndex, openedMenus }, () => {
      if (this.props.mode === 'vertical') {
        this.openActiveItemMenus();
      }
    });
  }

  openActiveItemMenus() {
    let { activeIndex, menuItems, submenus } = this.state;

    if (!menuItems[activeIndex]) return;
    if (activeIndex && this.props.mode === 'vertical') {
      let indexPath = menuItems[activeIndex].indexPath();
      // 展开该菜单项的路径上所有子菜单
      indexPath.forEach(index => {
        const submenu = submenus[index];

        submenu && this.openMenu(index, submenu.indexPath());
      });
    }
  }


  render() {
    const {mode, theme} = this.props;
    return (
      <ul
        style={this.styles()}
        className={this.classname('hui-menu', {
          'hui-menu--horizontal': mode === 'horizontal',
          'hui-menu--dark': theme === 'dark'
        })}
      >
        {this.props.children}
      </ul>
    )
  }
}

Menu.childContextTypes = {
  component: PropType.any
};

Menu.propTypes = {
  mode: PropType.string,
  defaultActive: PropType.string,
  defaultOpeneds: PropType.arrayOf(PropType.any),
  theme: PropType.string,
  uniqueOpened: PropType.bool,
  menuTrigger: PropType.string,
  onSelect: PropType.func,
  onOpen: PropType.func,
  onClose: PropType.func
};
  
Menu.defaultProps = {
  mode: 'vertical',
  theme: 'light',
  menuTrigger: 'hover'
}
  