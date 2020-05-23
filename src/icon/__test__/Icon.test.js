import React from 'react'
import {expect} from 'chai';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import Icon from '../index';

configure({adapter: new Adapter()});

describe('test icon component', () => {
    it('should load dom element when initing component', () => {
      const dom = mount(<Icon name="search"/>)
      expect(dom.find('.hui-icon')).to.have.lengthOf(1);
      expect(dom.find('.hui-icon-search')).to.have.length(1);
    })
})
