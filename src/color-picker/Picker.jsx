import React from 'react';
import Alpha from './components/Alpha';
import Color from './components/Color';
import Hue from './components/Hue';
import {Component, PropType, View} from 'libs/index';
import 'module/Picker.scss';


class Picker extends Component {
  render() {
    const {color, pickerIsShow, showAlpha, onClear, onPick} = this.props;
    const currentColor = color.value;
    return (
      <View show={pickerIsShow}>
        <div className="hui-picker">
          <div className="hui-picker-wrapper-panel">
            <Color
              ref={"color-panel"}
              color={color}
              onChange={(color) => this.props.onChange(color)}
            />
            <Hue 
              ref={"hue"}
              color={color}
              vertical={true}
              onChange={(color) => this.props.onChange(color)}
            />
          </div>
          {showAlpha && <Alpha color={color} ref={"alpha"} />}
          <div className="hui-picker-options">
            <span className="hui-picker-value">{currentColor}</span>
            <button
              className="hui-picker-btn"
              onClick={() => onPick()}
            >
              确定
            </button>
            <a
              className="hui-picker-link"
              href="void:javascript;"
              onClick={() => onClear()}
            >清空</a>
          </div>
        </div>
      </View>
    )
  }
}

Picker.propTypes = {
  color: PropType.object.isRequired,
  showPicker: PropType.bool,
  showAlpha: PropType.bool,
  onPick: PropType.func,
  onClear: PropType.func,
  onChange: PropType.func
};

Picker.defaultProps = {
  onPick() {},
  onClear() {},
  onChange() {}
};

export default Picker;