const express = require('express')
const router = express.Router()
const services = require('./services')

router.get('/gen-code/:userId',services.generateCode)
router.get('/check-code/:userId/:code',services.checkCode)
router.get('/view-codes',services.viewCodes)
router.post('/',services.placeOrder)
router.get('/',services.viewOrders)
router.post('/multi/orders',services.setOrders)
router.post('/multi/codes',services.setDiscCode)

module.exports = router