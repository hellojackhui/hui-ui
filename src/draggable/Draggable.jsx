import React from 'react';
import ReactDOM from 'react-dom';
import {Component, PropType} from '../../libs/index';
import {addEvent, removeEvent} from '../../libs/utils/addEvents';
import {getTouchIdentifier, getControlPosition, createCoreData, createDraggableData, getBoundPosition, canDragX, canDragY} from './utils/domFunctions';
import './Draggable.scss';

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
      lastX: 0,
      lastY: 0,
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
  onMouseDown = (e) => {
    this.props.onMouseDown && this.props.onMouseDown(e);
    // 只允许左键触发
    if (!this.props.allowClick && typeof e.button === 'number' && e.button !== 0) return false;

    // 保证元素在这个window下
    const node = this.findDOMNode();
    const {ownerDocument} = node;
    if (this.props.disabled || !(e.target instanceof ownerDocument.defaultView.Node)) {
      return;
    }
    if (e.type === 'touchstart') e.preventDefault();
    const touchIdentifier = getTouchIdentifier(e);
    this.setState({touchIdentifier});

    const position = getControlPosition(e, touchIdentifier, this);

    if (position === null) return;
    const {x, y} = position;
    const coreEvent = createCoreData(this, x, y);
    const shouldUpdate = this.props.onStart && this.props.onStart(e, coreEvent);
    if (shouldUpdate === false || this.mounted === false) return;
    this.setState({
      dragging: true,
      dragged: true,
      lastX: x,
      lastY: y
    });
    addEvent(ownerDocument, dragEventFor.move, this.onMouseDrag)
    addEvent(ownerDocument, dragEventFor.stop, this.onMouseDragStop)
  }

  onMouseDrag = (e) => {
    this.props.onMouseMove && this.props.onMouseMove(e);
    const position = getControlPosition(e, this.state.touchIdentifier, this);
    if (position == null) return;
    let {x, y} = position;
    const coreEvent = createCoreData(this, x, y);
    this.onDrag(coreEvent);
    if (this.mounted === false) { 
      this.onMouseDragStop(new MouseEvent('mouseup'));
      return;
    }
    this.setState({
      lastX: x,
      lastY: y
    })
  }

  onDrag = (coreEvent) => {
    if (!this.state.dragging) return;
    const uiData = createDraggableData(this, coreEvent);
    const newState = {
      x: uiData.x,
      y: uiData.y,
    }
    if (this.props.bounds) {
      const {x, y} = newState;

      newState.x += this.state.slackX;
      newState.y += this.state.slackY;

      const [newStateX, newStateY] = getBoundPosition(this, newState.x, newState.y);
      newState.x = newStateX;
      newState.y = newStateY;

      newState.slackX = this.state.slackX + (x - newState.x);
      newState.slackY = this.state.slackY + (y - newState.y);

      uiData.x = newState.x;
      uiData.y = newState.y;
      uiData.deltaX = newState.x - this.state.x;
      uiData.deltaY = newState.y - this.state.y;
    }
    this.setState(newState);
  }

  onMouseDragStop = (e) => {
    if (!this.state.dragging) return;
    this.props.onMousUp && this.props.onMousUp(e);
    const position = getControlPosition(e, this.state.touchIdentifier, this);
    if (position == null) return;
    const thisNode = this.findDOMNode();
    this.setState({
      dragging: false,
      lastX: NaN,
      lastY: NaN,
      slackX: 0,
      slackY: 0
    });
    if (thisNode) {
      removeEvent(thisNode.ownerDocument, dragEventFor.move, this.onMouseDrag);
      removeEvent(thisNode.ownerDocument, dragEventFor.stop, this.onMouseDragStop);
    }
  }

  onMouseUp = (e) => {
    this.onMouseDragStop(e);
  }

  onTouchEnd = (e) => {
    this.onMouseDragStop(e);
  }
  componentWillUnmount() {
    this.mounted = false;
    const node = this.findDOMNode();
    if (node) {
      const {ownerDocument} = node;
      removeEvent(ownerDocument, eventsFor.mouse.move, this.handleDrag);
      removeEvent(ownerDocument, eventsFor.touch.move, this.handleDrag);
      removeEvent(ownerDocument, eventsFor.mouse.stop, this.onMouseDragStop);
      removeEvent(ownerDocument, eventsFor.touch.stop, this.onMouseDragStop);
      removeEvent(node, eventsFor.touch.start, this.onTouchStart, {passive: false});
      // if (this.props.enableUserSelectHack) removeUserSelectStyles(ownerDocument);
    }
  }

  // 查找当前node
  findDOMNode = () => {
    return this.props.ref ? this.props.ref.current : ReactDOM.findDOMNode(this) 
  }

  render() {
    const {axis, children, position, defaultPosition, controlled, disabled} = this.props;
    const {isDragging, x, y} = this.state;
    const draggableStateClass = {
      'hui-draggable': true,
      'hui-draggable-dragging': isDragging,
      'react-draggable-dragged': false,
      'hui-draggable-disabled': disabled
    }
    const draggbleStatusClass = {
      'cursor-x': axis === 'x',
      'cursor-y': axis === 'y',
      'cursor-disable': axis === 'none'
    }
    const draggable = !controlled || this.state.dragging;
    const validPosition = position || defaultPosition;
    const transformOpt = {
      x: (canDragX(this) && draggable) ?
        x : validPosition.x,
      y: (canDragY(this) && draggable) ?
        y : validPosition.y
    } 

    return React.cloneElement(React.Children.only(children), {
      'className': this.classname(draggableStateClass, draggbleStatusClass),
      'onMouseDown': this.onMouseDown,
      'onMouseUp': this.onMouseUp,
      'onTouchEnd': this.onTouchEnd,
      'style': {
        ...children.props.style,
        'transform': `translate(${transformOpt.x}px,${transformOpt.y}px)`
      }
    })
  }
}

Draggable.propType = {
  axis: PropType.oneOf(['both', 'x', 'y', 'none']),
  bounds: PropType.oneOfType([PropType.string, PropType.bool]),
  disabled: PropType.bool,
  scale: PropType.number,
  defaultPosition: PropType.object,
  allowClick: PropType.bool,
  position: PropType.shape({
    x: PropType.number,
    y: PropType.number
  }),
  onMouseDown: PropType.func,
  onMouseMove: PropType.func,
  onMousUp: PropType.func,
}

Draggable.defaultProps = {
  axis: 'both',
  scale: 1,
  defaultPosition: {
    x: 0,
    y: 0
  },
  position: {
    x: 0,
    y: 0
  }
}