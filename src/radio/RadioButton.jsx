import React from 'react';
import {Component, PropType} from '../../libs/index';
import './Radio.scss';

export default class RadioButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.getChecked(props),
      focus: false,
    }
  }
  parent() {
    return this.context.component;
  }

  getChecked = (props) => {
    return props.checked || props.modal === props.value;
  }
  componentDidMount() {
    let checked = this.getChecked(this.props);
    if (checked) {
      this.setState({
        checked: true,
      })
    }
  }
  componentWillReceiveProps(nextprops) {
    let checked = this.getChecked(nextprops);
    if (this.state.checked !== checked) {
      this.setState({
        checked: checked
      })
    }
  }
  onChange = (e) => {
    let checked = e.target.checked;
    console.log(e);
    if (checked) {
      if (this.props.onChange) {
        this.props.onChange(this.props.value);
      }
    }
    this.setState({
      checked: true,
    })
  }
  onfocus = () => {
    this.setState({
      focus: true,
    })
  }
  onblur = () => {
    this.setState({
      focus: false,
    })
  }
  render() {
    const {children, disabled} = this.props;
    const {focus, checked} = this.state;
    return (
      <label style={this.styles()} className={this.classname('hui-radio-button')}>
        <span className={this.classname('hui-radio-button__wrap', {
          'is-disabled': disabled,
          'is-checked': checked,
          'is-focus': focus,
        })}>
          <input 
            type="radio"
            className="hui-radio-button__input"
            onFocus={this.onfocus}
            onBlur={this.onblur}
            onChange={this.onChange}
            disabled={disabled}
            checked={checked}
          />
          {children || this.props.value}
        </span>
      </label>
    )
  }
}

RadioButton.contextTypes = {
  component: PropType.any,
}