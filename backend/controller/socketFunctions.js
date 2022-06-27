const data = require('../../data/db.json')

module.exports = {
    subscribe: function (id) {
        console.log('subscribed to ' + id)
        return 'ok'
    },

    unsubscribe: function (id) {
        console.log('unsubscribed from ' + id)
        return 'ok'
    },

    authorizeCharging: function (id) {
        console.log('authorized ' + id)
        return 'ok'
    },

    unauthorizeCharging: function (id) {
        console.log('unauthorized ' + id)
        return 'ok'
    },

    configure: function (id, mode) {
        console.log('changed mode of ' + id + ' to ' + mode)
        return 'ok'
    },

    chargingStatus: function (id, numb) {
        console.log('get chargingStatus of ' + id)
        let response = {}
        response.chargingStatus = data.chargingStatus[numb]
        return response
    }
}
