import React from 'react';
import {Component, PropType} from '../../libs/index';
import './Divider.scss';


class Divider extends Component {
    render() {
      const {type, plain, orientation, dashed} = this.props;
      return (
        <div className={this.classname(
          "hui-divider", 
          type && `hui-divider-${type}`, 
          orientation && `hui-divider-text-${orientation}`, 
          dashed && 'hui-divider-dashed',
          plain && 'hui-divider-plain',
          {
            'hui-divider-with-text': this.props.children,
          }
        )}>
          {
            this.props.children && (
              <span className="hui-divider-text-inner">
                {
                  this.props.children
                }
              </span>
            )
          }
        </div>
      )
    }
}

Divider.propTypes = {
  dashed: PropType.bool,
  orientation: PropType.oneOf(['left', 'right', 'center']),
  type: PropType.oneOf(['horizontal', 'vertical']),
  plain: PropType.bool,
}

Divider.defaultProps = {
  type: 'horizontal'
}

export default Divider;