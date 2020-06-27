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
import Tree from './tree';
// import Menu from './menu';
import Collapse from './collapse';
import Transfer from './transfer';
import ColorPicker from './color-picker';
import Modal from './modal';
import PopOver from './popover';
import Dropdown from './dropdown';
import Result from './result';
import Table from './table';
import TableAction from './table/tableAction';
import Skeleton from './skeleton/index';
import AutoComplete from './autocomplete';
import BackTop from './backTop';
import Icon from './icon';
import Divider from './divider';

let defaultDataSource = [];
for (let i = 0; i < 5000; i++) {
  defaultDataSource.push({
    name: `name${i + 1}`,
    name2: `固定-${i + 1}`,
    name3: `name3---${i}`,
    name4: `name3名称长name2名称长name2名称长${i}`,
    name5: `name5---${i}`,
    name6: `name6---${i}`,
    name7: `固定---${i}`,
    name8: `固定---${i}`,
    name9: `固定---${i}`,
    name10: `固定---${i}`,
    name11: `行内输入${i}`,
    name12: `内容${i}`,
    name13: `内容${i}`,
    name14: `内容${i}`,
    name15: `输入框输入的值${i}`,
    disabled: i == 5,
    checked: i == 5
  });
}
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
      treedata: [
        {
          title: 'title0',
          value: 'title0',
          children: [
            {
              title: 'title0-1',
              value: 'title0-1',
            }, {
              title: 'title0-2',
              value: 'title0-2',
              children: [
                {
                  title: 'title0-2-1',
                  value: 'title0-2-1',
                }, {
                  title: 'title0-2-2',
                  value: 'title0-2-2',
                  children: [
                    {
                      title: 'title0-2-2-1',
                      value: 'title0-2-2-1',
                      children: [
                        {
                          title: 'title0-2-2-1-1',
                          value: 'title0-2-2-1-1',
                        }, {
                          title: 'title0-2-2-1-2',
                          value: 'title0-2-2-1-2',
                        }
                      ],
                    }, {
                      title: 'title0-2-2-2',
                      value: 'title0-2-2-2',
                      children: [
                        {
                          title: 'title0-2-2-2-1',
                          value: 'title0-2-2-2-1',
                        }, {
                          title: 'title0-2-2-2-2',
                          value: 'title0-2-2-2-2',
                        }
                      ],
                    }
                  ],
                }
              ],
            }
          ],
        },
        {
          title: 'title2',
          value: 'title2',
        },
        {
          title: 'title3',
          value: 'title3',
        }
      ],
      transfervalue: [1,4],
      visible: false,
      loading: false,
      dataSource: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      countries: [
        {value: '中国', name: '中国'},
        {value: '中国2', name: '中国2'},
        {value: '中国3', name: '中国3'},
        {value: '美国', name: '美国'},
        {value: '法国', name: '法国'},
        {value: '英国', name: '英国'},
        {value: '德国', name: '德国'},
        {value: '意大利', name: '意大利'},
        {value: '日本', name: '日本'},
        {value: '俄罗斯', name: '俄罗斯'},
        {value: '朝鲜', name: '朝鲜'},
        {value: '加拿大', name: '加拿大'},
      ],
      selectCountry: '',
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

  // tree
  handleSelect = (selectItems = []) => {
    this.setState({
      selectItems
    });
  };
  handleClear = () => {
    this.setState({
      clearAll: false
    });
  };
  handleItemChecked = (currItem) => {
    console.log(currItem);
  };
  handlePictureCardPreview(file) {
    this.setState({
      dialogImageUrl: file.url,
      dialogVisible: true,
    })
  }
  get transferdata() {
    const data = [];
    for (let i = 1; i <= 15; i++) {
      data.push({
        key: i,
        label: `备选项 ${ i }`,
        disabled: i % 4 === 0
      });
    }
    return data;
  }
  handleTranferChange = (value) => {
    this.setState({ transfervalue: value })
  }
  onChange = (res) => {
    console.log(res);
  }

  // table
  componentWillMount() {
    let { clientHeight } = document.documentElement;
    console.log(clientHeight)
    this.tableHeight = clientHeight - 250 - 50;
  }
  componentDidMount() {
    this.initQuery(this.state.pageNum, this.state.pageSize);
  }
  initQuery = (pageNum, pageSize) => {
    // return
    this.setState({
      loading: true,
      // dataSource: []
    });
    setTimeout(() => {
      this.setState({
        dataSource: defaultDataSource.slice((pageNum-1)*pageSize, pageNum*pageSize),
        loading: false,
        pageNum,
        pageSize,
        total: defaultDataSource.length
      });
    }, 1000);
  };
  query = () => {
    this.initQuery(1, 15);
  };

  load = () => {
    this.setState({ loading: false });
  };

  indicator = () => {
    return <span>啊啊啊</span>;
  };

  _del = (item, index) => {
    console.log(item, index);
    Message.success(`当前选择数据为第 ${index + 1} 条`);
  };

  getHoverContent = (record, index) => {
    return (
      <TableAction
        actions={[
          {
            title: "查看",
            visible: record.name !== "name5",
            onClick: () => this._del(record, index)
          },
          {
            title: "编辑",
            onClick: () => this._del(record, index)
          },
          {
            title: "删除",
            onClick: () => this._del(record, index)
          },
        ]}
      />
    );
  };
  expandedRowRender = (record, index) => {
    const columns = [
      { title: 'Date',key: 'date',checked: true, width: '20%' },
      { title: 'Name', key: 'name',checked: true,width: '20%' },
      {
        title: 'Status',
        key: 'state',
        checked: true,
        width: '20%'

      },
      { title: 'Upgrade Status',  key: 'upgradeNum', checked: true,width: '20%' },
      {
        title: 'Action',
        dataIndex: 'operation',
        key: 'operation',
        checked: true,
        width: '20%'
      },
    ];

    const data = [];
    let { name3 } = record;
    for (let i = 0; i < 30; ++i) {
      data.push({
        key: i,
        date: '2014-12-24 23:12:00',
        name: 'This is production name',
        upgradeNum: `Upgraded: ${i}`,
        state: `${name3}--${i}`,
        operation: 'delete'
      });
    }
    return (
      <div style={{padding: '12px'}}>
        <Table columnsDrag={false} columnsFilter={false} columns={columns} dataSource={data} scroll={{y: 150}} forceRender />
      </div>
    );
  }
  // onPaginationChange = (pageNum, pageSize) => {
  //   this.initQuery(pageNum, pageSize);
  // }
  // onShowSizeChange = (pageNum, pageSize) => {
  //   this.initQuery(pageNum, pageSize);
  // }
  onSelect = (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  };
  onSelectAll = (selected, selectedRows) => {
    console.log(selected, selectedRows);
  };

  querySearch(queryString, cb) {
    const { countries } = this.state;
    const results = queryString ? countries.filter(this.createFilter(queryString)) : countries;
    console.log(results);
    // 调用 callback 返回建议列表的数据
    cb(results);
  }

  createFilter(queryString) {
    return (countries) => {
      return (countries.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
    };
  }
  
  handleSelect(item) {
    console.log(item);
  }

  render() {
    const fileList2 = [
      {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg'}
    ];
    const { dialogImageUrl, dialogVisible, treedata, dataSource, loading } = this.state;
    let rowSelection = {
      // type: 'radio',
      onSelect: this.onSelect,
      onSelectAll: this.onSelectAll,
      // fixed: false
    };
    let rowHover = {
      hoverContent: this.getHoverContent,
      onRowHover: () => {}
    };
    let expandable = {
      expandedRowRender: this.expandedRowRender
    }
    return (
      <div>
        <div style={{'marginTop': '20px'}}>
          <Alert title={'123123'} closable/>
        </div>
        <div style={{'marginTop': '20px'}}>
          {/* <Badge isDot>
            <Alert title={'点类型'} />
          </Badge> */}
          <Badge value={100} max={99}>
            <Alert title={'99+'} />
          </Badge>
        </div>
        <div style={{'marginTop': '20px'}}>
          <Tag type="warning">2323</Tag>
        </div>
        <div style={{'marginTop': '20px'}}>
          <Button type="primary" onClick={this.onClick}>主要按钮</Button>
          <Button onClick={this.onClick}>默认按钮</Button>
          <Button type="text" onClick={this.onClick}>text</Button>
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
          Message.info({
            message: 'msg',
            showClose: true
          })
        }
        <div style={{'marginTop': '20px'}}>
          <Input type="textarea" autoSize={false}/>
        </div>
        <div style={{'margin': '20px'}}>
          <Row>
            <Column span="8">
              <AutoComplete
                placeholder="请输入内容"
                value={this.state.selectCountry}
                onFocus={e=>console.log('onFocus')}
                onBlur={e=>console.log('onblur')}
                fetchSuggestions={this.querySearch.bind(this)}
                onSelect={this.handleSelect.bind(this)}
                triggerOnFocus={true}
              ></AutoComplete>
            </Column>
          </Row>
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
          <InputNumber value={3} max={4} min={2} />
        </div>
        <div style={{'marginTop': '20px', 'width': '500px'}}>
          <Tabs type="border-card" editable currentName="1" onTabAdd={this.tabAdd} addable>
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
        <div style={{'marginTop': '20px'}}>
          <Tree
            data={treedata}
            multiple={true}
            clearAll={false}
            defaultExpandAll={true}
            expandOnClickNode={true}
            selectItems={[]}
            showQuery={true}
            onSelect={this.handleSelect}
            onClear={this.handleClear}
            onItemChecked={this.handleItemChecked}
          />
        </div>
        {/* <div style={{'marginTop': '30px'}}>
        <Menu theme="dark" defaultActive="1" className="el-menu-demo" mode="horizontal" menuTrigger="click">
          <Menu.Item index="1">处理中心</Menu.Item>
          <Menu.SubMenu index="2" title="我的工作台">
            <Menu.Item index="2-1">选项1</Menu.Item>
            <Menu.Item index="2-2">选项2</Menu.Item>
            <Menu.Item index="2-3">选项3</Menu.Item>
          </Menu.SubMenu>
          <Menu.Item index="3">订单管理</Menu.Item>
        </Menu>
        </div> */}
        <div style={{'marginTop': '20px'}}>
      <Collapse value={'1'}>
        <Collapse.Item title="一致性 Consistency" name="1">
          <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
          <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
        </Collapse.Item>
        <Collapse.Item title="反馈 Feedback" name="2">
          <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
          <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
        </Collapse.Item>
        <Collapse.Item title="效率 Efficiency" name="3">
          <div>简化流程：设计简洁直观的操作流程；</div>
          <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
          <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
        </Collapse.Item>
        <Collapse.Item title="可控 Controllability" name="4">
          <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
          <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
        </Collapse.Item>
      </Collapse>
        </div>
        <div style={{'marginTop': '20px'}}>
          <Transfer value={this.state.transfervalue} filterable data={this.transferdata} onChange={this.handleTranferChange}/>
        </div>
        <div style={{'margin': '20px'}}>
          <Dropdown trigger="click" menu={(
            <Dropdown.Menu>
              <Dropdown.Item>黄金糕</Dropdown.Item>
              <Dropdown.Item>狮子头</Dropdown.Item>
              <Dropdown.Item>螺蛳粉</Dropdown.Item>
              <Dropdown.Item>双皮奶</Dropdown.Item>
              <Dropdown.Item>蚵仔煎</Dropdown.Item>
            </Dropdown.Menu>
            )}>
            <Button type="primary">
              更多菜单<i className="el-icon-caret-bottom el-icon--right"></i>
            </Button>
          </Dropdown>
        </div>
        <div style={{'marginTop': '20px'}}>
          <ColorPicker value={""} onChange={this.onChange} showAlpha/>
        </div>
        <div style={{'margin': '20px'}}>
          <Button type="primary" size={'small'} onClick={() => this.setState({visible: true})}>打开</Button>
          <Modal visible={this.state.visible} title={"模态框1"} lockScroll onClose={() => this.setState({visible: false})}> 
            <Modal.Body>
              <span>这是一个模态框2</span>
            </Modal.Body>
            <Modal.Footer>
              <Button type="primary" size={'small'} onClick={() => this.setState({visible: false})}>关闭</Button>
            </Modal.Footer>
          </Modal>
        </div>
        <div style={{'margin': '100px'}}>
          <PopOver placement="bottom" title="标题" width="200" content="这是一段容,这是一段容,这是一段容,这是一段容。" trigger="focus">
            <Button>hover 激活</Button>
          </PopOver>
        </div>
        <div style={{'margin': '20px'}}>
        <Result
          status="smile"
          title="Successfully Purchased Cloud Server ECS!"
          subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
          extra={[
            <Button type="primary" key="console">
              Go Console
            </Button>,
            <Button key="buy">Buy Again</Button>,
          ]}
        />
        </div>
        {/* <div>
          <Table
              tableUniqueId={"xxx"}
              scroll={{ y: document.documentElement.clientHeight - 250 - 50}}
              dataSource={dataSource}
              loading={loading}
              bordered
              columns={[
                {
                  title: "组织左固定2",
                  key: "name2",
                  // width: 100,
                  width: "14.28%",
                  fixed: "left",
                  checked: true,
                  disabled: false
                },
                {
                  title: "组织组织3",
                  key: "name3",
                  // align: "center",
                  // width: 300,
                  width: "14.28%",
                  min: 200,
                  checked: true,
                  disabled: false,
                  // fixed: "left"
                },
                {
                  title: "组织组织4",
                  key: "name4",
                  width: 300,
                  checked: false,
                  disabled: true
                },
                {
                  title: "组织组织5",
                  key: "name5",
                  // width: 111,
                  width: "14.28%",
                  checked: true,
                  disabled: false,
                  // fixed: 'left'
                },
                {
                  title: "组织组织6",
                  key: "name6",
                  // width: 200,
                  width: "14.28%",
                  checked: true,
                  disabled: false
                },
                {
                  title: "组织右固定7",
                  key: "name7",
                  // width: 200,
                  width: "14.28%",
                  checked: true,
                  disabled: false
                },
                {
                  title: "组织右固定8",
                  key: "name8",
                  // width: 100,
                  width: "14.28%",
                  checked: true,
                  disabled: false
                },
                {
                  title: "组织右固定9",
                  key: "name9",
                  // width: 100,
                  width: "14.32%",
                  checked: true,
                  disabled: false
                },
                {
                  title: "组织右固定10",
                  key: "name10",
                  width: 100,
                  checked: false,
                  disabled: false,
                  render: (item, index) => {
                    return item.name10;
                  }
                },
                {
                  title: "组织右固定11",
                  key: "name11",
                  width: 130,
                  checked: false,
                  disabled: false,
                  render: (item, index) => {
                    return <Input value={item.name15} onChange={() => {}} />;
                  }
                },
                {
                  title: "组织右固定12",
                  key: "name12",
                  width: 104,
                  checked: false,
                  disabled: false
                },
                {
                  title: "组织右固定13",
                  key: "name13",
                  width: 200,
                  checked: false,
                  disabled: true,
                  // fixed: "right"
                },
                {
                  title: "组织右固定14",
                  key: "name14",
                  width: 160,
                  checked: false,
                  disabled: false,
                  // fixed: "right"
                },
                {
                  title: "组织右固定15",
                  key: "name15",
                  width: 120,
                  fixed: "right",
                  checked: false,
                  disabled: false
                }
              ]}
              rowHover={rowHover}
              // rowSelection={rowSelection}
              // expandable={expandable}
            />
        </div> */}
        <div style={{'margin': '20px'}}>
            <Skeleton avatar active loading={false}>
            <div>
              <h4>Ant Design, a design language</h4>
              <p>
                We supply a series of design principles, practical patterns and high quality design
                resources (Sketch and Axure), to help people create their product prototypes
                beautifully and efficiently.
              </p>
            </div>
            </Skeleton>
        </div>
        <BackTop>
          <div>UP</div>
        </BackTop>
        <div style={{'padding': '20px'}}>
          <p>123123123123123</p>
          <Divider type="vertical"></Divider>
          <p>312312312312312</p>
        </div>
      </div>
    )
  }
}