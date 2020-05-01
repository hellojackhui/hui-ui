import React from 'react';
import ReactDOM from 'react-dom';
import {Component, View, PropType, Transition} from '../../libs/index';
import Popper from 'popper.js';
import './PopOver.scss';

export default class PopOver extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopper: false,
    }
  }
  componentWillReceiveProps(props) {
    if (props.visible !== this.props.visible) {
      this.setState({
        showPopper: props.visible
      });
    }
  }
  componentDidMount() {
    const {trigger} = this.props;
    let popper = this.refs.popper;
    this.reference = ReactDOM.findDOMNode(this.refs.reference);
    this.element = ReactDOM.findDOMNode(this);

    if (this.reference == null) return;

    if (trigger == 'click') {
      this.reference.addEventListener('click', () => {
        this.setState({
          showPopper: !this.state.showPopper
        })
      })
      document.addEventListener('click', (e) => {
        if (!this.element || this.element.contains(e.target) || !this.reference || this.reference.contains(e.target) || !popper || popper.contains(e.target)) return;
        this.setState({
          showPopper: false,
        })
      })
    } else if (trigger == 'hover') {
      this.reference.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
      this.reference.addEventListener('mouseleave', this.handleMouseLeave.bind(this));

      popper.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
      popper.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    } else if (trigger === 'manual') {
        this.setState({ showPopper: this.props.visible });
    } else {
      if (this.reference.nodeName === 'INPUT' || this.reference.nodeName === 'TEXTAREA') {
        this.reference.addEventListener('focus', () => { this.setState({ showPopper: true })});
        this.reference.addEventListener('blur', () => { this.setState({ showPopper: false })});
      } else {
        this.reference.addEventListener('mousedown', () => { this.setState({ showPopper: true })});
        this.reference.addEventListener('mouseup', () => { this.setState({ showPopper: false })});
      }
    }
  }
  onEnter = () => {
    if (this.refs.arrow) {
      this.refs.arrow.setAttribute('x-arrow', '');
    }
    this.popperJS = new Popper(this.reference, this.refs.popper, {
      placement: this.props.placement,
      modifiers: {
        computeStyle: {
          gpuAcceleration: true,
        }
      }
    })
  }
  onAfterLeave = () => {
    this.popperJS.destroy();
  }
  handleMouseEnter() {
    clearTimeout(this.timer);

    this.setState({
      showPopper: true
    });
  }
  handleMouseLeave() {
    this.timer = setTimeout(() => {
      this.setState({
        showPopper: false
      });
    }, 200);
  }
  componentWillUnmount() {
    this.reference.parentNode.replaceChild(this.reference.cloneNode(true), this.reference);
  }
  render() {
    const {transition, width, popperclass, title, content, visibleArrow} = this.props;
    const {showPopper} = this.state;
    return (
      <span>
        <Transition name={transition} onEnter={this.onEnter.bind(this)} onAfterLeave={this.onAfterLeave.bind(this)}>
          <View show={showPopper}>
            <div ref="popper" className={this.classname('hui-popper', popperclass)} style={this.styles({width: Number(width)})}>
              {title && <div className="hui-popper__title">{title}</div>}
              {content}
              {visibleArrow && <div ref="arrow" className="hui-popper__arrow" />}
            </div>
          </View>
        </Transition>
        {
          React.cloneElement(React.Children.only(this.props.children), {
            ref: 'reference'
          })
        }
      </span>
    )
  }
}

PopOver.propTypes = {
  title: PropType.string,
  content: PropType.oneOf([PropType.node, PropType.string]),
  visible: PropType.bool,
  popperclass: PropType.string,
  transition: PropType.string,
  width: PropType.oneOf([PropType.string, PropType.number]),
  trigger: PropType.oneOfType(['click', 'hover', 'manual', 'focus']),
  placement: PropType.oneOf(['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end']),
  visibleArrow: PropType.bool,
}

PopOver.defaultProps = {
  visibleArrow: true,
  transition: 'fade-in-linear',
  trigger: 'click',
  placement: 'bottom',
  width: 150
}