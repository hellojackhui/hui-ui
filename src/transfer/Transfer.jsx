import React from 'react';
import {Component, PropType} from '../../libs/index';
import Button from '../button/index';
import TransferPanel from './TransferPanel';
import i18n from '../i18n';
import './Transfer.scss';

export default class Transfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftChecked: props.leftDefaultChecked ? props.leftDefaultChecked : [],
      rightChecked: props.rightDefaultChecked ? props.rightDefaultChecked : []
    }
  }

  onLeftCheckedChange = (val) => {
    this.setState({
      leftChecked: val,
    })
  }

  onRightCheckedChange = (val) => {
    this.setState({
      rightChecked: val,
    })
  }

  addToLeft = () => {
    const {value} = this.props;
    const {rightChecked} = this.state;
    let currentValue = value.slice();
    rightChecked.forEach((item) => {
      const index = currentValue.indexOf(item);
      if (index > -1) {
        currentValue.splice(index, 1);
      }
    })
    this.setState({
      rightChecked: []
    }, () => {
      this.props.onChange(currentValue, 'left', rightChecked)
    })
  }

  addToRight = () => {
    const {value} = this.props;
    const {leftChecked} = this.state;
    let currentValue = value.slice();
    leftChecked.forEach((item) => {
      const index = currentValue.indexOf(item);
      if (index == -1) {
        currentValue = currentValue.concat(item);
      }
    })
    this.setState({
      leftChecked: []
    }, () => {
      this.props.onChange(currentValue, 'right', leftChecked)
    })
  }

  get sourceData()  {
    const {data, propsAlias, value} = this.props;
    return data.filter((item) => !value.includes(item[propsAlias['key']]));
  }

  get targetData() {
    const {data, propsAlias, value} = this.props;
    return data.filter((item) => value.includes(item[propsAlias['key']]));
  }

  render() {
    const {
      filterPlaceholder,
      titles,
      buttonTexts,
      propsAlias,
      filterable,
      filterMethod,
      footerFormat,
      leftFooter,
      rightFooter,
      renderContent
    } = this.props;
    const {leftChecked, rightChecked} = this.state;
    return (
      <div style={this.styles()} className={this.classname('hui-transfer')}>
        <TransferPanel 
          propsAlias={propsAlias}
          data={this.sourceData}
          title={titles[0] || i18n.t('hui.transfer.titles.0')}
          checked={leftChecked}
          filterable={filterable}
          filterMethod={filterMethod}
          footerFormat={footerFormat}
          renderContent={renderContent}
          placeholder={
            filterPlaceholder || i18n.t('el.transfer.filterPlaceholder')
          }
          onChange={this.onLeftCheckedChange}
        >
          {leftFooter}
        </TransferPanel>
        <div className="hui-transfer__buttons">
          <Button
            type={'primary'}
            size={'small'}
            onClick={this.addToLeft}
            disabled={rightChecked.length == 0} 
          >
            <i className="hui-icon hui-icon-chevron-left"></i>
            {buttonTexts[0] !== undefined && <span>{buttonTexts[0]}</span>}
          </Button>
          <Button
            type={'primary'}
            size={'small'}
            onClick={this.addToRight}
            disabled={leftChecked.length == 0} 
          >
            <i className="hui-icon hui-icon-chevron-right"></i>
            {buttonTexts[0] !== undefined && <span>{buttonTexts[0]}</span>}
          </Button>
        </div>
        <TransferPanel 
          propsAlias={propsAlias}
          data={this.targetData}
          title={titles[1] || i18n.t('hui.transfer.titles.1')}
          checked={rightChecked}
          filterable={filterable}
          filterMethod={filterMethod}
          footerFormat={footerFormat}
          renderContent={renderContent}
          placeholder={
            filterPlaceholder || i18n.t('el.transfer.filterPlaceholder')
          }
          onChange={this.onRightCheckedChange}
        >
          {rightFooter}
        </TransferPanel>
      </div>
    )
  }
}

Transfer.propTypes = {
  data: PropType.array,
  titles: PropType.array,
  buttonTexts: PropType.array,
  filterPlaceholder: PropType.string,
  filterMethod: PropType.func,
  leftDefaultChecked: PropType.array,
  rightDefaultChecked: PropType.array,
  renderContent: PropType.func,
  value: PropType.array,
  footerFormat: PropType.object,
  filterable: PropType.bool,
  propsAlias: PropType.object,
  onChange: PropType.func,
  leftFooter: PropType.node,
  rightFooter: PropType.node
}

Transfer.defaultProps = {
  data: [],
  titles: [],
  buttonTexts: [],
  filterPlaceholder: '',
  leftDefaultChecked: [],
  rightDefaultChecked: [],
  value: [],
  footerFormat: {},
  propsAlias: {
    label: 'label',
    key: 'key',
    disabled: 'disabled'
  },
  onChange() {}
}

