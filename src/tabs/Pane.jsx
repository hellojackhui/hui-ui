import React from 'react';
import {Component, PropType} from '../../libs/index';

class Pane extends Component {
  render() {
    return (
      <div style={this.styles()} className="hui-pane">
        {this.props.children}
      </div>
    )
  }
}

Pane.PropType = {
  label: PropType.string,
  name: PropType.string,
  disabled: PropType.bool,
  closable: PropType.bool,
}

Pane.defaultProps = {
  disabled: false,
  closable: false,
}

export default Pane;