import React from 'react';
import Alert from './alert';
import Badge from './badge';
import Tag from './tag';
import Button from './button';
import Radio from './radio';
import Switch from './switch';
import Loading from './loading';
import Progress from './progress';
import Message from './message';
import Input from './input';

export default class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      radiovalue: 0,
      switchValue: 0,
    }
  }
  onClick = () => {
    window.alert('clicked');
  }
  radioChange = (val) => {
    this.setState({
      radiovalue: val
    })
  }
  switchChange = (val) => {
    this.setState({
      switchValue: val
    })
  }
  render() {
    return (
      <div>
        <div style={{'marginTop': '20px'}}>
          <Alert title={'123123'} />
        </div>
        <div style={{'marginTop': '20px'}}>
          <Badge value={'ad'}>
            <Alert title={'123123'} />
          </Badge>
        </div>
        <div style={{'marginTop': '20px'}}>
          <Tag type="warning">2323</Tag>
        </div>
        <div style={{'marginTop': '20px'}}>
          <Button type="primary" size={'small'} onClick={this.onClick}>2323</Button>
        </div>
        <div style={{'marginTop': '20px'}}>
          <Radio checked={true}>2323</Radio>
        </div>
        {/* <div style={{'marginTop': '20px'}}>
          <Radio value={1} checked={this.state.radiovalue === 1} onChange={this.radioChange}>1</Radio>
          &nbsp;
          <Radio value={0} checked={this.state.radiovalue === 0} onChange={this.radioChange}>0</Radio>
        </div> */}
        <div style={{'marginTop': '20px'}}>
          <Radio.group value={this.state.radiovalue} onChange={this.radioChange}>
            <Radio value={1}>1</Radio>
            <Radio value={0}>0</Radio>
          </Radio.group>
        </div>
        <div style={{'marginTop': '20px'}}>
          <Radio.group value={this.state.radiovalue} onChange={this.radioChange}>
            <Radio.button value={1}>1</Radio.button>
            <Radio.button value={0}>0</Radio.button>
            <Radio.button value={2}>2</Radio.button>
          </Radio.group>
        </div>
        <div style={{'marginTop': '20px'}}>
          <Switch 
            value={this.state.switchValue}
            onChange={this.switchChange}
            onValue={100}
            offValue={0}
            onFocus={()=>console.log('focus')}
            onBlur={()=>console.log('blur')}
            onText="22"
            offText="22"/>
        </div>
        <div style={{'marginTop': '20px'}}>
          <Loading loading={true} text={'hello'}>
            <div style={{'width': '300px', 'height': '400px'}}></div>
          </Loading>
        </div>
        <div style={{'width': '350px', 'marginTop': '40px'}}>
          <Progress type="line" percentage={90} />
          <Progress type="line" percentage={70} status="success" />
          <Progress strokeWidth={18} percentage={50} status="success" textInside />
          <br/>
          <Progress type="circle" percentage={80} width={80}/>
          <Progress type="circle" percentage={70} width={80}/>
          <Progress type="circle" percentage={100}  width={80} status="success" />
          <Progress type="circle" percentage={50}  width={80} status="exception" />
        </div>
        {
          Message.warning({
            message: 'hello',
            showClose: true,
          })
        }
        <div style={{'marginTop': '20px'}}>
          <Input value={244} disabled/>
        </div>
      </div>
    )
  }
}