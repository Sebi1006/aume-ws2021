import React from 'react'
import { configure, shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import YearView from '../../../../pages/history/chartviews/YearView'
import 'jest-canvas-mock'

configure({ adapter: new Adapter() })

it('renders without crashing', () => {
  shallow(<YearView/>)
})

it('renders component contents', () => {
  const wrapper = shallow(<YearView/>)

  expect(wrapper.isEmptyRender())
    .toEqual(false)
})

it('accepts props', () => {
  const testData = { labels: [], datasets: [] }
  const wrapper = mount(<YearView data={testData}/>)

  expect(wrapper.props().data)
    .toEqual(testData)
})
