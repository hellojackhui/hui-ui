import React from 'react';
import {Component, PropType} from '../../libs/index';
import 'module/Card.scss';

export default class Card extends Component {
  render() {
    const {header, bodyStyle, children} = this.props;
    return (
      <div style={this.styles()} className={this.classname('hui-card')}>
        {
          header && (
            <div className="hui-card__header">
              {header}
            </div>
          )
        }
        <div className="hui-card__content" style={this.styles(bodyStyle)}>
          {children}
        </div>
      </div>
    )
  }
}

Card.propTypes = {
  header: PropType.string,
  bodyStyle: PropType.object,
}