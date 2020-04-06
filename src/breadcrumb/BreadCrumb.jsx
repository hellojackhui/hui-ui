import React from 'react';
import {Component, PropType} from '../../libs/index';
import './BreadCrumb.scss';


export default class BreadCrumb extends Component {
  getChildContext() {
    return {
      seperator: this.props.seperator
    }
  }
  render() {
    const {children} = this.props;
    return (
      <div style={this.styles()} className={this.classname("hui-breadcrumb")}>
        {children}
      </div>
    )
  }
}

BreadCrumb.childContextTypes = {
  seperator: PropType.string,
}

BreadCrumb.propTypes = {
  seperator: PropType.string
}

BreadCrumb.defaultProps = {
  seperator: '/'
}