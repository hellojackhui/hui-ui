import React from 'react'
import {expect} from 'chai';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import RadioButton from '../RadioButton';
import RadioGroup from '../RadioGroup';
import sinon from 'sinon';

configure({adapter: new Adapter()});

describe('test radio component', () => {
it("should load dom element when setting component", () => {
    const dom = mount(<RadioButton checked={true}/>);
    const input = dom.find(".hui-radio-button__input");
    expect(dom.find('.hui-radio-button')).to.have.lengthOf(1);
    expect(dom.find('.hui-radio-button__wrap.is-checked')).to.have.lengthOf(1);
    expect(dom.state().checked).to.equal(true);
    input.simulate('change', {target: {checked: false}});
    expect(dom.find('.hui-radio-button__wrap.is-checked')).to.have.lengthOf(0);
    dom.setProps({'checked': true});
    expect(dom.state().checked).to.equal(true);
  })
it("should change focus state when setting focus", () => {
    const dom = mount(<RadioButton checked={true}/>);
    const input = dom.find(".hui-radio-button__input");
    expect(input.simulate('focus'));
    expect(dom.find('.hui-radio-button__wrap.is-focus')).to.have.lengthOf(1);
    expect(input.simulate('blur'));
    expect(dom.find('.hui-radio-button__wrap.is-focus')).to.have.lengthOf(0);
  })
it("should disabled component when setting disabled props", () => {
    const dom = mount(<RadioButton disabled/>);
    const input = dom.find(".hui-radio-button__input");
    expect(dom.find('.hui-radio-button__wrap.is-disabled')).to.have.lengthOf(1);
    expect(input.getDOMNode().getAttribute('disabled')).to.equal("");
    dom.setProps({'disabled': false})
    expect(input.getDOMNode().getAttribute('disabled')).to.equal(null);
    expect(dom.find('.hui-radio-button__wrap.is-disabled')).to.have.lengthOf(0);
  })
it("should call onChange function when setting onChange callback", () => {
    const onChange = sinon.spy();
    const dom = mount(<RadioButton onChange={onChange}/>);
    const input = dom.find(".hui-radio-button__input");
    input.simulate('change', {target: {checked: true}});
    expect(onChange).to.have.property("callCount", 1);
  })
it("should load Group dom when initing RadioGroup component", () => {
    const func1 = sinon.spy();
    const dom = mount(
      <RadioGroup value={"2"} onChange={func1}>
        <RadioButton value={"1"}>1</RadioButton>
        <RadioButton value={"2"}>2</RadioButton>
      </RadioGroup>
    )
    const dom2 = mount(
      <RadioGroup />
    )
    const dom3 = mount(
      <RadioGroup>
        <div>123</div>
        <RadioButton value={"1"}></RadioButton>
      </RadioGroup>
    )
    const domInput = dom.find(".hui-radio-group").childAt(0).find('.hui-radio-button__input');
    expect(dom.find('.hui-radio-group')).to.have.lengthOf(1);
    expect(dom.find(".hui-radio-group").childAt(0).state().checked).to.equal(false);
    expect(dom.find(".hui-radio-group").childAt(1).state().checked).to.equal(true);
    dom.setProps({value: "1"});
    expect(dom.find(".hui-radio-group").childAt(0).state().checked).to.equal(true);
    expect(dom.find(".hui-radio-group").childAt(1).state().checked).to.equal(false);
    expect(dom2.find(".hui-radio-group").children()).to.have.lengthOf(0);
    expect(dom3.find(".hui-radio-group").children()).to.have.lengthOf(1);
    domInput.simulate('change', {target: {checked: false}});
    expect(func1).to.have.property('callCount', 0);
  })
})
