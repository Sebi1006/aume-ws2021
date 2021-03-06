import React from 'react'
import { configure, shallow, mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import Adapter from 'enzyme-adapter-react-16'
import ChargingMode from '../../../pages/dashboard/chargingMode'
import i18n from '../../testSetup/i18nForTest'
import 'jest-canvas-mock'

configure({ adapter: new Adapter() })

it('renders without crashing', () => {
  mount(<ChargingMode><I18nextProvider i18n={i18n}/></ChargingMode>)
})

it('renders component contents', () => {
  const wrapper = shallow(<ChargingMode><I18nextProvider i18n={i18n}/></ChargingMode>)

  expect(wrapper.isEmptyRender())
    .toEqual(false)
})
