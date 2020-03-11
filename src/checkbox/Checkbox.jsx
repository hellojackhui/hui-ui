import React from 'react';
import {Component, PropType} from '../../libs/index';
import './Checkbox.scss';

export default class Checkbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.calCheckStatus(props)
    }
  }
  calCheckStatus = (props) => {
    return props.checked;
  }
  onChange = (e) => {
    const val = e.target.checked;
    const {onChange} = this.props;
    this.setState({
      checked: val,
    }, () => {
      if (onChange && val) {
        onChange(val);
      }
    })
  }
  render() {
    const {disabled, children, indeterminate} = this.props;
    const {checked} = this.state;
    return (
      <label style={this.styles()} className={this.classname('hui-checkbox', {
        'is-disabled': disabled,
      })}>
        <span className={this.classname("hui-checkbox__inner", {
          'is-indeterminate': indeterminate,
          'is-checked': checked,
        })}></span>
        <input 
          className="hui-checkbox__input"
          type="checkbox"
          disabled={disabled}
          onChange={this.onChange}
          checked={checked}
        />
        <span className="hui-checkbox__title">{children}</span>
      </label>
    )
  }
}

Checkbox.propTypes = {
  checked: PropType.oneOfType([PropType.bool, PropType.number, PropType.string]),
  disabled: PropType.bool,
  label: PropType.string,
  indeterminate: PropType.bool,
  onChange: PropType.func,
}