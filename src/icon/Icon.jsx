import React from 'react';
import {Component, PropType} from 'libs/index';


export default class Icon extends Component {
  render() {
    return (
      <i style={this.styles()} className={this.classname('hui-icon', `hui-icon-${this.props.name}`)}></i>
    )
  }
}

Icon.propTypes = {
  name: PropType.string
}