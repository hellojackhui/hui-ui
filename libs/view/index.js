import React from 'react';
import {PropType} from '../index';

export default class View extends React.Component {
  render() {
    const {children, show, className = ''} = this.props;
    let classNames = [];
    let mixins = {style: {...children.props.style}};
    if (!show) mixins.style['display'] = 'none';
    if (children.props.className) classNames.push(children.props.className);
    if (className) children.push(className);
    mixins.className = classNames.join(' ');
    return React.cloneElement(React.Children.only(children), mixins);
  }
}

View.propTypes = {
  show: PropType.bool,
}

View.defaultProps = {
  show: true,
}