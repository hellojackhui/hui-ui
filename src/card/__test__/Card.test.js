import React from 'react'
import {expect} from 'chai';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import Card from '../index';

configure({adapter: new Adapter()});

describe('test card component', () => {
  it('should load element when setting component', () => {
    const dom = mount(<Card header={'你好'}>这是一张卡片</Card>)
    expect(dom.props().header).to.equal('你好');
    expect(dom.find('.hui-card')).to.have.lengthOf(1);
    expect(dom.find('.hui-card__header').text()).to.equal('你好');
    expect(dom.find('.hui-card__content').text()).to.equal('这是一张卡片');
  })
  it('should have different style when setting bodyStyle prop', () => {
    const dom = mount(<Card header={'你好'} />)
    const old = dom.find('.hui-card__content').html();
    dom.setProps({bodyStyle: {'border': '1px solid red'}});
    expect(dom.find('.hui-card__content').html() === old).to.equal(false);
  })
})
