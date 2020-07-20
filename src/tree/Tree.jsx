import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import {Component, PropType, Transition, View} from '../../libs/index';
import Input from '../input/index';
import Checkbox from '../checkbox/index';
import Icon from '../icon/index';
import {matchKey, dipatchParent} from './utils.js';
import './Tree.scss';
import {demoData} from './mockdata';
import { clone } from 'lodash';

export default class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sourceTreeData: [],
      sourceListData: [],
      treeData: [],
      listData: [],
    }
    this.activeNode = null;
  }

  componentDidMount() {
    this.initTreeData(this.props.data)
  }

  componentWillReceiveProps(nextProps, nextState) {
    const {data} = this.props;
    if (!isEqual(data, nextProps.data)) {
      this.initTreeData(nextProps.data)
    }
  }

  initTreeData = (sourcedata) => {
    let sourceTreeData = this.initialTreeData(sourcedata);
    let list = this.initListdata(sourceTreeData)
    this.setDefaultExpand(list, sourceTreeData);
    this.setState({
      sourceTreeData,
      sourceListData: list,
      treeData: cloneDeep(sourceTreeData),
      listData: clone(list)
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
    const {defaultCheckedKeys, defaultExpandAll} = this.props;
    let checked = defaultCheckedKeys.includes(node.id) || false;
    let expanded = defaultExpandAll || false;
    return {
      ...node,
      key: parent ? `${parent.key}-${index + 1}`: `node-${index + 1}`,
      checked,
      active: false,
      level,
      parent: parent ? `${parent.key}` : null,
      expanded,
      '$parent': parent,
    }
  }

  // 设置默认展开项
  setDefaultExpand = (list, sourceData) => {
    let {defaultExpandedKeys} = this.props;
    let keysFromIds = list.filter((item) => defaultExpandedKeys.includes(item.id));
    let keys = keysFromIds.map((item) => item.key);
    function traverse(data = sourceData) {
      if (!data) return;
      for (let i = 0; i < data.length; i++) {
        let node = data[i];
        if (keys.some((key) => key.indexOf(node.key) > -1)) {
          node.expanded = true;
        }
        if (node.children) {
          traverse(node.children)
        }
      } 
      return;
    }
    traverse(sourceData)
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
  renderTreeData = (listData = []) => {
    return listData.map((node) => {
      return this.renderTreeNode(node);
    })
  }

  renderTreeNode = (node) => {
    const {checked, expanded, level, key, label, children, disabled, active} = node;
    const {renderContent, isShowCheckbox} = this.props;
    const isExpandClass = {
      'is-expanded': expanded,
      'not-expanded': !expanded
    }
    const treeNodeClass = this.classnames({
      "hui-tree-node": true,
      "is-active": active
    })
    const store = {
      'append': (target, data) => {
        if (!data.children) {
          data.children = [];
        }
        let newItem = this.insertNodeParams(target, (data.children.length) || 0, data, level + 1);
        let insertIndex = data.children.findIndex((node) => node.key === data.key);
        data.children.splice(insertIndex + 1, 0, newItem)
        this.setState({})
      },
      'remove': (data) => {
        let nodeIndex;
        let target = dipatchParent(data, 1) || this.state.treeData;
        if (data.parent) {
          nodeIndex = target.children.findIndex((item) => item.key === data.key);
          target.children.splice(nodeIndex, 1);
        } else {
          nodeIndex = target.findIndex((item) => item.key === data.key);
          target.splice(nodeIndex, 1);
        }
        this.setState({})
      }
    }
    return (
      <React.Fragment>
        <div className={treeNodeClass} key={key} style={this.styles({
          'paddingLeft': `${20 * (level + 1)}px`
        })} onClick={(e) => this.toogleActiveNode(e, node, level)}>
          {
            (children && children.length) ? (
              <Icon name={"caret-down"} className={isExpandClass} />
            ) : null
          }
          {
            isShowCheckbox && (
              <Checkbox 
                checked={checked}
                disabled={disabled}
              />
            )
          }
          <span className="hui-tree-node__title">{label}</span>
          <div className="hui-tree-node__extend">
            {
              renderContent(store, node)
            }
          </div>
        </div>
        <Transition name="zoom-in-top">
          <View show={(children && children.length) && expanded}>
            <div>
              {
                this.renderTreeData(children)
              }
            </div>
          </View>
        </Transition>
      </React.Fragment>
    )
  }

  // 控制节点展开/关闭
  toogleActiveNode = (event, node, level) => {
    event.preventDefault();
    // 控制展开
    if (node.expanded != undefined) {
      node.expanded = !node.expanded;
    }
    node.active = true;
    if (!this.activeNode) {
      this.activeNode = node;
    } else {
      this.activeNode.active = false;
      this.activeNode = node;
    }
    this.setState({});
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
  defaultExpandAll: PropType.bool,   // 是否默认显示全部
  defaultCheckedKeys: PropType.array, // 默认选中项
  defaultExpandedKeys: PropType.array, // 默认展开项
  isShowCheckbox: PropType.bool,  // 是否显示选择框
}

Tree.defaultProps = {
  withquery: true,
  isShowCheckbox: true,
  defaultExpandAll: false,
}