import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Alert from './alert';
import Badge from './badge';

ReactDOM.render(<Badge value={'new'} max={99} ><Alert title="中华人民工" showIcon style={{'width': '200px'}}/></Badge>, document.getElementById('root'));
