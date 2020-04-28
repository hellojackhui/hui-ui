import React from 'react';
import {Component, PropType, Animate} from '../../libs';
import './Collapse.scss';

export default class CollapseItem extends Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props);
    this.state = {
      isVisible: props.isActive
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isActive) {
      this.setState({
        isVisible: nextProps.isActive
      })
    }
    
  }
  onEnd = (visible) => {
    this.setState({
      isVisible: visible,
    })
  }
  render() {
    const {isActive, name, onClick, title} = this.props;
    const {isVisible} = this.state;
    return (
      <div className={this.classname('hui-collapse-item', {
        'is-active': isActive
      })}>
        <div className="hui-collapse-item__header" onClick={() => onClick(name)}>
          <i className="hui-collapse-item__header__arrow hui-icon hui-icon-chevron-right" />
          {title}
        </div>
        {/* {
          isActive && (
            <div className={this.classname("hui-collapse-item__wrap")}>
              <div className="hui-collapse-item__content">
                {this.props.children}
              </div>
            </div>
          )
        } */}
        <Animate visible={isActive} enterClassName="hui-collapse--open" leaveClassName="hui-collapse--close" onEnd={this.onEnd}>
          {
            ({classNameType}) => (
              <div className={this.classname("hui-collapse-item__wrap", classNameType, {
                'is-disabled': !isVisible,
              })}>
                <div className="hui-collapse-item__content">
                  {this.props.children}
                </div>
              </div>
            )
          }
        </Animate>
      </div>
    )
  }
}

CollapseItem.propTypes = {
  isActive: PropType.bool,
  title: PropType.node,
  name: PropType.string,
  onClick: PropType.func,
}