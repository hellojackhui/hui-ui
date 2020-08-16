import React from 'react';
import {Component, PropType} from 'libs/index';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

export default class InfiniteScroll extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    let { dataEnd = 8 } = props;
    // 当前是否更新
    this.isUpdating = true;
    // 滚动容器
    this.scrollwrapper = props.wrapper;
    // 当前scroll位置
    this.scrollTop = 0;
    // 记录数据索引起始位置
    this.dataStart = 0;
    // 记录最后滚动区域 index
    this.lastIndex = 0;
    // 记录数据索引起始位置
    this.dataStart = 0;
    // 记录数据索引结束位置
    this.dataEnd = dataEnd;
    // 分组数量，TODO可根据高度动态设置
    this.groupNum = 6;
  }
  componentDidMount() {
    let { wrapper } = this.props;
    // 增加滚动监听
    if (typeof window !== `undefined`) {
      this.addScrollListenerHandler(wrapper);
    }
  }

  componentWillReceiveProps(nextProps) {
    let { wrapper } = nextProps;
    if (!isEqual(this.wrapperBackUp, wrapper)) {
      // 增加滚动监听
      this.addScrollListenerHandler(wrapper);
    }
  }

  componentWillUnmount() {
    let { current } = this.props.wrapper;
    current && current.removeEventListener('scroll', this.bindHandlerScroll);
  }

  addScrollListenerHandler = (wrapper) => {
    // 备份 wrapper;
    this.wrapperBackUp = cloneDeep(wrapper);
    const { current } = wrapper;
    current && current.addEventListener('scroll', this.bindHandlerScroll);
  }

  bindHandlerScroll = (event) => {
    const element = event.srcElement;
    const {scrollTop} = element;
    let { rowHeight, expandIndex, onScrollChange, datasLength, tableUniqueId } = this.props;
    let groupHeight = (this.groupNum * rowHeight);
    if(!isNaN(expandIndex)) {
        let { clientHeight: expandHeight } = document.querySelector(`div[expand-row-key=${tableUniqueId}-expand]`) || {};
        let scrollRowNum = Math.floor(scrollTop / rowHeight);
        let expandRowNum = Math.floor(expandHeight / rowHeight);
        if (expandHeight && (datasLength <= this.dataEnd || expandIndex >= this.dataStart && scrollRowNum <= expandIndex + expandRowNum)) {
          groupHeight += expandHeight;
        }
    }
    let currentIndex = Math.floor(scrollTop / groupHeight);
    if(this.scrollTopHistory < scrollTop){
      // 向下滚动
      (currentIndex > 0 && this.lastIndex < currentIndex) && this.onScrollChange(currentIndex, element);
    } else if (this.scrollTopHistory > scrollTop) {
      // 向上滚动
      this.lastIndex > currentIndex && this.onScrollChange(currentIndex, element);
    }
    this.scrollTopHistory = scrollTop;
    // 滚动条 change事件
    typeof onScrollChange === 'function' && onScrollChange(event);
  }

  onScrollChange = (index, current) => {
    let { clientHeight } = current;
    let { rowHeight, onCursorChange } = this.props;
    this.lastIndex = index;
    let dataStart = this.dataStart = index * this.groupNum - 1 < 0 ? 0 : index * this.groupNum - 1;
    let dataEnd = this.dataEnd = dataStart + Math.ceil(clientHeight / rowHeight) + this.groupNum + 3;
    typeof onCursorChange === 'function' && onCursorChange({
      dataStart,
      dataEnd
    });
  }

  render() {
    const { rowHeight, datasLength } = this.props;
    let style = {
      height: rowHeight * datasLength,
      paddingTop: this.dataStart * rowHeight
    }
    return (
      <div style={style}>
        {this.props.children}
      </div>
    );
  }
}

InfiniteScroll.propTypes = {
  rowHeight: PropType.oneOf([PropType.string, PropType.number]), 
  expandIndex: PropType.number, 
  onScrollChange: PropType.func,
  onCursorChange: PropType.func, 
  datasLength: PropType.number, 
  tableUniqueId: PropType.string, 
  wrapper: PropType.any
} 

InfiniteScroll.defaultProps = {
  wrapper: {},
  rowHeight: 40,
  datasLength: 0,
  dataStart: 0
}