import React from 'react';
import ReactDOM from 'react-dom';
import ReactClickOutside from 'react-click-outside';
import {Component, PropType} from '../../libs/index'
import Button from '../button'

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }

  getChildContext() {
    return {
      component: this,
    }
  }

  componentWillUpdate(props, state) {
    if (state.visible != this.state.visible) {
      this.refs.dropdown.onVisibleChange(state.visible);

      if (this.props.onVisibleChange) {
        this.props.onVisibleChange(state.visible);
      }
    }
  }

  componentDidMount() {
    this.initEvent();
  }

  initEvent = () => {
    const {trigger, splitButton} = this.props;
    const dom = ReactDOM.findDOMNode(trigger ? this.refs.trigger : this.refs.default);
    if (trigger === 'hover') {
      dom.addEventListener('mouseenter', this.show.bind(this));
      dom.addEventListener('mouseleave', this.hide.bind(this));
      let dropdownElm = ReactDOM.findDOMNode(this.refs.dropdown);
      dropdownElm.addEventListener('mouseenter', this.show.bind(this));
      dropdownElm.addEventListener('mouseleave', this.hide.bind(this));
    } else if (trigger == 'click') {
      dom.addEventListener('click', this.handleClick.bind(this));
    }
  }

  show() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.setState({ visible: true }), 250);
  }

  hide() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.setState({ visible: false }), 150);
  }

  handleClick() {
    this.setState({ visible: !this.state.visible });
  }

  handleClickOutside() {
    if (this.state.visible) {
      this.setState({ visible: false });
    }
  }

  handleMenuItemClick(command, instance) {
    if (this.props.hideOnClick) {
      this.setState({
        visible: false
      });
    }

    if (this.props.onCommand) {
      setTimeout(() => {
        this.props.onCommand(command, instance);
      });
    }
  }

  render() {
    const {splitButton, type, size, menu, children} = this.props;
    return (
      <div style={this.styles()} className="hui-dropdown">
        {
          splitButton ? (
            <Button.Group>
              <Button type={type} size={size} onClick={this.props.onClick.bind(this)}>
                {this.props.children}
              </Button>
              <Button ref="trigger" type={type} size={size} className="hui-dropdown__caret-button">
                <i className="hui-dropdown__icon hui-icon hui-icon-caret-button"></i>
              </Button>
            </Button.Group>
          ) : React.cloneElement(children, {
            ref: "default"
          })
        }
        {
          React.cloneElement(menu, {
            ref: 'dropdown'
          })
        }
      </div>
    )
  }
}

Dropdown.childContextTypes = {
  component: PropType.any,
}

export default ReactClickOutside(Dropdown);