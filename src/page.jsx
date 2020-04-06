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
import Checkbox from './checkbox';
import Slider from './slider';
import InputNumber from './input-number';
import Tabs from './tabs';
import Card from './card';
import WaterMask from './watermask';
import {Row, Column} from './layout/index';
import Upload from './upload/index';
import { View } from '../libs';
import Rate from './rate';
import Steps from './steps';
import Breadcrumb from './breadcrumb';
export default class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      radiovalue: 0,
      switchValue: 0,
      cities: ['上海', '北京', '广州', '深圳'],
      checkboxGroup1: ['上海'],
      checkboxGroup2: ['北京'],
      checkboxGroup3: ['广州'],
      tabarr: [0],
      dialogImageUrl: '',
      dialogVisible: false,
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
  tabAdd = () => {
    const {tabarr} = this.state;
    tabarr.push(tabarr[tabarr.length - 1] + 1)
    this.setState({
      tabarr,
    })
  }
  handleRemove(file, fileList) {
    console.log(file, fileList);
  }
  
  handlePictureCardPreview(file) {
    this.setState({
      dialogImageUrl: file.url,
      dialogVisible: true,
    })
  }
  render() {
    const fileList2 = [
      {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg'}
    ];
    const { dialogImageUrl, dialogVisible } = this.state;
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
          <Input type="textarea" autoSize={false}/>
        </div>
        <div style={{'marginTop': '20px'}}>
          {/* <Checkbox indeterminate={false} checked={true}>123</Checkbox> */}
          <Checkbox.Group value={['hello', 'world']}>
            <Checkbox label={'hello'}>hello</Checkbox>
            <Checkbox label={'hello1'}>hello1</Checkbox>
            <Checkbox label={'world'}>world</Checkbox>
          </Checkbox.Group>
        </div>
        <div style={{'marginTop': '20px'}}>
          <Checkbox.Group value={this.state.checkboxGroup1}>
            {
              this.state.cities.map((city, index) => {
                return <Checkbox.Button key={index} label={city}>{city}</Checkbox.Button>
              })
            }
          </Checkbox.Group>
        </div>
        {/* {
          Notification.info('message')
        }
        {
          Notification.info({
            msg: 'message',
            duration: 4000
          })
        } */}
        <div style={{'marginTop': '20px'}}>
        111
          <Slider value={20} formatTooltip={(val) => val / 100} showStops showInput/>
        </div>
        <div style={{'marginTop': '20px'}}>
          <InputNumber value={20} step={2} />
        </div>
        <div style={{'marginTop': '20px', 'width': '500px'}}>
          <Tabs type="border-card" editable currentName="1" onTabAdd={this.tabAdd}>
            {
              this.state.tabarr.map((item, index) => {
                return (
                  <Tabs.Pane label={`apple-${index}`} name={`${index}`}>label={`apple-${index}`}</Tabs.Pane>
                )
              })
            }
          </Tabs>
        </div>
        <div style={{'marginTop': '20px'}}>
          <Card
            header={<h1>hello</h1>}
          >
            <Progress type="line" percentage={90} />
          </Card>
        </div>
        <div style={{'marginTop': '20px'}}>
          <WaterMask content={"hellojackhui"} style={{'width': '600px', 'height': '600px'}}>
            <div >hello world</div>
          </WaterMask>
        </div>
        <div style={{'marginTop': '20px'}}>
          <Row gutter={20}>
            <Column span="4"><div style={{'height': '50px', 'background': 'red'}}></div></Column>
            <Column span="12"><div style={{'height': '50px', 'background': 'red'}}></div></Column>
            <Column span="3"><div style={{'height': '50px', 'background': 'red'}}></div></Column>
            <Column span="5"><div style={{'height': '50px', 'background': 'red'}}></div></Column>
          </Row>
        </div>
        <Upload
          className="upload-demo"
          action="//jsonplaceholder.typicode.com/posts/"
          onPreview={file => this.handlePreview(file)}
          onRemove={(file, fileList) => this.handleRemove(file, fileList)}
          fileList={fileList2}
          listType="picture"
            tip={<div className="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>}
          >
            <Button size="small" type="primary">点击上传</Button>
        </Upload>
        <Upload
          className="upload-demo"
          drag
          action="//jsonplaceholder.typicode.com/posts/"
          onPreview={file => this.handlePreview(file)}
          onRemove={(file, fileList) => this.handleRemove(file, fileList)}
          fileList={fileList2}
          listType="picture"
            tip={<div className="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>}
          >
        </Upload>
        <div>
          <Upload
            action="//jsonplaceholder.typicode.com/posts/"
            listType="picture-card"
            onPreview={file => this.handlePictureCardPreview(file)}
            onRemove={(file, fileList) => this.handleRemove(file, fileList)}
          >
            <i className="hui-icon hui-icon-plus"></i>
          </Upload>
          <View show={dialogVisible}>
            <img width="100%" src={dialogImageUrl} alt="" />
          </View>
        </div>
        <div>
          <Rate colors={['#99A9BF', '#F7BA2A', '#FF9900']} />
          <Rate allowHalf={true} onChange={(val) => console.log(val)} />
          <Rate showText={true} disabled={true} value={3.9}/>
        </div>
        <div>
        <Steps space={200} active={1} direction="vertical">
          <Steps.Step title="步骤 1" description="这是一段很长很长很长的描述性文字"></Steps.Step>
          <Steps.Step title="步骤 2" description="这是一段很长2222很长很长的描述性文字"></Steps.Step>
          <Steps.Step title="步骤 3" description="这是一段很长很长很长的描述性文字"></Steps.Step>
        </Steps>
        <Breadcrumb>
        <Breadcrumb.Item>首页</Breadcrumb.Item>
      <Breadcrumb.Item>活动管理</Breadcrumb.Item>
      <Breadcrumb.Item>活动列表</Breadcrumb.Item>
      <Breadcrumb.Item>活动详情</Breadcrumb.Item>
    </Breadcrumb>
        </div>
      </div>
      
    )
  }
}