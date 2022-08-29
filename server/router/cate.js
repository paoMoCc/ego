const express = require('express');
const router = express.Router()
const expressJoi = require("@escook/express-joi")
const cateHandler = require("../router_handler/cate")
const { addCate_schema } = require("../schema/cate")

//添加分类
router.post('/addCate',expressJoi(addCate_schema),cateHandler.addCate)
//获取所有分类
router.get('/getCate',cateHandler.getCate)


module.exports = router