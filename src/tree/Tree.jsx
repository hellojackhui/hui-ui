import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import {Component, PropType, Transition, View} from '../../libs/index';
import Input from '../input/index';
import Checkbox from '../checkbox/index';
import Icon from '../icon/index';
import {matchKey, dipatchParent, allChecked, allNotChecked} from './utils.js';
import NoDataImg from '../../assets/no-data.png';
import './Tree.scss';

export default class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sourceTreeData: [], // 源树数据（列表展示专用）
      sourceListData: [], // 源列表数据（列表展示专用）
      treeData: [], // 实时树数据
      listData: [], // 实时列表数据（列表展示专用）
      inputValue: props.value,  // 输入框数据
    }
    this.activeNode = null; // 当前激活项
    this.childrenName = props.defaultChildrenName;
    this.defaultKeyName = props.defaultKeyName;
    this.defaultLabelName = Array.isArray(props.defaultLabelName) ? props.defaultLabelName : [props.defaultLabelName];
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
      listData: cloneDeep(list)
    })
  }

  // 初始化树数据
  initialTreeData = (source = [], parent = null, level = 0, append = false) => {
    if (!source) return source;
    let target = source;
    let start = 0;
    let end = target.length;
    if (append) {
      start = target.length;
      end = target.length + source.length;
    }
    for (let i = start; i < end; i++) {
      let node = this.insertNodeParams(append ? target[i - start] : target[i], i, parent, level);
      append ? (target[i - start] = node) : (target[i] = node);
      if (node[this.childrenName]) {
        node[this.childrenName] = this.initialTreeData(node[this.childrenName], node, level + 1);
      }
    }
    return target;
  }

  // 为数据添加初始化属性
  insertNodeParams = (node, index, parent, level) => {
    const {defaultCheckedKeys, defaultExpandAll} = this.props;
    let checked = (defaultCheckedKeys && (node ? defaultCheckedKeys.includes(node[this.defaultKeyName]) : false));
    let expanded = defaultExpandAll || false;
    let newnode = {
      ...node,
      key: parent ? `${parent.key}-${index + 1}`: `node-${index + 1}`,
      checked,
      active: false,
      indeterminate: false,
      level,
      disabled: node.disabled || false,
      parent: parent ? `${parent.key}` : null,
      expanded,
      '$parent': parent,
    }
    this.traverseNodeCheckSink(newnode, checked);
    this.traverseNodeCheckPop(newnode, checked);
    return newnode;
  }

  // 设置默认展开项
  setDefaultExpand = (list, sourceData) => {
    let {defaultExpandedKeys} = this.props;
    if (!defaultExpandedKeys) {
      return;
    }
    let keysFromIds = list.filter((item) => defaultExpandedKeys.includes(item[this.defaultKeyName]));
    let keys = keysFromIds.map((item) => item.key);
    function traverse(data = sourceData) {
      if (!data) return;
      for (let i = 0; i < data.length; i++) {
        let node = data[i];
        if (keys.some((key) => key.indexOf(node.key) > -1)) {
          node.expanded = true;
        }
        if (node[this.childrenName]) {
          traverse(node[this.childrenName])
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
      if (node[this.childrenName] != null) {
        this.initListdata(node[this.childrenName], source);
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

  // 动态获取内容
  lazyLoadNode = (e, node, val) => {
    node['childrending'] = true;
    this.setState({})
    return new Promise((resolve, reject) => {
      return this.props.load(node, resolve)
    }).then((data) => {
      if (data && data.length) {
        let newTree = this.initialTreeData(data, node, node.level + 1, true);
        if (newTree.length) {
          node['children'] = cloneDeep(newTree);
          (node['expanded'] === undefined) && (node['expanded'] = true);
        }
      }
      delete node['childrending'];
      this.setState({}, () => {
        return Promise.resolve(1);
      });
    })
  }

  renderTreeNode = (node) => {
    const {checked, expanded, level, key, disabled, active, indeterminate, childrending = false} = node;
    const {renderContent, isShowCheckbox, lazy} = this.props;
    const hasChildren = (node[this.childrenName] && node[this.childrenName].length);
    const isExpandClass = {
      'is-expanded': expanded,
      'not-expanded': !expanded
    }
    const treeNodeClass = this.classnames({
      "hui-tree-node": true,
      "is-active": active
    })
    const label = this.defaultLabelName.filter((item) => node[item] !== undefined)[0];
    // 工厂方法
    const store = {
      'append': (target, data) => {
        if (!data[this.childrenName]) {
          data[this.childrenName] = [];
        }
        let newItem = this.insertNodeParams(target, (data[this.childrenName].length) || 0, data, level + 1);
        let insertIndex = data[this.childrenName].findIndex((node) => node.key === data.key);
        data[this.childrenName].splice(insertIndex + 1, 0, newItem)
        this.setState({})
      },
      'remove': (data) => {
        let nodeIndex;
        let target = dipatchParent(data, 1) || this.state.treeData;
        if (data.parent) {
          nodeIndex = target[this.childrenName].findIndex((item) => item.key === data.key);
          target[this.childrenName].splice(nodeIndex, 1);
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
          'paddingLeft': `${(hasChildren ? 20 : 25) * (level + 1)}px`
        })} onClick={(e) => this.setClickHandler(e, node, level)}>
          {
            hasChildren ? (
              <Icon name={"caret-down"} className={isExpandClass} />
            ) : null
          }
          {
            lazy && childrending && (
              <Icon name={"circle-o-notch"} className="hui-tree-loading" />
            )
          }
          {
            isShowCheckbox && (
              <Checkbox 
                checked={checked}
                disabled={disabled}
                indeterminate={indeterminate}
                onChange={(val, e) => this.toggleNodeCheckHandler(e, node, val)}
              />
            )
          }
          {
            this.renderLabel(node[label])
          }
          {
            renderContent && (
              <div className="hui-tree-node__extend">
                {
                  renderContent(store, node)
                }
              </div>
            )
          }
        </div>
        <Transition name="zoom-in-top" key={`${key}-transition`}>
          <View show={!!(hasChildren && expanded)}>
            <div>
              {
                this.renderTreeData(node[this.childrenName])
              }
            </div>
          </View>
        </Transition>
      </React.Fragment>
    )
  }

  // 自定义渲染显示
  renderLabel = (label) => {
    const {inputValue} = this.state
    const {withquery} = this.props;
    if (!withquery || inputValue === undefined) return (
      <span className="hui-tree-node__title">{label}</span>
    )
    let strIndex = label.indexOf(inputValue);
    if (strIndex < 0) {
      return (
        <span className="hui-tree-node__title">{label}</span>
      )
    }
    let strObj = [
      {
        name: 'normal',
        label: label.substring(0, strIndex)
      },
      {
        name: 'highlight',
        label: `${inputValue}`
      },
      {
        name: 'normal',
        label: label.substr(strIndex + inputValue.length)
      }
    ]
    return (
      <span className="hui-tree-node__title">
        {
          strObj.map((item) => {
            if (item.name === 'normal') return item.label;
            if (item.name === 'highlight') return (
              <span className="highLight">{item.label}</span>
            )
          })
        }
      </span>
    )
  }

  // 根据点击元素进行不同事件处理
  setClickHandler = (e, node, level) => {
    const {lazy} = this.props;
    let target = e.target;
    let isRow = target.classList[0] === 'hui-tree-node' 
    || target.classList[0] === 'hui-icon'
    || target.classList[0] === 'hui-tree-node__title';
    if (isRow) {
      if (lazy && (!node[this.childrenName] || !node[this.childrenName].length) && node.expanded === false) {
        return this.lazyLoadNode(e, node, level).then(() => {
          return this.toogleActiveNode(e, node, level);
        });
      } else {
        return this.toogleActiveNode(e, node, level);
      }
    } else {
      return () => {}
    }
  }

  // 选中节点checkbox执行函数
  toggleNodeCheckHandler = (e, node, val) => {
    // e.persist()
    e.stopPropagation();
    const {onCheckChange} = this.props;
    node.checked = val;
    this.traverseNodeCheckSink(node, val);
    this.traverseNodeCheckPop(node, val);
    this.setState({}, () => {
      onCheckChange && onCheckChange(node, val)
    })
  }


  // 由节点向下进行遍历，设置节点中间态
  traverseNodeCheckSink = (node, val) => {
    if (val) {
      node.indeterminate = false;
    }
    node.checked = val;
    if (node[this.childrenName] && node[this.childrenName].length) {
      for (let item of node[this.childrenName]) {
        this.traverseNodeCheckSink(item, val)
      }
    } else {
      return;
    }
  }

  // 由节点向上进行遍历，设置节点中间态
  traverseNodeCheckPop = (node, val) => {
    if (node[this.childrenName] && node[this.childrenName].length && node.disabled === false) {
      if (allChecked(node)) {
        node.checked = true;
        node.indeterminate = false;
      } else if (allNotChecked(node)) {
        node.checked = false;
        node.indeterminate = false;
      } else {
        node.checked = false;
        node.indeterminate = true;
      }
    }
    if (node.parent) {
      this.traverseNodeCheckPop(node.$parent);
    }
    return;
  }

  // 控制节点展开/关闭
  toogleActiveNode = (event, node, level) => {
    // 控制展开
    if (node.expanded !== undefined) {
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
  
  // 树节点搜索
  treeNodeSearch = (val) => {
    this.setState({inputValue: val})
    const {sourceListData} = this.state;
    let filterList = val !== '' ? sourceListData.filter((item) => {
      let targetName = `${this.defaultLabelName.filter((label) => item[label] !== undefined)[0]}`;
      let target = item[targetName];
      return target.indexOf(`${val}`.trim()) > -1;
    }) : [];
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
        if (!matchKey(node.key, keyList, true)) {
            data.splice(i, 1);
            i--;
        } else {
          if (matchKey(node.key, keyList, true)) {
            node.expanded = true;
          } else {
            node.expanded = false;
          }
          if (node[this.childrenName]) {
            node[this.childrenName] = traverseTree(node[this.childrenName])
          }
        }
      }
      return data;
    }
    let treeData = traverseTree(cloneDeep(sourceTreeData));
    this.setState({
      treeData
    })
  }

  // 暴露于实例的方法
  // 获取选中的列表节点
  getCheckedNodes = () => {
    const {treeData} = this.state;
    let list = this.initListdata(cloneDeep(treeData));
    let checked = list.filter((item) => item.checked === true);
    return checked;
  }

  // 获取选中的key
  getCheckedKeys = () => {
    const {treeData} = this.state;
    let list = this.initListdata(cloneDeep(treeData));
    let keys = list.filter((item) => item.checked === true).map((item) => item.key);
    return keys;
  }

  //通过节点对象选中节点
  setCheckedNodes = (data) => {
    const {treeData} = this.state;
    let list = this.initListdata(treeData);
    list.forEach((item) => {
      item.checked = false;
      item.indeterminate = false;
    })
    let ids = data.map((item) => item[this.defaultKeyName] ?? item);
    for (let id of ids) {
      let index = list.findIndex((item) => item[this.defaultKeyName] === id);
      this.traverseNodeCheckSink(list[index], true);
      this.traverseNodeCheckPop(list[index], true);
    }
    this.setState({})
  }
  
  // 通过key设置选中
  setCheckedKeys = (data) => {
    return this.setCheckedNodes(data);
  }

  // 清空树选中
  resetChecked = () => {
    const {treeData} = this.state;
    let list = this.initListdata(treeData);
    list.forEach((item) => {
      item.checked = false;
      item.indeterminate = false;
    })
    this.setState({})
  }

  render() {
    const {withquery, isShowCheckbox} = this.props;
    const {inputValue, treeData} = this.state;
    return (
      <div style={this.styles()} className={this.classname('hui-tree-container')}>
        {
          (withquery && !isShowCheckbox) && (
            <Input 
                type={"text"}
                className={'hui-tree-input'}
                icon={'search'}
                placeholder={"输入关键字进行过滤"}
                value={inputValue}
                onChange={this.treeNodeSearch}
                onIconClick={this.treeNodeSearch}
            />
          )
        }
        {
          this.renderTree()
        }
        {
          !treeData.length && (
            <div className="hui-tree__empty">
              <img src={NoDataImg} alt="no-data-image"/>
              搜索不到数据哦～
            </div>
          )
        }
      </div>
    )
  }
}

Tree.propTypes = {
  data: PropType.object,    // 来源数据
  withquery: PropType.bool, // 是否带搜索框
  emptyText: PropType.string,   // 内容为空展示信息
  nodeKey: PropType.string, // 树唯一节点
  load: PropType.func,  // 加载子树数据方法
  lazy: PropType.bool,  // 是否异步加载
  renderContent: PropType.func, // 渲染树节点内容区
  defaultKeyName: PropType.string, // 默认key名称设置
  defaultLabelName: PropType.string, // 默认label名称设置
  defaultChildrenName: PropType.string, // 默认子节点名称设置
  defaultExpandAll: PropType.bool,   // 是否默认显示全部
  defaultCheckedKeys: PropType.array, // 默认选中项
  defaultExpandedKeys: PropType.array, // 默认展开项
  isShowCheckbox: PropType.bool,  // 是否显示选择框
  onCheckChange: PropType.func, // 选中后回调
}

Tree.defaultProps = {
  withquery: true,
  lazy: false,
  isShowCheckbox: false,
  defaultExpandAll: false,
  defaultKeyName: 'id',
  defaultLabelName: 'label',
  defaultChildrenName: 'children'
}