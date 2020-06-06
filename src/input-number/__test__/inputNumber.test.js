import React from 'react'
import {expect} from 'chai';
import {mount} from 'enzyme';
import sinon from 'sinon';
import InputNumber from '../index';
import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'

configure({adapter: new Adapter()});


describe('test input-number component', () => {
  it('should load element when initing component', () => {
    const dom = mount(<InputNumber defaultValue={123} />);
    expect(dom.find('.hui-input-number')).to.have.lengthOf(1);
    expect(dom.find('.hui-input-number__inner input').getDOMNode().getAttribute('value')).to.equal("123");
    dom.setProps({value: "1234"});
    expect(dom.find('.hui-input-number__inner input').getDOMNode().getAttribute('value')).to.equal("1234");
  })
  it("should change component size when setting size prop", () => {
    const dom = mount(<InputNumber size="large" />);
    expect(dom.find('.hui-input-number--large')).to.have.lengthOf(1);
    dom.setProps({'size': 'small'});
    expect(dom.find('.hui-input-number--small')).to.have.lengthOf(1);
  })
  it("should disabled to change when value is larger than max value or smaller than min value", () => {
    const dom = mount(<InputNumber value={3} max={4} min={2} />);
    const increaseDOM = dom.find('.hui-input-number__increase');
    const decreateDOM = dom.find('.hui-input-number__decrease');
    const inputDOM = dom.find('.hui-input-number__inner input');
    increaseDOM.simulate('click');
    expect(inputDOM.getDOMNode().getAttribute('value')).to.equal('4');
    increaseDOM.simulate('click');
    expect(inputDOM.getDOMNode().getAttribute('value')).to.equal('4');
    for(let i = 0; i < 2; i++) {
      decreateDOM.simulate('click');
    }
    inputDOM.simulate('change', {target: {value: '1'}})
    expect(inputDOM.getDOMNode().getAttribute('value')).to.equal('2');
  })
  it("should disabled when setting disabled prop", () => {
    const dom = mount(<InputNumber value={3} disabled/>);
    expect(dom.find('.hui-input-number').hasClass('is-disabled')).to.equal(true);
  })
  it("should change by step when setting step prop", () => {
    const onchangeFunc = sinon.spy();
    const dom = mount(<InputNumber value={20} step={3} onChange={onchangeFunc} />);
    const inputDOM = dom.find('.hui-input-number__inner input');
    const increaseDOM = dom.find('.hui-input-number__increase');
    const decreateDOM = dom.find('.hui-input-number__decrease');
    increaseDOM.simulate('click');
    expect(inputDOM.getDOMNode().getAttribute('value')).to.equal('23');
    expect(onchangeFunc).to.have.property('callCount', 1);
    decreateDOM.simulate('click');
    expect(inputDOM.getDOMNode().getAttribute('value')).to.equal('20');
    expect(onchangeFunc).to.have.property('callCount', 2);
  })
  it("should become focus when setting input in focuing state", () => {
    const dom = mount(<InputNumber value="123" />);
    dom.find('.hui-input-number__inner input').simulate('focus');
    expect(dom.state().focus).to.equal(true);
    dom.find('.hui-input-number__inner input').simulate('blur');
    expect(dom.state().focus).to.equal(false);
  })
it("should disabled inputControls when setting showInputControls prop", () => {
    const dom = mount(<InputNumber showInputControls={false} />);
    expect(dom.find('.hui-input-number__increase')).to.have.lengthOf(0);
    dom.setProps({'showInputControls': true});
    expect(dom.find('.hui-input-number__increase')).to.have.lengthOf(1);
  })
  
})

