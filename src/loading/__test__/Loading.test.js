import React from 'react'
import {expect} from 'chai';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import Loading from '../index';
import sinon from 'sinon';

configure({adapter: new Adapter()});

describe('test loading component', () => {
    it('should load dom element when initing component', () => {
      const l1 = mount(<Loading text={"正在加载中"} loading={true}/>);
      expect(l1.find(".hui-loading")).to.have.lengthOf(1);
      expect(l1.find(".hui-loading__wrap")).to.have.lengthOf(1);
      expect(l1.find(".hui-loading").getDOMNode().style.position).to.equal("relative")
      expect(document.body.classList.contains('.hui-loading--overflow')).to.equal(false);
      expect(l1.find(".hui-loading__text").text()).to.equal("正在加载中");
    })
  it("should disable loading icon when setting disabled prop", () => {
      const l1 = mount(<Loading text={"正在加载中"} loading={true}/>);
      expect(l1.find(".hui-loading__wrap")).to.have.lengthOf(1);
      l1.setProps({loading: false});
      expect(l1.find(".hui-loading__wrap")).to.have.lengthOf(0);
    })
    it("should disabled to scroll when setting fullscreen prop", () => {
      const l1 = mount(<Loading text={"正在加载中"} loading={true} fullScreen/>);
      expect(l1.find(".hui-loading").getDOMNode().style.position).to.equal("fixed");
      l1.setProps({loading: false});
      l1.unmount();
    })
    it("should change color when setting color prop", () => {
      const l1 = mount(<Loading text={"正在加载中"} loading={true} color={"#ff0000"}/>);
      expect(l1.find(".hui-loading__wrap circle").getDOMNode().getAttribute("stroke")).to.equal("#ff0000");
    })
})
