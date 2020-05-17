import React from 'react'
import {expect} from 'chai';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import sinon from 'sinon';
import Button from './index';
import ButtonGroup from './ButtonGroup';

configure({adapter: new Adapter()});


describe('test button component', () => {
it('should load dom element when initing component', () => {
    const dom = mount(<Button>test1</Button>);
    expect(dom.find('.hui-button')).to.have.lengthOf(1);
    expect(dom.find('.hui-button span').text()).to.equal("test1");
    expect(dom.find('.hui-button__icon')).to.have.lengthOf(0);
    dom.setProps({loading: true});
    dom.find('.hui-button').simulate('click');
    expect(dom.find('.hui-button__icon')).to.have.lengthOf(1);
  })
it('should load different button when setting different type prop', () => {
    const dom = mount(<Button>test2</Button>)
    expect(dom.find('.hui-button').hasClass('hui-button--plain')).to.equal(true);
    dom.setProps({type: 'primary'})
    expect(dom.find('.hui-button').hasClass('hui-button--primary')).to.equal(true);
    dom.setProps({type: 'text'})
    expect(dom.find('.hui-button').hasClass('hui-button--text')).to.equal(true);
    dom.setProps({type: 'success'})
    expect(dom.find('.hui-button').hasClass('hui-button--success')).to.equal(true);
    dom.setProps({type: 'info'})
    expect(dom.find('.hui-button').hasClass('hui-button--info')).to.equal(true);
    dom.setProps({type: 'warning'})
    expect(dom.find('.hui-button').hasClass('hui-button--warning')).to.equal(true);
    dom.setProps({type: 'danger'})
    expect(dom.find('.hui-button').hasClass('hui-button--danger')).to.equal(true);
    dom.setProps({plain: true})
    expect(dom.find('.hui-button').hasClass('is-plain')).to.equal(true);
  })
it('should show disabled when setting disabled prop', () => {
    const dom = mount(<Button disabled>test3</Button>)
    expect(dom.find('.hui-button').hasClass('is-disabled')).to.equal(true);
    dom.setProps({disabled: false})
    expect(dom.find('.hui-button').hasClass('is-disabled')).to.equal(false);
  })
it('should show icon when setting icon prop', () => {
    const dom = mount(<Button loading>test4</Button>)
    expect(dom.find('.hui-button').hasClass('is-loading')).to.equal(true);
    expect(dom.find('.hui-button__loading')).to.have.lengthOf(1);
    dom.setProps({loading: false})
    expect(dom.find('.hui-button__loading')).to.have.lengthOf(0);
    dom.setProps({icon: 'user'})
    expect(dom.find('.hui-icon-user')).to.have.lengthOf(1);
    dom.setProps({icon: 'user', loading: true})
    expect(dom.find('.hui-icon-user')).to.have.lengthOf(0);
  })
it('should change different size when setting size prop', () => {
    const dom = mount(<Button size="small">test5</Button>)
    expect(dom.find('.hui-button--small')).to.have.lengthOf(1);
    dom.setProps({size: 'mini'})
    expect(dom.find('.hui-button--mini')).to.have.lengthOf(1);
  })
it('should shoe different buttontype when setting nativetype prop', () => {
    const dom = mount(<Button nativeType="submit">test5</Button>)
    expect(dom.find("button[type='submit']")).to.have.lengthOf(1);
    dom.setProps({nativeType: 'reset'})
    expect(dom.find("button[type='reset']")).to.have.lengthOf(1);
  })
it('should run callback function when setting onClick function', () => {
    const cb = sinon.spy();
    const dom = mount(<Button onClick={cb}>test5</Button>);
    dom.find('.hui-button').simulate('click');
    expect(cb).to.have.property('callCount', 1);
  })
it('should run ButtonGroup dom when setting ButtonGroup component', () => {
    const dom = mount(
      <ButtonGroup>
        <Button>test1</Button>
        <Button>test2</Button>
      </ButtonGroup>
    )
    expect(dom.find('.hui-button-group')).to.have.lengthOf(1);
  })
})
