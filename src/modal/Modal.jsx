import React from 'react';
import {Component, PropType, Animate, View} from '../../libs/index';
import './Modal.scss';

export default class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
      bodyOverflow: '',
    }
    this.setBodyOverflow();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.visible !== nextProps.visible) {
      this.setState({
        visible: nextProps.visible
      }, () => {
        this.setBodyOverflow();
      })
    }
  }

  setBodyOverflow = () => {
    const {visible} = this.state;
    const {lockScroll, mask} = this.props;
    const {bodyOverflow} = this.state;
    console.log(visible, lockScroll)
    if (visible) {
      this.clearScrollBar();
      if (lockScroll && document && document.body.style) {
         this.setState({
           bodyOverflow: document.body.style.overflow
         })
         document.body.style.overflow = 'hidden';
      }
    } else {
      if (lockScroll && mask && bodyOverflow !== 'hidden' && document && document.body.style) {
        document.body.style.overflow = bodyOverflow;
      }
    }
  }

  clearScrollBar = () => {
    document.querySelectorAll('.hui-modal__body').forEach((el) => {
      setTimeout(() => {
        el.style.overflow = 'hidden';
        setTimeout(() => el.style.overflow = 'auto', 0);
      }, 0)
    })
  }

  onEnd = () => {
    if (!this.state.visible) {
      this.props.onClose && this.props.onClose();
    } else {
      this.props.onOpen && this.props.onOpen();
    }
  }

  closeModal = () => {
    this.setState({
      visible: false,
    })
  }

  clickOverflow = (e) => {
    const {closeOnClickModal} = this.props;
    if (closeOnClickModal && e.target.className === 'hui-modal__mask') {
      this.closeModal();
    }
  }

  keyDown = (e) => {
    const {closeOnEsc} = this.props;
    if (closeOnEsc && e.keyCode === 27) {
      this.closeModal();
    }
  }

  render() {
    const {visible} = this.state;
    const {title, size, mask, children, top} = this.props;
    return (
        <Animate visible={visible} enterClassName="hui-modal--enter" leaveClassName="hui-modal--leave" onEnd={this.onEnd}>
        {
          ({classNameType}) => {
            return (
              <div style={this.styles()} className="hui-modal" onClick={this.clickOverflow} onKeyDown={this.keyDown}>
                <div 
                  className={this.classname('hui-modal__inner', size && `hui-modal--${size}`, classNameType)}
                  style={this.styles({top: top})}
                >
                  <div className="hui-modal__header">
                    <span className="hui-modal__title">{title}</span>
                    <i className="hui-modal__close hui-icon hui-icon-close" onClick={this.closeModal}></i>
                  </div>
                  {children}
                </div>
                {
                  mask && (
                    <View show={visible}>
                      <div className="hui-modal__mask"></div>
                    </View>
                  )
                }
              </div>
            )
          }
        }
      </Animate>
      
    )
  }
} 

Modal.propTypes = {
  visible: PropType.bool,
  title: PropType.string,
  size: PropType.string,
  mask: PropType.bool,
  lockScroll: PropType.bool,
  customClass: PropType.string,
  closeOnClickModal: PropType.bool,
  closeOnEsc: PropType.bool,
  onOpen: PropType.func,
  onClose: PropType.func,
}

Modal.defaultProps = {
  size: 'small',
  top: '15%',
  mask: true,
  lockScroll: false,
  closeOnClickModal: true,
  closeOnEsc: true,
}