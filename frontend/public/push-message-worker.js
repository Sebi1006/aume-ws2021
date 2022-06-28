/* eslint-disable no-restricted-globals */
let wsBackend
let wsConnectionURL
let isActiveSnyc
let errorMessage = false
let jwt
let chargingPoint

// Modes for WebSocket reconnecting time
const MODE1 = 5000 // 5 seconds
const MODE2 = 30000 // 30 seconds
const MODE3 = 120000 // 2 minutes

// Error warning for lost connection over WebSocket
const connectionLostMessage = { status: 'Error', message: 'Lost connection to the server.' }

// Bidirectional channel for communication with the client over the id 'settings-channel'
const clientCom = new BroadcastChannel('settings-channel')

self.addEventListener('install', (event) => {
  console.log('Service worker installing...')
  event.waitUntil(
    caches.open('fl-cache')
      .then((cache) => {
        return cache.addAll([
          'static/logo.jpg',
          'static/tree.png',
          'locales/de/translation.json',
          'locales/en/translation.json',
          'favicon.ico',
          'favicon.png',
          'index.html',
          'manifest.json',
        ])
          .then(() => self.skipWaiting())
      }),
  )
})

self.addEventListener('activate', (event) => {
  console.log('Service worker activating...')
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open('fl-cache')
      .then((cache) => cache.match(event.request, { ignoreSearch: true }))
      .then((response) => {
        return response || fetch(event.request)
      }),
  )
})

function dateFormat (input) {
  const date = new Date(input)
  let minutes = date.getMinutes()
  minutes = minutes < 10 ? `0${minutes}` : minutes
  return `${date.getHours()}:${minutes} o'clock.`
}

function chargingCompletedMessage (payload) {
  const { v, uom } = payload.chargedWork
  const date = dateFormat(payload.ended)
  return `It was loaded ${v} ${uom} until ${date}.`
}

async function setNotification (input) {
  try {
    const payload = JSON.parse(input)
    if (payload && payload.chargingStatus) {
      switch (payload.chargingStatus.status) {
        case 'CHARGING':
          self.registration.showNotification('Vehicle charges.', { body: dateFormat(payload.chargingStatus.started) })
          break
        case 'CONNECTED':
          self.registration.showNotification('Vehicle connected.', { body: dateFormat(payload.chargingStatus.lastActivated) })
          break
        case 'FAULTY':
          self.registration.showNotification('Error detected.', { body: dateFormat(payload.chargingStatus.lastActivated) })
          break
        case 'CHARGING_COMPLETED':
          self.registration.showNotification('Charging finished.', { body: chargingCompletedMessage(payload.chargingStatus) })
          break
        default:
          console.log(`SW: Unknown Message ${payload}.`)
      }
    }
    if (payload && payload.status) {
      self.registration.showNotification(payload.status,
        { body: payload.message })
    }
  } catch (e) {
    console.log(`SW: Invalid message ${e}.`)
  }
}

async function connectWS (connectionCounter = 0) {
  if (isActiveSnyc === true && jwt) {
    console.log('SW: WebSocket connecting.')
    wsBackend = new WebSocket(`${wsConnectionURL}?access_token=${jwt}`)

    wsBackend.onopen = () => {
      console.log('SW: WebSocket is open now.')
      wsBackend.send(`{"action":"subscribe","chargingPoint":"${chargingPoint}"}`)
    }

    wsBackend.onmessage = (m) => {
      errorMessage = false
      setNotification(m.data)
    }

    wsBackend.onclose = () => {
      console.log('SW: WebSocket is closed now.')
      if (isActiveSnyc === true) {
        if (errorMessage === false) {
          setNotification(connectionLostMessage)
          errorMessage = true
        }
        wsBackend = null
        const nextCount = connectionCounter + 1
        if (connectionCounter <= 5) {
          setTimeout(() => connectWS(nextCount), MODE1)
        } else if (connectionCounter <= 10) {
          setTimeout(() => connectWS(nextCount), MODE2)
        } else {
          setTimeout(() => connectWS(11), MODE3)
        }
      }
    }

    wsBackend.onerror = () => {
      console.log('SW: WebSocket has an error.')
    }
  } else if (wsBackend) {
    wsBackend.close()
    wsBackend = null
    console.log('SW: WebSocket disconnected.')
  }
}

async function handleClientCall (event) {
  if (event.data && event.data.action === 'backgroundSync') {
    wsConnectionURL = event.data.url
    isActiveSnyc = event.data.control === 'true'
    connectWS()
  }
  if (event.data && event.data.action === 'getStatus') {
    clientCom.postMessage({ isActiveSnyc })
  }
  if (event.data && event.data.action === 'jwtHeader') {
    jwt = event.data.jwt
    chargingPoint = event.data.chargingPoint
  }
}

// Receives messages from clients
self.addEventListener('message', (event) => {
  handleClientCall(event)
})

// Receives messages from clients over the BroadcastChannel
clientCom.onmessage = (event) => {
  handleClientCall(event)
}
