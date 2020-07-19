import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import {Component, PropType} from '../../libs/index';
import Input from '../input/index';
import Checkbox from '../checkbox/index';
import {matchKey} from './utils.js';
import './Tree.scss';
import {demoData} from './mockdata';


export default class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sourceTreeData: [],
      sourceListData: [],
      treeData: [],
    }
  }

  componentDidMount() {
    this.initTreeData()
  }

  initTreeData = () => {
    let sourceTreeData = this.initialTreeData(demoData);
    this.setState({
      sourceTreeData,
      treeData: cloneDeep(sourceTreeData)
    }, () => {
      let list = this.initListdata()
      this.setState({
        sourceListData: list,
      })
    })
  }

  // 初始化树数据
  initialTreeData = (source = [], parent = null, level = 0) => {
    if (!source) return source;
    let target = cloneDeep(source);
    for (let i = 0; i < target.length; i++) {
      let node = this.insertNodeParams(target[i], i, parent, level);
      target[i] = node;
      if (node.children) {
        node.children = this.initialTreeData(node.children, node, level + 1)
      }
    }
    return target;
  }

  // 为数据添加初始化属性
  insertNodeParams = (node, index, parent, level) => {
    return {
      ...node,
      key: parent ? `${parent.key}-${index + 1}`: `node-${index + 1}`,
      checked: false,
      level,
      parent: parent ? `${parent.key}` : null,
      expanded: false,
    }
  }

  initListdata = (data = this.state.sourceTreeData, source = []) => {
    if (!data) return source;
    for (let i = 0; i < data.length; i++) {
      let node = data[i];
      source.push(node);
      if (node.children != null) {
        this.initListdata(node.children, source);
      }
    }
    return source;
  }

  // 渲染树组件容器
  renderTree = () => {
    const {treeData} = this.state;
    return (
      <div className="hui-tree-wrapper">
        {
          this.renderTreeData(treeData)
        }
      </div>
    )
  }

  // 渲染树节点
  renderTreeData = (listData) => {
    return listData.map((node) => {
       return this.renderTreeNode(node);
    })
  }

  renderTreeNode = (node) => {
    const {checked, expanded, level, key, label, children, disabled} = node;
    const {renderContent} = this.props;
    return (
      <React.Fragment>
        <div className="hui-tree-node" key={key} style={this.styles({
          'paddingLeft': `${20 * level}px`
        })}>
          <Checkbox 
            checked={checked}
            disabled={disabled}
          />
          <span className="hui-tree-node__title">{label}</span>
          <div className="hui-tree-node__extend">
            123
          </div>
        </div>
        {
           children && this.renderTreeData(node.children)
        }
      </React.Fragment>
    )
  }


  loadData = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(demoData)
      }, 1000);
    })
  }
  
  // 树节点搜索
  treeNodeSearch = (val) => {
    const {sourceListData} = this.state;
    let filterList = sourceListData.filter((item) => `${item.label}`.indexOf(`${val}`.trim()) > -1);
    return this.genFilterTree(filterList);
  }

  // 过滤后对节点树
  genFilterTree = (filterList) => {
    const {sourceTreeData} = this.state;
    const keyList = filterList.map((item) => item.key);
    console.log(keyList);
    function traverseTree(data = sourceTreeData) {
      if (!data) return data;
      for (let i = 0; i < data.length; i++) {
        let node = data[i];
        if (!matchKey(node.key, keyList, false)) {
            data.splice(i, 1);
            i--;
        } else if (node.children) {
          node.children = traverseTree(node.children)
        }
      }
      return data;
    }
    let treeData = traverseTree(cloneDeep(sourceTreeData));
    this.setState({
      treeData
    })
  }
  

  render() {
    const {withquery, value} = this.props;
    return (
      <div style={this.styles()} className={this.classname('hui-tree-container')}>
        {
          withquery && (
            <Input 
                type={"text"}
                className={'hui-tree-input'}
                icon={'search'}
                placeholder={"输入关键字进行过滤"}
                value={value}
                onChange={this.treeNodeSearch}
                onIconClick={this.treeNodeSearch}
            />
          )
        }
        {
          this.renderTree()
        }
      </div>
    )
  }
}

Tree.propTypes = {
  data: PropType.object,    // 来源数据
  withquery: PropType.bool,
  emptyText: PropType.string,   // 内容为空展示信息
  nodeKey: PropType.string, // 树唯一节点
  load: PropType.func,  // 加载子树数据方法
  renderContent: PropType.func, // 渲染树节点内容区
  defaultExpandAll: PropType.bool   // 是否默认显示全部
}

Tree.defaultProps = {
  withquery: true,
}