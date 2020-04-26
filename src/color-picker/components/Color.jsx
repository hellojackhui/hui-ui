import React from 'react';
import {Component, PropType} from '../../../libs/index';
import dragFunction from '../draggable';
import '../Picker.scss';

class Color extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cursorTop: 0,
      cursorLeft: 0,
      background: 'hsl(0%, 100%, 50%)'
    }
  }
  componentDidMount() {
    const option = {
      drag: (e) =>  {
        this.handleDrag(e);
      },
      end: (e) =>  {
        this.handleDrag(e);
      }
    }
    dragFunction(this.$el, option);
    this.update();
  }
  componentWillReceiveProps(nextProps) {
    const {color} = nextProps;
    let background = `hsl(${color.get('hue')}, 100%, 50%)`;
    if (background !== this.state.background) {
      this.update(nextProps);
    }
  }
  handleDrag = (e) => {
    let el = this.$el;
    let {color} = this.props;
    let {onChange} = this.context;
    let rect = el.getBoundingClientRect();
    let left = e.clientX - rect.left;
    let top = e.clientY - rect.top;
    left = Math.max(0, left);
    left = Math.min(left, rect.width);
    top = Math.max(0, top);
    top = Math.min(top, rect.height);
    this.setState({
      cursorLeft: left,
      cursorTop: top,
      background: 'hsl(' + color.get('hue') + ', 100%, 50%)'
    }, () => {
      color.set({
        saturation: left / rect.width * 100,
        value: 100 - top / rect.height * 100
      });
      onChange(color);
    })
  }
  update = (newprops) => {
    let { color } = newprops || this.props;
    let value = color.get('value');
    let saturate = color.get('saturation');
    let el = this.$el;
    let {width, height} = el.getBoundingClientRect();
    if (!height) height = width * 3 / 4;

    this.setState({
      cursorLeft: saturate * width / 100,
      cursorTop: (100 - value) * height / 100,
      background: `hsl(${color.get('hue')}, 100%, 50%)`
    })
  }
  render() {
    const {cursorTop, cursorLeft, background} = this.state;
    return (
      <div 
        className="hui-color-panel"
        ref={(el) => this.$el = el}
        style={{'background': background}}
      >
        <div className="hui-color-panel__white"></div>
        <div className="hui-color-panel__black"></div>
        <div 
            className="hui-color-panel__cursor" 
            style={{'left': cursorLeft, 'top': cursorTop}}
        >
          <div />
        </div>
      </div>
    )
  }
}

Color.contextTypes = {
  onChange: PropType.func
};

export default Color;