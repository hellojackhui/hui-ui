import React from 'react';
import {Component, PropType} from '../../libs/index';
import Input from '../input/index';
import './InputNumber.scss';


export default class InputNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || props.defaultValue,
      focus: false,
    };
    this.timeout = null;
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.value) {
      this.setState({
        value: nextProps.value
      })
    }
  }
  onIncrease = () => {
    const {value} = this.state;
    const {step, max} = this.props;
    let newValue = value >= max ? value : value + step;
    this.setState({
      value: newValue
    }, () => {
      this.onStopInput();
    })
  }
  onDecrease = () => {
    const {value} = this.state;
    const {step, min} = this.props;
    let newValue = value <= min ? value : value - step;
    this.setState({
      value: newValue
    }, () => {
      this.onStopInput();
    })
  }
  onStopInput = () => {
    let value = this.state.value;
    const {min, max, onChange} = this.props;
    let newValue = value;
    if (min >= newValue) {
      newValue = min;
    }
    if (max <= newValue) {
      newValue = max;
    }
    this.setState({
      value: newValue
    }, () => {
      onChange && onChange(newValue);
    })
  }
  onChange = (val) => {
    this.setState({
      value: val
    }, () => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.onStopInput();
      }, 750);
    })
  }
  onFocus = () => {
    this.setState({
      focus: true,
    })
  }
  onBlur = () => {
    this.setState({
      focus: false,
    })
  }
  render() {
    const {value, focus} = this.state;
    const {size, disabled, max, min} = this.props;
    return (
      <div className={this.classname('hui-input-number', size && `hui-input-number--${size}`, {
        'is-disabled': disabled,
        'is-focus': focus,
      })} style={this.styles()}>
        <div className="hui-input-number__inner">
            <Input
              disabled={disabled}
              placeholder={''}
              value={value}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onChange={this.onChange}
              autoComplete={'off'}
            />
        </div>
        <div className={this.classname("hui-input-number__increase", {
          'is-hide': value >= max
        })} onClick={this.onIncrease}><i className="hui-icon hui-icon-plus"/></div>
        <div className={this.classname("hui-input-number__decrease", {
          'is-hide': value <= min
        })} onClick={this.onDecrease}><i className="hui-icon hui-icon-minus"/></div>
      </div>
    )
  }
}

InputNumber.propTypes = {
  defaultValue: PropType.number,
  value: PropType.number,
  min: PropType.number,
  max: PropType.number,
  step: PropType.number,
  size: PropType.oneOf(['large', 'small']),
  disabled: PropType.bool,
  controls: PropType.boolean,
  onChange: PropType.func,
}

InputNumber.defaultProps = {
  min: 0,
  max: Number.MAX_SAFE_INTEGER,
  step: 1,
  disabled: false,
  controls: true,
}