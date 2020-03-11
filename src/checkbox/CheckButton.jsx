import React from 'react';
import {Component, PropType} from '../../libs/index';
import './Checkbox.scss';

export default class CheckButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.calChecked(props)
    }
  }
  onChange = (e) => {
    var val = e.target.checked;
    this.setState({
      checked: val,
    }, () => {
      if (this.props.onChange) {
        this.props.onChange(val)
      }
    })
  }
  calChecked = (props) => {
    return props.checked;
  }
  render() {
    const {children, disabled} = this.props;
    const {checked} = this.state;
    return (
      <label style={this.styles()}>
        <span className="hui-checkbutton__inner">
          <span className="hui-checkbutton__btn"></span>
          <input 
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={this.onChange}
          />
        </span>
        <span className="hui-checkbutton__title">{children}</span>
      </label>
    )
  }
}

CheckButton.propTypes = {
  checked: PropType.oneOfType([PropType.bool, PropType.number, PropType.string]),
  disabled: PropType.bool,
  label: PropType.string,
  indeterminate: PropType.bool,
  onChange: PropType.func,
}