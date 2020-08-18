import React from 'react';
import {Component, PropType} from '../../../libs/index';
import dragFunction from '../draggable';
import '../../../style/core/module/Picker.scss';

class Hue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbLeft: 0,
      thumbTop: 0,
    }
  }
  componentDidMount() {
    let {bar, thumb} = this.refs;
    let option = {
      drag: (e) => {
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
  handleClick(e) {
    let target = e.target;
    let thumb = this.refs.thumb;
    if (target !== thumb) {
      this.handleDrag(e);
    }
  }
  update = () => {
    this.setState({
      thumbLeft: this.calThumbLeft(),
      thumbTop: this.calThumbTop(),
    })
  }
  calThumbLeft = () => {
    const {vertical, color} = this.props;
    if (vertical) return 0;
    let el = this.$el;
    const hue = color.get('hue');
    if (!el) return;
    let thumb = this.refs.thumb;
    return Math.round(hue * (el.getBoundingClientRect().width - thumb.offsetWidth / 2) / 360);
  }
  calThumbTop = () => {
    const {vertical, color} = this.props;
    if (!vertical) return 0;
    let el = this.$el;
    const hue = color.get('hue');
    if (!el) return;
    let thumb = this.refs.thumb;
    return Math.round(hue * (el.getBoundingClientRect().height - thumb.offsetHeight / 2) / 360);
  }
  handleDrag(event) {
    const rect = this.$el.getBoundingClientRect();
    const { thumb } = this.refs;
    const { vertical, color } = this.props;
    const { onChange } = this.context;
    let hue;
    if (!vertical) {
      let left = event.clientX - rect.left;
      left = Math.min(left, rect.width - thumb.offsetWidth / 2);
      left = Math.max(thumb.offsetWidth / 2, left);
      hue = Math.round(
        (left - thumb.offsetWidth / 2) / (rect.width - thumb.offsetWidth) * 360
      );
    } else {
      let top = event.clientY - rect.top;
      top = Math.min(top, rect.height - thumb.offsetHeight / 2);
      top = Math.max(thumb.offsetHeight / 2, top);
      hue = Math.round(
        (top - thumb.offsetHeight / 2) /
          (rect.height - thumb.offsetHeight) *
          360
      );
    }
    color.set('hue', hue);
    this.update();
    onChange(color);
  }
  render() {
    const {thumbLeft, thumbTop} = this.state;
    const {vertical} = this.props;
    return (
      <div
        ref={(el) => this.$el = el}
        className={this.classname({
         'hui-hue-panel': true,
         'is-vertical': vertical,
        })}
        style={{ float: 'right' }}
      >
        <div 
          className="hui-hue-panel__bar"
          onClick={(e) => this.handleClick(e)}
          ref={'bar'}
        >
          <div 
            className="hui-hue-panel__thumb" 
            ref={'thumb'}
            style={{'top': thumbTop, 'left': thumbLeft}}
          />
        </div>
      </div>
    )
  }
}

Hue.contextTypes = {
  onChange: PropType.func
};

export default Hue;