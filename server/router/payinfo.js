const express = require('express');
const router = express.Router()
const payinfoHandler = require('../router_handler/payinfo')

// 支付
router.post('/pay',payinfoHandler.pay)
// 下单时支付失败后重新支付
router.post('/repay',payinfoHandler.repay)
// 获取支付信息
router.get('/getPayinfo',payinfoHandler.getPayinfo)
// 立即购买
router.post('/buyNow',payinfoHandler.buyNow)

module.exports = router
