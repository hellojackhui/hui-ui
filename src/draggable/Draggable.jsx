import React from 'react';
import ReactDOM from 'react-dom';
import {a} from './utils/domFunctions';
import {Component, PropType} from '../../libs/index';
import {addEvent, removeEvent} from '../../libs/utils/addEvents';

const eventsFor = {
  touch: {
    start: 'touchstart',
    move: 'touchmove',
    stop: 'touchend'
  },
  mouse: {
    start: 'mousedown',
    move: 'mousemove',
    stop: 'mouseup'
  }
};

// 默认使用pc的mouse类事件
let dragEventFor = eventsFor.mouse;

export default class Draggable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dragged: false,
      dragging: false,
      x: props.position.x ? props.position.x : props.defaultPosition.x,
      y: props.position.y ? props.position.y : props.defaultPosition.y,
      slackX: 0,
      slackY: 0,
      lastx: 0,
      lasty: 0,
      isElementSVG: false,
      touchIdentifier: null,
    }
    this.mounted = false;
  }
  componentDidMount() {
    this.mounted = true;
    const node = this.findDOMNode();
    if (node) {
      addEvent(node, eventsFor.touch.start, this.onTouchStart, {passive: false})
    }
    
  }
  componentWillUnmount() {
    this.mounted = false;
    const node = this.findDOMNode();
    if (node) {
      const {ownerDocument} = node;
      removeEvent(ownerDocument, eventsFor.mouse.move, this.handleDrag);
      removeEvent(ownerDocument, eventsFor.touch.move, this.handleDrag);
      removeEvent(ownerDocument, eventsFor.mouse.stop, this.handleDragStop);
      removeEvent(ownerDocument, eventsFor.touch.stop, this.handleDragStop);
      removeEvent(node, eventsFor.touch.start, this.onTouchStart, {passive: false});
      if (this.props.enableUserSelectHack) removeUserSelectStyles(ownerDocument);
    }
  }

  // 查找当前node
  findDOMNode = () => {
    return this.props.ref ? this.props.ref.current : ReactDOM.findDOMNode(this) 
  }

  render() {
    const {axis} = this.props;
    const {isDragging, lastx, lasty} = this.state;
    const draggableStateClass = {
      'hui-draggable': true,
      'hui-draggable-dragging': isDragging,
      'react-draggable-dragged': false,
    }
    const draggbleStatusClass = {
      'cursor-x': axis === 'x',
      'cursor-y': axis === 'y',
    }
    return React.cloneElement(React.Children.only(this.props.children), {
      className: this.classname(draggableStateClass, draggbleStatusClass),
      style: this.styles(style),
      onMouseDown: this.onMouseDown,
      onMouseUp: this.onMouseUp,
      onTouchEnd: this.onTouchEnd
    })
  }
}

Draggable.propType = {
  axis: PropType.oneOf(['both', 'x', 'y', 'none']),
  bounds: PropType.oneOfType([PropType.string, PropType.bool]),
  scale: PropType.number,
  defaultPosition: PropType.object,
  position: PropType.object,
}