import React from 'react';
import ReactDOM from 'react-dom';
import {Component, PropType, View, Transition} from 'libs/index';
import Popper from 'popper.js';

class Suggestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopper: false,
      dropdownWidth: ''
    }
    this.popperJS = null;
  }
  onVisibleChange = (visible, inputWidth) => {
    this.setState({
      showPopper: visible,
      dropdownWidth: inputWidth
    })
  }
  parent() {
    return this.context.component;
  }
  onSelect = (item) => {
    this.parent().select(item);
  }
  onEnter = () => {
    const reference = ReactDOM.findDOMNode(this.parent().inputRef);
    this.popperJS = new Popper(reference, this.refs.popper, {
      modifiers: [
        {
          computeStyle: {
            gpuAcceleration: false
          }
        }
      ]
    });
  }
  onAfterLeave = () => {
    this.popperJS.destroy();
  }
  isOverFlow = () => {
    const {suggestions} = this.props;
    return suggestions.length > 7
  }
  render() {
    const { customItem } = this.parent().props;
    const { loading, selectIndex } = this.parent().state;
    const { suggestions } = this.props;
    const { showPopper, dropdownWidth } = this.state;
    return (
      <Transition name="zoom-in-top" onEnter={this.onEnter} onAfterLeave={this.onAfterLeave}>
        <View show={showPopper}>
          <div
            ref="popper"
            className={this.classnames('hui-autocomplete-suggestion', 'hui-popper', {
              'is-loading': loading
            })}
            style={{
              width: dropdownWidth,
              zIndex: 1
            }}
          >
            <ul className="hui-autocomplete-suggestion__list" style={{
              'overflowY': this.isOverFlow() ? 'scroll' : 'auto'
            }}>
              {
                loading ? (
                  <li><i className="hui-icon-loading"></i></li>
                ) : suggestions.map((item, index) => {
                  return (
                    <li
                      key={index}
                      className={this.classnames({'is-selected': selectIndex === index})}
                      title={item.value}
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

Suggestion.propTypes = {
  suggestions: PropType.array,
}

Suggestion.contextTypes = {
  component: PropType.any
};
  
export default Suggestion;