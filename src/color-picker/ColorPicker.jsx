import React from 'react';
import ClickOutside from 'react-click-outside';
import {Component, PropType} from 'libs/index';
import Picker from './Picker';
import Color from './color';
import 'module/ColorPicker.scss';

class ColorPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      color: new Color({
        enableAlpha: props.showAlpha,
        format: props.format,
      }),
      pickerIsShow: false,
      panelIsShow: false,
    }
  }
  getChildContext() {
    return {
      onChange: this.changeHandler
    }
  }
  componentDidMount() {
    const {value, color} = this.state;
    if (value) {
      color.fromString(value);
      this.setState({color})
    }
    this.el = this.refs.picker;
  }
  changeHandler = (color) => {
    this.setState(() => {
      return {
        value: color.value,
        color,
      }
    })
  }
  onClear = () => {
    this.setState({
      pickerIsShow: false,
      panelIsShow: false,
      value: null,
    }, () => {
      this.props.onChange && this.props.onChange(null);
      this.resetColor();
    })
  }
  resetColor = () => {
    let {value, color} = this.state;
    if (value) {
      color.fromString(value);
      this.setState({color})
    }
  }
  hide = () => {
    this.setState({
      pickerIsShow: false,
    }, () => this.resetColor())
  }
  handleClickOutside = () => {
    this.setState({pickerIsShow: false})
  }
  onPick = () => {
    this.setState({
      pickerIsShow: false
    }, () => {
      this.props.onChange(this.state.value)
    })
  }
  render() {
    const {showAlpha} = this.props;
    const {value, pickerIsShow, panelIsShow, color} = this.state;
    let displayColor = null;
    if (!value && !pickerIsShow) {
      displayColor = 'transparent';
    } else {
      let {r, g, b} = color.toRgb();
      let alpha = color._alpha;
      if (typeof alpha == 'number') {
        displayColor = showAlpha ? `rgba(${r}, ${g}, ${b}, ${alpha / 100})` : `rgb(${r}, ${g}, ${b})`
      }
    }
    return (
      <div style={this.styles()} className="hui-color-picker">
        <div 
            className="hui-color-picker__selector"
            onClick={() => this.setState({pickerIsShow: !pickerIsShow})}
        >
            <span className={this.classnames({
              'hui-color-picker__color': true,
              'is-alpha': showAlpha
            })}>
              <span 
                  className={'hui-color-picker__color-inner'}
                  style={{'backgroundColor': displayColor}}
              ></span>
              {
                !value && !panelIsShow && !pickerIsShow &&
                <span className="hui-color-picker__empty">x</span>
              }
            </span>
            <span className={this.classnames("hui-color-picker__arrow hui-icon hui-icon-chevron-down", {
              'is-rotate': pickerIsShow
            })}></span>
        </div>
        <Picker 
          ref="picker"
          pickerIsShow={pickerIsShow}
          color={color}
          showAlpha={showAlpha}
          onClear={this.onClear}
          onPick={this.onPick}
        />
      </div>
    )
  }
}

ColorPicker.childContextTypes = {
  onChange: PropType.any
}

ColorPicker.defaultProps = {
  onChange: () => {}
}

ColorPicker.propTypes = {
  value: PropType.string,
  showAlpha: PropType.bool,
  format: PropType.string,
  onChange: PropType.func
}

export default ClickOutside(ColorPicker);