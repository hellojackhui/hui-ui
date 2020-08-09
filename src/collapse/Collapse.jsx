import React from 'react';
import {Component, PropType} from '../../libs/index';
import 'module/Collapse.scss';

export default class Collapse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeNames: [].concat(props.value),
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setActiveNames(nextProps.value)
  }
  setActiveNames = (activeNames) => {
    activeNames = [].concat(activeNames);
    this.setState({activeNames}, () => this.props.onChange && this.props.onChange(activeNames))
  }
  clickHandler = (name) => {
    const {accordion} = this.props;
    const {activeNames} = this.state;
    if (accordion) {
      this.setActiveNames(
        activeNames[0] && activeNames[0] === name ? '' : name
      )
    } else {
      if (activeNames.includes(name)) {
        this.setActiveNames(activeNames.filter((activeName) => activeName !== name))
      } else {
        this.setActiveNames(activeNames.concat(name))
      }
    }
  }
  render() {
    const {children} = this.props;
    return (
      <div style={this.styles()} className="hui-collapse">
        {
          React.Children.map(children, (child, index) => {
            let name = child.props.name || index.toString();
            return React.cloneElement(child, {
              key: index,
              isActive: this.state.activeNames.includes(name),
              name,
              onClick: (item) => this.clickHandler(item)
            })
          })
        }
      </div>
    )
  }
}

Collapse.propTypes = {
  accordion: PropType.bool,
  value: PropType.oneOfType([PropType.array, PropType.string]),
  onChange: PropType.func
};

Collapse.defaultProps = {
  accordion: false,
}