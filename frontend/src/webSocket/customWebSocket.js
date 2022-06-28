class CustomWebSocket extends WebSocket {
  wsSubscribe = (chargingPoint) => {
    if (this.readyState === 1) {
      this.send(`{"action":"subscribe","chargingPoint":"${chargingPoint}"}`)
    } else {
      setTimeout(() => { this.wsSubscribe(chargingPoint) }, 100)
    }
  }

  wsUnsubscribe = (chargingPoint) => {
    if (this.readyState === 1) {
      this.send(`{"action":"unsubscribe","chargingPoint":"${chargingPoint}"}`)
    }
  }

  authorizeCharging = (chargingPoint, control, userId) => {
    if (this.readyState === 1) {
      this.send(`{"action":"authorizeCharging","chargingPoint":"${chargingPoint}", "control":"${control}", "userId":"${userId}"}`)
    }
  }

  unauthorizeCharging = (chargingPoint, control) => {
    if (this.readyState === 1) {
      this.send(`{"action":"unauthorizeCharging","chargingPoint":"${chargingPoint}", "control":"${control}"}`)
    }
  }

  configureAuthorizationMode = (chargingPoint, userID, authorizeMode) => {
    if (this.readyState === 1) {
      this.send(`{"action":"configureAuthorizationMode","chargingPoint":"${chargingPoint}","userID":"${userID}","authorizeMode":${authorizeMode}}`)
    }
  }

  chargingStatus = (chargingPoint) => {
    if (this.readyState === 1) {
      this.send(`{"action":"chargingStatus","chargingPoint":"${chargingPoint}"}`)
    }
  }
}

export default CustomWebSocket
