import React from 'react';
import {PropType} from '../../libs/index';
import Checkbox from './Checkbox';
import '../../style/core/module/Checkbox.scss';

export default class CheckButton extends Checkbox {

  getInnerStyle = () => {
    const group = this.parent()
    if (this.state.checked) {
      return {
        'backgroundColor': `${group.props.fill} || ''`,
        'borderColor': `1px solid ${group.props.fill || ''}`,
        'color': `${group.props.textColor || ''}`
      }
    } else {
      return {}
    }
  }

  render() {
    const {children, disabled} = this.props;
    const {checked, label, focus} = this.state;
    const group = this.parent();
    return (
      <label style={this.styles()} className={this.classname('hui-checkbutton', group.props.size && `hui-checkbutton--${group.props.size}`,{
        'is-disabled': disabled,
        'is-checked': checked,
        'is-focus': focus,
      })}>
        <input
          className="hui-checkbutton__input" 
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
        <span className={this.classname('hui-checkbutton__inner')} style={this.getInnerStyle()}>
          {children || label}
        </span>
      </label>
    )
  }
}

CheckButton.contextTypes = {
  group: PropType.any,
}

CheckButton.propTypes = {
  checked: PropType.oneOfType([PropType.bool, PropType.number, PropType.string]),
  disabled: PropType.bool,
  label: PropType.string,
  onChange: PropType.func,
}