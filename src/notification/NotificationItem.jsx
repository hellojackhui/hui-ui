import React from 'react';
import {Component, PropType, Animate} from '../../libs/index';
import './NotificationItem.scss';
import {default as Assets} from './assets';

export default class NotificationItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    }
    this.timer = null;
    this.$ref = null;
  }
  componentDidMount() {
    this.setState({
      visible: true,
    })
    this.starttimer();
  }
  componentWillUnmount() {
    this.stoptimer();
  }
  starttimer = () => {
    const {duration} = this.props;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.onClose()
    }, duration)
  }
  stoptimer = () => {
    clearTimeout(this.timer);
    this.timer = null;
  }
  onClick = () => {
    if (this.props.onClick) {
      this.props.onClick()
    }
  }
  onClose = () => {
    this.stoptimer();
    this.setState({
      visible: false,
    })
  }
  onEnd = (visible) => {
    if (!visible) {
      this.props.willUnmount(this.$ref.offsetHeight, parseInt(this.$ref.style.top));
    }
  }
  getIcon = () => {
    const {type} = this.props;
    return Assets[type];
  }
  render() {
    const {type, title, msg, iconClass, top} = this.props;
    const {visible} = this.state;
    return (
      <Animate visible={visible} enterClassName="hui-notification__enter" leaveClassName="hui-notification__leave" onEnd={this.onEnd}>
        {
          ({classNameType}) => {
            return (
                <div 
                    style={this.styles()} 
                    className={this.classname('hui-notification', classNameType)}
                    onMouseEnter={this.stoptimer}
                    onMouseLeave={this.starttimer}
                    onClick={this.onClick}
                    // eslint-disable-next-line
                    style={{
                      'top': top
                    }}
                    ref={($ref) => this.$ref = $ref}
                >
                  {
                    type && (
                      <i className={this.classname('hui-notification__icon')}>
                        <img src={this.getIcon()} alt="icon"/>
                      </i>
                    )
                  }
                  <div className={this.classname('hui-notification__group', {
                    'is-with-icon': type || iconClass
                  })}>
                    <h2 className="hui-notification__title">{title}</h2>
                    <div className="hui-notification__content">{msg}</div>
                    <i className="hui-notification__close hui-icon hui-icon-close" onClick={this.onClose}></i>
                  </div>
                </div>
            )
          }
        }
      </Animate>
    )
  }
}

NotificationItem.propTypes = {
  duration: PropType.number,
  type: PropType.oneOf(['success', 'info', 'warning', 'error']),
  title: PropType.string,
  iconClass: PropType.string,
  msg: PropType.string,
  top: PropType.number,
}

NotificationItem.defaultProps = {
  top: 16,
  duration: 3000,
  title: '提示',
  type: 'success',
}