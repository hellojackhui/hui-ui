import React from 'react'
import {expect} from 'chai';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import sinon from 'sinon';
import CheckboxGroup from '../CheckboxGroup';
import Checkbox from '../index';

configure({adapter: new Adapter()});

describe('test checkboxgroup component', () => {
  it('should load element when initing component', () => {
      const dom = mount(
        <CheckboxGroup value="1">
          <Checkbox label="1">1</Checkbox>
          <Checkbox label="2">2</Checkbox>
        </CheckboxGroup>
      )
      expect(dom.find('.hui-checkbox-group').childAt(0).find('.hui-checkbox__input').hasClass('is-checked')).to.equal(true);
      expect(dom.find('.hui-checkbox-group').childAt(1).find('.hui-checkbox__input').hasClass('is-checked')).to.equal(false);
    })
  it('should limit unselect when setting min prop', () => {
    const dom = mount(
    <CheckboxGroup value={["1", "3"]} min="2" max="3">
      <Checkbox label="1" trueLabel="no1">1</Checkbox>
      <Checkbox label="2" trueLabel="no2">2</Checkbox>
      <Checkbox label="3" trueLabel="no3">3</Checkbox>
      <Checkbox label="4" trueLabel="no4">4</Checkbox>
    </CheckboxGroup>
    )
    expect(dom.find('.hui-checkbox-group').childAt(0).find('.hui-checkbox__input').hasClass('is-checked')).to.equal(true);
    // 设置min
    const box2 = dom.find('.hui-checkbox-group').childAt(0);
    const inputdom = document.createElement('input');
    inputdom.checked = true;
    box2.simulate('change', {target: inputdom});
    expect(dom.find('.hui-checkbox-group').childAt(0).find('.hui-checkbox__input').hasClass('is-checked')).to.equal(true);
    expect(dom.state().options[0]).to.equal("1");
  })
  it('should limit select when setting max prop', () => {
    const dom = mount(
    <CheckboxGroup value={['1', '3', '4']} min="2" max="3">
      <Checkbox label="1" trueLabel="no1">1</Checkbox>
      <Checkbox label="2" trueLabel="no2">2</Checkbox>
      <Checkbox label="3" trueLabel="no3">3</Checkbox>
      <Checkbox label="4" trueLabel="no4">4</Checkbox>
    </CheckboxGroup>
    )
    const box3 = dom.find('.hui-checkbox-group').childAt(1);
    const inputdom2 = document.createElement('input');
    inputdom2.checked = true;
    box3.simulate('change', {target: inputdom2});
    expect(dom.find('.hui-checkbox-group').childAt(1).find('.hui-checkbox__input').hasClass('is-checked')).to.equal(false);
    expect(dom.state().options[1]).to.equal("3");
  })
});


