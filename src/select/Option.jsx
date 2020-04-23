import React from 'react';
import {Component, PropType, View} from '../../libs/index';

export default class Option extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: -1,
      visible: false,
      hitstate: false,
    }
  }
  parent() {
    return this.context.component;
  }
  componentDidMount() {
    this.parent().optioncreate(this);
    this.setState({
      index: this.parent.state.options.indexOf(this)
    })
    if (this.currentSelected() === true) {
      this.parent().addOptionToValue(this, true);
    }
  }
  componentWillUnmount() {
    this.parent().destoryOption(this);
  }

  currentSelected() {
    return this.props.selected || (this.parent().props.multiple ? 
      this.parent().state.value.indexOf(this.props.value) !== -1 :
      this.parent().state.value === this.props.value)
  }
  
  currentLabel() {
    return this.props.label || (typeof this.props.value === 'string' || typeof this.props.value === 'number' ? this.props.value : '');
  }

  itemSelected() {
    if (Object.prototype.toString.call(this.parent().state.selected) == '[object Object]') {
      return this === this.parent().state.selected;
    } else {
      return this.parent().state.selected.map(el => el.props.value).indexOf(this.props.value) !== -1
    }
    return false;
  }

  hoverItem() {
    if (!this.props.disabled || !this.parent().props.disabled) {
      this.parent().setState({
        hoverIndex: this.parent().state.options.indexOf(this)
      })
    }
  }

  selectOptionClick() {
    if (this.props.disabled !== true && this.parent().props.disabled !== true) {
      this.parent().onOptionClick(this);
    }
  }

  resetIndex() {
    this.setState({
      index: this.parent().state.options.indexOf(this)
    });
  }

  render() {
    const {visible, index} = this.state;
    return (
      <View show={visible}>
        <li 
          style={this.styles()} 
          className={this.classname("hui-option", {
            'is-active': this.itemSelected(),
            'is-disabled': this.props.disabled || this.parent().props.disabled,
            'hover': this.parent().state.hoverIndex == index
          })}
          onMouseEnter={this.hoverItem.bind(this)}
          onClick={this.selectOptionClick.bind(this)}
        >
          {this.props.children || <span>{this.currentLabel()}</span> }
        </li>
      </View>
    )
  }
}

Option.contextTypes = {
  component: PropType.any
};

Option.propTypes = {
  value: PropType.any.isRequired,
  label: PropType.oneOfType([PropType.string, PropType.number]),
  selected: PropType.bool,
  disabled: PropType.bool
}
