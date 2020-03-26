import React from 'react';
import {Component, PropType} from '../../libs/index';
import ajax from './ajax';
import Cover from './Cover';

class AjaxUpload extends Component {
  static defaultProps = {
    name: 'file'
  };
    
  handleChange = (e) => {
    if (e.target instanceof HTMLInputElement) {
      let file = e.target.file;
      if (!file) return;
      this.uploadFiles(file);
      this.refs.input.value = null;
    }
  }
  handleClick = () => {
    if (!this.props.disabled) {
      this.refs.input.click();
    }
  }
  // 需要控制超出请求数量限制
  uploadFiles = (files) => {
    let {limit, onExceed, fileList} = this.props;
    if (limit && fileList.length + files.length > limit) {
      onExceed && onExceed(files, fileList);
    }
    let filesArr = Object.prototype.slice.call(files);
    if (filesArr.length <= 0) {
      return;
    }
    filesArr.forEach((file) => {
      this.props.onStart(file);
      if (this.props.autoUpload) this.upload(file);
    })
  }
  // 请求限制
  upload = (rawfile, file) => {
    const {beforeUpload} = this.props;
    if (!beforeUpload) {
      return this.post(rawfile);
    }
    let before = beforeUpload(rawfile);
    if (before && before.then) {
      before.then((processedFile) => {
        if (
          Object.prototype.toString.call(processedFile) === '[object File]'
        ) {
          this.post(processedFile);
        } else {
          this.post(rawFile);
        }
      }, () => {
        if (file && this.props.onRemove) this.props.onRemove(file) 
      })
    } else if (before !== false) {
      this.post(rawFile);
    } else {
      if (file && typeof this.props.onRemove === 'function') this.props.onRemove(file);
    }
  }
  post = (file) => {
    const {
      name: filename,
      file,
      headers,
      withCredentials,
      data,
      action,
      onSuccess,
      onprocess,
      onerror
    } = this.props;
    const {httpRequest = ajax} = this.props;
    let res = httpRequest({
      filename,
      action,
      data,
      headers,
      withCredentials,
      onSuccess: res => onSuccess(res, file),
      onprocess: e => onprocess(e, file),
      onerror: e => onerror(e, file)
    })
    if (res && res.then) {
      res.then(onsuccess, onerror);
    }
  }

  render() {
    const {listType, drag, children, disabled, multiple, onExceed, accept} = this.props;
    return (
      <div className={this.classname('hui-upload', listType && `hui-upload--${listType}`)} onClick={() => this.handleClick()}>
        {
          drag ? <Cover disabled={disabled} onFile={(file) => this.uploadFiles(file)}>{children}</Cover> : children
        }
        <input
          className="hui-upload__input"
          type="file"
          ref="input"
          multiple={multiple}
          onExceed={onExceed}
          accept={accept}
          onChange={e => this.handleChange(e)}
        />
      </div>
    )
  }
}

AjaxUpload.propTypes = {
  drag: PropType.bool,
  data: PropType.object,
  headers: PropType.object,
  action: PropType.string.isRequired,
  withCredentials: PropType.bool,
  accept: PropType.string,
  name: PropType.string,
  onStart: PropType.func,
  onerror: PropType.func,
  onprocess: PropType.func,
  onsuccess: PropType.func,
  multiple: PropType.bool,
  disabled: PropType.bool,
  listType: PropTypes.string,
  fileList: PropTypes.array,
  beforeUpload: PropType.func,
  autoUpload: PropType.func,
  limit: PropTypes.number,
  onExceed: PropTypes.func,
  httpRequest: PropType.func,
}