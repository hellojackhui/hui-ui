import React from "react";
import Adapter from 'enzyme-adapter-react-16';
import {configure, mount} from 'enzyme';
import Tag from '../index';
import {expect} from 'chai';
import sinon from 'sinon';

configure({adapter: new Adapter()});

describe('test tag component', () => {
it('should load tag element when initing component', () => {
    const tag = mount(<Tag type="info">123</Tag>)
    expect(tag.props().type).to.equal('info');
    expect(tag.find('.hui-tag')).to.have.lengthOf(1);
    expect(tag.find('.hui-tag').text()).to.equal('123');
  })
it('should show different type of tag when setting different type', () => {
    const tag = mount(<Tag type="info"></Tag>);
    expect(tag.find('.hui-tag--info')).to.have.lengthOf(1);
    tag.setProps({type: 'gray'});
    expect(tag.find('.hui-tag--gray')).to.have.lengthOf(1);
    tag.setProps({type: 'gray'});
    expect(tag.find('.hui-tag--gray')).to.have.lengthOf(1);
    tag.setProps({type: 'success'});
    expect(tag.find('.hui-tag--success')).to.have.lengthOf(1);
    tag.setProps({type: 'warning'});
    expect(tag.find('.hui-tag--warning')).to.have.lengthOf(1);
    tag.setProps({type: 'danger'});
    expect(tag.find('.hui-tag--danger')).to.have.lengthOf(1);
  })
it('should show close icon when setting closable prop', () => {
    const closeFunc = sinon.spy();
    const tag = mount(<Tag type="info" closable></Tag>);
    expect(tag.find('.hui-tag__close')).to.have.lengthOf(1);
    tag.find('.hui-tag__close').simulate('click');
    expect(tag.state().visible).to.equal(false);
    const tag2 = mount(<Tag type="info" closable onClose={closeFunc}></Tag>);
    tag2.find('.hui-tag__close').simulate('click');
    expect(closeFunc).to.have.property('callCount', 1);
  })
it('should show border when setting hit prop', () => {
    const tag = mount(<Tag type="info"></Tag>);
    expect(tag.find('.is-hit')).to.have.lengthOf(0);
    tag.setProps({hit: false})
    expect(tag.find('.is-hit')).to.have.lengthOf(0);
    tag.setProps({hit: true})
    expect(tag.find('.is-hit')).to.have.lengthOf(1);
  })
it('should change backgroundcolor when setting color prop', () => {
    const tag = mount(<Tag type="info" color="red"></Tag>);
    const oldhtml = tag.find('.hui-tag').html();
    tag.setProps({color: 'green'});
    expect(tag.find('.hui-tag').html() === oldhtml).to.equal(false);
  })
})
