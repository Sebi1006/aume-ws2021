import { calcRange } from '../../utils/utils'
import { CarMock, ChargeCyclesMock, CurrentChargeCyclesMock } from '../testSetup/mockData'
import 'jest-canvas-mock'

beforeAll(() => {
  localStorage.setItem('carConfigData', JSON.stringify(CarMock()))
})

afterAll(() => {
  localStorage.removeItem('carConfigData')
})

it('calc handle by empty cycle', () => {
  const resp = calcRange([])
  expect(resp)
    .toEqual({ best: 0, worst: 0 })
})

it('calc handle by non cycle', () => {
  const resp = calcRange(null)
  expect(resp)
    .toEqual({ best: 0, worst: 0 })
})

it('calc single range', () => {
  const resp = calcRange(CurrentChargeCyclesMock(28))
  expect(resp)
    .toEqual({ best: 195, worst: 145 })
})

it('calc without range', () => {
  const resp = calcRange(CurrentChargeCyclesMock(0))
  expect(resp)
    .toEqual({ best: 0, worst: 0 })
})

it('calc the range', () => {
  const resp = calcRange(ChargeCyclesMock())
  expect(resp)
    .toEqual({ best: 205, worst: 152 })
})

it('calc failed by no car', () => {
  localStorage.removeItem('carConfigData')
  const resp = calcRange(ChargeCyclesMock())
  expect(resp)
    .toEqual({ best: 0, worst: 0 })
})
