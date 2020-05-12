import React from 'react';
import {Component, PropType} from '../../../libs/index';
import Button from '../../button/index';
import isEqual from 'lodash/isEqual';
import './TableAction.scss';

export default class TableAction extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    this.isReceiveProps = true;
  }

  shouldComponentUpdate(nextProps) {
    if (this.isReceiveProps) {
      this.isReceiveProps = false;
      return isEqual(nextProps, this.props);
    }
    return true;
  }

  actionsFilters = (actions) => {
    return actions.filter((action) => !action.hasOwnProperty('visible') || action.visible)
  }


  clickHandler = (onClick, e) => {
    typeof onClick === 'function' && onClick(e);
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }

  renderButtonLists = (actions) => {
    actions = this.actionsFilters(actions);
    return actions.map(({icon, title, onClick}, index) => {
      return <Button key={`table-action-${index}`} icon={icon} onClick={(e) => this.clickHandler(onClick, e)}>{title}</Button>
    })
  }

  render() {
    const {actions} = this.props;
    return (
      <div style={this.styles()} className={this.classname('hui-table-action')}>
        {this.renderButtonLists(actions)}
      </div>
    )
  }
}