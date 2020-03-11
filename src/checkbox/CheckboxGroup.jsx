import React from 'react';
import {Component, PropType} from '../../libs/index';
import './Checkbox.scss';

export default class CheckboxGroup extends Component {
  
}

CheckboxGroup.propTypes = {
  value: PropType.arrayOf(PropType.string),
  size: PropType.oneOf(['large', 'small']),
  fill: PropType.string,
  textColor: PropType.string,
  min: PropType.number,
  max: PropType.number,
  onChange: PropType.func,
}