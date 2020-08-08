import React from 'react';
import {PropType, Component, View, Transition} from '../../libs/index';
import './Cascader.scss';

export default class CascaderMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      inputWidth: 0,
      value: [],
      activeValue: [],
      visible: false,
      triggerType: 'click',
      changeOnSelect: false,
      props: {},
    }
  }
  parent() {
    return this.context.component;
  }
  componentDidMount() {
    this.parent().initMenu(this);
  }
  componentDidUpdate(props, state) {
    if (this.state.value !== state.value || this.state.visible !== state.visible) {
        this.setState({activeValue: this.state.value})
    }
  }
  select = (item, menuIndex) => {
    let {activeValue} = this.state;
    if (item.__IS__FLAT) {
        activeValue = item.value;
    } else {
        if (!menuIndex) {
            activeValue = [item.value]
        } else {
            activeValue.splice(menuIndex, activeValue.length - 1, item.value);
        }
    }
    this.forceUpdate();
    this.parent().pickHandler(activeValue, true);
  }
  activeItem(item, menuIndex) {
    const activeOptions = this.activeOptions();

    this.state.activeValue.splice(menuIndex, activeOptions.length, item.value);

    this.forceUpdate();

    if (this.parent().props.changeOnSelect) {
      this.parent().pickHandler(this.state.activeValue, false);
    } else {
      this.parent().handleActiveItemChange(this.state.activeValue);
    }
  }
  activeOptions() {
    const activeValue = this.state.activeValue;
    const configurableProps = ['label', 'value', 'children', 'disabled'];
    const formatOptions = (options) => {
      options.forEach(option => {
        if (option.__IS__FLAT) return;
        configurableProps.forEach(prop => {
          const value = option[this.parent().props.props[prop] || prop];
          if (value) option[prop] = value;
        });
        if (Array.isArray(option.children)) {
          formatOptions(option.children);
        }
      });
    };
    const loadActiveOptions = (options, activeOptions = []) => {
      const level = activeOptions.length;
      activeOptions[level] = options;
      let active = activeValue[level];
      if (active) {
        options = options.filter(option => option.value === active)[0];
        if (options && options.children) {
          loadActiveOptions(options.children, activeOptions);
        }
      }
      return activeOptions;
    };

    formatOptions(this.state.options);

    return loadActiveOptions(this.state.options);
  }
  render() {
    const {expandTrigger} = this.parent().props;
    const {activeValue, visible} = this.state;
    const activeOptions = this.activeOptions();
    const menus = activeOptions.map((menu, menuIndex) => {
        let isFlat = false;
        const items = menu.map((item, index) => {
            const events = {};
            if (item.__IS__FLAT) isFlat = true;
            if (!item.disabled) {
                if (item.children) {
                  let triggerEvent = {
                    click: 'onClick',
                    hover: 'onMouseEnter'
                  }[expandTrigger];
                  events[triggerEvent] = () => { this.activeItem(item, menuIndex); };
                } else {
                  events.onClick = () => { this.select(item, menuIndex); };
                }
            }
            return (
              <li key={index} className={this.classnames({
                  'hui-cascader-menu__item': true,
                  'hui-cascader-menu__item--extensible': item.children,
                  'is-active': item.value === activeValue[menuIndex],
                  'is-disabled': item.disabled
                })}
                {...events}
              >
                {item.label}
              </li>
            );
        })
        let menuStyle = {};

        if (isFlat) {
          menuStyle.minWidth = this.inputWidth + 'px';
        }

        return (
          <ul key={menuIndex} className={this.classnames({
            'hui-cascader-menu': true,
            'hui-cascader-menu--flexible': isFlat
          })} style={menuStyle}>
            {items}
          </ul>
        );
    })
    return (
        <Transition name="zoom-in-top">
          <View show={visible}>
            <div className={this.classnames('hui-cascader-menus')}>
              {menus}
            </div>
          </View>
        </Transition>
      );
  }
}

CascaderMenu.contextTypes = {
  component: PropType.any,
}