import React from 'react';
import {Component, PropType} from '../../libs/index';
import './Checkbox.scss';

export default class CheckboxGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: this.props.value || []
    }
  }
  static childContextTypes = {
    group: PropType.any
  }
  getChildContext() {
    return {
      group: this,
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({
        options: nextProps.value
      });
    }
  }
  onChange = (value, checked) => {
    const index = this.state.options.indexOf(value);
    if (checked) {
      if (index === -1) {
        this.state.options.push(value);
      }
    } else {
      this.state.options.splice(index, 1);
    }
    this.forceUpdate();
    if (this.props.onChange) {
      this.props.onChange(this.state.options);
    }
  }
  render() {
    const {options} = this.state;
    return (
      <div style={this.styles()} className="hui-checkbox-group">
        {
          React.Children.map(this.props.children, (node, index) => {
            if (!node) return null;
            let {name} = node.type;
            if (name !== 'Checkbox' && name !== 'CheckButton') {
              return null;
            }
            console.log(options.indexOf(node.props.label))
            return React.cloneElement(node, Object.assign({}, node.props, {
              key: index,
              checked: node.props.checked || options.indexOf(node.props.value) >= 0 || options.indexOf(node.props.label) >= 0,
              onChange: this.onChange.bind(this, node.props.value ? node.props.value : node.props.value === 0 ? 0 : node.props.label)
            }))
          })
        }
      </div>
    )
  }
}

CheckboxGroup.propTypes = {
  min: PropType.oneOfType([PropType.string, PropType.number]),
  max: PropType.oneOfType([PropType.string, PropType.number]),
  value: PropType.arrayOf(PropType.string),
  size: PropType.oneOf(['large', 'small']),
  fill: PropType.string,
  textColor: PropType.string,
  onChange: PropType.func,
}