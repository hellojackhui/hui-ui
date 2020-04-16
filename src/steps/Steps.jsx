import React from 'react';
import {Component, PropType} from '../../libs/index'; 


class Steps extends Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props);
  }
  getChildContext() {
    return {
      component: this,
    }
  }
  calStatus = (index) => {
    const {active, processStatus, finishStatus} = this.props;
    let status = 'wait';

    if (active > index) {
      status = finishStatus;
    } else if (index === active) {
      status = processStatus;
    }

    return status;
  }

  calcProgress = (status, index) => {
    let step = 100;
    const style = {};
    style.transitionDelay = 150 * index + 'ms';

    const nextStatus = this.calStatus(index + 1);
    // 前后状态不一致时，并且当前status为完成，statusLine的长度才为50%
    if (nextStatus !== status) {
      if (status === this.props.finishStatus) {
        step = 50;
      } else if (status === 'wait') {
        step = 0;
        style.transitionDelay = -150 * index + 'ms';
      }
    }

    this.props.direction === 'vertical'
      ? (style.height = step + '%')
      : (style.width = step + '%');
    return style;
  }
  render() {
    const {space, direction, activeStep, children} = this.props;
    return (
      <div style={this.styles()} className={this.classname("hui-steps")}>
        {
          React.Children.map(children, (child, index) => {
            const computedSpace = space
            ? `${space}px`
            : `${100 / children.length}%`;
            const style = direction === 'horizontal' ?
            { width: computedSpace } : {
              height: index === children.length - 1 ? 'auto' : computedSpace
            }
            const status = this.calStatus(index);
            const lineStyle = this.calcProgress(status, index);
            return (
              React.cloneElement(child, {
                activeStep: activeStep,
                direction: direction,
                style: style,
                status: status,
                lineStyle: lineStyle,
                stepNumber: index + 1,
              })
            )
          })
        }
      </div>
    )
  }
}

Steps.childContextTypes = {
  component: PropType.any,
}

Steps.propTypes = {
  space: PropType.number,
  direction: PropType.string,
  active: PropType.number,
  processStatus: PropType.string,
  finishStatus: PropType.string,
}

Steps.defaultProps = {
  direction: 'horizontal',
  active: 0,
  processStatus: 'process',
  finishStatus: 'finish'
}

export default Steps;
