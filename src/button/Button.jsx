import React from 'react';
import {Component, PropType} from '../../libs/index';
import 'module/Button.scss';

export default class Button extends Component {
  handleClick = () => {
    if (this.props.onClick) {
     this.props.onClick();
    }
  }
  render() {
    const {size, type, plain, loading, disabled, icon, nativeType, children} = this.props;
    return (
      <button className={this.classname('hui-button', size && `hui-button--${size}`, type && `hui-button--${type}`, {
        'is-plain': plain,
        'is-disabled': disabled,
        'is-loading': loading,
      })}
        type={nativeType}
        onClick={this.handleClick}
      >
        {loading && <i className={this.classname("hui-button__icon", "hui-icon", 'hui-icon-repeat', 'hui-button__loading')} />}
        {!loading && icon && <i className={this.classname("hui-button__icon", "hui-icon", `hui-icon-${icon}`)}></i>}
        <span>{children}</span>
      </button>
    )
  }
}

Button.propTypes = {
  size: PropType.oneOf(['large', 'small', 'mini']),
  type: PropType.string,
  plain: PropType.bool,
  loading: PropType.bool,
  disabled: PropType.bool,
  icon: PropType.string,
  nativeType: PropType.string
}

Button.defaultProps = {
  plain: false,
  disabled: false,
  loading: false,
  type: 'plain',
}