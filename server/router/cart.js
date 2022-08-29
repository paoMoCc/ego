const expressJoi = require('@escook/express-joi');
const express = require('express');
const router = express.Router()
const cartHandler = require('../router_handler/cart')
const { addCart_schema, changeQuantity_schema } = require("../schema/cart")

// 添加至购物车
router.post('/addToCart',expressJoi(addCart_schema),cartHandler.addToCart)
// 移出购物车
router.delete('/removeFromCart',cartHandler.removeFromCart)
// 修改购物车内商品的数量
router.post('/changeQuantity',expressJoi(changeQuantity_schema),cartHandler.changeQuantity)
// 获取购物车内商品
router.get('/getCartPro',cartHandler.getCartPro)

module.exports = router