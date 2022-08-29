const express = require('express');
const router = express.Router()
const adminHandler = require('../router_handler/admin')


// 审核商品
router.post('/checkPro',adminHandler.checkPro)
// 删除用户
router.delete('/delUser',adminHandler.delUser)    
// 封禁用户
router.post('/bandUser',adminHandler.bandUser)
// 获取所有用户
router.get('/getAllUser',adminHandler.getAllUser)


module.exports = router