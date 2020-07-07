import React from 'react'
import {expect} from 'chai';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import Steps from '../index';

configure({adapter: new Adapter()});

describe('test steps component', () => {
it('should load dom when initing component', () => {
    let dom = mount(
      <Steps active={1} direction="vertical">
        <Steps.Step title="步骤 1" description="这是一段很长很长很长的描述性文字"></Steps.Step>
        <Steps.Step title="步骤 2" description="这是一段很长2222很长很长的描述性文字"></Steps.Step>
        <Steps.Step title="步骤 3" description="这是一段很长很长很长的描述性文字"></Steps.Step>
      </Steps>
    );
    expect(dom.find('.hui-steps')).to.have.lengthOf(1);
    expect(dom.find('.hui-step')).to.have.lengthOf(3);
    expect(dom.props().direction).to.equal("vertical");
    expect(dom.find(Steps.Step).first().props().status).to.equal('finish');
    expect(dom.find(Steps.Step).at(1).props().status).to.equal('process');
    expect(dom.find(Steps.Step).at(2).props().status).to.equal('wait');
    expect(dom.find('.hui-step__description').at(0).text()).to.equal('这是一段很长很长很长的描述性文字');
    expect(dom.find('.hui-step__description').at(1).text()).to.equal('这是一段很长2222很长很长的描述性文字');
    expect(dom.find('.hui-step__title').at(0).text()).to.equal('步骤 1');
    expect(dom.find('.hui-step__title').at(1).text()).to.equal('步骤 2');
    dom.setProps({active: 2, direction: 'horizontal'});
    expect(dom.props().direction).to.equal("horizontal");
    expect(dom.find(Steps.Step).first().props().status).to.equal('finish');
    expect(dom.find(Steps.Step).at(1).props().status).to.equal('finish');
    expect(dom.find(Steps.Step).at(2).props().status).to.equal('process');
  })
it('should change space when setting different space', () => {
    let dom = mount(
      <Steps space={200} active={1} direction="vertical">
        <Steps.Step title="步骤 1" description="这是一段很长很长很长的描述性文字"></Steps.Step>
        <Steps.Step title="步骤 2" description="这是一段很长2222很长很长的描述性文字"></Steps.Step>
      </Steps>
    );
    expect(dom.props().space).to.equal(200);
    expect(dom.find(Steps.Step).at(0).props().style.height).to.equal('200px');
    dom.setProps({space: 100});
    expect(dom.find(Steps.Step).at(0).props().style.height).to.equal('100px');
    dom.setProps({direction: 'horizontal'});
    expect(dom.find(Steps.Step).at(0).props().style.width).to.equal('100px');
  })
})
