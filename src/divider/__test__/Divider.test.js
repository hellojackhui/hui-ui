import React from 'react'
import {expect} from 'chai';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import Divider from '../index';

configure({adapter: new Adapter()});

describe('test Divider component', () => {
it('should load dom when initing component', () => {
    let dom = mount(<Divider />);
    expect(dom.find('.hui-divider')).to.have.lengthOf(1);
    expect(dom.find('.hui-divider-horizontal')).to.have.lengthOf(1);
    dom = mount(<Divider dashed/>);
    expect(dom.find('.hui-divider-dashed')).to.have.lengthOf(1);
    dom = mount(<Divider type={"vertical"}/>);
    expect(dom.find('.hui-divider-vertical')).to.have.lengthOf(1);
  })
it('should set different align when initing text', () => {
    let dom = mount(<Divider>123</Divider>);
    expect(dom.find('.hui-divider-with-text')).to.have.lengthOf(1);
    expect(dom.find('.hui-divider-text-inner')).to.have.lengthOf(1);
    expect(dom.find('.hui-divider-text-inner').text()).to.equal("123");
    dom.setProps({'orientation': 'center'})
    expect(dom.find('.hui-divider-text-center')).to.have.lengthOf(1);
    dom.setProps({'orientation': 'left'})
    expect(dom.find('.hui-divider-text-left')).to.have.lengthOf(1);
    dom.setProps({'orientation': 'right'})
    expect(dom.find('.hui-divider-text-right')).to.have.lengthOf(1);
    dom.setProps({'plain': true})
    expect(dom.find('.hui-divider-plain')).to.have.lengthOf(1);
  })
})
