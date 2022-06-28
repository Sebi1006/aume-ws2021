import React from 'react'
import { configure, shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import MonthView from '../../../../pages/history/chartViews/monthView'
import 'jest-canvas-mock'

configure({ adapter: new Adapter() })

it('renders without crashing', () => {
  shallow(<MonthView/>)
})

it('renders component contents', () => {
  const wrapper = shallow(<MonthView/>)

  expect(wrapper.isEmptyRender())
    .toEqual(false)
})

it('accepts props', () => {
  const testData = { labels: [], datasets: [] }
  const wrapper = mount(<MonthView data={testData}/>)

  expect(wrapper.props().data)
    .toEqual(testData)
})
