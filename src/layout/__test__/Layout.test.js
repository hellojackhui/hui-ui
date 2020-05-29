import React from 'react'
import {expect} from 'chai';
import {mount} from 'enzyme';
import {Row, Column} from '../index.js';
import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'

configure({adapter: new Adapter()});

describe('Layout test', () => {
it('Basic layout', () => {
    const w1 = mount(
      <Row>
        <Column span="24"><div className="grid-content bg-purple-dark"></div></Column>
      </Row>
    );
    const w2 = mount(
      <Row>
        <Column span="12"><div className="grid-content bg-purple"></div></Column>
        <Column span="12"><div className="grid-content bg-purple-light"></div></Column>
      </Row>
    );
    const w3 = mount(
      <Row>
        <Column span="8"><div className="grid-content bg-purple"></div></Column>
        <Column span="8"><div className="grid-content bg-purple-light"></div></Column>
        <Column span="8"><div className="grid-content bg-purple"></div></Column>
      </Row>
    );
    const w4 = mount(
      <Row>
        <Column span="6"><div className="grid-content bg-purple"></div></Column>
        <Column span="6"><div className="grid-content bg-purple-light"></div></Column>
        <Column span="6"><div className="grid-content bg-purple"></div></Column>
        <Column span="6"><div className="grid-content bg-purple-light"></div></Column>
      </Row>
    );
    const w5 = mount(
      <Row>
        <Column span="4"><div className="grid-content bg-purple"></div></Column>
        <Column span="4"><div className="grid-content bg-purple-light"></div></Column>
        <Column span="4"><div className="grid-content bg-purple"></div></Column>
        <Column span="4"><div className="grid-content bg-purple-light"></div></Column>
        <Column span="4"><div className="grid-content bg-purple"></div></Column>
        <Column span="4"><div className="grid-content bg-purple-light"></div></Column>
      </Row>
    );
    const w6 = mount(
      <Row>
        <Column span="0"><div className="grid-content bg-purple"></div></Column>
      </Row>
    );
    expect(w1.find('.hui-row .hui-column-24 .grid-content')).to.have.lengthOf(1)
    expect(w1.find('.hui-row .hui-column-24').length).to.equal(1);
    expect(w2.find('.hui-row .hui-column-12').length).to.equal(2);
    expect(w3.find('.hui-row .hui-column-8').length).to.equal(3);
    expect(w4.find('.hui-row .hui-column-6').length).to.equal(4);
    expect(w5.find('.hui-row .hui-column-4').length).to.equal(6);
    expect(w6.find('.hui-row .hui-column-0').length).to.equal(1);
  });

  it('Column spacing', () => {
    const w = mount(
      <Row gutter="20">
        <Column span="6"><div className="grid-content bg-purple"></div></Column>
        <Column span="6"><div className="grid-content bg-purple"></div></Column>
        <Column span="6"><div className="grid-content bg-purple"></div></Column>
        <Column span="6"><div className="grid-content bg-purple"></div></Column>
      </Row>
    );
    expect(w.find('.hui-row .hui-column-6').length).to.equal(4);
    expect(w.find('.hui-row .hui-column-6').at(0).prop('style').paddingLeft).to.equal('10px');
    expect(w.find('.hui-row .hui-column-6').at(0).prop('style').paddingRight).to.equal('10px');
  })

  it('Hybrid layout', () => {
    const w1 = mount(
      <Row gutter="20">
        <Column span="16"><div className="grid-content bg-purple"></div></Column>
        <Column span="8"><div className="grid-content bg-purple"></div></Column>
      </Row>
    );
    const w2 = mount(
      <Row gutter="20">
        <Column span="8"><div className="grid-content bg-purple"></div></Column>
        <Column span="8"><div className="grid-content bg-purple"></div></Column>
        <Column span="4"><div className="grid-content bg-purple"></div></Column>
        <Column span="4"><div className="grid-content bg-purple"></div></Column>
      </Row>
    );
    const w3 = mount(
      <Row gutter="20">
        <Column span="4"><div className="grid-content bg-purple"></div></Column>
        <Column span="16"><div className="grid-content bg-purple"></div></Column>
        <Column span="4"><div className="grid-content bg-purple"></div></Column>
      </Row>
    );
    expect(w1.find('.hui-row .hui-column-16').length).to.equal(1);
    expect(w1.find('.hui-row .hui-column-8').length).to.equal(1);

    expect(w2.find('.hui-row .hui-column-8').length).to.equal(2);
    expect(w2.find('.hui-row .hui-column-4').length).to.equal(2);

    expect(w3.find('.hui-row .hui-column-16').length).to.equal(1);
    expect(w3.find('.hui-row .hui-column-4').length).to.equal(2);
  })

  it('Column offset', () => {
    const w1 = mount(
      <Row gutter="20">
        <Column span="6"><div className="grid-content bg-purple"></div></Column>
        <Column span="6" offset="6"><div className="grid-content bg-purple"></div></Column>
      </Row>
    );
    const w2 = mount(
      <Row gutter="20">
        <Column span="6" offset="6"><div className="grid-content bg-purple"></div></Column>
        <Column span="6" offset="6"><div className="grid-content bg-purple"></div></Column>
      </Row>
    );
    const w3 = mount(
      <Row gutter="20">
        <Column span="12" offset="6"><div className="grid-content bg-purple"></div></Column>
      </Row>
    );
    expect(w1.find('.hui-row .hui-column-6').length).to.equal(2);
    expect(w1.find('.hui-row .hui-column-6.hui-column-offset-6').length).to.equal(1);
    expect(w2.find('.hui-row .hui-column-6.hui-column-offset-6').length).to.equal(2);
    expect(w3.find('.hui-row .hui-column-12.hui-column-offset-6').length).to.equal(1);
  });

  it('Alignment', () => {
    const w1 = mount(
      <Row type="flex" className="row-bg">
        <Column span="6"><div className="grid-content bg-purple"></div></Column>
        <Column span="6"><div className="grid-content bg-purple-light"></div></Column>
        <Column span="6"><div className="grid-content bg-purple"></div></Column>
      </Row>
    );
    const w2 = mount(
      <Row type="flex" className="row-bg" justify="center">
        <Column span="6"><div className="grid-content bg-purple"></div></Column>
        <Column span="6"><div className="grid-content bg-purple-light"></div></Column>
        <Column span="6"><div className="grid-content bg-purple"></div></Column>
      </Row>
    );
    const w3 = mount(
      <Row type="flex" className="row-bg" justify="end">
        <Column span="6"><div className="grid-content bg-purple"></div></Column>
        <Column span="6"><div className="grid-content bg-purple-light"></div></Column>
        <Column span="6"><div className="grid-content bg-purple"></div></Column>
      </Row>
    );
    const w4 = mount(
      <Row type="flex" className="row-bg" justify="space-between">
        <Column span="6"><div className="grid-content bg-purple"></div></Column>
        <Column span="6"><div className="grid-content bg-purple-light"></div></Column>
        <Column span="6"><div className="grid-content bg-purple"></div></Column>
      </Row>
    );
    const w5 = mount(
      <Row type="flex" className="row-bg" justify="space-around">
        <Column span="6"><div className="grid-content bg-purple"></div></Column>
        <Column span="6"><div className="grid-content bg-purple-light"></div></Column>
        <Column span={6}><div className="grid-content bg-purple"></div></Column>
      </Row>
    );
    expect(w1.find('.hui-row--flex')).to.have.lengthOf(1);
    expect(w2.find('.hui-row--center')).to.have.lengthOf(1);
    expect(w3.find('.hui-row--end')).to.have.lengthOf(1);
    expect(w4.find('.hui-row--space-between')).to.have.lengthOf(1);
    expect(w5.find('.hui-row--space-around')).to.have.lengthOf(1);
  });

  it('Responsive Layout', () => {
    const w = mount(
      <Row gutter="10">
        <Column xs="8" sm="6" md="4" lg="3"><div className="grid-content bg-purple"></div></Column>
        <Column xs="4" sm="6" md="8" lg="9"><div className="grid-content bg-purple-light"></div></Column>
        <Column xs="4" sm="6" md="8" lg="9"><div className="grid-content bg-purple"></div></Column>
        <Column xs="8" sm="6" md="4" lg="3"><div className="grid-content bg-purple-light"></div></Column>
      </Row>
    );
    const w1 = mount(
      <Row gutter="10">
        <Column xs="0" sm="6" md="4" lg="3"><div className="grid-content bg-purple"></div></Column>
      </Row>
    );
    expect(w.find('.hui-column-24.hui-column-xs-8.hui-column-sm-6.hui-column-md-4.hui-column-lg-3').length).to.equal(2);
    expect(w.find('.hui-column-24.hui-column-xs-4.hui-column-sm-6.hui-column-md-8.hui-column-lg-9').length).to.equal(2);
    expect(w1.find('.hui-column-24.hui-column-xs-0.hui-column-sm-6.hui-column-md-4.hui-column-lg-3').length).to.equal(1);
  });

  it('Row custom tag', () => {
    const w = mount(
      <Row tag="section">
        <Column span="24"><div className="grid-content bg-purple-dark"></div></Column>
      </Row>
    );
    expect(w.find('section').length).to.equal(1);
  });

  it('Column custom tag', () => {
    const w = mount(
      <Row>
        <Column tag="section" span="24"><div className="grid-content bg-purple-dark"></div></Column>
      </Row>
    );
    expect(w.find('.hui-row section.hui-column-24').length).to.equal(1);
  });

  it('Row with align', () => {
    const w1 = mount(
      <Row type="flex" align="middle" className="row-bg">
        <Column span="6"><div className="grid-content bg-purple"></div></Column>
        <Column span="6"><div className="grid-content bg-purple-light"></div></Column>
        <Column span="6"><div className="grid-content bg-purple"></div></Column>
      </Row>
    );
    const w2 = mount(
      <Row type="flex" align="bottom" className="row-bg">
        <Column span="6"><div className="grid-content bg-purple"></div></Column>
        <Column span="6"><div className="grid-content bg-purple-light"></div></Column>
        <Column span="6"><div className="grid-content bg-purple"></div></Column>
      </Row>
    );
    expect(w1.find('.hui-row--middle')).to.have.lengthOf(1);
    expect(w2.find('.hui-row--bottom')).to.have.lengthOf(1);
  });

  it('Column with push', () => {
    const w = mount(
      <Row gutter="20">
        <Column span="12" push="12"><div className="grid-content bg-purple"></div></Column>
      </Row>
    );
    expect(w.find('.hui-column-12').hasClass('hui-column-push-12')).to.equal(true);
  });

  it('Column with pull', () => {
    const w = mount(
      <Row gutter="20">
        <Column span="12" pull={12}><div className="grid-content bg-purple"></div></Column>
      </Row>
    );
    expect(w.find('.hui-column-12').hasClass('hui-column-pull-12')).to.equal(true);
  });
});
