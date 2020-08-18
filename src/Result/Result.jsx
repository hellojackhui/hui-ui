import React from 'react';
import {Component, PropType} from '../../libs/index';
import Icon from '../icon/index';
import '../../style/core/module/Result.scss';

export default class Result extends Component {
  statusToIcon = (status) => {
    switch(status) {
      case 'success': return 'check-circle';
      case 'error': return 'times-circle';
      case 'warning': return 'warning';
      case 'info': return 'info-circle';
      default: return status;
    }
  }
  calcIconStyles = (status) => {
    let color = '';
    switch(status) {
      case 'success': color = '#13ce66'; break;
      case 'error': color = '#ff4949'; break;
      case 'warning': color = '#f7ba2a'; break;
      case 'info': color = '#50bfff'; break;
      default: color = '#50bfff'; break;
    }
    return {
      'fontSize': '70px',
      color: color,
    }
  }
  render() {
    const {title, subTitle, extra, status, children, icon} = this.props;
    return (
      <div className={this.classname('hui-result')} style={this.styles()}>
        <div className="hui-result__icon">
          <Icon name={this.statusToIcon(status || icon)} style={this.calcIconStyles(status)} />
        </div>
        <div className="hui-result__title">{title}</div>
        <div className="hui-result__subtitle">{subTitle}</div>
        {
          children && (<div className="hui-result__content">
            {children}
          </div>)
        }
        <div className="hui-result__extra">
          {extra}
        </div>
      </div>
    )
  }
}

Result.propTypes = {
  title: PropType.string,
  subTitle: PropType.string,
  status: PropType.string,
  icon: PropType.string,
  extra: PropType.node,
}