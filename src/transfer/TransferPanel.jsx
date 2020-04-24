import React from 'react';
import {Component, PropType, View} from '../../libs/index';
import Checkbox from '../checkbox/index';
import Input from '../input/index';
import i18n from '../i18n/index';
import './Transfer.scss';

export default class TransferPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      inputHover: false,
    }
  }
  inputhover = () => {
    this.setState({
      inputHover: true,
    })
  }
  inputBlur = () => {
    this.setState({
      inputHover: false
    })
  }
  clearQuery = () => {
    if (this.inputIcon === 'times-circle') {
      this.setState({
        query: '',
      })
    }
  }
  handleAllCheckedChange = (ischecked) => {
    let checked = ischecked ? this.checkableData.map((item) => item[this.keyProp]) : [];
    this.props.onChange(checked);
  }
  handleCheckedChange = (value) => {
    this.props.onChange(value);
  }
  handleInputChange = (value) => {
    this.setState({
      query: value,
    })
  }
  contentRender = (item, renderContent, key, label) => {
    if (typeof renderContent === 'function') {
      return renderContent(item)
    } else {
      return (
        <span>{item[label] || item[key]}</span>
      )
    }
  }
  get allChecked() {
    const checkedKeys = this.checkableData.map((data) => {
      return data[this.keyProp]
    })
    return checkedKeys.length > 0 && checkedKeys.every((key) => this.props.checked.includes(key))
  }

  get filteredData() {
    return this.props.data.filter((item) => {
      if (typeof this.props.filterMethod === 'function') {
        return this.props.filterMethod(this.state.query, item);
      } else {
        let label = item[this.labelProp] || item[this.keyProp].toString();
        return label.toLowerCase().includes(this.state.query.toLowerCase());
      }
    })
  }
  get checkedSummary() {
    console.log(123)
    let checkedLength = this.props.checked.length;
    let dataLength = this.props.data.length;
    const { noChecked, hasChecked } = this.props.footerFormat;
    if (noChecked && hasChecked) {
      return checkedLength > 0
        ? hasChecked
            .replace(/\${checked}/g, checkedLength)
            .replace(/\${total}/g, dataLength)
        : noChecked.replace(/\${total}/g, dataLength);
    } else {
      if (checkedLength <= 0) {
        return i18n.t('hui.transfer.noCheckedFormat', {
          total: dataLength
        })
      } else {
        return i18n.t('hui.transfer.hasCheckedFormat', {
          total: dataLength,
          checked: checkedLength
        })
      }
    }
  }
  get getindeterminate() {
    let checkedLength = this.props.checked.length;
    return checkedLength > 0 && checkedLength < this.checkableData.length;
  }
  get hasNoMatch() {
    const {query} = this.state;
    return query.length > 0 && this.filteredData.length === 0;
  }
  get checkableData() {
    return this.filteredData.filter(item => !item[this.disabledProp]);
  }
  get keyProp() {
    return this.props.propsAlias.key;
  }
  get labelProp() {
    return this.props.propsAlias.label;
  }
  get disabledProp() {
    return this.props.propsAlias.disabled;
  }
  get inputIcon() {
    const {query, inputHover} = this.state;
    return (query.length > 0 && inputHover) ? 'times-circle' : 'search-plus'; 
  }

  render() {
    const {
      title,
      filterable,
      data,
      checked,
      renderContent,
      placeholder,
    } = this.props;
    const {query} = this.state;
    return (
      <div className="hui-transfer-panel">
        <p className="hui-transfer-panel__header">{title}</p>
        <div className="hui-transfer-panel__body">
          {
            filterable && (
              <Input 
                className="hui-transfer-panel__filter"
                value={query}
                size={"small"}
                onMouseEnter={this.inputhover}
                onMouseLeave={this.inputBlur}
                placeholder={placeholder}
                icon={this.inputIcon}
                onIconClick={this.clearQuery}
                onChange={this.handleInputChange}
              />
            )
          }
          <View show={!this.hasNoMatch && data.length > 0}>
            <Checkbox.Group
              value={checked}
              className={this.classname('hui-transfer-panel__list', {
                'is-filterable': filterable,
              })}
              onChange={this.handleCheckedChange}
            >
              {
                this.filteredData.map((item, index) => {
                  return (
                    <Checkbox 
                      className="hui-transfer-panel__item"
                      label={item[this.labelProp]}
                      disabled={item[this.disabledProp]}
                      value={item[this.keyProp]}
                      key={index}
                    >
                      {this.contentRender(item, renderContent, this.keyProp, this.labelProp)}
                    </Checkbox>
                  )
                })
              }
            </Checkbox.Group>
          </View>
          <View show={this.hasNoMatch}>
            <p className="hui-transfer-panel__empty">
              {i18n.t('hui.transfer.noMatch')}
            </p>
          </View>
          <View show={data.length === 0 && !this.hasNoMatch}>
            <p className="hui-transfer-panel__empty">
              {i18n.t('hui.transfer.noData')}
            </p>
          </View>
        </div>
        <p className="hui-transfer-panel__footer">
          <Checkbox 
            checked={this.allChecked}
            onChange={this.handleAllCheckedChange}
            indeterminate={this.getindeterminate}
          >
            {this.checkedSummary}
          </Checkbox>
          {this.props.children}
        </p>
      </div>
    )
  }
}

TransferPanel.propTypes = {
  data: PropType.array,
  renderContent: PropType.func,
  placeholder: PropType.string,
  title: PropType.string,
  filterable: PropType.bool,
  footerFormat: PropType.object,
  filterMethod: PropType.func,
  propsAlias: PropType.object,
  onChange: PropType.func,
  checked: PropType.array
}

TransferPanel.defaultProps = {
  data: [],
  footerFormat: {},
  propsAlias: {},
  onChange() {}
}