import React from 'react';
import {Component, PropType} from '../../libs/index';
import './Anchor.scss';


class Anchor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  componentDidMount() {
    
  }

  render() {
    return (
      <div style={this.styles()}>
        Anchor
      </div>
    )
  }
}

Anchor.propTypes = {
  
}

Anchor.defaultProps = {
  
}

Anchor.childContextTypes = {
  component: PropType.any,
}