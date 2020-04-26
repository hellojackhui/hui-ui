import React from 'react';
import {Component, PropType} from '../../../libs/index';
import dragFunction from '../draggable';
import '../Picker.scss';

class Alpha extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: '',
      left: 0,
    }
  }
  componentDidMount() {
    let {bar, thumb} = this.refs;
    let option = {
      drag: (e) =>  {
        this.handleDrag(e)
      },
      end: (e) =>  {
        this.handleDrag(e) 
      }
    }
    dragFunction(bar, option);
    dragFunction(thumb, option);
    this.update();
  }

  clickHandler = (e) => {
    const thumb = this.refs.thumb;
    const target = e.target;
    if (thumb !== target) {
      this.handleDrag(e);
    }
  }

  handleDrag = (e) => {
    const {color} = this.props;
    const {onChange} = this.context;
    const rect = this.$el.getBoundingClientRect();
    const {thumb} = this.refs;

    let left = e.clientX - rect.left;
    left = Math.max(thumb.offsetWidth / 2, left);
    left = Math.min(left, rect.width - thumb.offsetWidth / 2);
    color.set(
      'alpha',
      Math.round(
        (left - thumb.offsetWidth / 2) / (rect.width - thumb.offsetWidth) * 100
      )
    )
    this.update();
    onChange(color);
  }

  calThumbLeft = () => {
    const {color} = this.props;
    const el = this.$el;
    const thumb = this.refs.thumb;
    if (!el) return;
    let alpha = color._alpha;
    return Math.round(alpha * (el.offsetWidth - thumb.offsetWidth / 2) / 100)
  }

  calBackgroundColor = () => {
    const {color} = this.props;
    if (color && color.value) {
      const {r, g, b} = color.toRgb();
      return `linear-gradient(to right, rgba(${r}, ${g}, ${b}, 0) 0%, rgba(${r}, ${g}, ${b}, 1) 100%)`
    }
    return null;
  }

  update = () => {
    this.setState({
      backgroundColor: this.calBackgroundColor(),
      left: this.calThumbLeft()
    })
  }

  render() {
    const {backgroundColor, left} = this.state;
    return (
      <div
       className="hui-picker-alpha"
       ref={(el) => this.$el = el}
      >
        <div
          onClick={(e) => this.clickHandler(e)}
          className="hui-picker-alpha__bar"
          ref="bar"
          style={{
            'background': backgroundColor
          }}
        >
          <div
            className="hui-picker-alpha__thumb"
            ref="thumb"
            style={{
              'left': `${left}px`
            }}
          ></div>
        </div>
      </div>
    )
  }
}

Alpha.contextTypes = {
  onChange: PropType.func
};
Alpha.propTypes = {
  color: PropType.object.isRequired,
};

export default Alpha;