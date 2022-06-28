import React from 'react'
import { configure, shallow, mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import Adapter from 'enzyme-adapter-react-16'
import i18n from '../../testSetup/i18nForTest'
import UserProfileCar from '../../../pages/profile/userProfileCar'
import 'jest-canvas-mock'

configure({ adapter: new Adapter() })

it('renders without crashing', () => {
  mount(
    <UserProfileCar>
      <I18nextProvider i18n={i18n}/>
    </UserProfileCar>,
  )
})

it('renders component contents', () => {
  const wrapper = shallow(
    <UserProfileCar>
      <I18nextProvider i18n={i18n}/>
    </UserProfileCar>,
  )

  expect(wrapper.isEmptyRender())
    .toEqual(false)
})
