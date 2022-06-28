import React from 'react'
import { configure, shallow, mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import Adapter from 'enzyme-adapter-react-16'
import PowerPrice from '../../../pages/dashboard/powerPrice'
import i18n from '../../testSetup/i18nForTest'
import 'jest-canvas-mock'

configure({ adapter: new Adapter() })

it('renders without crashing', () => {
  mount(<PowerPrice><I18nextProvider i18n={i18n}/></PowerPrice>)
})

it('renders component contents', () => {
  const wrapper = shallow(<PowerPrice><I18nextProvider i18n={i18n}/></PowerPrice>)

  expect(wrapper.isEmptyRender())
    .toEqual(false)
})
