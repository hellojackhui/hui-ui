import React from 'react';
import {Component, PropType} from 'libs/index';
import 'module/Column.scss';

class Column extends Component {
  static contextTypes = {
    gutter: PropType.oneOfType([PropType.number, PropType.string])
  }
  getStyle = () => {
    const style = {};
    if (this.context.gutter) {
      style.paddingLeft = `${this.context.gutter / 2}px`;
      style.paddingRight = style.paddingLeft;
    }
    return style;
  }
  render() {
    const {tag, children} = this.props;
    let classList = [];
    ['span', 'offset', 'push', 'pull'].forEach((action) => {
      if (this.props[action] >= 0) {
        action !== 'span' ? classList.push(`hui-column-${action}-${this.props[action]}`) : classList.push(`hui-column-${this.props[action]}`)
      }
    });

    ['xs', 'sm', 'md', 'lg'].forEach((size) => {
      if (typeof this.props[size] === 'object') {
        let detail = this.props[size];
        Object.keys(detail).forEach((key) => {
          classList.push(
            key !== 'span' ? `hui-column-${size}-${key}-${detail[key]}` : `hui-column-${size}-${detail[key]}`
          )
        })
      } else if (this.props[size] >= 0){
        classList.push(`hui-column-${size}-${Number(this.props[size])}`)
      }
    })
    return React.createElement(tag, {
      className: this.classname('hui-column', classList),
      style: this.styles(this.getStyle())
    }, children)
  }
}

Column.PropType = {
  span: PropType.oneOfType([PropType.number, PropType.string]),
  offset: PropType.oneOfType([PropType.number, PropType.string]),
  push: PropType.oneOfType([PropType.number, PropType.string]),
  pull: PropType.oneOfType([PropType.number, PropType.string]),
  xs: PropType.oneOfType([PropType.object, PropType.string]),
  sm: PropType.oneOfType([PropType.object, PropType.string]),
  md: PropType.oneOfType([PropType.object, PropType.string]),
  lg: PropType.oneOfType([PropType.object, PropType.string]),
  tag: PropType.string,
}

Column.defaultProps = {
  span: 24,
  tag: "div",
}

export default Column;