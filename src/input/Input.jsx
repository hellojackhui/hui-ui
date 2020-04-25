import React from 'react';
import {Component, PropType} from '../../libs/index';
import './Input.scss';
import {calculateTextareaStyle} from './utils';

export default class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textareaStyle: {resize: props.resize}
    }
  }
  componentDidMount() {
    this.calTextArea();
  }
  onfocus = (e) => {
    const { onFocus } = this.props;
    if (onFocus) onFocus(e)
  }
  onblur = (e) => {
    const { onBlur } = this.props;
    if (onBlur) onBlur(e)
  }
  textChangeHandler = (e) => {
    let val = e.target.value;
    if (this.props.onChange) {
      this.props.onChange(val);
    }
    this.calTextArea();
  }
  trimHandler = () => {
    this.refs.input.value = this.refs.input.value.trim();
    if (this.props.onChange) {
      this.props.onChange(this.refs.input.value.trim());
    }
  }
  iconClickHandler = (e) => {
    if (this.props.onIconClick) {
      this.props.onIconClick(e);
    }
  }
  calTextArea = () => {
    if (!this.props.autoSize || this.props.type !== 'textarea') {
      return;
    }
    const minRows = this.props.minRows;
    const maxRows = this.props.maxRows;
    const calTextAreaStyle = calculateTextareaStyle(this.refs.textarea, minRows, maxRows);
    this.setState({
      textareaStyle: Object.assign({}, this.state.textareaStyle, calTextAreaStyle)
    });

  }
  render() {
    const { type, size, disabled, prepend, append, icon, autoComplete, rows, onMouseEnter, onMouseLeave, trim, ...otherprops } = this.props;
    const commonClassName = this.classname(
      type === 'textarea' ? 'hui-textarea' : 'hui-input',
      size && `hui-input__${size}`,
      {
        'is-disabled': disabled,
        'hui-input-group': !!prepend || !!append,
        'hui-input-group--prepend': !!prepend,
        'hui-input-group--append': !!append
      }
    )
    delete otherprops.onIconClick;
    delete otherprops.style;
    delete otherprops.resize;
    delete otherprops.autoSize;


    if (type === 'textarea') {
      return (
        <div style={this.styles()} className={this.classname(commonClassName)}>
          <textarea 
            {...otherprops}
            ref="textarea"
            rows={rows}
            style={this.state.textareaStyle}
            onChange={this.textChangeHandler}
            onFocus={this.onfocus}
            onBlur={this.onblur}
            className="hui-textarea__inner"
          />
        </div>
      )
    } else {
      return (
        <div style={this.styles()} className={this.classname(commonClassName)} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          {prepend && <div className="hui-input-group__prepend">{prepend}</div>}
          {icon && <i className={this.classnames('hui-input__icon', 'hui-icon', `hui-icon-${icon}`)} onClick={this.iconClickHandler}></i>}
          <input 
            {...otherprops}
            ref="input"
            type={type}
            className="hui-input__inner"
            autoComplete={autoComplete}
            onChange={this.textChangeHandler}
            onFocus={this.onfocus}
            onBlur={this.onblur}
          />
          {append && <div className="hui-input-group__append">{append}</div>}
        </div>
      )
    }
  }
}

Input.propTypes = {
  // input attrs
  type: PropType.string,
  icon: PropType.string,
  disabled: PropType.bool,
  placeholder: PropType.string,
  readOnly: PropType.bool,
  autoFocus: PropType.bool,
  maxLength: PropType.number,
  minLength: PropType.number,
  value: PropType.any,
  trim: PropType.bool,
  size: PropType.oneOf(['large', 'small', 'mini']),
  autoSize: PropType.bool,
  prepend: PropType.node,
  append: PropType.node,

  // autocomplete attrs
  rows: PropType.number,
  resize: PropType.oneOf(['none', 'both', 'horizontal', 'vertical']),
  autoComplete: PropType.string,

  // input events
  onFocus: PropType.func,
  onBlur: PropType.func,
  onChange: PropType.func,
  onIconClick: PropType.func,
  onMouseEnter: PropType.func,
  onMouseLeave: PropType.func,
}

Input.defaultProps = {
  type: 'text',
  autoSize: false,
  trim: false,
  rows: 2,
  autoComplete: 'off',
}