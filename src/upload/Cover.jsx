import React from 'react';
import {Component, PropType} from '../../libs/index';


export default class Cover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dragOver: false,
    }
  }

  onDropHandler = (e) => {
    if (this.props.disabled) return;
    e.preventDefault();
    this.setState({
      dragOver: false,
    })
    this.props.onFile(e.dataTransfer.files);
  }

  onDragOverHandler = (e) => {
    e.preventDefault();
    if (!this.props.disabled) {
      this.setState({
        dragable: true,
      })
    }
  }

  onDragLeaveHandler = (e) => {
    e.preventDefault();
    this.setState({
      dragable: false,
    })
  }


  render() {
    const {dragable} = this.state;
    const {children} = this.props;
    return (
      <div className={this.classname('hui-upload-dragger', {
        'is-dragging': dragable
      })}
        onDrop={this.onDropHandler}
        onDragOver={this.onDragOverHandler}
        onDragLeave={this.onDragLeaveHandler}
      >
        {children}
      </div>
    )
  }

}

Cover.propTypes = {
  onFile: PropType.func,
  disabled: PropType.bool,
}