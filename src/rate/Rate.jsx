import React from 'react';
import {Component, PropType} from '../../libs/index';
import '../../style/core/module/Rate.scss';

class Rate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: -1,
      hoverIndex: -1,
      pointerAtLeftHalf: false,
      currentValue: props.value - 1
    }
    const {
      iconClasses, voidIconClass, disabledVoidIconClass, colors, voidColor, disabledVoidColor
    } = this.props;
    
    this.classMap = {
       lowClass: iconClasses[0],
       mediumClass: iconClasses[1],
       highClass: iconClasses[2],
       voidClass: voidIconClass,
       disabledVoidClass: disabledVoidIconClass
     };
  
    this.colorMap = {
      lowColor: colors[0],
      mediumColor: colors[1],
      highColor: colors[2],
      voidColor: voidColor,
      disabledVoidColor: disabledVoidColor
    };
  }
  componentWillReceiveProps(nextprops) {
    if (nextprops.value && nextprops.value !== this.props.value) {
      this.setState({
        value: nextprops.value,
      })
    }
  }
  hasClass(target, classname) {
    return target.classList.contains(classname)
  }
  setCurrentValue = (e, index) => {
    const {disabled, allowHalf} = this.props;
    if (disabled) {
      return;
    }
    if (allowHalf) {
      e.persist();
      let target = e.target;
      if (this.hasClass(target, 'hui-star__item')) {
        target = target.querySelector('.hui-rate__icon');
      }
      if (this.hasClass(target, 'hui-star__decimal')) {
        target = target.parentNode;
      }
      this.setState({
        pointerAtLeftHalf: (e.clientX - target.getBoundingClientRect().left) * 2 <= target.clientWidth,
        currentValue: ((e.clientX - target.getBoundingClientRect().left) * 2 <= target.clientWidth) ? index - 0.5 : index
      })
    } else {
      this.setState({
        currentValue: index,
      })
    }
    this.setState({
      hoverIndex: index
    })
  }
  resetStarValue = () => {
    const {disabled, allowHalf} = this.props;
    const {value} = this.state;
    if (disabled) {
      return;
    }
    if (allowHalf) {
      this.setState({
        pointerAtLeftHalf: value !== Math.floor(value)
      })
    }
    this.setState({
      currentValue: value,
      hoverIndex: -1
    })
  }
  getIconStyle = (item) => {
    const {disabled} = this.props;
    const {currentValue} = this.state;
    let voidColor = disabled ? this.colorMap.disabledVoidColor : this.colorMap.voidColor;
    return {
      color: item <= currentValue ? this.activeColor() : voidColor
    }
  }
  activeColor() {
    return this.getValueFromMap(this.state.currentValue, this.colorMap);
  }
  getValueFromMap(value, map) {
    const { lowThreshold, highThreshold } = this.props;
    let result = '';
    if (value <= lowThreshold - 1) {
      result = map.lowColor || map.lowClass;
    } else if (value >= highThreshold - 1) {
      result = map.highColor || map.highClass;
    } else {
      result = map.mediumColor || map.mediumClass;
    }
    return result;
  }
  activeClass() {
    return this.getValueFromMap(this.state.currentValue, this.classMap);
  }
  voidClass() {
    return this.props.disabled
      ? this.classMap.disabledVoidClass
      : this.classMap.voidClass;
  }
  showDecimalIcon = (index) => {
    const {disabled, allowHalf, value} = this.props;
    const {pointerAtLeftHalf, currentValue} = this.state;
    let diceimalIconWhenDisabled = disabled && 
    this.isDecimal(index) > 0 && index - 1 < value - 1 && index > value - 1;
    let diceimalIconWhenVisible = allowHalf && pointerAtLeftHalf && (index - 0.5).toFixed(1) === currentValue.toFixed(1);
    return diceimalIconWhenDisabled || diceimalIconWhenVisible;
  }
  isDecimal = () => {
    const { value } = this.props;
    return value * 100 - Math.floor(value) * 100;
  }
  classes = () => {
    const { currentValue } = this.state;
    const { max } = this.props;
    let result = [];
    let i = 0;
    let threshold = currentValue;
    // if (allowHalf && currentValue !== Math.floor(currentValue)) {
    //   threshold = threshold;
    // }
    for (; i <= threshold; i++) {
      result.push(this.activeClass());
    }
    for (; i < max; i++) {
      result.push(this.voidClass());
    }
    return result;
  }
  decimalIconClass() {
    return this.getValueFromMap(this.props.value, this.classMap);
  }
  selectValue(value) {
    const { disabled, allowHalf, onChange } = this.props;
    const { pointerAtLeftHalf, currentValue } = this.state;
    if (disabled) {
      return;
    }
    if (allowHalf && pointerAtLeftHalf) {
      // this.$emit('input', this.currentValue);
      this.setState({
        value: currentValue,
      }, () => {
        onChange && onChange(currentValue + 1);
      })
    } else {
      this.setState({
        currentValue: value,
        value,
      }, () => {
        onChange && onChange(value + 1);
      })
    }
  }
  decimalStyle = () => {
    const { disabled, allowHalf } = this.props;
    let width = '';
    if (disabled) {
      width = `${this.isDecimal() < 50 ? 0 : 50}%`;
    }
    if (allowHalf) {
      width = '50%';
    }
    return {
      color: this.activeColor(),
      width
    };
  }
  showText() {
    const { disabled, texts, textTemplate, value } = this.props;
    const { currentValue } = this.state;
    let result = '';
    if (disabled) {
      result = textTemplate.replace(/\{\s*value\s*\}/, value);
    } else {
      result = texts[Math.ceil(currentValue)];
    }
    return result;
  }
  render() {
    const {showText, textColor, max, disabled} = this.props;
    const { hoverIndex } = this.state;
    return (
      <div style={this.styles()} className={this.classname('hui-rate')}>
        {
          [...new Array(max)].map((v, k) => {
            return (
              <span
                className="hui-rate__item"
                key={k}
                style={{'cursor': disabled ? "auto" : "pointer"}}
                onClick={() => this.selectValue(k)}
                onMouseMove={(e) => this.setCurrentValue(e, k)}
                onMouseLeave={() => this.resetStarValue()}
                >
                  <i
                    style={this.getIconStyle(k)}
                    className={this.classname(`hui-rate__star hui-icon hui-icon-star ${this.classes()[k]}`, {
                      hover: hoverIndex === k
                    })
                    }
                  >
                    {
                      this.showDecimalIcon(k) ? <i style={this.decimalStyle()} className={`hui-rate__decimal hui-icon ${this.decimalIconClass()}`}></i> : null
                    }
                  </i>
                </span>
            )
          })
        }
        {showText
          ? <span className="hui-rate__text" style={{ color: textColor }}>
              {this.showText()}
            </span>
          : null}
      </div>
    )
  }
}

Rate.propTypes = {
  colors: PropType.array,
  texts: PropType.array,
  showtext: PropType.bool,
  textColor: PropType.string,
  disabled: PropType.bool,
  value: PropType.number,
  onChange: PropType.func,
  textTemplate: PropType.string,
  lowThreshold: PropType.number,
  highThreshold: PropType.number,
  max: PropType.number,
  voidColor: PropType.string,
  disabledVoidColor: PropType.string,
  iconClasses: PropType.array,
  voidIconClass: PropType.string,
  disabledVoidIconClass: PropType.string,
  allowHalf: PropType.bool
}

Rate.defaultProps = {
  colors: ['#F7BA2A', '#F7BA2A', '#F7BA2A'],
  texts: ['极差', '失望', '一般', '喜欢', '满意'],
  showtext: false,
  textColor: "#1F2D3D",
  disabled: false,
  value: 0,
  lowThreshold: 2,
  highThreshold: 4,
  max: 5,
  voidColor: '#C6D1DE',
  disabledVoidColor: '#EFF2F7',
  iconClasses: ['hui-icon-star', 'hui-icon-star', 'hui-icon-star'],
  voidIconClass: 'hui-icon-star',
  disabledVoidIconClass: 'hui-icon-star',
  allowHalf: false,
  textTemplate: '{value}'
}

export default Rate;