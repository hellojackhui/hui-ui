import React from 'react'
import {expect} from 'chai';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import Checkbox from '../index';
import sinon from 'sinon';

configure({adapter: new Adapter()});

describe('test checkbox component', () => {
it('should load element when initing component', () => {
    const dom = mount(<Checkbox checked={true} label="label"/>);
    expect(dom.props().checked).to.equal(true);
    expect(dom.find(".hui-checkbox")).to.have.lengthOf(1);
    expect(dom.find(".hui-checkbox__input").hasClass('is-checked')).to.equal(true);
    expect(dom.find(".hui-checkbox__title").text()).to.equal('label');
  })
it('should change state after setting different state', () => {
    const dom = mount(<Checkbox checked={true} trueLabel="成功" falseLabel="失败"/>);
    expect(dom.state().checked).to.equal(true);
    expect(dom.find(".hui-checkbox__title").text()).to.equal('成功');
    dom.setProps({checked: false})
    expect(dom.state().checked).to.equal(false);
    expect(dom.find(".hui-checkbox__title").text()).to.equal('失败');
  })
it('should disabled checkbox when setting disabled prop', () => {
    const dom = mount(<Checkbox checked={true} disabled/>);
    expect(dom.find(".hui-checkbox__input").hasClass('is-disabled')).to.equal(true);
  })
it('should show indeterminate when setting indeterminate prop', () => {
    const dom = mount(<Checkbox checked={true} indeterminate/>);
    expect(dom.find(".hui-checkbox__input").hasClass('is-indeterminate')).to.equal(true);
    dom.setProps({indeterminate: false});
    expect(dom.find(".hui-checkbox__input").hasClass('is-indeterminate')).to.equal(false);
  })
it('should show focus when setting indeterminate prop', () => {
    const dom = mount(<Checkbox checked={true}/>);
    expect(dom.find(".hui-checkbox__input").hasClass('is-focus')).to.equal(false);
    dom.find('.hui-checkbox__original').simulate('focus');
    expect(dom.find(".hui-checkbox__input").hasClass('is-focus')).to.equal(true);
    dom.find('.hui-checkbox__original').simulate('blur');
    expect(dom.find(".hui-checkbox__input").hasClass('is-indeterminate')).to.equal(false);
  })
it('should active function when setting callback prop', () => {
    const onChangecb = sinon.spy();
    const dom = mount(<Checkbox checked={false} onChange={onChangecb} />);
    const Input = document.createElement('input');
    Input.checked = true;
    dom.find('input[type="checkbox"]').simulate('change', {target: Input});
    expect(onChangecb).to.have.property('callCount', 1);
  })
})
