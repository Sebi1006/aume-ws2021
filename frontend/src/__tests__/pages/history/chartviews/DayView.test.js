import React from 'react'
import { configure, shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import DayView from '../../../../pages/history/chartviews/DayView'
import 'jest-canvas-mock'

configure({ adapter: new Adapter() })

it('renders without crashing', () => {
  shallow(<DayView/>)
})

it('renders component contents', () => {
  const wrapper = shallow(<DayView/>)

  expect(wrapper.isEmptyRender())
    .toEqual(false)
})

it('accepts props', () => {
  const testData = { labels: [], datasets: [] }
  const wrapper = mount(<DayView data={testData}/>)

  expect(wrapper.props().data)
    .toEqual(testData)
})
