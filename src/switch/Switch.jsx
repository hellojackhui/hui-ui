import React from 'react';
import {Component, PropType} from '../../libs/index';
import './Switch.scss';


export default class Switch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.getChecked(props)
    }
  } 
  getChecked = (props) => {
    return true;
  }
  switchTitle = () => {
    const {checked} = this.state;
    return checked ? '1' : '0';
  }
  render() {
    const {checked, focus} = this.state;
    const {disabled} = this.props;
    return (
      <label style={this.styles()} className={this.classname('hui-switch')}>
        <input 
          type="checkbox" 
          className={this.classname('hui-switch-input')}
          disabled={disabled}
          checked={checked}
        />
        <span className={this.classname('hui-switch-trunk', {
          'is-focus': focus,
          'is-disabled': disabled
        })}>
          <span className={this.classname('hui-switch-thumb', {
            'is-checked': checked
          })} />
          <span className={this.classname('hui-switch-title', {
            'is-checked': checked
          })}>{this.switchTitle()}</span>
        </span>
      </label>
    )
  }
}