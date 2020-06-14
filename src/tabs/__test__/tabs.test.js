import React from 'react'
import {expect} from 'chai';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import Tabs from '../index';
import Icon from '../../icon/index';
import sinon from 'sinon';

configure({adapter: new Adapter()});

describe('test tabs component', () => {
    it('should load tabs dom element when setting component', () => {
      const dom = mount(
        <Tabs editable currentName="1" addable>
          <Tabs.Pane label={`apple-${1}`} name={`${1}`}>2</Tabs.Pane>
          <Tabs.Pane label={`apple-${2}`} name={`${2}`}>1</Tabs.Pane>
        </Tabs>
      )
      expect(dom.props().type).to.equal('card');
      expect(dom.find('.hui-tab.hui-tab--card')).to.have.lengthOf(1);
      expect(dom.find('.hui-tab__add')).to.have.lengthOf(1);
      dom.setProps({type: 'border-card'});
      expect(dom.find('.hui-tab.hui-tab--border-card')).to.have.lengthOf(1);
    })
    it("should change activename when setting handler", () => {
      const state = {
        name: '',
      }
      const dom = mount(
        <Tabs activeName="2" onTabClick={ (tab) => state.name = tab.props.name }>
          <Tabs.Pane label="用户管理" name="1">用户管理</Tabs.Pane>
          <Tabs.Pane label="配置管理" name="2">配置管理</Tabs.Pane>
          <Tabs.Pane label="角色管理" name="3">角色管理</Tabs.Pane>
          <Tabs.Pane label="定时补偿任务" name="4">定时补偿任务</Tabs.Pane>
        </Tabs>
      )
      expect(dom.find('.hui-tab .hui-tab__item').at(0).text()).to.equal('用户管理');
      expect(dom.find('.hui-tab .hui-pane').at(0).text()).to.equal('用户管理');
      expect(dom.find('.hui-tab .hui-tab__item').at(1).text()).to.equal('配置管理');
      expect(dom.find('.hui-tab .hui-pane').at(1).text()).to.equal('配置管理');
      expect(dom.find('.hui-tab .hui-tab__item').at(2).text()).to.equal('角色管理');
      expect(dom.find('.hui-tab .hui-pane').at(2).text()).to.equal('角色管理');
      expect(dom.find('.hui-tab .hui-tab__item').at(3).text()).to.equal('定时补偿任务');
      expect(dom.find('.hui-tab .hui-pane').at(3).text()).to.equal('定时补偿任务');

      expect(dom.find('.hui-tab .hui-tab__item').at(1).hasClass('is-active')).to.equal(true);
      expect(dom.find('.hui-tab .hui-pane').at(1).prop('style').display).to.equal(undefined);

      dom.find('.hui-tab .hui-tab__item').at(0).simulate('click');
      expect(dom.find('.hui-tab .hui-tab__item').at(0).hasClass('is-active')).to.equal(true);
      expect(dom.find('.hui-tab .hui-tab__item').at(1).hasClass('is-active')).to.equal(false);
      expect(state.name).to.equal('1');
    })
  it("should enable to create custom tabs", () => {
      const label = <span><Icon name="date" /> 用户管理</span>;
      const dom = mount(
        <Tabs type="border-card" activeName="1">
          <Tabs.Pane label={label} name="1">用户管理</Tabs.Pane>
          <Tabs.Pane label="配置管理" name="2">配置管理</Tabs.Pane>
          <Tabs.Pane label="角色管理" name="3">角色管理</Tabs.Pane>
          <Tabs.Pane label="定时补偿任务" name="4">定时补偿任务</Tabs.Pane>
        </Tabs>
      )
      expect(dom.find('.hui-tab .hui-tab__header i').html()).to.equal('<i class="hui-icon hui-icon-date"></i>');
    })
    it("enable to add or close tabs", () => {
        const state = {
          tabs: [{
            title: 'Tab 1',
            name: 'Tab 1',
            content: 'Tab 1 content',
          }, {
            title: 'Tab 2',
            name: 'Tab 2',
            content: 'Tab 2 content',
          }],
          tabIndex: 2,
        };
        const editTab = (action, tab) => {
          if (action === 'add') {
            const { tabs, tabIndex } = state;
            const index = tabIndex + 1;
    
            tabs.push({
              title: 'new Tab',
              name: 'Tab ' + index,
              content: 'new Tab content',
            });
            state.tabs = tabs;
            state.tabIndex = index;
          }
    
          if (action === 'remove') {
            const { tabs } = state;
    
            tabs.splice(tab.key.replace(/^\.\$/, ''), 1);
            state.tabs = tabs;
          }
        };
        const dom = mount(
          <Tabs type="card" value="Tab 2" editable onTabEdit={(action, tab) => editTab(action, tab)}>
            {
              state.tabs.map((item, index) => {
                return <Tabs.Pane key={index} closable label={item.title} name={item.name}>{item.content}</Tabs.Pane>
              })
            }
          </Tabs>
        );
        expect(dom.find('.hui-tab__add').length).to.equal(1);
        expect(dom.find('.hui-tab .hui-tab__item').at(0).hasClass('is-closable')).to.equal(true);

        dom.find('.hui-tab__add').simulate('click');
        dom.setProps({
          children: state.tabs.map((item, index) => {
            return <Tabs.Pane key={index} closable label={item.title} name={item.name}>{item.content}</Tabs.Pane>
          }),
        });
        expect(dom.find('.hui-tab .hui-tab__item').length).to.equal(3);
    
        dom.find('.hui-tab .hui-tab__item').at(1).find('.hui-icon-close').simulate('click');
        dom.setProps({
          children: state.tabs.map((item, index) => {
            return <Tabs.Pane key={index} closable label={item.title} name={item.name}>{item.content}</Tabs.Pane>
          }),
        });
        expect(dom.find('.hui-tab .hui-tab__item').length).to.equal(2);
    })
})
