import React from 'react'
import {expect} from 'chai';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import Skeleton from '../index';
import SkeletonButton from '../SkeletonButton';

configure({adapter: new Adapter()});


describe('test skeleton component', () => {
it("should load dom element when setting component", () => {
    const s1 = mount(<Skeleton />)
    expect(s1.find(".hui-skeleton")).to.have.lengthOf(1);
    expect(s1.props().loading).to.equal(true);
    expect(s1.props().title).to.equal(true);
  })
  it("should change loading when setting load prop", () => {
    const s1 = mount(<Skeleton loading/>)
    expect(s1.find(".hui-skeleton__wrapper")).to.have.lengthOf(1);
    s1.setProps({'loading': false});
    expect(s1.find(".hui-skeleton__wrapper")).to.have.lengthOf(0);
  })
  it("should load active animation when setting prop", () => {
    const s1 = mount(<Skeleton active/>)
    expect(s1.find(".hui-skeleton").hasClass("with-active")).to.equal(true);
  })
  it("should load different rows when setting paragraph props", () => {
    const s1 = mount(<Skeleton paragraph={{"row": 3, width: "200px"}}/>);
    expect(s1.find("li")).to.have.lengthOf(3);
    expect(s1.find("li").at(1).getDOMNode().style.width).to.equal("200px");
    expect(s1.find("li").at(2).getDOMNode().style.width).to.equal("61%");
  })
  it("should load avatar when setting avatar props", () => {
    const s1 = mount(<Skeleton avatar></Skeleton>);
    expect(s1.find(".hui-skeleton").hasClass("with-avatar")).to.equal(true);
  })
it("should load skeleton button when setting component", () => {
    const s1 = mount(<SkeletonButton></SkeletonButton>);
    expect(s1.find(".hui-skeleton-button")).to.have.lengthOf(1);
    s1.setProps({'active': true, 'size': 'lg', 'shape': "round"});
    expect(s1.find(".hui-skeleton-button").hasClass("hui-skeleton-button-lg")).to.equal(true);
    expect(s1.find(".hui-skeleton-button").hasClass("is-active")).to.equal(true);
    expect(s1.find(".hui-skeleton-button").hasClass("hui-skeleton-button-round")).to.equal(true);
    s1.setProps({'active': false, 'size': 'sm', 'shape': "circle"});
    expect(s1.find(".hui-skeleton-button").hasClass("hui-skeleton-button-sm")).to.equal(true);
    expect(s1.find(".hui-skeleton-button").hasClass("is-active")).to.equal(false);
    expect(s1.find(".hui-skeleton-button").hasClass("hui-skeleton-button-circle")).to.equal(true);
  })
it("should load skeleton circle when setting component", () => {
    const s1 = mount(<Skeleton.Circle></Skeleton.Circle>);
    expect(s1.find(".hui-skeleton-circle")).to.have.lengthOf(1);
    s1.setProps({'active': true, 'size': 'lg', 'shape': "round"});
    expect(s1.find(".hui-skeleton-circle").hasClass("hui-skeleton-circle-lg")).to.equal(true);
    expect(s1.find(".hui-skeleton-circle").hasClass("is-active")).to.equal(true);
    expect(s1.find(".hui-skeleton-circle").hasClass("hui-skeleton-circle-round")).to.equal(true);
    s1.setProps({'active': false, 'size': 'sm', 'shape': "circle"});
    expect(s1.find(".hui-skeleton-circle").hasClass("hui-skeleton-circle-sm")).to.equal(true);
    expect(s1.find(".hui-skeleton-circle").hasClass("is-active")).to.equal(false);
    expect(s1.find(".hui-skeleton-circle").hasClass("hui-skeleton-circle-circle")).to.equal(true);
  })
  it("should load skeleton input when setting component", () => {
    const s1 = mount(<Skeleton.Input></Skeleton.Input>);
    expect(s1.find(".hui-skeleton-input")).to.have.lengthOf(1);
    s1.setProps({'size': 'lg'});
    expect(s1.find(".hui-skeleton-input").hasClass("hui-skeleton-input-lg")).to.equal(true);
    s1.setProps({'size': 'sm'});
    expect(s1.find(".hui-skeleton-input").hasClass("hui-skeleton-input-sm")).to.equal(true);
  })
})
