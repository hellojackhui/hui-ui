import React from 'react';
import {Component, PropType, View, Transition} from 'libs/index';
import 'module/Modal.scss';

export default class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
      bodyOverflow: '',
    }
    if (typeof window !== `undefined`) {
      this.setBodyOverflow();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.visible !== nextProps.visible) {
      this.setState({
        visible: nextProps.visible,
      }, () => {
        if (typeof window !== `undefined`) {
          this.setBodyOverflow();
        }
      })
    }
  }

  setBodyOverflow = () => {
    const {visible} = this.state;
    const {lockScroll, mask} = this.props;
    const {bodyOverflow} = this.state;
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

  closeModal = () => {
    const {onClose} = this.props;
    onClose && onClose();
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
  
  onEnter = () => {
    this.refs.modalWrap.style.zIndex = '10000';
    this.refs.modal.style.top = '';
  }

  onAfterEnter = () => {
    this.refs.modal.style.top = '20%';
  }

  onLeave = () => {
    this.refs.modal.style.top = '';
  }

  onAfterLeave = () => {
    this.refs.modalWrap.style.zIndex = '-10000';
    this.refs.modal.style.top = '';
  }

  render() {
    const {visible} = this.state;
    const {title, size, mask, children} = this.props;
    return (
      <div style={this.styles({
        'zIndex': '-10000',
      })} className={this.classnames("hui-modal")} onClick={this.clickOverflow} onKeyDown={this.keyDown} ref={'modalWrap'}>
        <Transition name="slider" onEnter={this.onEnter} onAfterEnter={this.onAfterEnter} onLeave={this.onLeave} onAfterLeave={this.onAfterLeave}>
          <View show={visible}>
            <div 
                className={this.classname('hui-modal__inner', size && `hui-modal--${size}`)}
                ref={'modal'}
              >
                <div className="hui-modal__header">
                  <span className="hui-modal__title">{title}</span>
                  <i className="hui-modal__close hui-icon hui-icon-close" onClick={this.closeModal}></i>
                </div>
                {children}
            </div>
          </View>
        </Transition>
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
  mask: true,
  lockScroll: false,
  closeOnClickModal: true,
  closeOnEsc: true,
}