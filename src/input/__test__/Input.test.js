import React from 'react'
import {expect} from 'chai';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import Input from '../index';

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
    const dom = mount(<Input value={'123'} icon={'search'}/>);
    expect(dom.find('.hui-input__icon')).to.have.lengthOf(1);
    expect(dom.find('.hui-input__icon').hasClass('hui-icon-search')).to.equal(true);
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
})
