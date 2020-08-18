import React from 'react';
import {Component, PropType, Transition, View} from '../../libs/index';
import '../../style/core/module/Collapse.scss';

export default class CollapseItem extends Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props);
  }
  render() {
    const {isActive, name, onClick, title} = this.props;
    return (
      <div className={this.classname('hui-collapse-item', {
        'is-active': isActive
      })}>
        <div className="hui-collapse-item__header" onClick={() => onClick(name)}>
          <i className="hui-collapse-item__header__arrow hui-icon hui-icon-chevron-right" />
          {title}
        </div>
        <Transition name="zoom-in-top">
          <View show={isActive}>
            <div className={this.classname("hui-collapse-item__wrap")}>
              <div className="hui-collapse-item__content">
                {this.props.children}
              </div>
            </div>
          </View>
        </Transition>
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