import React from 'react';
import {Component, PropType} from '../../libs/index';
import './Loading.scss';

export default class Loading extends Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props);
  }
  componentWillUnmount() {
    this.enableScroll();
  }
  currentStyle = () => {
    if (this.props.fullScreen) {
      this.disableScroll();
      return {
        'position': 'fixed',
        'top': '0',
        'right': '0',
        'left': '0',
        'bottom': '0',
        'zIndex': '9999'
      }
    } else {
      if (this.props.loading) {
        return {
          'position': 'relative',
          'width': 'fit-content',
        }
      } else {
        return {};
      }
    }
  }
  disableScroll = () => {
    document.body.classList.add('hui-loading--overflow') 
  }
  enableScroll = () => {
    document.body.classList.remove('hui-loading--overflow') 
  }
  render() {
    const {children, loading, text, color} = this.props;
    return (
      <div style={this.currentStyle()} className={this.classname('hui-loading')}>
        {
          loading && (
            <div style={{
              'display': 'block',
              'position': 'absolute',
              'top': '0px',
              'left': '0px',
              'right': '0px',
              'bottom': '0px',
              'margin': 'auto',
              'zIndex': '999',
              'backgroundColor': 'rgba(255, 255, 255, 0.7)'
            }}>
                <div className={this.classname('hui-loading__wrap')}>
                    <svg className="hui-loading__svg" viewBox="25 25 50 50">
                        <circle class="path" cx="50" cy="50" r="20" fill="#ffffff" stroke={color}></circle>
                    </svg>
                    {text && <p className="hui-loading__text" style={{'color': color}}>{text}</p>}
                </div>
            </div>
          )
        }
        {children}
      </div>
    )
  }
}

Loading.propTypes = {
  fullScreen: PropType.bool,
  text: PropType.string,
  color: PropType.string,
  loading: PropType.bool,
}

Loading.defaultProps = {
  fullScreen: false,
  loading: false,
  color: '#50bfff',
}