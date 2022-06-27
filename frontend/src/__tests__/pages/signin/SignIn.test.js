import React from 'react'
import { configure, shallow, mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import Adapter from 'enzyme-adapter-react-16'
import i18n from '../../testSetup/i18nForTest'
import SignIn from '../../../pages/signIn/signIn'
import 'jest-canvas-mock'

configure({ adapter: new Adapter() })

it('renders without crashing', () => {
  mount(<SignIn><I18nextProvider i18n={i18n}/></SignIn>)
})

it('renders component contents', () => {
  const wrapper = shallow(<SignIn><I18nextProvider i18n={i18n}/></SignIn>)

  expect(wrapper.isEmptyRender())
    .toEqual(false)
})
