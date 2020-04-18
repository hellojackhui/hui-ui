import React from 'react';
import ReactDOM from 'react-dom';
import {isEqual} from 'lodash';
import exportProperty from './motion';

const STATUS_NONE = 'none';
const STATUS_ENTER = 'enter';
const STATUS_LEAVE = 'leave';

export default class Animate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
      status: STATUS_NONE,
    };

    //是否接收到props的变化
    this.isReceiveProps = false;
    this.$ele = null;
  }

  // 初次渲染，需要完成对元素对事件绑定，以及对状态对判定
  componentDidMount() {
    // Event injection
    const $ele = ReactDOM.findDOMNode(this);
    if (this.$ele !== $ele) {
      this.removeEventListener(this.$ele);
      this.addEventListener($ele);
      this.$ele = $ele;
    }
    let { visible } = this.state;
    let { onEnd } = this.props;
    if (visible) {
      this.setState({
        status: STATUS_ENTER
      }, () => {
        !exportProperty.supportTransition && onEnd && onEnd(visible);
      });
    }
  }

  // animationend或者transitionend事件触发
  // 完成对于元素触发对判定，以及事件完成后状态对更新
  onMotionStart(event) {
    if (this.$ele !== event.target) {
      return;
    }
    let { onStart, visible: pVisible } = this.props;
    this.setState({
      visible: pVisible,
      status: STATUS_ENTER
    }, () => {
      onStart && onStart(pVisible);
    });
  };

  onMotionEnd(event) {
    if (this.$ele !== event.target) {
      return;
    }
    let { onEnd, visible: pVisible } = this.props;
    this.setState({
      visible: pVisible,
      status: STATUS_NONE
    }, () => {
      onEnd && onEnd(pVisible);
    });
  };

  addEventListener($ele) {
    if (!$ele) return;
    $ele.addEventListener(exportProperty.animationStartName, this.onMotionStart.bind(this));
    $ele.addEventListener(exportProperty.animationEndName, this.onMotionEnd.bind(this));
    $ele.addEventListener(exportProperty.transitionStartName, this.onMotionStart.bind(this));
    $ele.addEventListener(exportProperty.transitionEndName, this.onMotionEnd.bind(this));
  };
  removeEventListener($ele) {
    if (!$ele) return;
    $ele.removeEventListener(exportProperty.animationStartName, this.onMotionStart.bind(this));
    $ele.removeEventListener(exportProperty.animationEndName, this.onMotionEnd.bind(this));
    $ele.removeEventListener(exportProperty.transitionStartName, this.onMotionStart.bind(this));
    $ele.removeEventListener(exportProperty.transitionEndName, this.onMotionEnd.bind(this));
  };

  // 接收visible参数后，需要修改状态以及
  componentWillReceiveProps(nextProps) {
    this.isReceiveProps = true;
    let { visible: prevVisible, onEnd } = this.props;
    let { visible } = nextProps;
    let { status } = this.state;
    prevVisible !== visible && this.setState({
      status: visible ? STATUS_ENTER:(status === STATUS_LEAVE ? STATUS_NONE:STATUS_LEAVE)
    }, () => {
      !exportProperty.supportTransition && onEnd && onEnd(visible);
    });
  }

  shouldComponentUpdate(nextProps) {
    if (this.isReceiveProps) {
      this.isReceiveProps = false;
      return !isEqual(this.props, nextProps);
    }
    return true;
  }

  componentWillUnmount() {
    this.removeEventListener(this.$ele);
  }

  render() {
    let { children, enterClassName, leaveClassName, eventProps } = this.props;
    let { status } = this.state;
    let classNames = '';
    if (status === STATUS_ENTER) {
      classNames = enterClassName;
    }
    if (status === STATUS_LEAVE) {
      classNames = leaveClassName;
    }
    return (
      children({
        ...eventProps,
        classNameType: classNames
      })
    )
  }
}
