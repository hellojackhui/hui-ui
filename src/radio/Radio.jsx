import React from 'react';
import {Component, PropType} from '../../libs/index';
import './Radio.scss';

export default class Radio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      focus: false,
    }
  }

  parent() {
    return this.context.component;
  }

  componentDidMount() {
    let checked = this.getChecked(this.props);
    if (checked) {
      this.setState({
        checked: true,
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    const checked = this.getChecked(nextProps);
    if (this.state.checked !== checked) {
      this.setState({
        checked
      })
    }
  }

  handleFocus = () => {
    this.setState({
      focus: true,
    })
  }

  handleBlur = () => {
    this.setState({
      focus: false,
    })
  }

  getChecked = (props) => {
    return !!props.checked || props.modal === props.value;
  }

  handleClick = (e) => {
    let value = e.target.checked;
    if (value) {
      if (this.props.onChange) {
        this.props.onChange(this.props.value);
      }
    }
    this.setState({
      checked: value,
    })
  }

  render() {
      const {disabled, children} = this.props;
      const {checked, focus} = this.state;
      return (
        <label className="hui-radio" style={this.styles()}>
          <span className={this.classname('hui-radio__icon', {
            'is-disabled': disabled,
            'is-focus': focus,
            'is-checked': checked,
          })}>
            <span className="hui-radio__inner"></span>
            <input 
              type="radio"
              className="hui-radio__input"
              checked={checked}
              disabled={disabled}
              onChange={this.handleClick}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
            />
          </span>
          <span className="hui-radio__title">
            {children}
          </span>
        </label>
      )
  }
}

Radio.contextTypes = {
  component: PropType.any,
}

Radio.propTypes = {
  checked: PropType.bool,
  value: PropType.oneOfType([PropType.string, PropType.number, PropType.bool]),
  disabled: PropType.bool,
  name: PropType.string,
  onChange: PropType.func
}