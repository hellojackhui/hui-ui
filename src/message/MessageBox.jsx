import React from 'react';
import {Component, Animate, PropType} from '../../libs/index';
import './MessageBox.scss';
import {default as Assets} from './assets';


export default class MessageBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    }
    this.timer = null;
  }
  componentDidMount() {
    this.setState({
      visible: true,
    })
    this.startTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  onEnd = (visible) => {
    if (!visible) {
      this.props.willUnmount();
    }
  }

  onClose = () => {
    this.stopTimer();
    this.setState({
      visible: false,
    })
  }

  startTimer = () => {
    const {duration} = this.props;
    this.stopTimer();
    this.timer = setTimeout(() => {
      this.onClose();
    }, duration)
  }

  stopTimer = () => {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  getIcon = () => {
    const {type} = this.props;
    return Assets[type];
  }

  render() {
    const {message, showClose, iconClass} = this.props;
    return (
      <Animate visible={this.state.visible} enterClassName="hui-message--enter" leaveClassName="hui-message--leave" onEnd={this.onEnd}>
        {
          ({classNameType}) => (
            <div style={this.styles()} className={this.classname('hui-message', classNameType)} onMouseEnter={this.stopTimer} onMouseLeave={this.startTimer}>
                {!iconClass && <img className="hui-message__image" src={this.getIcon()} alt="icon"/>}
                <div className="hui-message__title">
                    {iconClass && <i className={this.classname("hui-message__icon", "hui-icon", iconClass)}></i>}
                    <p>{message}</p>
                    {showClose && <i className={this.classname('hui-message__close', 'hui-icon', 'hui-icon-close')} onClick={this.onClose.bind(this)}></i>}
                </div>
            </div>
          )
        }
      </Animate>
        
    )
  }
}

MessageBox.propTypes = {
  duration: PropType.number,
  showClose: PropType.bool,
  message: PropType.string,
  iconClass: PropType.string,
}

MessageBox.defaultProps = {
  duration: 3000,
}