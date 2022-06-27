/* eslint-disable no-restricted-globals */
let wsBackend
let wsConnectionURL
let isActiveSnyc
let errorMessage = false
let jwt
let chargingPoint

// Modes for WebSocket reconnecting time.
const MODE1 = 5000 // 5 seconds
const MODE2 = 30000 // 30 seconds
const MODE3 = 120000 // 2 minutes

// Error warning for lost connection over WebSocket.
const connectionLostMessage = { status: 'Fehler', message: 'Verbindung zum Server verloren.' }

// Bidirectional channel for communication with the client (react) over the id 'settings-channel'.
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

/**
 * Push notificaton date formatting
 * @param {Date} input: Date
 */
function dateFormat (input) {
  const date = new Date(input)
  let minutes = date.getMinutes()
  minutes = minutes < 10 ? `0${minutes}` : minutes
  return `${date.getHours()}:${minutes} Uhr`
}

/**
 * Message formatter for `CHARGING_COMPLETED` notification.
 * @param {Notification} payload: object
 */
function chargingCompletedMessage (payload) {
  const { v, uom } = payload.chargedWork
  const date = dateFormat(payload.ended)
  return `Es wurde ${v} ${uom} bis ${date} geladen.`
}

/**
 * Triggers push notifications for users.
 * Formatting notifications based on conntent.
 * @param {notification} input: object
 */
async function setNotification (input) {
  try {
    const payload = JSON.parse(input)
    if (payload && payload.chargingStatus) {
      switch (payload.chargingStatus.status) {
        case 'CHARGING':
          self.registration.showNotification('Fahrzeug lädt.', { body: dateFormat(payload.chargingStatus.started) })
          break
        case 'CONNECTED':
          self.registration.showNotification('Fahrzeug angeschlossen.', { body: dateFormat(payload.chargingStatus.lastActivated) })
          break
        case 'FAULTY':
          self.registration.showNotification('Fehler erkannt.', { body: dateFormat(payload.chargingStatus.lastActivated) })
          break
        case 'CHARGING_COMPLETED':
          self.registration.showNotification('Laden beendet.', { body: chargingCompletedMessage(payload.chargingStatus) })
          break
        default:
          console.log(`SW: Unknown Message ${payload}`)
      }
    }
    if (payload && payload.status) {
      self.registration.showNotification(payload.status,
        { body: payload.message })
    }
  } catch (e) {
    console.log(`SW: Invalid message = ${e}`)
  }
}

/**
 * Backend WebSocket connection function.
 * On Error: tries to reconnect in diffrent mode.
 * @param {Recursive counter} connectionCounter: number
 */
async function connectWS (connectionCounter = 0) {
  if (isActiveSnyc === true && jwt) {
    console.log('SW: Websocket Connecting.')

    wsBackend = new WebSocket(`${wsConnectionURL}?access_token=${jwt}`)

    // if (wsBackend.readyState === 1) {
    //   const sendAction = { action: 'subscribe', chargingPoint };
    //   wsBackend.send(sendAction);
    // }
    wsBackend.onopen = () => {
      console.log('Open')
      // const sendAction = { action: 'subscribe', chargingPoint };
      wsBackend.send(`{"action":"subscribe","chargingPoint":"${chargingPoint}"}`)
    }

    // Event listener for WS incoming messages.
    wsBackend.onmessage = (m) => {
      errorMessage = false
      setNotification(m.data)
    }

    // Event listener when WS  is closed. Tries to reconnect if background sync is activated.
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

    // Event listener when erros in SW occurs.
    wsBackend.onerror = () => {
      console.log('SW: WebSocket has a error.')
    }
  } else if (wsBackend) {
    wsBackend.close()
    wsBackend = null
    console.log('SW: Websocket disconnected.')
  }
}

/**
 * This function receives messages sends from the clients and.
 * processes the requests based on the action description in the sent message.
 * @param {Event} event: Event
 */
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

// Receives messages from clients over the `BroadcastChannel`.
clientCom.onmessage = (event) => {
  handleClientCall(event)
}
