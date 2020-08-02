import React from 'react';
import ReactDOM from 'react-dom';
import PopperJS from 'popper.js';
import {Component, PropType} from '../../libs/index';
import ClickOutside from 'react-click-outside';
import Input from '../input/index';
import './Cascader.scss';


class Cascader extends Component {
    constructor(props) {
      super(props);
      this.state = {
        inputhover: false,
        inputValue: '',
        visible: false,
        flatOptions: this.flattenOptions(props.options),
        currentValue: props.value
      }
      this.menu = null;
      this.input = null;
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
      this.menu.setState({
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

    // 铺平数据
    flattenOptions = (options) => {
      let flatOptions = [];
      if (!options.length) return flatOptions;
      options.reduce((prev, next) => {
        if (!next[this.getChildren()]) {
          return [...prev, next]
        } else {
          return [...prev, ...this.flattenOptions(next[this.getChildren()])];
        }
      }, [])
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
      return this.props.props.chilren || 'chilren';
    }

    // 根据当前输入值，获取对应的查询结果
    getCurrentLabels = () => {
      let options = this.props.options;
      let labels = [];
      let {currentValue} = this.state;
      currentValue.forEach((val) => {
        let item = options && options.filter((option) => option[this.getKey()] === val)[0];
        if (item) {
          labels.push(item[this.getKey()]);
          options = options[this.getChildren()];
        }
      })
      return labels;
    }

    handleClickOutside() {
      if (this.state.visible) {
        this.setState({ visible: false });
      }
    }


    render() {
      const {disabled, placeholder, clearable, size, showAllLevels} = this.props;
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
              readOnly={true}
              value={inputValue}
              size={size}
              disabled={disabled}
              onChange={(val) => this.setState({inputValue: val})}
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
                        <span>{label}</span>
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
  filterable: PropTypes.bool,
  showAllLevels: PropTypes.bool,
  activeItemChange: PropTypes.func,
  onChange: PropTypes.func
}

Cascader.defaultProps = {
  value: [],
  clearable: false,
  expandTrigger: 'click',
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