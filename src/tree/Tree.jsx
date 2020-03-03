import React from 'react';
import {Component, PropType} from '../../libs/index';

export default class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentWillReceiveProps(nextProps) {
    
  }

  componentDidMount() {
    
  }

  render() {
    const {highlightCurrent, data, options, isShowCheckbox, onCheckChange, renderContent} = this.props;
    return (
      <div style={this.styles()} className={this.classname('hui-tree', {
        'is-highlightCurrent': highlightCurrent
      })}>
        {
          data.map((item, index) => {
            return (
              <Node 
                data={item}
                options={options}
                isShowCheckbox={isShowCheckbox}
                onCheckChange={onCheckChange}
                renderContent={renderContent}
                parent={this}
                treeNode={this}
              />
            )
          })
        }
      </div>
    )
  }
}

Tree.propTypes = {
  data: PropType.object,
  options: PropType.object,
  highlightCurrent: PropType.bool,
  onCheckChange: PropType.func,
  onNodeClicked: PropType.func,
  isShowCheckbox: PropType.bool,
  renderContent: PropType.func,
  nodeKey: PropType.string,
  defaultExpandedKeys: PropType.object,
  defaultCheckedKeys: PropType.object,
}