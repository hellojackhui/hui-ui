import React from 'react'
import {expect} from 'chai';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import BackTop from '../index';

configure({adapter: new Adapter()});

describe('test backTop component', () => {
  it("should show dom element when initing component", () => {
      const dom = mount(
        <BackTop>
          <div>up</div>
        </BackTop>
      )
      expect(dom.find('.hui-backtop')).to.have.lengthOf(1);
    })
})
