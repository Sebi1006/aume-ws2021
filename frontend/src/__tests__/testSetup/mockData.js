export const ChargeCyclesMock = () => {
  return [
    {
      id: 'f209490a-1838-11eb-adc1-0242ac120002',
      status: 'CHARGING_COMPLETED',
      chargingPoint: 1,
      started: '2020-10-23T08:09:30.056Z',
      ended: '2020-10-23T12:09:30.056Z',
      chargedWork: {
        v: 5.5,
        uom: 'kWh'
      },
      power: {
        v: 0.0,
        uom: 'kW'
      }
    },
    {
      id: 'f209490a-1838-11eb-adc1-0242ac110002',
      status: 'CHARGING_COMPLETED',
      chargingPoint: 1,
      started: '2020-10-22T08:09:30.056Z',
      ended: '2020-10-22T12:09:30.056Z',
      chargedWork: {
        v: 12.5,
        uom: 'kWh'
      },
      power: {
        v: 0.0,
        uom: 'kW'
      }
    },
    {
      id: 'f209490a-1838-11eb-adc1-0242ac100002',
      status: 'CHARGING_COMPLETED',
      chargingPoint: 1,
      started: '2020-10-21T08:09:30.056Z',
      ended: '2020-10-21T16:09:30.056Z',
      chargedWork: {
        v: 11.5,
        uom: 'kWh'
      },
      power: {
        v: 0.0,
        uom: 'kW'
      }
    }
  ]
};

export const CurrentChargeCyclesMock = (v) => {
  return [
    {
      id: 'f209490a-1838-11eb-adc1-0242ac120002',
      status: 'CHARGING_COMPLETED',
      chargingPoint: 1,
      started: '2020-10-23T08:09:30.056Z',
      ended: '2020-10-23T12:09:30.056Z',
      chargedWork: {
        v,
        uom: 'kWh'
      },
      power: {
        v: 0.0,
        uom: 'kW'
      }
    },
  ]
};

export const CarMock = () => {
  return {
    carData:
      {
        id: 'testId',
        batteryUsableKwh: 28,
        batteryFullKwh: 30,
        range:
          {
            best: {
              combined: 195
            },
            worst: {
              combined: 145
            }
          }
      }
  }
};
