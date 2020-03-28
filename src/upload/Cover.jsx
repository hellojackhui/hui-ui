import React from 'react';
import {Component, PropType} from '../../libs/index';
import './Cover.scss';

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
        dragOver: true,
      })
    }
  }

  onDragLeaveHandler = (e) => {
    e.preventDefault();
    this.setState({
      dragOver: false,
    })
  }


  render() {
    const {dragOver} = this.state;
    const {children} = this.props;
    return (
      <div className={this.classname('hui-upload-dragger', {
        'is-dragover': dragOver
      })}
        onDrop={this.onDropHandler}
        onDragOver={this.onDragOverHandler}
        onDragLeave={this.onDragLeaveHandler}
      >
        <i className="hui-upload-dragger__icon hui-icon hui-icon-upload" />
        <div className="hui-upload-dragger__tip">
          将文件拖到此处<em>点击上传</em>
        </div>
        {children}
      </div>
    )
  }

}

Cover.propTypes = {
  onFile: PropType.func,
  disabled: PropType.bool,
}