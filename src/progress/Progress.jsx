/*
 * progress组件
 * @Author: hellojackhui 
 * @Date: 2020-03-06 17:09:42 
 * @Last Modified by: hellojackhui
 * @Last Modified time: 2020-08-09 20:17:07
 */

import React from 'react';
import {Component, PropType} from '../../libs/index';
import '../../style/core/module/Progress.scss';
class Progress extends Component {
  static defaultProps = {
    percentage: 0,
    type: 'line',
    strokeWidth: 6,
    textInside: false,
    width: '126',
    showText: true
  }

  // 根据storkewidth和width的比值获取进度圈的直径
  relativeStrokeWidth() {
    const { strokeWidth, width } = this.props;
    return (strokeWidth / width * 100).toFixed(1);
  }

  // 获取进度圈的d
  trackPath = () => {
    const radius = parseInt(
        50 - parseFloat(this.relativeStrokeWidth()) / 2,
        10
    )
    return `M 50 50 m 0 -${radius} a ${radius} ${radius} 0 1 1 0 ${radius * 2} a ${radius} ${radius} 0 1 1 0 -${radius * 2}`;
  }

  // 为进度显示添加背景
  stroke = () => {
    let type
    switch (this.props.status) {
        case 'success':
            type = '#13ce66';
            break;
        case 'exception':
            type = '#ff4949';
            break;
        default:
            type = '#20a0ff';
            break;
    }
    return type;
  }

  perimeter = () => {
    const radius = 50 - parseFloat(this.relativeStrokeWidth()) / 2;
    return 2 * Math.PI * radius;
  }

  // 添加进度条的样式
  circlePathStyle = () => {
    const perimeter = this.perimeter();
    return {
      'strokeDasharray': `${perimeter}px ${perimeter}px`,
      'strokeDashoffset': `${(1 - this.props.percentage / 100) * perimeter}px`,
      'transition': `stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease`,
    }
  }

  // icon渲染
  iconSvg = () => {
    const { status } = this.props;
    let path = '';
    if (status === 'success') {
      path = `M 779.939 279 l 42.483 42.37 l -423.496 424.618 L 202 550.658 l 42.253 -42.6 l 154.445 153.194 Z`;
    } else {
      path = `M 810.667 273.707 l -60.3733 -60.3733 l -238.293 238.293 l -238.293 -238.293 l -60.3733 60.3733 l 238.293 238.293 l -238.293 238.293 l 60.3733 60.3733 l 238.293 -238.293 l 238.293 238.293 l 60.3733 -60.3733 l -238.293 -238.293 Z`
    }
    return path;
  }

  // 获取文字大小
  getTextSize = () => {
    const { type, strokeWidth, width } = this.props;
    return type === 'line' ? 12 + strokeWidth * 0.4 : width * 0.111111 + 2;
  }

  render() {
    let {type, percentage, strokeWidth, textInside, status, width, showText} = this.props
    let progress;
    if (type === 'line') {
      progress = (
        <div className="hui-progress-bar">
          <div className="hui-progress-bar__outer" style={{'height': `${strokeWidth}px`}}>
            <div className="hui-progress-bar__inner" style={{'width': `${percentage}%`}}>
              {
                showText && textInside && (
                  <div className="hui-progress-bar__text">
                    {`${percentage}%`}
                  </div>
                )
              }
            </div>
          </div>
        </div>
      )
    } else {
      progress = (
        <div className="hui-progress-circle" style={{'width': `${width}px`}}>
          <svg viewBox="0 0 100 100">
            <path 
              className="hui-progress-circle__track"
              d={this.trackPath()}
              strokeWidth={this.relativeStrokeWidth()}
              fill="none"
              stroke="#e5e9f2"
            />
            <path 
              className="hui-progress-circle__path"
              d={this.trackPath()}
              strokeLinecap="round"
              stroke={this.stroke()}
              strokeWidth={this.relativeStrokeWidth()}
              fill="none"
              style={this.circlePathStyle()}
            />
          </svg>
        </div>
      )
    }
    const progressText = showText && (
     !textInside && (
       <div 
         className="hui-progress-text"
         style={{'fontSize': `${this.getTextSize()}px`}}
       >
         {status ? (
            <svg className="hui-progress-circle__icon" viewBox="0 0 1024 1024" width={`${width / 4 }px`}>
             <path d={this.iconSvg()} fill={this.stroke()}/>
            </svg>
         ) : `${percentage}%`}
       </div>
     )
    )
    return (
      <div
        style={this.styles()}
        className={this.classname('hui-progress', `hui-progress-${type}`, {
          [`is-${status}`]: !!status,
          'hui-progress--without-text': !showText,
          'hui-progress--text-inside': textInside,
        })}
      >
        {progress}
        {progressText}
      </div>
    )
  }
}

Progress.propTypes = {
  percentage: PropType.number,
  type: PropType.string,
  strokeWidth: PropType.number,
  textInside: PropType.bool,
  status: PropType.string,
  width: PropType.number,
  showText: PropType.bool,
}

export default Progress;