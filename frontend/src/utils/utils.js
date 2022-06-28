import apiClient from '../apiClient'

// Haversine formula (shortest distance over the earths surface)
export function distanceCalculation (lat1, lon1, lat2, lon2) {
  const R = 6371e3 // meters

  // φ, λ in radians
  const phi1 = (lat1 * Math.PI) / 180
  const phi2 = (lat2 * Math.PI) / 180
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2)
    + Math.cos(phi1) * Math.cos(phi2)
    * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const d = R * c // in metres

  return Math.floor(d)
}

function getCarRange (carId) {
  const headers = {
    'x-client-id': '5e8c22366f9c5f23ab0eff39',
    'Content-Type': 'application/json',
  }
  const query = `
query car($carId: ID!) { 
  car(id: $carId) {
    id
    batteryUsableKwh
    batteryFullKwh
    range {
      best {
        combined
      }
      worst {
        combined
      }
    }
  }
}`
  const variables = { carId }
  const request = JSON.stringify({ query, variables })
  const resp = apiClient.post('https://api.chargetrip.io/graphql', request, {
    headers,
  })
  return resp.then((httpres) => {
    if (httpres.data) {
      return httpres.data.data.car
    }
    return null
  })
}

function reduceRange (total, cycle) {
  return { best: total.best + cycle.best, worst: total.worst + cycle.worst }
}

export function calcRange (chargingCyle) {
  const local = localStorage.getItem('carConfigData') ?? '{}'
  const configCar = JSON.parse(local)

  if (!configCar.carData || !chargingCyle || chargingCyle.length === 0) {
    return { best: 0, worst: 0 }
  }

  if (!configCar.carData.range) {
    getCarRange(configCar.carData.id)
      .then((resp) => {
        if (resp.range) {
          configCar.carData.range = resp.range
          configCar.carData.batteryUsableKwh = resp.batteryUsableKwh
          localStorage.setItem('carConfigData', JSON.stringify(configCar))
        }
      })
  }

  const { range } = configCar.carData
  const sumRange = chargingCyle.map((cycle) => {
    const { v } = cycle.chargedWork
    const diffLoad = v / configCar.carData.batteryUsableKwh
    const best = range.best.combined * diffLoad
    const worst = range.worst.combined * diffLoad
    return { best, worst }
  })
    .reduce(reduceRange)

  return { best: Math.floor(sumRange.best), worst: Math.floor(sumRange.worst) }
}

const utils = {
  distanceCalculation,
  calcRange,
}

export default utils
