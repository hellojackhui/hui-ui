import React from 'react';
import {Component, PropType, View} from '../../libs/index';
import {Resizable} from 'react-resizable';
import Checkbox from '../checkbox/index';
import Input from '../input/index';
import Loading from '../loading/index';
import Button from '../button/index';
import Popover from '../popover/index';
import {isEqual, debounce, cloneDeep} from 'lodash';
import {getScrollbarWidth} from './utils';

const debounceOptions = {
  delay: 100,
  options: {
    leading: false,
    trailing: true,
  }
}
// 占位符
const HOLD_CELL_PLACEHOLDER = 'cell_placeholder';
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
      isCheckAll: false
    }
    // 表格唯一id
    this.tableUniqueId = props.tableUniqueId;
    // 缓存表头信息
    this.cacheColumns = cloneDeep(props.columns);
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
  componentWillReceiveProps(nextprops) {
    this.isReceiveProps = true;
  }
  shouldComponentUpdate(nextprops) {
    if (this.isReceiveProps) {
      this.isReceiveProps = false;
      return isEqual(nextprops, this.props) || nextprops.forceRender;
    }
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
  judgeParallelScroll = (datalen) => {
    const {current} = this.scrollContainer;
    let rowHeight = this.rowHeight;
    return current.clientHeight && datalen > Math.floor((this.props.scroll.y) / rowHeight);
  }
  /**
   * @description: 备份表格宽度相关数据
   * @param {tableWidth, holdWidth}
   * @return:
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
    const {dataSource, isCheckAll} = this.state;
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
      isCheckAll
    });
  }

  judgeAllChecked = (dataSource) => {
    if (!dataSource.length) return false;
    return dataSource.every((data) => !item.disabled && item.checked);
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
        {topPos && this.renderPagination()}
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
            <div className={this.classnames('hui-table-body')}
              ref={this.bodyContainer}
            >
              {
                this.renderBody(columns)
              }
            </div>
            {(dataSource.length === 0 && !loading) &&  this.renderNoData()}
          </div>
        </div>
        {bottomPos && this.renderPagination()}
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