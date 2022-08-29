const express = require('express');
const router = express.Router()
const orderHandler = require('../router_handler/order')

// 取消订单
router.post('/cancelOrder',orderHandler.cancelOrder)
// 获取订单信息 0-已取消-10-未付款，20-已付款（待发货），30-已发货，40-待收货，50-交易成功
router.get('/getOrder',orderHandler.getOrder)
// 发货
router.post('/sendPro',orderHandler.sendPro)
// 收货
router.post('/receivePro',orderHandler.receivePro)


module.exports = router