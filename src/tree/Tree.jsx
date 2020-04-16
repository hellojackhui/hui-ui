import React from 'react';
import {Component, PropType} from '../../libs/index'
import Checkbox from '../checkbox/index';
import Input from '../input/index';
import Button from '../button/index';
import {isEqual, cloneDeep, includes} from 'lodash';
import './Tree.scss';

const checkEnum = {
  all: 'ALL',// 子节点全部选中
  part: 'PART',// 子节点部分选中
  none: 'NONE',// 子节点全部没有选中
};
export default class Tree extends Component {
  constructor (props) {
    super(props);
    this.receiveProps = false;
    this.state = {
      treeData: props.data,
      treeDataTile: {},
      keyword: '',
      filterEmpty: false
    };
  }

  componentWillReceiveProps (nextProps) {
    this.receiveProps = true;
    let { clearAll, onClear } = nextProps;
    if (clearAll) {
      let { treeDataTile } = this.state;
      this.changeTreeDataChecked({selKey: -1, data: treeDataTile});
      this.receiveProps = false;
      this.setState({
        treeDataTile
      }, () => {
        this.filterCheckedItems();
        onClear && onClear();
      });
    }
  }

  shouldComponentUpdate (nextProps) {
    if (this.receiveProps) {
      return isEqual(this.props, nextProps);
    }
    return true;
  }

  componentDidMount () {
    let { treeData: data } = this.state;
    let selectItemsValueArr = this.prepareSelectItemsValueArr();
    let { treeData, treeDataTile } = this.prepareTreeDataTile({data, selectItemsValueArr, level: 0});
    this.judgeParentChecked(treeDataTile);
    this.setState({
      treeData,
      treeDataTile
    });
  }

  /**
   * 准备选中数据源
   */
  prepareSelectItemsValueArr = () => {
    let { selectItems = [] } = this.props;
    let valueArr = [];
    for (let selItem of selectItems) {
      let {value} = selItem || {};
      valueArr.push(value);
    }
    return valueArr;
  };

  /**
   * 组装数据源
   * @param data
   * @param baseKey
   * @param treeDataTile
   * @returns {{treeDataTile: *, treeData: *}}
   */
  prepareTreeDataTile = ({data = [], baseKey = '0', treeDataTile = {}, selectItemsValueArr = [], level = 0} ) => {
    let _this = this;
    let { defaultExpandAll = true } = _this.props;
    let len = data.length;
    level += 1;
    for (let i = 0; i < len; i++) {
      let item = data[i];
      let __key__ = `${baseKey}-${i}`;
      item.__key__ = __key__;
      item.__level__ = level;
      item.__parent__ = baseKey;
      item.__open__ = !!defaultExpandAll;
      let { value } = item;
      let { __checked__: parentChecked } = treeDataTile[baseKey] || {};
      item.__checked__ = includes(selectItemsValueArr, value) || parentChecked;
      let { children = [] } = item;
      if (children.length > 0) {
        treeDataTile[__key__] = item;
        _this.prepareTreeDataTile({data: children, baseKey: __key__, treeDataTile, selectItemsValueArr, level: level});
      } else {
        treeDataTile[__key__] = item;
      }
    }
    return {treeData: data, treeDataTile};
  };

  renderTree = (treeData = [], key = 'tree') => {
    const {emptyText} = this.props;
    if (treeData == null || typeof treeData != 'object' || treeData.length < 0) {
      return '数据格式错误';
    }
    if (treeData && treeData.length > 0) {
      return (
        <div key={`${key}-next-parent`} className="hui-tree-parent-node">
          {this.renderTreeItems(treeData)}
        </div>
      );
    } else {
      return (
        <div className="hui-tree__nodata">{emptyText}</div>
      )
    }
  };

  renderTreeItems = (treeItems) => {
    return treeItems.map((item) => {
      return this.treeItem(item)
    });
  };

  treeItem = (item) => {
    let { multiple, highlightCurrent, renderOptions } = this.props;
    let {__key__, __show__ = true, __open__, __checked__, __half__, __disabled__, children = [], __level__, title} = item;
    return !__show__ || item.__checked__ === undefined ? null : (
      <div key={`tree-node-${__key__}`} style={{'paddingLeft': `${__level__ * 10}px`}} className={this.classname('hui-tree-child-node', {'tree-checked': __checked__ && highlightCurrent})} >
        <span className={this.classname('tree-btn-folder', {'tree-btn-hide': children.length === 0, 'tree-btn-open': __open__})} onClick={() => this.toggleChildren(__key__, {__open__: !__open__})}>▶</span>
        {
          multiple && <Checkbox indeterminate={__half__} checked={__checked__} disabled={__disabled__} onChange={(val) => this.multipleChange(val, __key__)} />
        }
        {/* <span className="tree-node-title" onClick={() => this.multipleChange({checked: !__checked__}, __key__)} title={title}>{title}</span> */}
        <span className="tree-node-title" onClick={() => this.titleClickHandler(item)} title={title}>{title}</span>
        {
          renderOptions && renderOptions(item)
        }
        {
          __open__ && children.length > 0 && this.renderTree(children, __key__)
        }
      </div>
    );
  };

  // 点击节点内容函数执行
  titleClickHandler = (item) => {
    const {__key__, __open__, __checked__} = item;
    const {expandOnClickNode} = this.props;
    if (expandOnClickNode) {
      this.toggleChildren(__key__, {__open__: !__open__})
    } else {
      this.multipleChange({checked: !__checked__}, __key__)
    }
    
  }

  filterCheckedItems = () => {
    let { onSelect, merge = true } = this.props;
    let { treeDataTile } = this.state;
    let dataKeys = Object.keys(treeDataTile);
    let checkedItems = [];
    let childrenKeys = [];
    for (let key of dataKeys) {
      if (childrenKeys.includes(key) && merge) {
        continue;
      }
      let item = treeDataTile[key];
      let { __checked__, children = [] } = item;
      if (this.childrenAllChecked(children, true) === checkEnum.all) {
        childrenKeys = childrenKeys.concat(this.getChildrenKeys(children));
      }
      if (__checked__) {
        let nextItem = this.handleCallBackData(cloneDeep(item));
        checkedItems.push(nextItem);
      }
    }
    onSelect && onSelect(checkedItems);
  };

  getChildrenKeys = (data = [], keys = []) => {
    for (let item of data) {
      let {__key__, children = []} = item;
      keys.push(__key__);
      if (children.length > 0) {
        this.getChildrenKeys(children, keys);
      }
    }
    return keys;
  };

  /**
   * 多选或者单选title
   * @param checked
   * @param key
   */
  multipleChange = (checked, key) => {
    let { multiple, onItemClick, onItemChecked} = this.props;
    let { treeData, treeDataTile } = this.state;
    if (typeof onItemClick === 'function') {
      let currItem = cloneDeep(treeDataTile[key]);
      currItem = this.handleCallBackData(currItem);
      onItemClick(currItem);
    }
    if (typeof onItemChecked === 'function' && checked) {
      let currItem = cloneDeep(treeDataTile[key]);
      currItem = this.handleCallBackData(currItem);
      onItemChecked(currItem);
    }
    if (!multiple) {
      this.changeTreeDataChecked({selKey: key, data: treeDataTile});
    } else {
      this.changeTreeDataTile({selKey: key, data: treeDataTile, props:{__checked__: checked}});
    }
    this.setState({
      treeData,
      treeDataTile,
    }, () => {
      this.filterCheckedItems();
    });
  };

  handleCallBackData = (currItem = {}) => {
    delete currItem['children'];
    delete currItem['__checked__'];
    delete currItem['__half__'];
    delete currItem['__parent__'];
    delete currItem['__key__'];
    delete currItem['__open__'];
    delete currItem['__show__'];
    return currItem;
  };

  /**
   * 展开关闭下级节点
   * @param key
   * @param props
   */
  toggleChildren = (key, props) => {
    let { treeDataTile } = this.state;
    Object.assign(treeDataTile[key], props);
    this.setState({
      treeDataTile
    });
  };

  /**
   * 展开，选择状态修改
   * @param selKey
   * @param data
   * @param props
   * @returns {*}
   */
  changeTreeDataTile = ({selKey, data, props}) => {
    let dataKeys = Object.keys(data);
    let { __checked__ } = props;
    for (let key of dataKeys) {
      if (key === selKey) {
        let item = data[key];
        item.__checked__ = __checked__;
        let { children = [] } = item;
        this.changeChildrenNodesChecked(children, __checked__);
        this.judgeCurrParentChecked(data, key);
      }
    }
  };

  /**
   * 选择状态修改，单选时反选其他节点
   * @param selKey
   * @param data
   * @returns {*}
   */
  changeTreeDataChecked = ({selKey, data}) => {
    let dataKeys = Object.keys(data);
    for (let key of dataKeys) {
      Object.assign(data[key], { __checked__: selKey === key, __half__: false });
    }
  };

  /**
   *
   * @param data
   * @param checked
   */
  changeChildrenNodesChecked = (data, checked) => {
    for (let itemChild of data) {
      itemChild.__checked__ = checked;
      itemChild.__half__ = false;
      let { children = [] } = itemChild;
      if (children.length > 0) {
        this.changeChildrenNodesChecked(children, checked);
      }
    }
  };

  /**
   * 判断当前父级节点是否选中
   * @param data
   * @param selKey
   * @returns {*}
   */
  judgeCurrParentChecked = (data, selKey) => {
    let dataKeys = Object.keys(data);
    for (let key of dataKeys) {
      if (key === selKey) {
        let item = data[key];
        let { __checked__, children = [], __parent__ } = item;
        let checked = this.childrenAllChecked(children, __checked__);
        Object.assign(item, {__checked__: checked === checkEnum.all, __half__: checked === checkEnum.part});
        __parent__ !== '0' && this.judgeCurrParentChecked(data, __parent__);
      }
    }
  };

  /**
   * 判断父级节点是否选中
   * @param data
   * @returns {*}
   */
  judgeParentChecked = (data) => {
    let dataKeys = Object.keys(data).reverse();
    for (let key of dataKeys) {
      let item = data[key];
      let { __checked__, children = [] } = item;
      let checked = this.childrenAllChecked(children, __checked__);
      Object.assign(item, {__checked__: checked === checkEnum.all, __half__: checked === checkEnum.part});
      // __parent__ !== '0' && this.judgeParentChecked(data, __parent__);
    }
  };

  /**
   * 判断当前子节点是否全选中
   * @param data
   * @param checked
   * @returns {string}
   */
  childrenAllChecked = (data = [], checked) => {
    let allLen = data.length;
    if (allLen === 0) {
      return checked ? checkEnum.all:checkEnum.none;
    }
    let checkedLen = 0;
    let halfLen = 0;
    for (let item of data) {
      let {__checked__, __half__} = item;
      if (__checked__) {
        checkedLen ++;
      }
      if (__half__) {
        halfLen ++;
      }
    }
    if (checkedLen === 0 && allLen > 0 && halfLen === 0) {
      return checkEnum.none;
    } else if (checkedLen > 0 && checkedLen === allLen) {
      return checkEnum.all;
    } else {
      return checkEnum.part;
    }
  };

  /**
   * 模糊匹配
   * @param value
   */
  handleChange = (value) => {
    this.filterTreeData(value);
  };

  /**
   * 条件过滤
   * @param value
   */
  filterTreeData = (value) => {
    let { treeDataTile } = this.state;
    let { filterNodeMethod } = this.props;
    let dataKeys = Object.keys(treeDataTile).reverse();// 从子节点开始匹配
    let matchCount = 0;
    for (let key of dataKeys) {
      let item = treeDataTile[key];
      let { title, children = [] } = item;
      if (typeof filterNodeMethod === 'function') {
        item.__show__ = filterNodeMethod({title, value})
      } else {
        item.__show__ = title.indexOf(value) !== -1;
      }
      if (children.length > 0) {
        item.__show__ = this.childrenNodeShow(children);
      }
      if (item.__show__) {
        matchCount ++;
      }
    }
    this.setState({
      treeDataTile,
      keyword: value,
      filterEmpty: matchCount === 0 && String(value || '')
    });
  };

  /**
   * 子节点是否匹配
   * @param data
   * @returns {boolean}
   */
  childrenNodeShow = (data) => {
    for (let item of data) {
      let { __show__ } = item;
      if (__show__) {
        return true;
      }
    }
    return false;
  };

  render () {
    let { treeData, keyword, filterEmpty } = this.state;
    let { showQuery = true } = this.props;
    return (
      <div className={`hui-tree ${showQuery ? 'query-spacing':''}`}>
        {
          showQuery && (
            <div className="tree-search-bar" >
              <Input onChange={this.handleChange} value={keyword} placeholder="支持关键字搜索" style={{'width': '100%'}}/>
            </div>
          )
        }
        {this.renderTree(treeData)}
        {
          filterEmpty && (
            <div className="hui-tree-empty">
              <p>{"没有数据"}}</p>
            </div>
          )
        }
      </div>
    )
  }
}

Tree.propTypes = {
  data: PropType.array,
  options: PropType.object,
  emptyText: PropType.string,
  showQuery: PropType.bool,
  highlightCurrent: PropType.bool,
  defaultExpandAll: PropType.bool,
  filterNodeMethod: PropType.func,
  expandOnClickNode: PropType.bool,
  renderOptions: PropType.func,
}

Tree.defaultProps = {
  showQuery: false,
  options: {
    title: 'title',
    children: 'children'
  },
  emptyText: '没有数据哦～',
  highlightCurrent: false,
  defaultExpandAll: false,
  expandOnClickNode: false,
  renderOptions: (data) => {
    return (
      <span style={{float: 'right', marginRight: '20px'}}>
        <Button size="mini" plain>Append</Button>
        <Button size="mini" plain>Delete</Button>
      </span>
    )
  }
}