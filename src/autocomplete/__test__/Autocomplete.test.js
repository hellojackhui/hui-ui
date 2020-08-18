import React from 'react'
import {expect} from 'chai';
import {mount} from 'enzyme';
import sinon from 'sinon';
import AutoComplete from '../index';
import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'

configure({adapter: new Adapter()});

describe('test Autocomplete component', () => {
  it('should load dom when initialing component', function() {
      const dom = mount(
      <AutoComplete
        placeholder="请输入内容"
        value={''}
        onFocus={e=>console.log('onFocus')}
        onBlur={e=>console.log('onblur')}
        fetchSuggestions={() => {}}
        onSelect={() => {}}
        triggerOnFocus={true}
      />)
      expect(dom.find('.hui-autocomplete')).to.have.lengthOf(1);
    })
})
