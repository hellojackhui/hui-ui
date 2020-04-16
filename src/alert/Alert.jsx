import React from 'react';
import {Component, PropType, View, Animate} from '../../libs/index';
import './Alert.scss';

export default class Alert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      domVisible: true,
    }
  }

  onClose = () => {
    this.setState({
      visible: false
    })
  }

  onEnd = (visible) => {
    if (!visible) {
      this.setState({
        domVisible: false,
      })
    }
  }

  onLeave = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }
  
  genIcon = (type) => {
    switch(type) {
      case 'success': return 'hui-icon-check-circle';
        case 'warning': return 'hui-icon-exclamation-circle';
          case 'info': return 'hui-icon-info-circle';
            case 'error': return 'hui-icon-times-circle';
    }
  }

  render() {
    const {title, description, type, closable, closeText, showIcon} = this.props;
    return (
      <Animate visible={this.state.visible} enterClassName="hui-alert--fadein" leaveClassName="hui-alert--fadeout" onEnd={this.onEnd}>
        {
          ({classNameType}) => (
            <View show={this.state.domVisible}>
              <div className={this.classname('hui-alert', type && `hui-alert--${type}`, classNameType, {
                'is-disabled': !this.state.domVisible
              })} style={this.styles()}>
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
          )
        }
      </Animate>
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