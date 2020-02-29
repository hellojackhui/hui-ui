import React from 'react';
import {Component, PropType, View} from '../../libs/index';
import './Alert.scss';

export default class Alert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    }
  }

  onClose = () => {
    this.setState({
      visible: false
    })
  }

  onLeave = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render() {
    const {title, description, type, closable, closeText, showIcon} = this.props;
    return (
      // <Transition name="hui-alert-fade" onExited={this.onClose}>
        
      // </Transition>
      <View show={this.state.visible}>
        <div className={this.classname('hui-alert', type && `hui-alert--${type}`)} style={this.styles()}>
          { showIcon && <i className={this.classname('hui-alert__icon', 'hui-icon', `hui-icon-${type}`, {
            'is-big': description
          })}></i>}
          <div className="hui-alert__content">
            {title && <span className={this.classname('hui-alert__title', {
                'is-bold': description
            })}>{title}</span>}
            {description && <p className={this.classname('hui-alert__description')}>{description}</p>}
          </div>
          <View show={closable}>
            <i className={this.classname('hui-alert__close', {
              'hui-icon': !closeText,
              'hui-icon-close': !closeText,
              'is-customed': closeText,
            })}
              onClick={this.onClose}
            >{closeText}</i>
          </View>
        </div>
      </View>
    )
  }
}

Alert.propTypes = {
  title: PropType.string,
  type: PropType.string,
  description: PropType.string,
  closable: PropType.bool,
  closeText: PropType.string,
  showIcon: PropType.bool,
}

Alert.defaultProps = {
  type: 'info',
  closable: true,
  showIcon: false,
}