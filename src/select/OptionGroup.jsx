import React from 'react';
import {Component, PropType} from 'libs/index';

class OptionGroup extends Component {
  render() {
    return (
      <ul style={this.styles()} className="hui-select-group__wrap">
        <span className="hui-select-group__title">{this.props.label}</span>
        <li>
          <ul className="hui-select-group">
            {this.props.children}
          </ul>
        </li>
      </ul>
    )
  }
}

OptionGroup.propTypes = {
  label: PropType.string,
}

export default OptionGroup;