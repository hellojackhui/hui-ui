import React from 'react';
import {Component, PropType} from 'libs/index';
import './Skeleton.scss';

export default class Skeleton extends Component {
  renderSkeletonPage = () => {
    const {active, avatar, title, paragraph} = this.props;
    return (
      <React.Fragment>
        {
          avatar && this.renderSkeletonHeader()
        }
        <div className="hui-skeleton__wrapper">
          {
            this.renderSkeletonBody(active, paragraph, title, avatar)
          }
        </div>
      </React.Fragment>
    )
  }
  renderSkeletonHeader = () => {
    return (
      <div className={this.classnames("hui-skeleton__header")}>
        <span className="hui-skeleton__header-avatar hui-skeleton__header-avatar-lg hui-skeleton__header-avatar-circle"></span>
      </div>
    )
  }
  renderSkeletonBody = (active, paragraph, title, avatar) => {
    return (
      <React.Fragment>
        {
          title && (
            <h3 className={this.classnames('hui-skeleton-title')} style={{'width': avatar ? '38%' : '50%'}}></h3>
          )
        }
        <ul className="hui-skeleton-paragraph">
          {
            this.renderSkeletonParagraph(paragraph)
          }
        </ul>
      </React.Fragment>
    )
  }
  renderSkeletonParagraph = (paragraph) => {
    const {row, width} = paragraph;
    let result = new Array(row).fill(width);
    result = result.map((item, index) => {
      return (
        <li key={index} style={{
          'width': index == row - 1 ? '61%' : item
        }}></li>
      )
    })
    return result;
  }
  render() {
    const {loading, children, avatar, active} = this.props;
    return (
      <div className={this.classname("hui-skeleton", {
        'with-avatar': avatar,
        'with-active': active
      })} style={this.styles()}>
        {
          loading ? this.renderSkeletonPage() : children
        }
      </div>
    )
  }
}

Skeleton.propTypes = {
  active: PropType.bool,
  loading: PropType.bool,
  avatar: PropType.oneOfType([PropType.bool, PropType.any]),
  paragraph: PropType.object,
  title: PropType.bool,
}

Skeleton.defaultProps = {
  active: false,
  title: true,
  loading: true,
  paragraph: {
    row: 3,
  }
}