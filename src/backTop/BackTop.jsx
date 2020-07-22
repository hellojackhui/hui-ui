import React from 'react';
import {Component, PropType, View, Transition} from '../../libs/index';

export default class BackTop extends Component {
  ctx = this;
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    }
    this.target = props.target(); // 获取监听对象
    this.raf = null;  // 获取raf对象
  }
  // 挂载监听滚动事件
  componentDidMount() {
    this.bindDOMEventListener();
  }
  // 卸载监听滚动事件
  componentWillUnmount() {
    this.unbindDOMEventListener();
  }
  bindDOMEventListener = () => {
    this.target.addEventListener('scroll', this.handler, false);
  }
  unbindDOMEventListener = () => {
    this.target.removeEventListener('scroll', this.handler, false);
  }
  // 监听回调
  handler = (e) => {
    const {visibilityHeight} = this.props;
    if (this.target.scrollY >= visibilityHeight && !this.state.visible) {
      this.setState({
        visible: true,
      })
    } else if (this.target.scrollY < visibilityHeight && this.state.visible) {
      this.setState({
        visible: false,
      }) 
    }
  }
  // 控制scrolltop距离
  getScrollStep = () => {
    let scrollVal = document.documentElement.scrollTop / 15;
    return scrollVal <= 15 ? 15 : scrollVal;
  }
  // 点击回调
  clickHandler = () => {
    const {onClick} = this.props;
    this.raf = window.requestAnimationFrame(this.rafDom);
    if (document.documentElement.scrollTop == 0) {
      window.cancelAnimationFrame(this.raf);
    }

    onClick && onClick();
  }
  // raf
  rafDom = () => {
    let val = document.documentElement.scrollTop
    if (val > 0) {
      document.documentElement.scrollTop = val - this.getScrollStep();
    } else {
      return;
    }
    window.requestAnimationFrame(this.rafDom)
  }
  render() {
    const {visible} = this.state;
    return (
      <div className={this.classname('hui-backtop')} style={this.styles()}>
        <Transition name="fade-in-linear">
          <View show={visible}>
            <div className="hui-backtop-content" onClick={this.clickHandler}>
              {
                React.cloneElement(this.props.children)
              }
            </div>
          </View>
        </Transition>
      </div>
    )
  }
}

BackTop.propTypes = {
  target: PropType.func,
  visibilityHeight: PropType.number,
  onClick: PropType.func
}

BackTop.defaultProps = {
  target: () => window,
  visibilityHeight: 400
}