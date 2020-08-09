import React from 'react';
import {Component, PropType} from '../../libs/index';
import 'module/Checkbox.scss';

export default class Checkbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: props.checked,
      focus: false,
      label: this.getLabel(props)
    }
  }
  static contextTypes = {
    group: PropType.any,
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      checked: nextProps.checked,
      label: this.getLabel(nextProps),
      focus: nextProps.focus,
    })
  }
  parent = () => {
    return this.context.group;
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
  getLabel = (props) => {
    if (props.trueLabel || props.falseLabel) {
      return props.checked ? props.trueLabel : props.falseLabel;
    } else {
      return props.label;
    }
  }
  onChange = (e) => {
    let val = e.target.checked;
    const {onChange, trueLabel, falseLabel} = this.props;
    let ctx = this.parent();
    if (ctx) {
      let arr = ctx.state.options;
      let len = arr.length + (val ? 1 : -1);
      if (ctx.props.min !== undefined && ctx.props.min > len) {
        return;
      }
      if (ctx.props.max !== undefined && ctx.props.max < len) {
        return;
      }
    }
    let newlabel = this.state.label;
    if (trueLabel || falseLabel) {
      newlabel = val ? trueLabel : falseLabel;
    }
    this.setState({
      checked: val,
      label: newlabel,
    }, () => {
      if (onChange) {
        onChange(val, e);
      }
    })
  }
  render() {
    const {disabled, children, indeterminate} = this.props;
    const {checked, label, focus} = this.state;
    return (
      <label style={this.styles()} className={this.classname('hui-checkbox')}>
        <span className={this.classnames("hui-checkbox__input", {
            'is-checked': checked,
            'is-indeterminate': indeterminate,
            'is-focus': focus,
            'is-disabled': this.props.disabled,
        })}>
          <span className="hui-checkbox__inner"></span>
          <input 
            className="hui-checkbox__original"
            type="checkbox"
            disabled={disabled}
            onChange={this.onChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            checked={checked}
          />
        </span>
        <span className="hui-checkbox__title">{children || label}</span>
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