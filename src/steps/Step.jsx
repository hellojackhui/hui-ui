import React from 'react';
import {Component, PropType} from 'libs/index';
import './Steps.scss';

class Step extends Component {
  render() {
    const {
      title,
      description,
      icon,
      status,
      direction,
      style,
      lineStyle,
      stepNumber,
    } = this.props;
    const directionClass = `is-${direction}`;
    const statusClass = `is-${status}`;
    const iconNode = icon ? <i className={`hui-icon hui-icon-${icon}`} /> : <div>{stepNumber}</div>;
    return (
      <div style={this.styles(style)} className={this.classname('hui-step', directionClass)}>
        <div className={this.classname("hui-step__head", statusClass, {
          'is-text': !icon
        })}>
          <div className={this.classname("hui-step__line", directionClass, {
            'is-icon': icon
          })}>
            <i className="hui-step__inner" style={lineStyle}></i>
          </div>
          <span className="hui-step__icon">
            {
              status !== 'success' && status !== 'error' ? iconNode : <i
                className={
                  'hui-icon hui-icon-' + (status === 'success' ? 'check' : 'close')
                }
              />
            }
          </span>
        </div>
        <div className="hui-step__main">
          <div className={this.classname("hui-step__title", statusClass)}>{title}</div>
          <div className={this.classname("hui-step__description", statusClass)}>{description}</div>
        </div>
      </div>
    )
  }
}

Step.contextTypes = {
  component: PropType.any,
}

Step.propTypes = {
  title: PropType.string,
  description: PropType.string,
  icon: PropType.string,
}

export default Step;