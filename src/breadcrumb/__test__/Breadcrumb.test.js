import React from 'react'
import {expect} from 'chai';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import BreadCrumb from '../index';

configure({adapter: new Adapter()});

describe('test BreadCrumb component', () => {
it('should load component when initing component', () => {
    const dom = mount(
        <BreadCrumb>
          <BreadCrumb.Item>首页</BreadCrumb.Item>
          <BreadCrumb.Item>次页</BreadCrumb.Item>
          <BreadCrumb.Item>尾页</BreadCrumb.Item>
        </BreadCrumb>
    );
    expect(dom.find('.hui-breadcrumb')).to.have.lengthOf(1);
    expect(dom.find('.hui-breadcrumb').children()).to.have.lengthOf(3);
  })
it('should show active breadcrumbitem when setting active prop', () => {
    const dom = mount(
        <BreadCrumb>
          <BreadCrumb.Item>首页</BreadCrumb.Item>
          <BreadCrumb.Item>次页</BreadCrumb.Item>
          <BreadCrumb.Item active>尾页</BreadCrumb.Item>
        </BreadCrumb>
    );
    expect(dom.find('.hui-breadcrumb-item.is-highlight')).to.have.lengthOf(1);
    expect(dom.find('.hui-breadcrumb-item.is-highlight .hui-breadcrumb-item__wrap').text()).to.equal('尾页');
  })
  it('should change seperator when setting seperator prop', () => {
    const dom = mount(
        <BreadCrumb>
          <BreadCrumb.Item>首页</BreadCrumb.Item>
        </BreadCrumb>
    );
    expect(dom.find('.hui-breadcrumb-item .hui-breadcrumb-item__seperator').at(0).text()).to.equal('/');
    dom.setProps({seperator: '@'});
    expect(dom.find('.hui-breadcrumb-item .hui-breadcrumb-item__seperator').at(0).text()).to.equal('@');
  })
})
