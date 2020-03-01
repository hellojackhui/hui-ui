import React from 'react';
import ReactDOM from 'react-dom';
const { isEqual } = require('lodash');
const { animationEndName, transitionEndName, supportTransition } = require('./motion');

const none = 'NONE';
const start = 'START';
const end = 'END';

export default class Animate extends React.component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
      status: start
    }
    this.$el = null;
    this.animation = React.createRef();
    this.receiveProps = false;
  }

  componentWillReceiveProps(nextProps) {
    this.receiveProps = true;
    let {visible: oldVisble, onEnd} = this.props;
    let {visible} = nextProps;
    let {status} = this.state;
    oldVisble != visible && this.setState({
      status: visible ? start : status == end ? end : none
    }, () => {
      !supportTransition && onEnd && onEnd();
    })
  }

  componentDidMount() {
    let $el = ReactDOM.findDOMNode(this);
    if (this.$el != $el) {
      this.removeListener($el);
      this.addListener($el);
      this.$el = $el;
    }
    let {visible} = this.state;
    let {onEnd} = this.props;
    if (visible) {
      this.setState({
        status: start,
      }, () => {
        !supportTransition && onEnd && onEnd();
      })
    }
  }
  
  shouldComponentUpdate(nextProps) {
    if (this.receiveProps) {
      this.receiveProps = false;
      return !isEqual(this.props, nextProps);
    }
    return true;
  }

  handler = (e) => {
    if (e.target != this.$el) return;
    this.setState({
      visible: this.state.visible,
      status: none
    }, () => {
      this.props.onEnd && this.props.onEnd(e)
    })
  }
  
  componentWillUnmount() {
    this.removeListener(this.$ele);
  }

  removeListener = (el) => {
    if (!el) return;
    el.removeEventListener(animationEndName, handler);
    el.removeEventListener(transitionEndName, handler);
  }

  addListener = (el) => {
    if (!el) return;
    el.addEventListener(animationEndName, handler);
    el.addEventListener(transitionEndName, handler);
  }

  render() {
    const {children, enterClassName, leaveClassName} = this.props;
    const {status} = this.state;
    let className = '';
    if (status == none) {
      className = '';
    } else if (status == start) {
      className = enterClassName;
    } else {
      className = leaveClassName;
    }
    return (
      children({
        ...this.props,
        className: className
      })
    )
  }

}