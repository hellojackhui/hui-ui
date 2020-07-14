import React from 'react';
import {Component, PropType} from '../../libs/index';
import './Anchor.scss';

const sharpMatcherRegx = /#(\S+)$/;

class Anchor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeLink: null
    }
    this.inkNode = null;
    this.scrollContainer = null;
    this.links = [];
    this.scrollEvent = null;
    this.animating = false;

  }

  getDefaultContainer = () => {
    return window;
  }

  registerLink = (link) => {
    if (this.links.includes(link)) {
      this.links.push(link);
    }
  }

  unregisterLink = (link) => {
    let index = this.links.indexOf(link);
    if (index > -1) {
      this.links.splice(index, 1);
    }
  }

  getContainer = () => {
    const {getContainer} = this.props;
    const getfunc = getContainer || this.getDefaultContainer;
    return getfunc();
  }

  getOffsetTop = (element, container) => {
    if (!element.getClientRects().length) {
      return 0;
    }
    let rect = element.getBoundingClientRect();
    if (rect.width || rect.height) {
      if (container === window) {
        let wrapper = element.ownerDocument.documentElement;
        return rect.top - wrapper.clientTop;
      }
      return rect.top - container.getBoundingClientRect().top;
    }
    return rect.top;
  }

  componentDidMount() {
    this.scrollContainer = this.getContainer();
    this.scrollEvent = addEventListener(this.scrollContainer, 'scroll', this.handleScroll);
    this.handleScroll();
  }

  componentDidUpdate() {
    if (this.scrollEvent) {
      let currentContainer = this.getContainer();
      if (this.scrollContainer !== currentContainer) {
        this.scrollContainer = currentContainer;
        this.scrollEvent.remove();
        this.scrollEvent = addEventListener(this.scrollContainer, 'scroll', this.handleScroll);
        this.handleScroll();
      }
    }
    this.updateInk();
  }

  componentWillUnmount() {
    if (this.scrollEvent) {
      this.scrollEvent.remove();
    }
  }

  getCurrentAnchor = (offsetTop = 0, bounding = 5) => {
    const {getCurrentAnchor} = this.props;
    if (typeof getCurrentAnchor === 'function') {
      return getCurrentAnchor();
    }
    let linkSection = [];
    let container = this.getContainer();
    this.links.forEach((link) => {
      let linkMath = sharpMatcherRegx.exec(link.toString());
      if (!linkMath) {
        return;
      }
      const target = document.getElementById(linkMath[1]);
      if (target) {
        const top = getOffsetTop(target, container);
        if (top < offsetTop + bounding) {
          linkSection.push({
            link,
            top,
          })
        }
      }
    })
    if (linkSection.length) {
      return linkSection.reduce((prev, next) => (next.top > prev.top) ? next : prev);
    }
    return '';
  }

  // 处理锚点滚动
  handleScrollTo = (link) => {
    const {offsetTop, targetOffset} = this.props;
    this.setCurrentActiveLink(link);
    const container = this.getContainer();
    const scrollTop = getScroll(container, true);
    const 
  }

  // 保存锚点
  saveInkNode = (node) => {
    this.saveInkNode = node;
  }

  // 设置当前激活锚点, 如果新冒点与旧冒点不同，就触发更新
  setCurrentActiveLink = (link) => {
    const {onChange} = this.props;
    const {activeLink} = this.state;
    if (activeLink !== link) {
      this.setState({
        activeLink: link
      }, () => {
        onChange(link)
      })
    }
  }

  // 处理滚动事件，并且获取激活点，并触发锚点更新
  handleScroll = () => {
    if (this.animating) {
      return;
    }
    const {offsetTop, bounds, targetOffset} = this.props;
    const currentLink = this.getCurrentAnchor(targetOffset !== undefined ? targetOffset : offsetTop || 0, bounds);
    this.setCurrentActiveLink(currentLink);
  }

  // 更新内锚点显示
  updateInk = () => {
    const anchorNode = ReactDOM.findDOMNode(this);
    const linkNode = anchorNode.getElementsByClassName('hui-anchor-link-title--active')[0];
    if (linkNode) {
      this.inkNode.style.top = `${linkNode.offsetTop + linkNode.clientHeight / 2 - 4.5}px`;
    }
  }

  render() {
    const {activeLink} = this.state;
    const {
      direction,
      offsetTop,
      showInkInFixed,
      children
    } = this.props;

    const inkClass = this.classnames('hui-anchor-ink-ball', {
      visible: activeLink
    })

    const wrapperClass = this.classnames('hui-anchor-wrapper', {
      'hui-anchor-rtl': direction === 'rtl'
    })

    const anchorClass = this.classnames('hui-anchor', {
      'fixed': !showInkInFixed
    })

    const wrapperStyle = {
      maxHeight: offsetTop ? `calc(100vh - ${offsetTop}px)` : '100vh',
      ...style
    }

    const anchorContent = (
      <div className={wrapperClass} style={wrapperStyle}>
        <div className={anchorClass}>
          <div className={`hui-anchor-ink`}>
            <span className={inkClass} ref={this.saveInkNode} />
          </div>
          {children}
        </div>
      </div>
    );

    return (
      <div style={this.styles()}>
        {
          anchorContent
        }
      </div>
    )
  }
}

Anchor.propTypes = {
  
}

Anchor.defaultProps = {
  
}

Anchor.childContextTypes = {
  component: PropType.any,
}