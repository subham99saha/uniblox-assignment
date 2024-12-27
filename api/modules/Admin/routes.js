const express = require('express')
const router = express.Router()
const services = require('./services')

router.get('/gen-code/:userId',services.generateCode)
router.get('/check-code/:userId/:code',services.checkCode)
router.get('/view-codes',services.viewCodes)
router.get('/',services.viewOrders)
router.post('/',services.placeOrder)

module.exports = router