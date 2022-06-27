import React from 'react'
import { configure, shallow, mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import Adapter from 'enzyme-adapter-react-16'
import i18n from '../../testSetup/i18nForTest'
import CarList from '../../../pages/profile/CarList'
import 'jest-canvas-mock'

configure({ adapter: new Adapter() })

it('renders without crashing', () => {
  mount(
    <CarList>
      <I18nextProvider i18n={i18n}/>
    </CarList>,
  )
})

it('renders component contents', () => {
  const wrapper = shallow(
    <CarList>
      <I18nextProvider i18n={i18n}/>
    </CarList>,
  )

  expect(wrapper.isEmptyRender())
    .toEqual(false)
})
