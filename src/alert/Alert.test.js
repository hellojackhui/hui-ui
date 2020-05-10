import React from "react";
import Adapter from 'enzyme-adapter-react-16';
import {configure, mount} from 'enzyme';
import Alert from './index';
import {expect} from 'chai';

configure({adapter: new Adapter()});

describe('test Alert component', () => {
it('should send precise props when initing component', () => {
    const component = mount(<Alert title="123" description="345" />);
    expect(component.props().title).to.equal("123");
    expect(component.props().description).to.equal('345');
  });
it('should load dom structure when initing component', () => {
    const dom = mount(<Alert title="123" description="345" />);
    expect(dom.find('.hui-alert')).to.have.lengthOf(1);
    expect(dom.find('.hui-alert__title').text()).to.equal('123');
    expect(dom.find('.hui-alert__description').text()).to.equal('345');
  });
it('should show different alert style when setting multiple type props', () => {
    const dom = mount(<Alert type="info" title="123" />);
    expect(dom.find('.hui-alert--info')).to.have.lengthOf(1);
    dom.setProps({type: 'error'});
    expect(dom.find('.hui-alert--error')).to.have.lengthOf(1);
    dom.setProps({type: 'success'});
    expect(dom.props().type).to.equal('success');
  });
it('should enable to close alert when setting close icon', () => {
    const dom = mount(<Alert type="info" closable/>);
    expect(dom.find('.hui-alert__close')).to.have.lengthOf(1);
    expect(dom.state().visible).to.equal(true);
    dom.find('.hui-alert__close').simulate('click');
    expect(dom.state().visible).to.equal(false);

  })
it('should show closetext when setting closetext', () => {
    const dom = mount(<Alert type="info" closeText="关闭" />);
    expect(dom.find('.hui-alert__close.hui-icon-close')).to.have.lengthOf(0);
    expect(dom.find('.hui-alert__close.is-customed')).to.have.lengthOf(1);
    expect(dom.find('.hui-alert__close.is-customed').text()).to.equal("关闭");
  });
  it('should show main icon when setting showIcon props', () => {
    const dom = mount(<Alert type="info" showIcon />);
    expect(dom.find('.hui-alert__icon')).to.have.lengthOf(1);
    expect(dom.find('.hui-icon-info-circle')).to.have.lengthOf(1);
    dom.setProps({type: 'success'});
    expect(dom.find('.hui-icon-check-circle')).to.have.lengthOf(1);
    dom.setProps({type: 'warning'});
    expect(dom.find('.hui-icon-exclamation-circle')).to.have.lengthOf(1);
    dom.setProps({type: 'error'});
    expect(dom.find('.hui-icon-times-circle')).to.have.lengthOf(1);
    dom.setProps({type: 'custom'});
    expect(dom.find('.hui-icon-check-circle')).to.have.lengthOf(1);
  })
})
