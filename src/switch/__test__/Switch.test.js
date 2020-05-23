import React from "react";
import Adapter from 'enzyme-adapter-react-16';
import {configure, mount} from 'enzyme';
import Switch from '../index';
import {expect} from 'chai';
import sinon from 'sinon';

configure({adapter: new Adapter()});

describe('test switch component', () => {
it('should load dom element when initing component', () => {
    const dom = mount(<Switch value={true} />);
    expect(dom.find('.hui-switch')).to.have.lengthOf(1);
    expect(dom.state().checked).to.equal(true);
    dom.find('.hui-switch__input').simulate('change', {target: {value: false}});
    expect(dom.find('.hui-switch-trunk').hasClass('is-disabled')).to.equal(false);
  })
it('should disabled element when setting disabled component', () => {
    const dom = mount(<Switch value={true} />);
    expect(dom.find('.hui-switch-trunk.is-disabled')).to.have.lengthOf(0);
    dom.setProps({disabled: true});
    expect(dom.find('.hui-switch-trunk.is-disabled')).to.have.lengthOf(1);
  })
it('should change value when setting custom value', () => {
    const dom = mount(<Switch value={'2'} onValue={'1'} offValue={'2'} onColor={'red'} offColor={'green'} onText={'开'} offText={'关'} />);
    expect(dom.find('.hui-switch__input').html().indexOf('checked') > -1).to.equal(false);
    expect(dom.find('.hui-switch-title--next').text()).to.equal('关');
    expect(dom.find('.hui-switch-trunk').prop('style').backgroundColor).to.equal('green');
    dom.setProps({value: '1'});
    expect(dom.find('.hui-switch-title--prev').text()).to.equal('开');
    expect(dom.find('.hui-switch-trunk').prop('style').backgroundColor).to.equal('red');
    dom.setProps({onValue: null, offValue: null});
    dom.setProps({value: '2'});
    expect(dom.state().checked).to.equal('2');
    dom.find('.hui-switch__input').simulate('change', {target: {value: '1'}});
    // dom.find('.hui-switch__input').simulate('change', {target: {value: false}});
  })
it('should activite change callback when setting onchange callback', () => {
    const changefunc = sinon.spy();
    const dom = mount(<Switch value={true} onChange={changefunc} />);
    const Input = document.createElement('input');
    Input.type = 'checkbox';
    Input.checked = true;
    dom.find('input[type="checkbox"]').simulate('change', {target: Input});
    expect(changefunc).to.have.property('callCount', 1);
  })
it('should activite blur or focus callback when setting onchange callback', () => {
    const focusfunc = sinon.spy();
    const blurfunc = sinon.spy();
    const dom = mount(<Switch value={true} onFocus={focusfunc} onBlur={blurfunc} allowFocus/>);
    dom.find('.hui-switch__input').simulate('focus');
    expect(focusfunc).to.have.property('callCount', 1);
    dom.find('.hui-switch__input').simulate('blur');
    expect(blurfunc).to.have.property('callCount', 1);
    dom.setProps({allowFocus: false});
    dom.find('.hui-switch__input').simulate('focus');
    expect(focusfunc).to.have.property('callCount', 1);
    dom.find('.hui-switch__input').simulate('blur');
    expect(blurfunc).to.have.property('callCount', 1);
  })
})
