/*
 * slider组件
 * @Author: hellojackhui 
 * @Date: 2020-03-15 20:46:23 
 * @Last Modified by: hellojackhui
 * @Last Modified time: 2020-06-04 07:14:52
 */

import React from 'react';
import {Component, PropType} from 'libs/index';
import './Slider.scss';
import InputNumber from '../input-number';

export default class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      thunkProps: {
        width: ''
      },
      iconProps: {
        left: ''
      }
    }
    this.$thunk = null;
    this.$icon = null;
    this.iconmoving = false;
    this.setPosition(props.value);
    this.stopsArray = new Array(10).fill(0).map((item, index) => `${index + 1}0%`);
  }
  setPosition = (e) => {
    const {max, min} = this.props;
    let percent = typeof e != 'object' ? parseFloat((e * 100) / (max - min)) : this.getComputedPercent(e);
    this.setPositionState(percent);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.value) {
      this.setState({
        value: nextProps.value
      }, () => {
        this.setPosition(this.state.value);
      })
    }
  }
  setPositionState = (percent) => {
    const {max, min} = this.props;
    const {thunkProps, iconProps} = this.state;
    thunkProps.width = `${percent}%`;
    iconProps.left = `${percent}%`;
    const currentvalue = parseFloat((max - min) * Number(percent) / 100);
    this.setState({
      thunkProps,
      iconProps,
      value: currentvalue,
    })
  }
  getComputedPercent = (e) => {
    const {showStops} = this.props;
    let eventOffset = e ? e.clientX : 0;
    let containerRect = this.$thunk.getBoundingClientRect();
    const {left, width} = containerRect;
    let offset = parseFloat(eventOffset - left);
    offset = offset >= width ? width : offset <= 0 ? 0 : offset;
    let percent = showStops ? Math.round(parseFloat(Math.ceil((offset * 100) / width)) / 10) * 10 : parseInt(Math.ceil((offset * 100) / width));
    return percent;
  }
  onMouseDown = (e) => {
    this.iconmoving = true;
  }
  onMouseMove = (e) => {
    if (!this.iconmoving) return;
    const {showStops} = this.props;
    const iconX = e.clientX;
    const {left, width} = this.$thunk.getBoundingClientRect();
    let newWidth = parseFloat(iconX - left);    // 新的宽度
    if (iconX <= left ) {
        newWidth = 0
    } else if (iconX >= parseFloat(left + width)) {
        newWidth = width;
    }
    let percent = showStops ? Math.round(parseFloat((newWidth / width) * 10)) * 10 : parseInt(Math.ceil((newWidth * 100) / width));
    this.setPositionState(percent);
  }
  onMouseUp = (e) => {
    this.iconmoving = false;
  }
  onMouseLeave = () => {
    this.iconmoving = false;
  }
  render() {
    const {disabled, showInput, showInputControls, showStops, showTooltip, range, formatTooltip} = this.props;
    const {thunkProps, iconProps, value} = this.state;
    return (
      <div className={this.classname('hui-slider', {
        'is-disabled': disabled
      })}
        style={{'cursor': this.iconmoving ? 'grab' : 'pointer'}}
        onMouseDown={this.onMouseDown} 
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
        onMouseLeave={this.onMouseLeave}
      >
        <div className={this.classname('hui-slider__inner')} onClick={this.setPosition} ref={($thunk) => this.$thunk = $thunk} >
          <div className="hui-slider__thunk" style={this.styles(thunkProps)}></div>
          {
            showStops && this.stopsArray.map((offset, index) => {
                return (
                  <div key={index} className="hui-slider__stop" style={this.styles({
                    'left': `${offset}`
                  })}></div>
                )
              })
          }
          <div className="hui-slider__tip" style={this.styles(iconProps)}
          >
            <span className="hui-slider__icon" />
            {
              showTooltip && (
                <span className="hui-slider__tooltip">{
                  formatTooltip ? formatTooltip(value) : value
                }</span>
              )
            }
          </div>
        </div>
        {
          showInput && (
            <InputNumber value={value} onChange={(value) => this.setState({value}, () => this.setPosition(this.state.value))} min={range[0]} max={range[1]} showInputControls={showInputControls} />
          )
        }
      </div>
    )
  }
}

Slider.propTypes = {
  value: PropType.oneOfType([PropType.string, PropType.number]),
  disabled: PropType.bool,
  showInput: PropType.bool,
  showInputControls: PropType.bool,
  showStops: PropType.bool,
  step: PropType.number,
  range: PropType.array,
  showTooltip: PropType.bool,
  formatTooltip: PropType.func,
}

Slider.defaultProps = {
  min: 0,
  max: 100,
  disabled: false,
  showInputControls: true,
  showStops: false,
  showTooltip: true,
  range: false,
}