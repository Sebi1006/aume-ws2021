import React from 'react'
import { configure, shallow, mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import Adapter from 'enzyme-adapter-react-16'
import PowerConsumption from '../../../pages/dashboard/powerConsumption'
import i18n from '../../testSetup/i18nForTest'
import 'jest-canvas-mock'

configure({ adapter: new Adapter() })

it('renders without crashing', () => {
  mount(<PowerConsumption><I18nextProvider i18n={i18n}/></PowerConsumption>)
})

it('renders component contents', () => {
  const wrapper = shallow(<PowerConsumption t={(mock) => mock}/>)

  expect(wrapper.isEmptyRender())
    .toEqual(false)
})
