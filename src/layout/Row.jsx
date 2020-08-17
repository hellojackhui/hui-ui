import React from 'react';
import {Component, PropType} from '../../libs/index';
import '../../style/core/module/Row.scss';

class Row extends Component {
  getChildContext() {
    return {
      gutter: this.props.gutter,
    }
  }
  getStyle = () => {
    const {gutter} = this.props;
    let result = {};
    if (gutter) {
      result.marginLeft = `-${Number(gutter) / 10}px`;
      result.marginRight = result.marginLeft;
    }
    return result;
  }
  render() {
    const {tag, justify, align, type, children} = this.props;
    return React.createElement(tag, {
      className: this.classname('hui-row', justify !== 'start' && `hui-row--${justify}`, align !== 'top' && `hui-row--${align}`, {
        'hui-row--flex': type === 'flex'
      }),
      style: this.styles(this.getStyle())
    }, children)
  }
}

Row.childContextTypes = {
  gutter: PropType.oneOfType([PropType.number, PropType.string])
}

Row.PropType = {
  gutter: PropType.string,
  type: PropType.string,
  justify: PropType.string,
  align: PropType.string,
  tag: PropType.string,
}

Row.defaultProps = {
  justify: 'start',
  align: 'top',
  tag: 'div'
};

export default Row;