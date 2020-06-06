import React from 'react'
import {expect} from 'chai';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import Radio from '../index';
import RadioGroup from '../RadioGroup';
import sinon from 'sinon';

configure({adapter: new Adapter()});

describe('test radio component', () => {
it("should load dom element when setting component", () => {
    const dom = mount(<Radio checked={true}/>);
    const input = dom.find(".hui-radio__input");
    expect(dom.find('.hui-radio')).to.have.lengthOf(1);
    expect(dom.find('.hui-radio__icon.is-checked')).to.have.lengthOf(1);
    expect(dom.state().checked).to.equal(true);
    input.simulate('change', {target: {checked: false}});
    expect(dom.find('.hui-radio__icon.is-checked')).to.have.lengthOf(0);
    dom.setProps({'checked': true});
    expect(dom.state().checked).to.equal(true);
  })
it("should change focus state when setting focus", () => {
    const dom = mount(<Radio checked={true}/>);
    const input = dom.find(".hui-radio__input");
    expect(input.simulate('focus'));
    expect(dom.find('.hui-radio__icon.is-focus')).to.have.lengthOf(1);
    expect(input.simulate('blur'));
    expect(dom.find('.hui-radio__icon.is-focus')).to.have.lengthOf(0);
  })
it("should disabled component when setting disabled props", () => {
    const dom = mount(<Radio disabled/>);
    const input = dom.find(".hui-radio__input");
    expect(dom.find('.hui-radio__icon.is-disabled')).to.have.lengthOf(1);
    expect(input.getDOMNode().getAttribute('disabled')).to.equal("");
    dom.setProps({'disabled': false})
    expect(input.getDOMNode().getAttribute('disabled')).to.equal(null);
    expect(dom.find('.hui-radio__icon.is-disabled')).to.have.lengthOf(0);
  })
it("should call onChange function when setting onChange callback", () => {
    const onChange = sinon.spy();
    const dom = mount(<Radio onChange={onChange}/>);
    const input = dom.find(".hui-radio__input");
    input.simulate('change', {target: {checked: true}});
    expect(onChange).to.have.property("callCount", 1);
  })
it("should load Group dom when initing RadioGroup component", () => {
    const dom = mount(
      <RadioGroup value={"2"}>
        <Radio value={"1"}></Radio>
        <Radio value={"2"}></Radio>
      </RadioGroup>
    )
    expect(dom.find('.hui-radio-group')).to.have.lengthOf(1);
    expect(dom.find(".hui-radio-group").childAt(0).state().checked).to.equal(false);
    expect(dom.find(".hui-radio-group").childAt(1).state().checked).to.equal(true);
    dom.setProps({value: "1"});
    expect(dom.find(".hui-radio-group").childAt(0).state().checked).to.equal(true);
    expect(dom.find(".hui-radio-group").childAt(1).state().checked).to.equal(false);
  })
})
