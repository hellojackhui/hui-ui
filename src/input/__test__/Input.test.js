import React from 'react'
import {expect} from 'chai';
import {mount} from 'enzyme';
import sinon from 'sinon';
import Input from '../index';
import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'

configure({adapter: new Adapter()});

describe('test Input component', () => {
it("should load dom element when initing component", () => {
    const dom = mount(<Input value={'123'} />);
    expect(dom.find('.hui-input')).to.have.lengthOf(1);
    expect(dom.props().type).to.equal('text');
    expect(dom.find('.hui-input__inner').getDOMNode().getAttribute('value')).to.equal('123');
  })
it("should change different mode when setting type prop", () => {
    const dom = mount(<Input type="textarea" value={'123'} />);
    expect(dom.find('.hui-textarea')).to.have.lengthOf(1);
    dom.setProps({'type': "text"});
    expect(dom.find('.hui-input')).to.have.lengthOf(1);
  })
it("should load icon when setting icon type", () => {
    const iconFunc = sinon.spy();
    const dom = mount(<Input value={'123'} icon={'search'} onIconClick={iconFunc} />);
    expect(dom.find('.hui-input__icon')).to.have.lengthOf(1);
    // expect(dom.find('.hui-input__icon').hasClass('.hui-icon-search')).to.equal(true);
    dom.find('.hui-input__icon').simulate('click');
    expect(iconFunc).to.have.property('callCount', 1);
  })
it("should disabled input when setting disabled prop", () => {
    const dom = mount(<Input value={'123'} disabled/>);
    expect(dom.find('.hui-input').hasClass('is-disabled')).to.equal(true);
    dom.setProps({'disabled': false});
    expect(dom.find('.hui-input').hasClass('is-disabled')).to.equal(false);
  })
it("should limit input length when setting maxlength or minlength prop", () => {
    const dom = mount(<Input value="123" maxLength={3} />);
    dom.find('.hui-input__inner').simulate('change', {target: {value: '1234'}});
    expect(dom.find('.hui-input__inner').getDOMNode().getAttribute('value')).to.equal('123');
    dom.setProps({'minLength': 3});
    dom.find('.hui-input__inner').simulate('change', {target: {value: '12'}});
    expect(dom.find('.hui-input__inner').getDOMNode().getAttribute('value')).to.equal('123');
  })
it("should change component size when setting size prop", () => {
    const dom = mount(<Input value="123" size={'large'} />);
    expect(dom.find('.hui-input__large')).to.have.lengthOf(1);
    dom.setProps({'size': 'small'});
    expect(dom.find('.hui-input__small')).to.have.lengthOf(1);
    dom.setProps({'size': 'mini'});
    expect(dom.find('.hui-input__mini')).to.have.lengthOf(1);
  })
it("should become focus when setting input in focuing state", () => {
    const focusFunc = sinon.spy();
    const blurFunc = sinon.spy();
    const dom = mount(<Input value="123" onFocus={focusFunc} onBlur={blurFunc} />);
    dom.find('.hui-input__inner').simulate('focus');
    expect(focusFunc).to.have.property('callCount', 1);
    dom.find('.hui-input__inner').simulate('blur');
    expect(blurFunc).to.have.property('callCount', 1);
  })
it("should call onchange function when setting onchange callback", () => {
    const onchangeFunc = sinon.spy();
    const dom = mount(<Input value="123" onChange={onchangeFunc} trim={true} />);
    dom.find('.hui-input__inner').simulate('change', {target: {value: '1234'}});
    expect(onchangeFunc).to.have.property('callCount', 1);
    dom.find('.hui-input__inner').simulate('blur');
    expect(onchangeFunc).to.have.property('callCount', 2);
  })
it("should call calTextArea function when setting textarea callback", () => {
    const onchangeFunc = sinon.spy();
    const dom = mount(<Input value="123" autoSize type="textarea" minRows={1} maxRows={3} onChange={onchangeFunc} />);
    dom.find('.hui-textarea__inner').simulate('change', {target: {value: '1232222222222222222224'}});
    expect(onchangeFunc).to.have.property('callCount', 1);
  })
it("contain different options", () => {
    const dom = mount(<Input value="123" trim={true} icon={'search'} prepend={'123'} append={'456'}/>);
    dom.find('.hui-input__inner').simulate('focus');
    dom.find('.hui-input__inner').simulate('change', {target: {value: '1234'}});
    dom.find('.hui-input__inner').simulate('blur');
    dom.find('.hui-input__icon').simulate('click');
    expect(dom.find('.hui-input-group__prepend').text()).to.equal('123');
    expect(dom.find('.hui-input-group__append').text()).to.equal('456');
  })
})
