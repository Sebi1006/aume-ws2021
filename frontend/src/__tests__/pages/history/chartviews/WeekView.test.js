import React from 'react'
import { configure, shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import WeekView from '../../../../pages/history/chartviews/WeekView'
import 'jest-canvas-mock'

configure({ adapter: new Adapter() })

it('renders without crashing', () => {
  shallow(<WeekView/>)
})

it('renders component contents', () => {
  const wrapper = shallow(<WeekView/>)

  expect(wrapper.isEmptyRender())
    .toEqual(false)
})

it('accepts props', () => {
  const testData = { labels: [], datasets: [] }
  const wrapper = mount(<WeekView data={testData}/>)

  expect(wrapper.props().data)
    .toEqual(testData)
})
