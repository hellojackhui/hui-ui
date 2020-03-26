import React from 'react';
import {Component, PropType, View} from '../../libs/index';

export default class UploadList extends Component {
  constructor(props) {
    super(props);
  }
  uploadlist = () => {
    const { onPreview, onRemove } = this.context;
    const { listType, fileList } = this.props;
    const isFinished = status => status === 'success';
    if(listType === 'none') return null;
    return (
      <ul className={this.classname('hui-upload-list', listType && `hui-upload-list--${listType}`)}>
        {
          fileList.map((file) => {
            <li key={file.uid} className={this.classname('hui-upload-list__item', `is-${file.status}`)}>
              {['picture-card', 'picture'].includes(listType) &&
                isFinished(file.status) &&
                <img
                  className="hui-upload-list__item-thumbnail"
                  src={file.url}
                  alt=""
                />
              }
              <a
                className="hui-upload-list__item-name"
                onClick={() => onPreview(file)}
              >
                <i className="hui-icon hui-icon-document" />{file.name}
              </a>
              <label
                className="hui-upload-list__item-status-label"
              >
                <i
                  className={this.classNames({
                    'hui-icon-upload-success': true,
                    'hui-icon-circle-check': listType === 'text',
                    'hui-icon-check': ['picture-card', 'picture'].includes(
                      listType
                    )
                  })}
                />
              </label>
              <i className="hui-icon hui-icon-close" onClick={() => onRemove(file)} />
              <View
                className="hui-upload-list__item-actions"
                show={listType === 'picture-card' && isFinished(file.status)}
              >
                  <span>
                    <span
                      onClick={() => onPreview(file)}
                      className="hui-upload-list__item-preview"
                    >
                      <i className="hui-icon-view" />
                    </span>
                    <span
                      className="hui-upload-list__item-delete"
                      onClick={() => onRemove(file)}
                    >
                      <i className="hui-icon hui-icon-delete" />
                    </span>
                  </span>
              </View>
              {file.status === 'uploading' &&
              <Progress
                strokeWidth={listType === 'picture-card' ? 6 : 2}
                type={listType === 'picture-card' ? 'circle' : 'line'}
                percentage={parseInt(file.percentage, 10)}
                status={
                  isFinished(file.status) && file.showProgress ? 'success' : ''
                }
              />}
            </li>
          })
        }
      </ul>
    )
  }
  render() {
    return (
      <View>{ this.uploadlist() }</View>
    )
  }
}

UploadList.contextTypes = {
  onPreview: PropTypes.func,
  onRemove: PropTypes.func
}

UploadList.propTypes = {
  listType: PropType.string,
  fileList: PropTypes.array
}