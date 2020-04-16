import React from 'react';
import {Component, PropType, View} from '../../libs/index';
import Progress from '../progress/index';
import './UploadList.scss';
export default class UploadList extends Component {
  uploadlist = () => {
    const { onPreview, onRemove } = this.context;
    const { listType, fileList } = this.props;
    const isFinished = status => status === 'success';
    if(listType === 'none') return null;
    return (
      <ul className={this.classname('hui-upload__list', listType && `hui-upload__list--${listType}`)}>
        {
          fileList.map((file) => {
            return <li key={file.uid} className={this.classnames({
              'hui-upload__list__item': true, 
              [`is-${file.status}`]: true
            })}>
              {['picture-card', 'picture'].includes(listType) &&
                isFinished(file.status) &&
                <img
                  className="hui-upload__list__item-thumbnail"
                  src={file.url}
                  alt=""
                />
              }
              <a
                className="hui-upload__list__item-name"
                onClick={() => onPreview(file)}
              >
                <i className="hui-icon hui-icon-document" />{file.name}
              </a>
              <label
                className="hui-upload__list__item-status-label"
              >
                <i
                  className={this.classnames({
                    'hui-icon': true,
                    'hui-icon-check-circle': listType === 'text',
                    'hui-icon-check': ['picture-card', 'picture'].includes(
                      listType
                    )
                  })}
                />
              </label>
              <i className="hui-icon hui-icon-close" onClick={() => onRemove(file)} />
              <View
                className="hui-upload__list__item-actions"
                show={listType === 'picture-card'}
              >
                <span>
                  <span
                    onClick={() => onPreview(file)}
                    className="hui-upload__list__item-preview"
                  >
                    <i className="hui-icon hui-icon-search-plus" />
                  </span>
                  <span
                    className="hui-upload__list__item-delete"
                    onClick={() => onRemove(file)}
                  >
                    <i className="hui-icon hui-icon-trash-o" />
                  </span>
                </span>
              </View>
              {file.status === 'uploading' &&
              <Progress
                strokeWidth={listType === 'picture-card' ? 6 : 2}
                type={listType === 'picture-card' ? 'circle' : 'line'}
                percentage={parseInt(file.percentage, 10)}
                width={148}
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
      <React.Fragment>
        { this.uploadlist() }
      </React.Fragment>
    )
  }
}

UploadList.contextTypes = {
  onPreview: PropType.func,
  onRemove: PropType.func
}

UploadList.PropType = {
  listType: PropType.string,
  fileList: PropType.array
}