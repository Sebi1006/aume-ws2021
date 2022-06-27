const data = require('../../data/db.json')

module.exports = {
    chargeCycles: function () {
        return data["charge-cycles"]
    },

    currentChargeCycle: function () {
        return data["current-charge-cycle"]
    },

    profile: function () {
        return data.profile
    }
}
