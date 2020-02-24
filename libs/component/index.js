import React from 'react';
import Classnames from 'classnames';

export default class Component extends React.Component {

  classnames(...classes) {
    return Classnames(classes);
  }

  classname(...classes) {
    return this.classnames.apply(this, classes.concat([this.props.className]))
  }

  styles(styles) {
    return Object.assign({}, this.props.style, styles);
  }
}