import React from 'react';
import {Component, PropType} from '../../libs/index';

export default class RadioGroup extends Component {

  getChildContext() {
    return {
      component: this,
    }
  }

  handleChange = (val) => {
    console.log(val);
    if (this.props.onChange) {
      this.props.onChange(val);
    }
  }

  render() {
    return (
      <div className={this.classname("hui-radio-group")} style={this.styles()}>
        {
          React.Children.map(this.props.children, (child) => {
            if (!child) return null;
            let {name} = child.type;
            if (name !== 'Radio' && name !== 'RadioButton') return null;
            return React.cloneElement(child, Object.assign({}, child.props, {
              onChange: this.handleChange,
              modal: this.props.value,
              size: this.props.size,
            }))
          })
        }
      </div>
    )
  }
  

}

RadioGroup.childContextTypes = {
  component: PropType.any
}

RadioGroup.propTypes = {
  value: PropType.oneOfType([PropType.string, PropType.number]),
  disabled: PropType.bool,
  size: PropType.bool,
  fill: PropType.string,
  textColor: PropType.string,
}