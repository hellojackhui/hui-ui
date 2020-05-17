import React from 'react'
import {expect} from 'chai';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import Collapse from './index';

configure({ adapter: new Adapter() })

describe('test Collapse component', () => {
it('should load dom element when initing component', () => {
    const dom = mount(
      <Collapse value={["1"]} accordion>
        <Collapse.Item name="1">1</Collapse.Item>
        <Collapse.Item name="2">2</Collapse.Item>
      </Collapse>
    )
    expect(dom.state().activeNames[0]).to.equal("1");
    expect(dom.find('.hui-collapse')).to.have.lengthOf(1);
    expect(dom.find('.hui-collapse-item')).to.have.lengthOf(2);
    dom.find('.hui-collapse-item').at(1).find('.hui-collapse-item__header').simulate('click');
    expect(dom.state().activeNames[0]).to.equal("2");
    dom.find('.hui-collapse-item').at(0).find('.hui-collapse-item__header').simulate('click');
    expect(dom.state().activeNames[0]).to.equal("1");
  })
it('should multi select when setting accordion prop is false', () => {
    const dom = mount(
      <Collapse value={[]}>
        <Collapse.Item name="1">1</Collapse.Item>
        <Collapse.Item name="2">2</Collapse.Item>
        <Collapse.Item>3</Collapse.Item>
      </Collapse>
    )
    dom.find('.hui-collapse-item').at(1).find('.hui-collapse-item__header').simulate('click');
    expect(dom.state().activeNames[0]).to.equal("2");
    dom.find('.hui-collapse-item').at(0).find('.hui-collapse-item__header').simulate('click');
    expect(dom.state().activeNames[1]).to.equal("1");
  })
  it('should call cb when setting onCHn', () => {
    const cb = sinon.spy();
    const dom = mount(
      <Collapse value={['1']} onChange={cb}>
        <Collapse.Item title="标题">12345</Collapse.Item>
        <Collapse.Item name="1" title="标题">12345</Collapse.Item>
      </Collapse>
    )
    expect(dom.find(Collapse.Item).at(0).props().name).to.equal('0');
    dom.find('.hui-collapse-item').at(1).find('.hui-collapse-item__header').simulate('click');
    expect(cb).to.have.property('callCount', 1);
    dom.find('.hui-collapse-item').at(0).find('.hui-collapse-item__header').simulate('click');
    dom.setProps({'value': ['2']});
    expect(dom.find(Collapse).state().activeNames.length).to.equal(1);
  })
})
