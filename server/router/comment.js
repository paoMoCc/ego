const express = require('express');
const router = express.Router()
const commentHandler = require('../router_handler/comment')

// 评价订单
router.post('/eval',commentHandler.eval)

// 删除评论(本人才能删除)
router.delete('/delComment',commentHandler.delComment)

// 获取评论（当前商品）
router.get('/getComment',commentHandler.getComment)

module.exports = router