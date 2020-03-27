import React from 'react';
import {Component, PropType} from '../../libs/index';
import UploadList from './UploadList';
import IFrameUpload from './IFrameUpload';
import AjaxUpload from './AjaxUpload';
import './upload.scss';

export default class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      tempIndex: 1
    };
  }
  getChildContext() {
    return {
      onPreview: this.handlePreview.bind(this),
      onRemove: this.handleRemove.bind(this)
    };
  }
  getFile(file) {
    if (file) {
      return this.state.fileList.find(item => item.uid === file.uid);
    }
    return null;
  }
  componentWillMount() {
    this.init(this.props);
  }
  init(props) {
    let { tempIndex } = this.state;
    const { fileList } = props;
    const uploadFiles = fileList.map(file => {
      file.uid = file.uid || Date.now() + tempIndex++;
      file.status = 'success';
      return file;
    });
    this.setState({ fileList: uploadFiles });
  }
  handleStart(file) {
    let { tempIndex, fileList } = this.state;

    file.uid = Date.now() + tempIndex++;

    let _file = {
      status: 'ready',
      name: file.name,
      size: file.size,
      percentage: 0,
      uid: file.uid,
      raw: file
    };

    try {
      _file.url = URL.createObjectURL(file);
    } catch (err) {
      return;
    }

    fileList.push(_file);
    this.setState({
      fileList,
      tempIndex
    });
  }
  handleProgress(e, file) {
    const { fileList } = this.state;
    let _file = this.getFile(file);
    if (_file) {
      _file.percentage = e.percent || 0;
      _file.status = 'uploading';
      this.props.onProgress(e, _file, fileList);
      this.setState({ fileList });
    }
  }
  handleSuccess(res, file) {
    const { fileList } = this.state;
    let _file = this.getFile(file);
    if (_file) {
      _file.status = 'success';
      _file.response = res;

      setTimeout(
        () => {
          this.setState({ fileList }, () => {
            this.props.onSuccess(res, _file, fileList);
            this.props.onChange(_file, fileList);
          });
        },
        1000
      );
    }
  }
  handleError(e, file) {
    const { fileList } = this.state;
    let _file = this.getFile(file);
    if (_file) {
      _file.status = 'fail';
      fileList.splice(fileList.indexOf(_file), 1);
      this.setState({ fileList }, () => {
        this.props.onError(e, _file, fileList);
        this.props.onChange(_file, fileList);
      });
    }
  }
  handleRemove(file) {
    const { fileList } = this.state;
    let _file = this.getFile(file);
    if (_file) {
      fileList.splice(fileList.indexOf(_file), 1);
      this.setState({ fileList }, () => this.props.onRemove(file, fileList));
    }
  }

  handlePreview(file) {
    if (file.status === 'success') {
      this.props.onPreview(file);
    }
  }
  clearFiles() {
    this.setState({
      fileList: []
    });
  }

  submit() {
    this.state.fileList
      .filter(file => file.status === 'ready')
      .forEach(file => {
        this.refs['upload-inner'].upload(file.raw, file);
      });
  }

  showCover() {
    const { fileList } = this.state;
    const file = fileList[fileList.length - 1];
    return file && file.status !== 'fail';
  }
  render() {
    const { fileList } = this.state;
    const {
      showFileList,
      autoUpload,
      drag,
      tip,
      action,
      multiple,
      beforeUpload,
      withCredentials,
      headers,
      name,
      data,
      accept,
      listType,
      className,
      limit,
      disabled,
      onExceed,
      httpRequest
    } = this.props;
    let uploadList;
    if (showFileList && fileList.length) {
      uploadList = <UploadList listType={listType} fileList={fileList} />;
    }
    const restProps = {
      autoUpload,
      drag,
      action,
      multiple,
      beforeUpload,
      withCredentials,
      headers,
      name,
      data,
      accept,
      listType,
      fileList,
      limit,
      disabled,
      onExceed,
      httpRequest,
      onStart: this.handleStart.bind(this),
      onProgress: this.handleProgress.bind(this),
      onSuccess: this.handleSuccess.bind(this),
      onError: this.handleError.bind(this),
      onPreview: this.handlePreview.bind(this),
      onRemove: this.handleRemove.bind(this),
      showCover: this.showCover(),
      ref: 'upload-inner'
    };
    const trigger = this.props.trigger || this.props.children;
    const uploadComponent = typeof FormData !== 'undefined'
      ? <AjaxUpload key="AjaxUpload" {...restProps}>{trigger}</AjaxUpload>
      : <IFrameUpload key="IFrameUpload" {...restProps}>{trigger}</IFrameUpload>;
    return (
       <div className={className}>
        {listType === 'picture-card' ? uploadList : ''}
        {this.props.trigger
          ? [uploadComponent, this.props.children]
          : uploadComponent}
        {tip}
        {listType !== 'picture-card' ? uploadList : ''}
      </div>
    )
  }
}

Upload.childContextTypes = {
  onPreview: PropType.func,
  onRemove: PropType.func
};
  
Upload.propTypes = {
  action: PropType.string.isRequired,
  headers: PropType.object,
  data: PropType.object,
  multiple: PropType.bool,
  name: PropType.string,
  withCredentials: PropType.bool,
  showFileList: PropType.bool,
  fileList: PropType.array,
  autoUpload: PropType.bool,
  accept: PropType.string,
  drag: PropType.bool,
  listType: PropType.oneOf(['text', 'picture', 'picture-card']),
  tip: PropType.node,
  trigger: PropType.node,
  beforeUpload: PropType.func,
  onRemove: PropType.func,
  onPreview: PropType.func,
  onProgress: PropType.func,
  onSuccess: PropType.func,
  onError: PropType.func,
  onChange: PropType.func,
  className: PropType.string,
  disabled: PropType.bool,
  limit: PropType.number,
  onExceed: PropType.func,
  httpRequest: PropType.func
};

Upload.defaultProps = {
  headers: {},
  name: 'file',
  type: 'select',
  listType: 'text',
  fileList: [],
  showFileList: true,
  autoUpload: true,
  disabled: false,
  onRemove() {},
  onPreview() {},
  onProgress() {},
  onSuccess() {},
  onError() {},
  onChange() {}
};