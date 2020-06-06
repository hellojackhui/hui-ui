import React from 'react';
import ReactDOM from 'react-dom';
import ClickOutside from 'react-click-outside';
import {Component, PropType} from '../../libs/index';
import Input from '../input/index';
import Suggestion from './Suggestion';

class AutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: props.value,
      focus: false,
      suggestions: [],
      loading: false,
      selectIndex: -1
    }
    this.inputRef = null;
    this.suggestionsRef = null;
  }
//   添加上下文
  getChildContext() {
    return {
      component: this
    };
  }
//   获取props后设置输入框值
  componentWillReceiveProps(nextProps) {
    this.setState({
     inputValue: nextProps.value
    })
  }
//   该生命周期下根据visible将输入框的长度传递给suggestion组件
  componentDidUpdate() {
    let visible = this.suggestionVisible();
    let inputDOM = ReactDOM.findDOMNode(this.inputRef);
    if (inputDOM instanceof HTMLElement) {
      setTimeout(() => {
        this.suggestionsRef.onVisibleChange(visible, inputDOM.offsetWidth);
      })
    }
  }
//   判断suggestion是否显示
  suggestionVisible = () => {
    let isValidData = Array.isArray(this.state.suggestions) && this.state.suggestions.length > 0;
    return (isValidData || this.state.loading) && this.state.focus;
  }
//   获取数据
  getData = (queryString) => {
    this.setState({ loading: true });
    this.props.fetchSuggestions(queryString, (suggestions) => {
      this.setState({loading: false})
      if (Array.isArray(suggestions)) {
        this.setState({ suggestions });
      }
    })
  }
//   点击组件外回调
  handleClickOutside() {
    if (this.state.focus) {
      this.setState({ focus: false });
    }
  }
//   输入框数据变化，1. 修改inputvalue， 2. 触发props回调，3. 重新获取数据
  changeHandler = (val) => {
    this.setState({inputValue: val});
    if (!this.props.triggerOnFocus && !value) {
      this.setState({ suggestions: [] }); return;
    }
    if (this.props.onChange) {
      this.props.onChange(val);
    }
    this.getData(val);
  }
//   获取焦点后，1. 修改focus，2. 触发props回调， 3. 获取数据
  focusHandler = (e) => {
    this.setState({focus: true});
    if (this.props.onFocus) this.props.onFocus(e);
    if(this.props.triggerOnFocus) {
      this.getData(this.state.inputValue);
    }
  }
// 根据newIndex设置index显示位置  
  changeSelect = (newIndex) => {
    console.log(newIndex)
  } 
//   键盘操作控制，enter-13， up-38, down-40
  keyDownHandler = (e) => {
    const {selectIndex} = this.state;
    switch(e.keyCode) {
      case 13: return this.keyEnterHandler(selectIndex);
      case 38: return this.changeSelect(selectIndex - 1);
      case 40: return this.changeSelect(selectIndex + 1);
      default: return;
    }
  }
//   确定键-将选中数据进行赋值
  keyEnterHandler = (index) => {
    if (index > 0 && index < this.state.suggestions.length) {
      this.select(this.state.suggestions[index]);
    }
  }
  select = (item) => {
    this.setState({
      inputValue: item.value,
    }, () => {
      this.setState({
        suggestions: []
      })
    })
    this.props.select && this.props.select(item);
  }

  render() {
    const {placeholder, disabled, name, size, icon, prepend, append, onIconClick, popperClass, onBlur} = this.props;
    const { inputValue, suggestions } = this.state;
    return (
      <div style={this.styles()} className={this.classname("hui-autocomplete")}>
        <Input 
          ref={(ref) => this.inputRef = ref}
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          name={name}
          size={size}
          icon={icon}
          prepend={prepend}
          append={append}
          onIconClick={onIconClick}
          onChange={this.changeHandler}
          onFocus={this.focusHandler}
          onBlur={onBlur}
          onKeyDown={this.keyDownHandler}
        />
        <Suggestion 
          ref={(ref) => this.suggestionsRef = ref}
          className={this.classNames(popperClass)}
          suggestions={suggestions}
        />
      </div>
    )
  }
}

AutoComplete.contextTypes = {
  component: PropType.any
}

export default ClickOutside(AutoComplete);