import React from 'react';
import {Component, PropType} from '../../libs/index';
import './Switch.scss';

export default class Switch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.getChecked(props),
    }
  }
  componentWillReceiveProps(nextprops) {
    const {checked: prev} = this.state;
    const checked = this.getChecked(nextprops);
    if (checked !== prev) {
      this.setState({
        checked,
      })
    }
  }
  getChecked = (props) => {
    // return props.value || props.onValue === props.value;
    if (props.onValue != null) {
      return props.onValue === props.value;
    } else {
      return props.value
    }
  }
  onChange = (e) => {
    let checked = e.target.checked;
    let {onValue, offValue} = this.props;
    let currentvalue;
    if (onValue != null && offValue != null) {
      currentvalue = checked ? onValue : offValue;
    } else {
      currentvalue = checked ? true : false;
    }
    if (this.props.onChange) {
      this.props.onChange(currentvalue)
    }
  }
  currentWidth = () => {
    const {onText, offText} = this.props;
    return onText != null || offText != null ? '58px' : '46px';
  }
  switchTitle = (type) => {
    const {onText, offText} = this.props;
    return type ? onText != null ? onText : 'ON' : offText != null ? offText : 'OFF'
  }
  currentBackground = () => {
    const {onColor, offColor} = this.props;
    const {checked} = this.state;
    return onColor != null ? checked ? onColor : offColor : checked ? '#13ce66' : '#ff4949';
  }
  onFocus = (e) => {
    if (this.props.onFocus && this.props.allowFocus) {
      this.props.onFocus(e)
    } else {
      return;
    }
  }
  onBlur = (e) => {
    if (this.props.onFocus && this.props.allowFocus) {
      this.props.onBlur(e)
    } else {
      return;
    }
  }
  render() {
    const {checked, focus} = this.state;
    const {disabled} = this.props;
    return (
      <label style={this.styles()} className={this.classname('hui-switch')}>
        <input 
          type="checkbox" 
          className={this.classnames('hui-switch__input')}
          disabled={disabled}
          checked={checked}
          onChange={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
        <span className={this.classnames('hui-switch-trunk', {
          'is-focus': focus,
          'is-disabled': disabled
        })} style={{
          'backgroundColor': this.currentBackground(),
          'width': this.currentWidth(),
        }}>
          <span className={this.classnames('hui-switch-thumb')} />
          <span className={this.classnames('hui-switch-title', 'hui-switch-title--prev')}>{this.switchTitle(true)}</span>
          <span className={this.classnames('hui-switch-title', 'hui-switch-title--next')}>{this.switchTitle(false)}</span>
        </span>
      </label>
    )
  }
}

Switch.propTypes = {
  value: PropType.oneOfType([PropType.bool, PropType.string, PropType.number]),
  onValue: PropType.oneOfType([PropType.bool, PropType.string, PropType.number]),
  offValue: PropType.oneOfType([PropType.bool, PropType.string, PropType.number]),
  onColor: PropType.string,
  offColor: PropType.string,
  onText: PropType.string,
  offText: PropType.string,
  onFocus: PropType.func,
  onBlur: PropType.func,
  onChange: PropType.func,
  disabled: PropType.bool,
  allowFocus: PropType.bool,
}

Switch.defaultProps = {
  disabled: false,
  onText: 'ON',
  offText: 'OFF',
  onValue: true,
  offValue: false,
  onColor: '#13ce66',
  offColor: '#c4c4c4',
  allowFocus: false,
}