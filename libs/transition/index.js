import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import requestAnimationFrame from 'raf'; 

export default class Transition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      children: props.children && this.enhanceChildren(props.children)
    }
    this.didEnter = this.didEnter.bind(this);
    this.didLeave = this.didLeave.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    const children = React.isValidElement(this.props.children) && React.Children.only(this.props.children);
    const nextChildren = React.isValidElement(nextProps.children) && React.Children.only(nextProps.children);
    if (!nextProps.name) {
      this.setState({
        children: nextChildren
      });
      return;
    }
    if (this.isViewComponent(nextChildren)) {
      this.setState({
        children: this.enhanceChildren(nextChildren, {show: children ? children.props.show : true})
      })
    } else {
      if (nextChildren) {
        this.setState({
          children: this.enhanceChildren(nextChildren)
        })
      }
    }
  }

  componentDidUpdate(preProps) {
    if (!this.props.name) return;
    const children = React.isValidElement(this.props.children) && React.Children.only(this.props.children);
    const preChildren = React.isValidElement(preProps.children) && React.Children.only(preProps.children);
    if (this.isViewComponent(children)) {
      if ((!preChildren || !preChildren.props.show) && children.props.show) {
        this.toggleVisible();
      } else if (preChildren && preChildren.props.show && !children.props.show) {
        this.toggleHidden();
      }
    } else {
      if (!preChildren && children) {
        this.toggleVisible();
      } else if (preChildren && !children) {
        this.toggleHidden();
      }
    }
  }

  enhanceChildren(children, props) {
    return React.cloneElement(children, Object.assign({ ref: (el) => { this.el = el } }, props))
  }

  get transitionClass() {
    const { name } = this.props;

    return {
      enter: `${name}-enter`,
      enterActive: `${name}-enter-active`,
      enterTo: `${name}-enter-to`,
      leave: `${name}-leave`,
      leaveActive: `${name}-leave-active`,
      leaveTo: `${name}-leave-to`,
    }
  }

  isViewComponent(element) {
    return element && (element.type.name === 'View' || element.type._typeName === 'View');
  }

  didEnter(e) {
    const dom = ReactDOM.findDOMNode(this.el);
    if (!e || e.target !== dom) return;
    const { onAfterEnter } = this.props;
    const { enterActive, enterTo } = this.transitionClass;
    dom.classList.remove(enterActive, enterTo);
    dom.removeEventListener('transitionend', this.didEnter);
    dom.removeEventListener('animationend', this.didEnter);
    onAfterEnter && onAfterEnter();
  }

  didLeave(e) {
    const dom = ReactDOM.findDOMNode(this.el);
    if (!e || e.target !== dom) return;
    const { onAfterLeave, children } = this.props;
    const { leaveActive, leaveTo } = this.transitionClass;
    new Promise((resolve) => {
      if (this.isViewComponent(children)) {
        dom.removeEventListener('transitionend', this.didLeave);
        dom.removeEventListener('animationend', this.didLeave);
        requestAnimationFrame(() => {
          dom.style.display = 'none';
          dom.classList.remove(leaveActive, leaveTo);
          requestAnimationFrame(resolve);
        });
      } else {
        this.setState({ children: null }, resolve);
      }
    }).then(() => {
      onAfterLeave && onAfterLeave();
    })
  }

  toggleVisible() {
    const {onEnter} = this.props;
    const { enter, enterActive, enterTo, leaveActive, leaveTo } = this.transitionClass;
    const dom = ReactDOM.findDOMNode(this.el);
    dom.addEventListener('transitionend', this.didEnter);
    dom.addEventListener('animationend', this.didEnter);

    requestAnimationFrame(() => {
      if (dom.classList.contains(leaveActive)) {
        dom.classList.remove(leaveActive, leaveTo);
        dom.removeEventListener('transitionend', this.didLeave);
        dom.removeEventListener('animationend', this.didLeave);
      }
      dom.style.display = '';
      dom.classList.add(enter, enterActive);
      console.log(dom.classList);
      onEnter && onEnter();

      requestAnimationFrame(() => {
        dom.classList.remove(enter);
        dom.classList.add(enterTo);
      })
    })
  }

  toggleHidden() {
    const {onLeave} = this.props;
    const {leave, leaveActive, leaveTo, enterActive, enterTo} = this.transitionClass;
    const dom = ReactDOM.findDOMNode(this.el);
    dom.addEventListener('transitionend', this.didLeave);
    dom.addEventListener('animationend', this.didLeave);
    requestAnimationFrame(() => {
      if (dom.classList.contains(enterActive)) {
        dom.classList.remove(enterActive, enterTo);
        dom.removeEventListener('transitionend', this.didEnter);
        dom.removeEventListener('animationend', this.didEnter);
      }
      dom.classList.add(leave, leaveActive);
      onLeave && onLeave();

      requestAnimationFrame(() => {
        dom.classList.remove(leave);
        dom.classList.add(leaveTo);
      })
    })
  }
  render() {
   return this.state.children || null;
  }
}

Transition.propTypes = {
  name: PropTypes.string,
  onEnter: PropTypes.func, // triggered when enter transition start
  onAfterEnter: PropTypes.func, // triggered when enter transition end
  onLeave: PropTypes.func, // triggered when leave transition start
  onAfterLeave: PropTypes.func // tiggered when leave transition end
};