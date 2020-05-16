import React from 'react';
import {Component, PropTypes} from '../../libs/index';
import {Resizable} from 'react-resizable';
import Checkbox from '../checkbox/index';
import Input from '../input/index';
import Loading from '../loading/index';
import Button from '../button/index';
import Popover from '../popover/index';
import InfiniteScroll from './infiniteScroll/index';
import {isEqual, debounce, cloneDeep} from 'lodash';
import {getScrollbarWidth, isSameJSON, createUniqueId} from './utils';
import 'react-resizable/css/styles.css';
import Icon from '../icon';
import i18n from '../i18n';
import './Table.scss';

const debounceOptions = {
  delay: 100,
  options: {
    leading: false,
    trailing: true,
  }
}
// 占位符
const HOLD_CELL_KEY = 'cell_placeholder';
const EXPAND_CELL = 'expand_cell';
const CUSTOM_TABLE_KEY = `abc_custom_table_key`;
const TABLE_VERSION = 'v1.0.0';

const stopBubble = (e) => {
  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();
}

export default class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      scrollHeight: props.scroll.y,
      dataSource: [],
      dataStart: 0,
      dataEnd: Math.ceil(scroll.y / props.rowHeight) + 15,
      tableWidth: '100%',
      dragLineLeft: 0,
      // 行操作栏偏移量
      actionBarOffset: -1000,
      // 粘滞左侧和右侧
      fixedLeftLast: false,
      fixedRightFirst: false,
      // 是否显示自定义过滤表头
      isPopoverVisible: false,
      // 是否收起操作bar
      isShowActions: true,
      // 是否全选
      isCheckedAll: false
    }
    // 表格唯一id
    this.tableUniqueId = props.tableUniqueId || createUniqueId();
    // 缓存表头信息
    this.columns = cloneDeep(props.columns);
    // 行高
    this.rowHeight = props.rowHeight;
    // 表格容器
    this.tableWrapper = React.createRef();
    // 定义滚动区域ref
    this.scrollContainer = React.createRef();
    // 表头区域ref
    this.headerContainer = React.createRef();
    // body列表区域ref
    this.bodyContainer = React.createRef();
    // 滚动条宽度
    this.scrollBarWidth = getScrollbarWidth();
    // 记录横向滚动历史
    this.scrollLeftHistory = 0;
    // 记录当前表格宽度（容器宽度，可视宽度）
    this.tableClientWidth = 0;
    // 记录当前已选择数据
    this.selectedRows = [];

    // 备份表格宽度，占位宽度
    this.backupTableOptions = {
      tableWidth: 0,
      cellPlaceholderWidth: 0
    }
    this.windowResizeHandler = debounce(this.windowResizeHandler, debounceOptions.delay, debounceOptions.options);
  }
  componentWillReceiveProps(nextProps) {
    this.isReceiveProps = true;
    let { columns, dataSource } = this.props;
    let { columns: nextColumns, dataSource: nextDataSource } = nextProps;
    if (!isEqual(dataSource, nextDataSource)) {
      this.handleListKey(nextDataSource.slice());
      this.resizeTableWidth(this.state.columns, nextDataSource.length);
    }
    if (!isSameJSON(columns, nextColumns)) {
      // 备份表格列信息
      this.columns = cloneDeep(nextColumns);
      // 先读取缓存表头信息
      nextColumns = this.getCustomColTable(cloneDeep(nextColumns));
      // 初始化表格列信息
      this.initTableColumn(cloneDeep(nextColumns), () => {
        // 初始化检查固定列状态
        this.initFixedColState();
      });
    }
  }
  shouldComponentUpdate(nextprops) {
    if (this.isReceiveProps) {
      this.isReceiveProps = false;
      return !isEqual(nextprops, this.props) || !!nextprops.forceRender;
    }
    return true;
  }
  componentDidMount() {
    setTimeout(() => {
      let {clientWidth} = this.scrollContainer.current;
      this.tableClientWidth = clientWidth;
      let columns = this.getCustomColTable(this.props.columns);
      // 初始化表格宽度
      this.initTableColumn(cloneDeep(columns), () => {
        // 初始化检查固定列状态
        this.initFixedColState();
        // 添加key
        this.handleListKey(this.props.dataSource.slice());
      })
      window.addEventListener('resize', this.windowResizeHandler, false);
    }, 50);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.windowResizeHandler, false);
  }

  initTableColumn = (columns, callback) => {
    let {rowSelection, expandable, dataSource} = this.props;
    rowSelection && (columns = this.addSelectCell(columns, rowSelection));
    expandable && (columns = thia.addExpandCell(columns, expandable));
    columns = this.addCellPlaceholder(columns);
    let initTableWidth = 0;
    const tableRealWidth = this.tableClientWidth - this.scrollBarWidth - 
      (rowSelection ? columns.filter(({key}) => key === 'checkbox' || key === 'radio')[0].width : 0) - 
      (expandable ? columns.filter(({key}) => key === EXPAND_CELL)[0].width : 0);
    columns.forEach((col, index) => {
      let {width = 150, checked} = col;
      if (String(width).indexOf('%') !== -1) {
        width = parseInt((parseFloat(width / 100) * tableRealWidth));
      }
      col.width = width;
      col.__w_index__ = index;
      checked === true && (initTableWidth += width);
    });
    let diffValue = 0;
    // 表格宽度大于表头宽度，占位列补位
    if (this.tableClientWidth > initTableWidth) {
      let scrollBarWidth = this.judgeParallelScroll(dataSource.length) ? this.scrollBarWidth : 0;
      diffValue = this.tableClientWidth - initTableWidth - scrollBarWidth;
      let colPlaceholder = columns.filter(item => item.key === HOLD_CELL_KEY)[0];
      colPlaceholder.width = diffValue;
      initTableWidth = this.tableClientWidth - scrollBarWidth;
    }
    this.backupTableDatas(initTableWidth, diffValue);
    this.setState({
      tableWidth: initTableWidth,
      columns,
    }, () => {
      callback()
    })
  }

  // 初始化检查是否有横向滚动条
  initFixedColState = () => {
    let { scrollLeft, scrollWidth, clientWidth } = this.scrollContainer.current;
    if (scrollLeft < scrollWidth - clientWidth) {
      this.setState({
        fixedRightFirst: true,
        fixedLeftLast: false,
        actionBarOffset: scrollWidth - clientWidth - scrollLeft
      });
    } else {
      this.setState({
        actionBarOffset: scrollWidth - clientWidth - scrollLeft
      });
    }
  };

  addSelectCell = (columns, rowSelection) => {
    let {type = 'checkbox', fixed = true, width = 50} = rowSelection;
    columns.unshift({
      key: type,
      width,
      fixed: fixed === true ? 'left' : undefined,
      checked: true,
      disabled: true,
    });
    return columns;
  }

  addExpandCell = (columns, expandable) => {
    let { width = 50, fixed = true } = expandable;
    columns.unshift({
      key: EXPAND_CELL,
      width,
      fixed: fixed === true ? 'left' : undefined,
      checked: true,
      disabled: true,
    });
    return columns;
  }

  addCellPlaceholder = (columns) => {
    let cell_placeholder = {
      key: HOLD_CELL_KEY,
      width: 0,
      checked: true,
      disabled: true
    };
    for (let i = columns.length - 1; i >= 0; i--) {
      let { fixed } = columns[i];
      let { fixed: preFixed } = columns[i - 1] || {};
      if (fixed !== 'right') {
        columns.splice(i + 1, 0, cell_placeholder);
        break;
      } else if (fixed === 'right' && preFixed !== 'right') {
        columns.splice(i, 0, cell_placeholder);
        break;
      }
    }
    return columns;
  }

  windowResizeHandler = (e) => {
    let {current} = this.scrollContainer;
    if (!current) {
      return;
    }
    const {columns} = this.state;
    const {clientWidth: changedClientWidth} = current;
    let scrollBarWidth = this.judgeParallelScroll(this.state.dataSource.length) ? this.scrollBarWidth : 0;
    // 处理纵向滚动条差值
    changedClientWidth += scrollBarWidth;
    let diffWidth = changedClientWidth - this.tableClientWidth;
    let {tableWidth, cellPlaceholderWidth: holdWidth} = this.backupTableOptions;
    if (diffWidth > 0) {
      if (this.tableClientWidth - scrollBarWidth + diffWidth + tableWidth) {
        diffWidth = this.tableClientWidth - scrollBarWidth + diffWidth + tableWidth;
        tableWidth += diffWidth;
        holdWidth += diffWidth
      } else {
        return;
      }
    } else if (diffWidth < 0) {
      diffWidth = Math.abs(diffWidth);
      if (holdWidth !== 0) {
        if (diffWidth <= holdWidth) {
          tableWidth -= diffWidth;
          holdWidth -= diffWidth;
        } else {
          // 注意，优先计算tableWidth, 顺序不可颠倒
          tableWidth -= holdWidth;
          holdWidth = 0;
        }
      } else {
        return;
      }
    } else {
      return;
    }
    // 处理表头、记录变化后值
    this.tableClientWidth = changedClientWidth;
    columns.filter(item => item.key === HOLD_CELL_KEY)[0].width = holdWidth;
    this.backupTableDatas(tableWidth, holdWidth);
    this.setState({
      columns,
      tableWidth,
      isPopoverVisible: false,
    });
  }
  
  // 判断是否有纵向滚动条
  judgeParallelScroll = (datalen) => {
    const {current} = this.scrollContainer;
    let rowHeight = this.rowHeight;
    return current.clientHeight && datalen > Math.floor((this.props.scroll.y) / rowHeight);
  }
  /**
   * @description: 备份表格宽度相关数据
   */
  backupTableDatas = (tableWidth, holdWidth) => {
    let { backupTableOptions } = this;
    backupTableOptions.tableWidth = tableWidth;
    backupTableOptions.cellPlaceholderWidth = holdWidth;
  }
  /**
   * 为数据添加自有属性
   */
  handleListKey = (nextdataSource) => {
    const {dataSource, isCheckedAll} = this.state;
    const {scroll, rowHeight} = this.props;
    let needKeyList = nextdataSource.slice();
    needKeyList.forEach((data, index) => {
      data.__t_id__ = createUniqueId();
      data.__w_index__ = index;
      data.__hover__ = false;
      data.__expanded__ = false;
    })
    isCheckedAll = this.judgeAllChecked(dataSource);
    // 滚动条重置
    this.scrollContainer.current.scrollTop = 0;
    this.setState({
      dataSource: needKeyList,
      dataEnd: Math.ceil(scroll.y / rowHeight) + 15,
      isCheckedAll
    });
  }

  judgeAllChecked = (dataSource) => {
    if (!dataSource.length) return false;
    return dataSource.every((item) => !item.disabled && item.checked);
  }

  // 过滤表头内容
  filterCustomSearch = (columns, customSearchKey) => {
    return columns.filter(({title = '', key}) => {
      return key !== 'checkbox' && key !== 'radio' && key !== EXPAND_CELL && key !== HOLD_CELL_KEY && title.indexOf(customSearchKey) !== -1;
    })
  }

  // 自定义表头输入框
  onCustomSearchChange = (value) => {
    this.setState({
      customSearchKey: value,
    })
  }

  // 渲染自定义表头
  renderCustomHeader = () => {
    const {isPopoverVisible, columns, customSearchKey = ''} = this.state;
    let customColumns = this.filterCustomSearch(columns, customSearchKey);
    return (
      <Popover
        trigger="click"
        placement="bottomRight"
        content={
          <div className="hui-table-filter">
            <div className="hui-table-filter__table">
              <div className="hui-table-filter__search">
                <div className="search-container">
                  <Input 
                    value={customSearchKey}
                    size="small"
                    onChange={this.onCustomSearchChange}
                  />
                  <Button className="search-icn" icon="query" />
                </div>
              </div>
              <div className="hui-table-filter__list">
                {
                  customColumns.length > 0 ? customColumns.map((item) => {
                    const {title, key, disabled, checked, __w_index__: index} = item;
                    return (
                      <div key={key} className="hui-table-filter__list-item">
                        <div className="item-left" title={title} onClick={e => {this.onCustomClickHandler(e, index)}}>
                          <label>
                            <Checkbox 
                              disabled={disabled}
                              checked={checked}
                            />
                          </label>
                          {title}
                        </div>
                        <div className="item-right"></div>
                      </div>
                    )
                  }) : (
                    <div className="hui-table-filter__list-noData">
                      <p>暂无搜索结果～</p>
                    </div>
                  )
                }
              </div>
            </div>
            <div className="hui-table-filter__btns">
              <Button 
                type="text"
                size="small"
                onClick={this.onCustomResetHandler}
              >
                恢复默认
              </Button>
            </div>
          </div>
        }
        visible={isPopoverVisible}
        visibleChange={this.visibleChangeHandler}
      >
        <Button style={{'padding': '0px'}} icon="more" />
      </Popover>
    )
  }

  // 恢复默认
  onCustomResetHandler = () => {
    let columns = cloneDeep(this.columns);
    this.clearCustomColTable();
    this.initTableColumn(columns, () => {
      this.initFixedColState();
    });
    this.setState({
      isPopoverVisible: false,
    })
  }

  // 自定义表头回调
  visibleChangeHandler = (visible) => {
    this.setState({
      isPopoverVisible: visible,
      customSearchKey: ''
    })
  }

  // 渲染表头
  renderHeader = (columns) => {
    const {tableWidth, isCheckedAll} = this.state;
    const {columnsDrag = true} = this.props;
    return (
      <div className="hui-table-header" style={{
        width: tableWidth + this.scrollBarWidth
      }}>
        {
          columns.map(({item, index}) => {
            const {title, key, width, fixed, min = 100, checked} = item;
            if (!checked) return null;
            const {wrapperClass, wrapperStyle, contentClass} = this.getTableColClass(item, columns, index);
            let content = (
              <div className={this.classnames(contentClass)} title={title}>
                {title}
              </div>
            );
            // 占位列
            if (key === HOLD_CELL_KEY) {
              return (
                <div key={key} className={this.classnames(wrapperClass)} style={this.styles(wrapperStyle)}></div>
              )
            }
            // 选择列
            if (key === 'checkbox') {
              content = (
                <div className={this.classnames(wrapperClass)}>
                  <Checkbox checked={isCheckedAll} indeterminate={this.selectedRows.length > 0 && !isCheckedAll} onClick={this.onAllClickHandler}/>
                </div>
              )
            }
            if (!columnsDrag || fixed) {
              fixed && (wrapperStyle[fixed] = this.computeFixedLocation(fixed, columns, index, 'header'))
              return (
                <div key={key} className={this.classnames(contentClass)} style={wrapperStyle}>
                  { content }
                </div>
              )
            }
            return (
              <Resizable
                key={key}
                className={this.classnames(wrapperClass)}
                axis='x'
                minConstraints={[min]}
                height={0}
                width={width}
                onResizeStop={this.onResizeStop(index)}
                onResize={this.onResize(index)}
              >
                <div style={wrapperStyle}>
                  {content}
                </div>
              </Resizable>
            )
          })
        }
      </div>
    )
  }

  toggleExpand = (e, row) => {
    const {__w_index__: index, __expanded__} = row;
    const {dataSource} = this.state;
    dataSource.forEach((item) => {
      item.__expanded__ = false;
    })
    dataSource[index].__expanded__ = !__expanded__;
    this.setState({
      dataSource,
    });
    stopBubble(e);
  }

  // 渲染表体
  renderBody = (columns) => {
    const {dataSource, dataStart, dataEnd, tableWidth} = this.state;
    let renderData = dataSource.slice(dataStart, dataEnd);
    let expandCollect = renderData.filter(({__expanded__}) => __expanded__);
    let expandIndex = expandCollect.length > 0 ? expandCollect[0].__w_index__ : undefined;
    return (
      <div style={{width: tableWidth}}>
        <InfiniteScroll
          wrapper={this.scrollContainer}
          dataLength={dataSource.length}
          onCursorChange={this.getDataCursor}
          onScrollChange={this.onScrollChange}
          tableUniqueId={this.tableUniqueId}
          expandIndex={expandIndex}
          dataEnd={dataEnd}
        >
          {
            renderData.map((item) => {
              const {__t_id__, __w_index__, __hover__, __expanded__, checked, disabled} = item;
              return (
                <React.Fragment key={__t_id__}>
                  <div
                    className={this.classnames('hui-table-row', {
                      'is-selected': checked
                    })}
                    data-row-key={__w_index__}
                    onMouseEnter={(e) => {
                      this.onRowMouseHandler(e, item)
                    }}
                    onMouseLeave={e => {
                      this.onRowMouseHandler(e, item);
                    }}
                    onClick={e => {
                      this.onRowClickHandler(e, item);
                    }}
                  >
                    {
                      columns.map((col, index) => {
                        const {key, checked: colChecked, fixed, render} = col;
                        if (!colChecked) {
                          return;
                        }
                        let {wrapperClass, wrapperStyle, contentClass} = this.getTableColClass(col, columns, index);
                        let content = (
                          <span className={this.classnames(contentClass)} title={item[key]} >
                            {item[key]}
                          </span>
                        )
                        if (render && typeof render === 'function') {
                          content = render(item, __w_index__);
                          if (typeof content === 'string') {
                            content = (
                              <span className={this.classnames(contentClass)} title={content}>
                                {content}
                              </span>
                            )
                          } else {
                            wrapperClass[`hui-table-cell-padding-none`] = true;
                          }
                        }
                        if (key === 'checkbox' || key === 'radio') {
                          content = (
                            <span className={this.classnames(contentClass)}>
                              <Checkbox checked={checked} disabled={disabled} />
                            </span>
                          )
                        }
                        if (key === EXPAND_CELL) {
                          const iconClass = {
                            ['fold_icon']: __expanded__
                          };
                          content = (
                            <Button icon="unfold" className={this.classnames(iconClass)} onClick={(e) => this.toggleExpand(e, item) } />
                          )
                        }
                        fixed && (wrapperStyle[fixed] = this.computeFixedLocation(fixed, columns, index));
                        return (
                          <div
                            key={key}
                            className={this.classnames(wrapperClass)}
                            style={wrapperStyle}
                          >
                            { key !== HOLD_CELL_KEY && content}
                          </div>
                        )
                      })
                    }
                    {__hover__ && this.renderBodyActions(item, __w_index__)}
                  </div>
                  {__expanded__ && this.renderExpandRow(item, __w_index__)}
                </React.Fragment>
              )
            })
          }
          
        </InfiniteScroll>
      </div>
    )
  }

  onClickFoldHandler = (e) => {
    this.setState({
      isShowActions: !this.state.isShowActions
    });
    stopBubble(e);
  }

  // 渲染行操作
  renderBodyActions = (item, index) => {
    const {actionBarOffset, isShowActions} = this.state;
    const {hoverContent} = this.props.rowHover;
    const {checked, __hover__} = item;
    let classNames = {
      'hui-table-hover-action-content': true,
      'hide-content': !isShowActions
    }
    return (
      <div
        className={this.classnames('hui-table-hover-action', {
          'row-selected': checked
        })}
        style={{
          'transform': `translateX(-${actionBarOffset + 10}px)`,
          'display': __hover__ ? 'block' : 'none' 
        }}
      >
        <div className={this.classnames(classNames)}>
          {
            hoverContent(item, index)
          }
        </div>
        <div className="hui-table-hover-action-fold">
          <Button
            onClick={this.onClickFoldHandler}
            title={isShowActions ? '收起' : '展开'}
          >
            <Icon name={isShowActions ? 'angle-double-right' : 'angle-double-left'}/>
          </Button>
        </div>
      </div>
    )
  }

  // 渲染扩展行
  renderExpandRow = (item, index) => {
    const { expandedRowRender } = this.props.expandable || {};
    if (typeof expandedRowRender !== 'function') {
      return null;
    }
    return (
      <div className="hui-table-expand" expand-row-key={`${this.tableUniqueId}-expand`}>
        {expandedRowRender(item, index)}
      </div>
    )
  }

  // 行enter事件

  onRowMouseHandler = (event, item) => {
    const {dataSource} = this.state;
    const {rowHover} = this.props;
    if (!rowHover) return;
    const { onRowHover } = this.props;
    let {__w_index__} = item;
    dataSource[__w_index__].__hover__ = event.type === 'mouseenter';
    if (event.type === 'mouseenter') {
      typeof onRowHover == 'function' && onRowHover(__w_index__, item);
    }
    this.setState({
      dataSource
    });
    stopBubble(event);
  }

  onRowClickHandler = (event, item) => {
    let { __w_index__: index, checked, disabled } = item;
    let { rowSelection } = this.props;
    if (!rowSelection || disabled) {
      return;
    }
    let { dataSource, isCheckedAll } = this.state;
    let { type, onSelect } = rowSelection;
    if (type === 'radio') {
      if (checked) {
        return;
      }
      this.selectedRows = [];
      dataSource.forEach(item => {
        item.checked = false;
      });
      dataSource[index].checked = !checked;
      this.selectedRows.push(dataSource[index]);
      isCheckedAll = false;
    } else {
      dataSource[index].checked = !checked;
      if (!checked) {
        this.selectedRows.push(dataSource[index]);
      } else {
        this.selectedRows = this.selectedRows.filter(item => item.__w_index__ !== index);
      }
      isCheckedAll = this.judgeAllChecked(dataSource);
    }
    this.setState({
      dataSource,
      isCheckedAll
    }, () => {
      typeof onSelect === 'function' && onSelect(row, this.selectedRows, !checked, event);
    });
  }

  // 获取游标位置
  getDataCursor = ({dataStart, dataEnd}) => {
    this.setState({
      dataStart,
      dataEnd
    })
  }

  onScrollChange = (event) => {
    const {scrollTop, scrollLeft, scrollWidth, clientWidth} = event.srcElement;
    const {isScrollTop} = this.state;
    if (scrollLeft !== this.scrollLeftHistory) {
      this.headerContainer.current.scrollLeft = scrollLeft;
      this.setState({
        fixedLeftLast: scrollLeft > 0,
        fixedRightFirst: scrollLeft < scrollWidth - clientWidth,
        actionBarOffset: scrollWidth - clientWidth - scrollLeft
      })
    }
    if (scrollTop > 0 && !isScrollTop) {
      this.setState({
        isScrollTop: true,
      })
    } else if (scrollTop === 0 && isScrollTop) {
      this.setState({
        isScrollTop: false,
      })
    }
  }

  // 获取表头header的class
  getTableColClass = (item, columns, index) => {
    const {width, style, align: textAlign, fixed, key} = item;
    let wrapperStyle = {
      width,
      style,
      textAlign
    }
    // 内容区容器样式
    let contentClass = {
      'hui-table-cell-content': true,
      'hui-table-select-column': key === 'checkbox' || key === 'radio'
    }

    // 元素完整样式
    let wrapperClass = {
      'hui-table-cell': true,
      'hui-table-bordered': this.props.bordered === true,
      'hui-table-hold-cell': key === HOLD_CELL_KEY,
      'hui-table-expand-cell': key === EXPAND_CELL,
      'hui-table-cell-fixed-left': fixed === 'left' && (index === 0 || this.isFixedCol(fixed, columns, index)),
      'hui-table-cell-fixed-left-last': fixed === 'left' && ((columns[index + 1] || {}).fixed !== 'left' || !(columns[index + 1] || {}).checked),
      'hui-table-cell-fixed-right': fixed === 'right' && (index === columns.length - 1 || this.isFixedCol(fixed, columns, index)),
      'hui-table-cell-fixed-right-last': fixed === 'right' && ((columns[index - 1] || {}).fixed !== 'right' || !(columns[index - 1] || {}).checked),
    }  
    return {
      wrapperClass,
      wrapperStyle,
      contentClass,
    }
  }

  // 判断是否为fixed固定
  isFixedCol = (fixed, columns, index) => {
    if (fixed === 'left') {
      for (let i = index; i >= 0; i--) {
        let {fixed} = columns[i];
        if (fixed !== 'left') {
          return false;
        }
      }
      return true;
    }
    if (fixed === 'right') {
      for (let i = index; i < columns.length; i++) {
        let {fixed} = columns[i];
        if (fixed !== 'right') {
          return false;
        }
      }
      return true
    }
    return false;
  }

  // 计算固定列位置
  computeFixedLocation = (fixed, columns, index, type) => {
    if (fixed === 'left') {
      let filterFixed = columns.filter(({fixed}, colIndex) => {
        return fixed === 'left' && (colIndex == 0 || this.isFixedCol(fixed, columns, colIndex));
      })
      if (index < filterFixed.length) {
        let left = 0;
        for (let i = index - 1; i >= 0; i--) {
          const {checked, width} = filterFixed[i];
          checked && (left += width);
        }
        return left;
      }
    }
    if (fixed === 'right') {
      let filterFixed = columns.filter(({fixed}, colIndex) => {
        return fixed === 'right' && (colIndex == columns.length - 1 || this.isFixedCol(fixed, columns, colIndex));
      })
      if (index >= columns.length - filterFixed.length) {
        let right = type === 'header' ? this.judgeParallelScroll(this.state.dataSource.length) ? this.scrollBarWidth : 0 : 0;
        for (let i = index + 1, j = filterFixed.length - 1; i < columns.length; i++, j--) {
          const {checked, width} = filterFixed[j];
          checked && (right += width);
        }
        return right;
      }
    }
  }

  // resizestop
  onResizeStop = (index) => (e, {element, size, handle}) => {
    let { columns, dataSource } = this.state;
    let {scrollLeft, scrollWidth, clientWidth: scrollClientWidth} = this.scrollContainer.current;
    let tableContentWidth = 0;
    let holdColIndex;
    columns.forEach(({width, checked, key}, index) => {
      if (key === HOLD_CELL_KEY) {
        holdColIndex = index;
      } else if(checked) {
        tableContentWidth += width;
      }
    });
    // 滚动条宽度
    let scrollBarWidth = this.judgeParallelScroll(dataSource.length) ? this.scrollBarWidth : 0;
    // 当前列历史宽度
    let hisColWidth = columns[index].width;
    // 表格可视宽度（不含滚动条）
    let tableClientWidth = this.tableClientWidth - scrollBarWidth;
    // 当前列拖拽后宽度
    let changedColWidth = Number(size.width.toFixed(2));
    // 占位列宽度
    let holdColWidth = columns[holdColIndex].width;
    let tableWidth = 0;
    let diffValue = hisColWidth - changedColWidth;
    if (diffValue === 0) {
      return;
    }
    if (diffValue > tableContentWidth - tableClientWidth) {
      if (tableContentWidth < tableClientWidth) {
        holdColWidth = holdColWidth - (changedColWidth - hisColWidth);
      } else {
        holdColWidth = tableClientWidth - (tableContentWidth - diffValue);
      }
    } else {
      holdColWidth = 0;
    }
    tableWidth = tableContentWidth + holdColWidth + changedColWidth - hisColWidth;
    columns[index].width = changedColWidth;
    columns[holdColIndex].width = holdColWidth;
    this.backupTableDatas(tableWidth, holdColWidth);
    this.saveCustomColTable(columns);
    this.setState({
      columns,
      tableWidth,
      actionBarOffset: tableWidth - scrollClientWidth - scrollLeft,
      fixedRightFirst: tableWidth - scrollClientWidth !== 0 && scrollLeft < tableWidth - scrollClientWidth,
      dragging: false,
    })
  }

  // resize事件
  onResize = (index) =>  (e, { element, size, handle }) => {
    const {columns} = this.state;
    if ((columns[index].min || 100) === size.width) {
      return;
    }
    let clientX = e.clientX;
    let left = clientX - (document.documentElement.clientWidth - this.tableWrapper.current.client) / 2;
    this.setState({
      dragLineLeft: left,
      dragging: true,
    })
  }

  // 自定义表头点击事件
  onCustomClickHandler = (e, index) => {
    const {columns, dataSource} = this.state;
    const { scrollLeft, clientWidth: scrollClientWidth } = this.scrollContainer.current;
    let currentCol = columns[index];
    let {checked, width: currentColWidth, disabled} = currentCol;
    let tableContentWidth = 0;
    let holdColIndex;
    if (disabled) { return; }
    columns.forEach((column, index) => {
      let {width, checked, key} = column;
      if (key === HOLD_CELL_KEY) {
        holdColIndex = index;
      } else if (checked) {
        tableContentWidth += width;
      }
    })
    // 滚动条宽度
    let scrollBarWidth = this.judgeParallelScroll(dataSource.length) ? this.scrollBarWidth : 0;
    // 占位符宽度
    let holdColWidth = columns[holdColIndex].width;
    // 表体可视宽度（不含滚动条）
    let tableClientWidth = this.tableClientWidth - scrollBarWidth;
    let tableWidth = 0;
    if (!checked) {
      if (holdColWidth > currentColWidth) {
        holdColWidth -= currentColWidth;
        tableWidth = tableClientWidth;
      } else {
        holdColWidth = 0;
        tableWidth = tableContentWidth + currentColWidth;
      }
    } else {
      // 隐藏
      if (holdColWidth === 0) {
        if (tableContentWidth - tableClientWidth >= currentColWidth) {
          holdColWidth = 0;
          tableWidth = tableContentWidth - currentColWidth;
        } else {
          holdColWidth = tableClientWidth - (tableContentWidth - currentColWidth);
          tableWidth = tableClientWidth;
        }
      } else {
        holdColWidth += currentColWidth;
        tableWidth = tableClientWidth;
      }
    }
    columns[holdColIndex].width = holdColWidth;
    currentCol.checked = !checked;
    // 备份宽度
    this.backupTableDatas(tableWidth, holdColWidth);
    // 缓存表头信息
    this.saveCustomColTable(columns);
    this.setState({
      columns,
      tableWidth,
      actionBarOffset: tableWidth - scrollClientWidth - scrollLeft,
    });
    stopBubble(e);
  }

  /**
   * @description: 缓存自定义表头列信息
   */
  saveCustomColTable = columns => {
    if (!this.verifyCustomParam()) {
      return;
    }
    columns = columns.filter(({key}) => key !== 'checkbox' && key !== 'radio' && key !== EXPAND_CELL && key !== HOLD_CELL_KEY);
    let localJson = JSON.parse(localStorage.getItem(CUSTOM_TABLE_KEY) || '{}');
    localJson[this.props.tableUniqueId] = {version: TABLE_VERSION, columns};
    localStorage.setItem(CUSTOM_TABLE_KEY, JSON.stringify(localJson));
  }

  /**
   * @description: 清除自定义表头列信息,避免localStorage一直缓存
   */
  clearCustomColTable = () => {
    if (!this.verifyCustomParam()) {
      return;
    }
    let localJson = JSON.parse(localStorage.getItem(CUSTOM_TABLE_KEY) || '{}');
    delete localJson[this.props.tableUniqueId];
    localStorage.setItem(CUSTOM_TABLE_KEY, JSON.stringify(localJson));
  }

  resizeTableWidth = (columns, len) => {
    const {tableWidth} = this.state;
    let isHasScroll = this.judgeParallelScroll(len);
    if (isHasScroll && (tableWidth == this.tableClientWidth)) {
      let cellPlaceholder = columns.filter(({key}) => key === HOLD_CELL_KEY)[0];
      let {width} = cellPlaceholder;
      let diffValue = width - this.scrollBarWidth;
      if (diffValue >= 0) {
        tableWidth = this.tableClientWidth - this.scrollBarWidth;
      } else {
        diffValue = 0;
        tableWidth = this.tableClientWidth - width;
      }
      cellPlaceholder.width = diffValue;
      // 备份宽度
      this.backupTableDatas(tableWidth, diffValue);
      this.setState({
        columns,
        tableWidth
      });
    }
  }

  // 获取自定义表头列信息
  getCustomColTable = (propsColumns) => {
    let localTableCustom = JSON.parse(localStorage.getItem(CUSTOM_TABLE_KEY) || '{}')[this.props.tableUniqueId] || {};
    let { version, columns = [] } = localTableCustom;
    if (!this.verifyCustomParam() || columns.length === 0 || version !== TABLE_VERSION) {
      return propsColumns;
    }
    propsColumns.forEach((col, index) => {
      if (index < propsColumns.length) {
        Object.assign(col, columns[index]);
      }
    });
    return propsColumns;
  }

  // 校验是否缓存表头信息
  verifyCustomParam = () => {
    let { tableUniqueId = false, columnsCache = true } = this.props;
    if (!tableUniqueId || columnsCache !== true) {
      return false;
    }
    return true;
  }

  onAllClickHandler = () => {
    const {dataSource, isCheckedAll} = this.state;
    const {onSelectAll} = this.props.rowSelection;
    dataSource.forEach((item) => {
      !item.disabled && (item.checked = !isCheckedAll)
    })
    this.selectedRows = !isCheckedAll ? cloneDeep(dataSource) : [];
    this.setState({
      isCheckedAll: !isCheckedAll,
      dataSource,
    }, () => {
      onSelectAll && onSelectAll(~isCheckedAll, this.selectedRows);
    })
  }

  // 无匹配数据渲染
  renderNoData = () => {
    const {loading} = this.props;
    if (loading) {
      return null;
    }
    return (
      <div className="hui-table-nodata">
        <img src={noDataImg}></img>
        <p>{i18n.t('hui.table.emptyText')}</p>
      </div>
    )
  }

  // 分页渲染
  renderPagination = () => {
    const {dataSource, pagination = false} = this.props;
    if (dataSource.length > 0 && pagination) {
      const {position = 'bottomRight'} = pagination;
      const placement = position.toLowerCase().replace(/top|bottom/, '');
      return (
        <div className="hui-table-pagination">
          <Pagination
            className={`${prefixCls}-pagination-content-${placement}`}
            {...pagination}
          />
        </div>
      )
    }
    return null;
  }

  render() {
    const {columns, scrollHeight, fixedLeftLast, fixedRightFirst, dragLineLeft, dragging, dataSource, isScrollTop} = this.state;
    const {loading, bordered, columnsFilter = true, pagination = false} = this.props;
    let tableClassNames = {
      'hui-table': true,
      'hui-table--bordered': bordered
    }
    let wrapClassNames = {
      'hui-table-scroll': true,
      'hui-table-ping-left': fixedLeftLast,
      'hui-table-ping-right': fixedRightFirst
    }
    let dragLineClassName = {
      'hui-table-drag-line': true,
      'dragging-show': dragging,
      'dragging-hide': !dragging
    }
    let bodyStyle = {
      maxHeight: scrollHeight
    };
    const topPos = pagination && (pagination.position || '').indexOf('top') !== -1;
    const bottomPos = pagination && (pagination.position || 'bottomRight').indexOf('bottom') !== -1;
    return (
      <Loading loading={loading} text="请求数据中">
        {/* {topPos && this.renderPagination()} */}
        <div className={this.classname(tableClassNames)} style={this.styles()} ref={this.tableWrapper}>
          {
            columnsFilter && <div className={this.classnames("hui-table-filter-column", {
              'header-rolled': isScrollTop
            })}>
              {this.renderCustomHeader()}
            </div>
          }
          <div 
            className={this.classnames(dragLineClassName)}
            style={{transform: `translateX(${dragLineLeft}px)`}}
          />
          <div className={this.classnames(wrapClassNames)}>
            {
              isScrollTop && <div className="hui-table-header-shadow" />
            }
            <div className={this.classnames('hui-table-header', {
              'header-rolled': isScrollTop,
            })}
              ref={this.headerContainer}
            >
              {
                this.renderHeader(columns)
              }
            </div>
            <div 
              className={this.classnames('hui-table-body')}
              style={bodyStyle}
              ref={this.scrollContainer}
            >
              {
                this.renderBody(columns)
              }
            </div>
            {(dataSource.length === 0 && !loading) &&  this.renderNoData()}
          </div>
        </div>
        {/* {bottomPos && this.renderPagination()} */}
      </Loading>
    )
  }
}

Table.propTypes = {
  prefixCls: PropTypes.string,
  tableUniqueId: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    key: PropTypes.string,
    width: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    fixed: PropTypes.oneOf(['left', 'right']),
    align: PropTypes.oneOf(['left', 'center', 'right']),
    render: PropTypes.func
  })),
  dataSource: PropTypes.array,
  loading: PropTypes.bool,
  columnsFilter: PropTypes.bool,
  columnsCache: PropTypes.bool,
  columnsDrag: PropTypes.bool,
  bordered: PropTypes.bool,
  scroll: PropTypes.object,
  rowHover: PropTypes.shape({
    hoverContent: PropTypes.func,
    onRowHover: PropTypes.func
  }),
  rowSelection: PropTypes.shape({
    type: PropTypes.oneOf(['checkbox', 'radio']),
    onSelect: PropTypes.func,
    onSelectAll: PropTypes.func,
    fixed: PropTypes.bool
  }),
  pagination: PropTypes.object
};
  

Table.defaultProps = {
  columns: [],
  dataSource: [],
  scroll: {
    x: 0,
    y: 460
  },
  rowHeight: 40,
};