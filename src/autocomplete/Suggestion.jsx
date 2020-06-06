import React from 'react';
import ReactDOM from 'react-dom';
import {Component, PropType, View, Transition} from '../../libs/index';
import Popper from 'popper.js';

export default class Suggestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopper: false,
      dropdownWidth: ''
    }
  }
  onVisibleChange = (visible, inputWidth) => {
    this.setState({
      showPopper: visible,
      dropdownWidth: inputWidth
    })
  }
  parent() {
    return this.context.Component;
  }
  onSelect = (item) => {
    this.parent().select(item);
  }
  onEnter = () => {
    const reference = ReactDOM.findDOMNode(his.parent().inputNode);
    this.popperJS = new Popper(reference, this.refs.popper, {
      modifiers: {
        computeStyle: {
          gpuAcceleration: false
        }
      }
    });
  }
  onAfterLeave() {
    this.popperJS.destroy();
  }
  render() {
    const { customItem } = this.parent().props;
    const { loading, highlightedIndex } = this.parent().state;
    const { suggestions } = this.props;
    const { showPopper, dropdownWidth } = this.state;
    return (
      <Transition name="zoom-in-top" onEnter={this.onEnter} onAfterLeave={this.onAfterLeave}>
        <View show={showPopper}>
          <div
            ref="popper"
            className={this.classNames('hui-autocomplete-suggestion', 'hui-popper', {
              'is-loading': loading
            })}
            style={{
              width: dropdownWidth,
              zIndex: 1
            }}
          >
            <ul className="hui-autocomplete-suggestion__list">
              {
                loading ? (
                  <li><i className="hui-icon-loading"></i></li>
                ) : suggestions.map((item, index) => {
                  return (
                    <li
                      key={index}
                      className={this.classNames({'highlighted': highlightedIndex === index})}
                      onClick={this.onSelect.bind(this, item)}>
                      {
                        !customItem ? item.value : React.createElement(customItem, {
                          index,
                          item
                        })
                      }
                    </li>
                  )
                })
              }
            </ul>
          </div>
        </View>
      </Transition>
    )
  }
}

Suggestion.contextTypes = {
  component: PropType.any
};
  