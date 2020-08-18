import React from 'react';
import {Component, PropType, View, Transition} from '../../libs/index';
import '../../style/core/module/Alert.scss';

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

  
  genIcon = (type) => {
    switch(type) {
      case 'success': return 'hui-icon-check-circle';
        case 'warning': return 'hui-icon-exclamation-circle';
          case 'info': return 'hui-icon-info-circle';
            case 'error': return 'hui-icon-times-circle';
      default: return 'hui-icon-check-circle';
    }
  }

  render() {
    const {title, description, type, closable, closeText, showIcon} = this.props;
    return (
      <Transition name="fade-in-linear">
        <View show={this.state.visible}>
          <div className={this.classname('hui-alert', type && `hui-alert--${type}`)} style={this.styles()}>
            { showIcon && <i className={this.classname('hui-alert__icon', 'hui-icon', `${this.genIcon(type)}`, {
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
      </Transition>
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
  closable: false,
  showIcon: false,
}