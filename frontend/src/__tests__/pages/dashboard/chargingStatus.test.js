import React from 'react'
import { configure, shallow, mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import Adapter from 'enzyme-adapter-react-16'
import ChargingStatus from '../../../pages/dashboard/chargingStatus'
import i18n from '../../testSetup/i18nForTest'
import 'jest-canvas-mock'

configure({ adapter: new Adapter() })

it('renders without crashing', () => {
  mount(
    <ChargingStatus>
      <I18nextProvider i18n={i18n}/>
    </ChargingStatus>,
  )
})

it('renders component contents', () => {
  const wrapper = shallow(
    <ChargingStatus>
      <I18nextProvider i18n={i18n}/>
    </ChargingStatus>,
  )

  expect(wrapper.isEmptyRender())
    .toEqual(false)
})
