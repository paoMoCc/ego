const express = require('express');
const router = express.Router()
const adminHandler = require('../router_handler/admin')




// 根据角色获取后台首页展示数据
router.post('/getData', adminHandler.getData)
// 根据角色获取/筛选所有商品(带分页功能)
router.post('/fetchList', adminHandler.fetchList)
// 下架或重新上架我的商品
router.post('/changeProStatus', adminHandler.changeProStatus)
// 删除商品
router.delete('/delPro', adminHandler.delPro)
// 修改库存
router.post('/changeProStock', adminHandler.changeProStock)
// 根据商品id获取商品信息
router.post('/getProById', adminHandler.getProById)
// 修改商品信息
router.post('/updatePro', adminHandler.updatePro)
// 根据rootId获取分类信息
router.post('/getCateByRootId', adminHandler.getCateByRootId)
// 删除分类 delCate
router.delete('/delCate', adminHandler.delCate)
// 修改分类
router.post('/updateCate', adminHandler.updateCate)
// 根据id获取分类
router.post('/getCateByCateId', adminHandler.getCateByCateId)
// 获取订单
router.post('/getOrderData', adminHandler.getOrderData)
// 根据订单id获取订单信息
router.post('/getOrderById', adminHandler.getOrderById)
// 获取未审核的商品
router.post('/getUncheckedPro', adminHandler.getUncheckedPro)
// 审核商品
router.post('/checkPro', adminHandler.checkPro)
// 获取未审核的分类
router.post('/getUncheckedCate', adminHandler.getUncheckedCate)
// 审核分类
router.post('/checkCate', adminHandler.checkCate)
// 获取所有用户
router.post('/getAllUser', adminHandler.getAllUser)
// 删除用户
router.delete('/delUser', adminHandler.delUser)
// 封禁用户
router.post('/banUser', adminHandler.banUser)
// 修改用户权限
router.post('/changeRole', adminHandler.changeRole)


module.exports = router