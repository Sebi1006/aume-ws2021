import React from 'react'
import { configure, shallow, mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import Adapter from 'enzyme-adapter-react-16'
import i18n from '../../testSetup/i18nForTest'
import CarConfig from '../../../pages/profile/carConfig'
import 'jest-canvas-mock'

configure({ adapter: new Adapter() })

it('renders without crashing', () => {
  mount(
    <CarConfig>
      <I18nextProvider i18n={i18n}/>
    </CarConfig>,
  )
})

it('renders component contents', () => {
  const wrapper = shallow(
    <CarConfig>
      <I18nextProvider i18n={i18n}/>
    </CarConfig>,
  )

  expect(wrapper.isEmptyRender())
    .toEqual(false)
})
