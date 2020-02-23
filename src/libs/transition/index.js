import React from 'react';
import { CSSTransition } from 'react-transition-group'
import {PropType} from '../index';
const noneFun = () => {};

export default class Transition extends React.Component {
  render() {
    const {
        inState,
        timeout,
        tranclass,
        unmountOnExit,
        onEnter,
        onEntering,
        onEntered,
        onExit,
        onExiting,
        onExited,
        appear,
        children,
      } = this.props;
    return (
      <CSSTransition
        onEnter={onEnter}
        onEntering={onEntering}
        onEntered={onEntered}
        onExit={onExit}
        onExiting={onExiting}
        onExited={onExited}
        in={inState}
        timeout={timeout}
        classNames={tranclass}
        appear={appear}
        unmountOnExit={unmountOnExit}
      >
        {
          children
        }
      </CSSTransition>
    )
  }
}
Transition.propTypes = {
  timeout: PropType.number,
  tranclass: PropType.string,
  inState: PropType.bool,
  onEnter: PropType.func,
  onEntering: PropType.func,
  onEntered: PropType.func,
  onExit: PropType.func,
  onExiting: PropType.func,
  onExited: PropType.func,
  unmountOnExit: PropType.bool,
  appear: PropType.bool,
}

Transition.defaultProps = {
  onEnter: noneFun,
  onEntering: noneFun,
  onEntered: noneFun,
  onExit: noneFun,
  onExiting: noneFun,
  onExited: noneFun,
  unmountOnExit: true,
  timeout: 1000,
  tranclass: '',
  inState: false,
  appear: false,
}