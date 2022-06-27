const express = require('express')
const router = express.Router()
const restFunctions = require('./controller/restFunctions')

router.get('/charge-cycles', (req, res) => {
    res.send(restFunctions.chargeCycles())
})

router.get('/current-charge-cycle', (req, res) => {
    res.send(restFunctions.currentChargeCycle())
})

router.get('/profile', (req, res) => {
    res.send(restFunctions.profile())
})

module.exports = router
