import React from 'react';
import {Component, PropType, View} from '../../libs/index';
import './Tabs.scss';

class Tabs extends Component {
  constructor(props) {
    super(props);
    let children = React.Children.toArray(props.children);
    this.state = {
      children: children,
      currentName: props.value || props.activeName || children[0].props.name,
      barStyle: {},
      navStyle: {
        'transform': '',
      },
      scrollable: false,
      scrollNext: false,
      scrollPrev: false,
    }
  }

  componentDidMount() {
    this.calcBarStyle(true);
    this.update();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.scrollable !== this.state.scrollable) {
      this.scrollToActiveTab();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeName !== this.props.activeName) {
      this.setState({
        currentName: nextProps.activeName,
      }, () => this.calcBarStyle());
    }

    if (nextProps.value !== this.props.value) {
      this.setState({
        currentName: nextProps.value,
      }, () => this.calcBarStyle());
    }

    if (nextProps.children !== this.props.children) {
      this.setState({
        children: React.Children.toArray(nextProps.children),
      }, () => {
        this.update()
        this.calcBarStyle()
      });
    }
  }

  update() {
    const navWidth = this.refs.nav.offsetWidth;
    const containerWidth = this.refs.scroll.offsetWidth;
    const currentOffset = this.getCurrentScrollOffset();

    if (containerWidth < navWidth) {
      const currentOffset = this.getCurrentScrollOffset();
      this.setState({
        scrollable: true,
        scrollablePrev: currentOffset,
        scrollPrev: true,
        scrollNext: true,
        scrollableNext: currentOffset + containerWidth < navWidth,
      });

      if (navWidth - currentOffset < containerWidth) {
        this.setOffset(navWidth - containerWidth);
      }
    } else {
      this.setState({
        scrollable: false,
      })

      if (currentOffset > 0) {
        this.setOffset(0);
      }
    }
  }

  tabAdd = () => {
    const { onTabAdd, onTabEdit } = this.props;

    onTabEdit && onTabEdit('add');
    onTabAdd && onTabAdd();
  }

  tabRemove = (tab, index, e) => {
    const { children, currentName } = this.state;
    const { onTabRemove, onTabEdit } = this.props;

    e.stopPropagation();

    if (children[index].props.name === currentName) {
      const nextChild = children[index + 1];
      const prevChild = children[index - 1];

      this.setState({
        currentName: nextChild ? nextChild.props.name : prevChild ? prevChild.props.name : '-1',
      });
    }

    children.splice(index, 1);

    this.setState({
      children
    }, () => {
      onTabEdit && onTabEdit('remove', tab);
      onTabRemove && onTabRemove(tab, e);
    });
  }

  scrollToActiveTab() {
    if (!this.state.scrollable) return;

    const nav = this.refs.nav;
    const activeTab = nav.querySelector('.is-active');
    const navScroll = this.refs.scroll;
    const activeTabBounding = activeTab.getBoundingClientRect();
    const navScrollBounding = navScroll.getBoundingClientRect();
    const navBounding = nav.getBoundingClientRect();
    const currentOffset = this.getCurrentScrollOffset();
    let newOffset = currentOffset;

    if (activeTabBounding.left < navScrollBounding.left) {
      newOffset = currentOffset - (navScrollBounding.left - activeTabBounding.left);
    }

    if (activeTabBounding.right > navScrollBounding.right) {
      newOffset = currentOffset + activeTabBounding.right - navScrollBounding.right;
    }

    if (navBounding.right < navScrollBounding.right) {
      newOffset = nav.offsetWidth - navScrollBounding.width;
    }

    this.setOffset(Math.max(newOffset, 0));
  }

  scrollPrev = () => {
    const containerWidth = this.refs.scroll.offsetWidth;
    const currentOffset = this.getCurrentScrollOffset();
    if (!currentOffset) return;
    let newOffset = currentOffset > containerWidth
      ? currentOffset - containerWidth
      : 0;
    this.setOffset(newOffset);
  }

  scrollNext = () => {
    const navWidth = this.refs.nav.offsetWidth;
    const containerWidth = this.refs.scroll.offsetWidth;
    const currentOffset = this.getCurrentScrollOffset();
    if (containerWidth + currentOffset >= navWidth) return;
    let newOffset = navWidth - currentOffset > containerWidth * 2 ?
        (containerWidth + currentOffset) : (navWidth - containerWidth);
    this.setOffset(newOffset);
  }

  getCurrentScrollOffset() {
    const { navStyle } = this.state;
    return navStyle.transform
      ? Number(navStyle.transform.match(/translateX\(-(\d+(\.\d+)*)px\)/)[1])
      : 0;
  }

  setOffset(value){
    this.setState({
      navStyle: {
        transform: `translateX(-${value}px)`,
      }
    });
  }

  tabclick = (item, e) => {
    if (item.props.disabled) return;
    this.setState({
      currentName: item.props.name,
    }, () => {
      const { onTabClick } = this.props;
      this.calcBarStyle();
      this.scrollToActiveTab();
      onTabClick && onTabClick(e);
    })
  }

  calcBarStyle = (firstRendering) => {
    if (this.props.type || !this.tabs.length) return {};
    let style = {};
    let offset = 0;
    let tabWidth = 0;
    let children = this.state.children instanceof Array ? this.state.children : [this.state.children];

    children.every((item, index) => {
      let $el = this.tabs[index];
      if (item.props.name !== this.state.currentName) {
        offset += $el.clientWidth;
        return true;
      } else {
        tabWidth = $el.clientWidth;
        return false;
      }
    })
    style.width = tabWidth + 'px';
    style.transform = `translateX(${offset}px)`;

    if (!firstRendering) {
      style.transition = 'transform .3s cubic-bezier(.645,.045,.355,1), -webkit-transform .3s cubic-bezier(.645,.045,.355,1)';
    }

    this.setState({
      barStyle: style,
    });
  }

  render() {
    const {type, closable, addable, editable} = this.props;
    const {children, currentName, barStyle, navStyle, scrollable, scrollNext, scrollPrev} = this.state;
    this.tabs = [];
    const tabClassName = this.classname({
      'hui-tab': true,
      'hui-tab--card': type === 'card',
      'hui-tab--border-card': type === 'border-card',
    })
    const addButton = addable || editable ? (
      <span className="hui-tab__add" onClick={() => this.tabAdd()}>
        <i className="hui-icon hui-icon-plus" />
      </span>
    ) : null;
    const scrollBtn = scrollable ? [
     (
        <span 
            key="hui-tab-scroll-prev" 
            className={scrollPrev ? 'hui-tab__prev' : 'hui-tab__prev is-disabled'}
            onClick={() => this.scrollPrev()}
        >
          <i className="hui-icon hui-icon-arrow-left"></i>
        </span>
     ),
     (
        <span 
            key="hui-tab-scroll-next" 
            className={scrollNext ? 'hui-tab__next' : 'hui-tab__next is-disabled'}
            onClick={() => this.scrollNext()}
        >
          <i className="hui-icon hui-icon-arrow-right"></i>
        </span>
     )
    ] : null;
    return (
      <div className={tabClassName} style={this.styles()}>
        <div className="hui-tab__header">
          {addButton}
          <div className={scrollable ? "hui-tab__wrap is-scroll" : "hui-tab__wrap"}>
            {scrollBtn}
            <div className="hui-tab__scroll" ref="scroll">
              <div className="hui-tab__nav" ref="nav" style={navStyle}>
                {
                  React.Children.map(children, (item, index) => {
                    const { name, label, disabled } = item.props;
                    const tabClassname = this.classnames({
                      'hui-tab__item': true,
                      'is-active': name === currentName,
                      'is-disabled': disabled,
                      'is-closable': closable || item.props.closable 
                    })
                    return (
                      <div 
                        className={tabClassname} 
                        style={this.styles()} 
                        key={`hui-tab__item-${index}`}
                        ref={(tab) => tab && this.tabs.push(tab)}
                        onClick={(e) => this.tabclick(item, e)}
                      >
                        {label}
                        <View show={editable || closable || item.props.closable}>
                          <span className="hui-tab__close hui-icon hui-icon-close" onClick={(e) => this.tabRemove(item, index, e)} />
                        </View>
                      </div>
                    )
                  })
                }
                <View show={!type}>
                  <div className="hui-tabs__active-bar" style={barStyle} />
                </View>
              </div>
            </div>
          </div>
        </div>
        <div className="hui-tab__content">
          {
            React.Children.map(children, (item) => {
              const {name} = item.props;
              return (
                <View show={name === currentName}>
                  {item}
                </View>
              )
            })
          }
        </div>
      </div>
    )
  }
}

Tabs.PropType = {
  type: PropType.oneOf(['card', 'border-card']),
  closable: PropType.bool,
  addable: PropType.bool,
  editable: PropType.bool,
  activeName: PropType.string,
  value: PropType.string,

  // 方法
  onTabClick: PropType.func,
  onTabRemove: PropType.func,
  onTabAdd: PropType.func,
  onTabEdit: PropType.func,
}

Tabs.defaultProps = {
  closable: false,
  addable: false,
  editable: false,
}

export default Tabs;