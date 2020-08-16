import React from 'react';
import ReactDOM from 'react-dom';
import PopperJS from 'popper.js';
import {Component, PropType, View} from 'libs/index';
import ClickOutside from 'react-click-outside';
import CascaderMenu from './CascaderMenu';
import Input from '../input/index';
import 'module/Cascader.scss';


class Cascader extends Component {
    constructor(props) {
      super(props);
      this.state = {
        inputhover: false,  // 是否悬浮
        inputValue: '', // 输入框值
        visible: false, // 是否显示明细
        menu: null, // 菜单list
        flatOptions: this.flattenOptions(props.options),  // 铺平option，便于查询
        currentValue: props.value   // 当前值
      }
      this.input = null;  // 输入框dom
    }
    getChildContext() {
      return {
        component: this
      }
    }
    componentDidMount() {
      this.input = ReactDOM.findDOMNode(this.refs.input);
    }
    componentWillReceiveProps(nextprops) {
      this.setState({
        currentValue: nextprops.value,
        flatOptions: this.flattenOptions(nextprops.options)
      })
      this.state.menu.setState({
        options: nextprops.options
      })
    }
    componentDidUpdate(props, state) {
      const {visible} = this.state;
      if (visible !== state.visible) {
        if (visible) {
          this.showSubMenu();
          if (!this.popperJS) {
            this.popperJS = new PopperJS(this.input, ReactDOM.findDOMNode(this.refs.menu), {
              placement: 'bottom-start',
              modifiers: {
                computeStyle: {
                  gpuAcceleration: false,
                }
              }
            })
          } else {
            this.popperJS.update();
          }
        } else {
          this.hideSubMenu();
          if (this.popperJS) {
            this.popperJS.destroy();
          }
          delete this.popperJS;
        }
      }
    }

    componentWillUnmount() {
      if (this.popperJS) {
        this.popperJS.destroy();
      }
    }

    showSubMenu = () => {
      this.state.menu.setState({
        visible: true,
        value: this.state.currentValue.slice(0),
        options: this.props.options,
        inputWidth: this.input.offsetWidth - 2
      })
    }

    initMenu = (menu) => {
      this.state.menu = menu;
    }

    hideSubMenu = () => {
      this.setState({
        value: ''
      })
      this.state.menu.setState({
        visible: false,
      })
    }

    updatePopper() {
      if (this.popperJS) {
        this.popperJS.update();
      }
    }

    handleActiveItemChange(value) {
      this.updatePopper();
  
      if (this.props.activeItemChange) {
        this.props.activeItemChange(value);
      }
    }

    // 铺平数据
    flattenOptions(options, ancestor = []) {
      let flatOptions = [];
  
      options.forEach((option) => {
        const optionsStack = ancestor.concat(option);
        if (!option[this.getChildren()]) {
          flatOptions.push(optionsStack);
        } else {
          if (this.changeOnSelect) {
            flatOptions.push(optionsStack);
          }
          flatOptions = flatOptions.concat(this.flattenOptions(option[this.getChildren()], optionsStack));
        }
      });
  
      return flatOptions;
    }

    // 清空数据
    clearValue = (e) => {
      e.stopPropagation();
      this.pickHandler([], true);
    }

    // 选中后
    pickHandler = (value = [], close = false) => {
      this.setState({
        inputValue: '',
        currentValue: value,
      })
      if (close) {
        this.setState({visible: false})
      }
      if (this.props.onChange) {
        this.props.onChange(value)
      }
    }

    // 点击input行触发menu显示
    clickHandler = () => {
      if (this.props.disabled) return;
      this.setState({
        visible: !this.state.visible
      })
    }

    // 获取配置的key
    getKey = () => {
      return this.props.props.label || 'label';
    }

    // 获取配置的value
    valueKey = () => {
      return this.props.props.value || 'value';
    }

    // 获取配置的children
    getChildren = () => {
      return this.props.props.chilren || 'children';
    }

    // 根据当前输入值，获取对应的查询结果
    getCurrentLabels = () => {
      let options = this.props.options;
      let labels = [];
      let {currentValue} = this.state;
      currentValue.forEach((val) => {
        let item = options && options.filter((option) => option[this.valueKey()] === val)[0];
        if (item) {
          labels.push(item[this.getKey()]);
          options = item[this.getChildren()];
        }
      })
      return labels;
    }

    handleClickOutside() {
      if (this.state.visible) {
        this.setState({ visible: false });
      }
    }

    // inputChangeHandler
    inputChangeHandler = (value) => {
      if (!this.state.visible) return;
      const options = this.state.flatOptions;
      if (!value) {
        this.state.menu.setState({
          options: this.props.options
        })
        return;
      }
      let filterOptions = options.filter((option) => {
        return option.some((item) => {
          new RegExp(value, 'i').test(item[this.getKey()])
        })
      })
      if (filterOptions.length) {
        filterOptions = filterOptions.map((option) => {
          return {
            __IS_FLAT: true,
            value: option.map((item) => item[this.valueKey()]),
            label: this.renderFilterLabel(value, option)
          }
        })
      } else {
        return {
          __IS_FLAT: true,
          label: '未匹配',
          value: '',
          disabled: true,
        }
      }
      this.state.menu.setState({
        options: filterOptions
      })
    }

    renderFilterLabel = (value, option) => {
      return option.map((item, index) => {
        const label = item[this.getKey()];
        const keywordIndex = label.toLowerCase().indexOf(value.toLowerCase());
        const labelPart = label.slice(keywordIndex, value.length + keywordIndex);
        const node = keywordIndex > -1 ? this.highLight(label, labelPart) : label;
        return index === 0 ? node : [' / ', node];
      })
    }

    highLight(label, keyword) {
      return label.split(keyword).map((node, index) => index === 0 ? node : [
        (<span className="hui-cascader-menu__item__keyword">{keyword}</span>),
        node
      ]);
    }

    render() {
      const {disabled, placeholder, clearable, size, showAllLevels, filterable} = this.props;
      const {visible, inputValue, inputHover} = this.state;
      const currentValue = this.getCurrentLabels();
      return (
        <div ref="cascader" className={this.classname('hui-cascader', {
          'is-disabled': disabled,
          'is-opened': visible
        })}>
          <span
            onClick={this.clickHandler}
            onMouseEnter={() => {
              this.setState({inputHover: true})
            }}
            onMouseLeave={() => {
              this.setState({inputHover: false})
            }}
          >
            <Input 
              ref={"input"}
              value={inputValue}
              readOnly={!filterable}
              size={size}
              disabled={disabled}
              onChange={value => { this.setState({ inputValue: value }) }}
              onKeyUp={this.inputChangeHandler}
              placeholder={placeholder}
              icon={
                (clearable && inputHover && currentValue.length) ? 'close' : visible ? 'caret-up' : 'caret-down'
              }
              onIconClick={
                (clearable && inputHover && currentValue.length) ? this.clearValueHandler : this.toggleDropDown
              }
            />
            <View show={currentValue.length}>
              <span className="hui-cascader__label">
                {
                  showAllLevels ? currentValue.map((label, index) => {
                    return (
                      <label key={index}>
                        <span title={label}>{label}</span>
                        {
                          index < currentValue.length - 1 && <span> / </span>
                        }
                      </label>
                    )
                  }) : currentValue[currentValue.length - 1]
                }
              </span>
            </View>
          </span>
          {/* menu组件 */}
          <CascaderMenu ref="menu" />
        </div>
      )
    }
}

Cascader.propTypes = {
  options: PropType.arrayOf(PropType.shape({
    value: PropType.string
  })).isRequired,
  props: PropType.object,
  value: PropType.array,
  placeholder: PropType.string,
  disabled: PropType.bool,
  clearable: PropType.bool,
  size: PropType.string,
  expandTrigger: PropType.string,
  filterable: PropType.bool,
  showAllLevels: PropType.bool,
  activeItemChange: PropType.func,
  onChange: PropType.func
}

Cascader.defaultProps = {
  value: [],
  clearable: false,
  showAllLevels: true,
  expandTrigger: 'click',
  filterable: false,
  props: {
    children: 'children',
    label: 'label',
    value: 'value',
    disabled: 'disabled'
  }
}

Cascader.childContextTypes = {
  component: PropType.any,
}

export default ClickOutside(Cascader);