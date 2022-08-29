const expressJoi = require('@escook/express-joi');
const express = require('express');
const router = express.Router()
const addressHandler = require("../router_handler/address")
const { addAddress_schema } = require("../schema/address")

// 增加地址
router.post('/addAddress', expressJoi(addAddress_schema),addressHandler.addAddress)
// 删除地址
router.delete('/deleteAddress', addressHandler.deleteAddress)
// 修改地址
router.post('/updateAddress', addressHandler.updateAddress)
// 获取地址
router.get('/getAddress', addressHandler.getAddress)

module.exports = router