import React from 'react';
import ReactDOM from 'react-dom';
import debounce from 'lodash/debounce';
import ReactClickOutside from 'react-click-outside';
import {Component, PropType} from '../../libs/index'
import Button from '../button'
require('./Dropdown.scss');

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
    this.show = debounce(this.show, 200, {
      leading: true,
      trailing: false
    });
  }

  getChildContext() {
    return {
      component: this,
    }
  }

  componentWillUpdate(props, state) {
    if (state.visible !== this.state.visible) {
      this.refs.dropdown.onVisibleChange(state.visible);

      if (props.onVisibleChange) {
        this.props.onVisibleChange(state.visible);
      }
    }
  }

  componentDidMount() {
    this.initEvent();
    // 处理dropdown因为overflow导致被覆盖的问题
    // this.setDropdownElement();
  }

  componentWillUnmount() {
    // this.removeDropdownElement();
  }

  initEvent = () => {
    const {trigger, splitButton} = this.props;
    const dom = ReactDOM.findDOMNode(splitButton ? this.refs.trigger : this.refs.default);
    if (trigger === 'hover') {
      dom.addEventListener('mouseenter', this.show.bind(this));
      dom.addEventListener('mouseleave', this.hide.bind(this));
      let dropdownElm = ReactDOM.findDOMNode(this.refs.dropdown);
      dropdownElm.addEventListener('mouseenter', this.show.bind(this));
      dropdownElm.addEventListener('mouseleave', this.hide.bind(this));
    } else if (trigger === 'click') {
      dom.addEventListener('click', this.handleClick.bind(this));
    }
  }

  handleMenuItemClick = (command, instance) => {
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

  show() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.setState({ visible: true }), 50);
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

  setDropdownElement = () => {
    let ele = ReactDOM.findDOMNode(this.refs.dropdown);
    document.body.appendChild(ele);
  }

  removeDropdownElement = () => {
    let ele = ReactDOM.findDOMNode(this.refs.dropdown);
    document.body.removeChild(ele);
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

Dropdown.propTypes = {
  menuAlign: PropType.oneOf(['start', 'end']),
  hideOnClick: PropType.bool,
}

Dropdown.defaultProps = {
  hideOnClick: true,
  trigger: 'hover',
  menuAlign: 'end'
}

export default ReactClickOutside(Dropdown);