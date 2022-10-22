const express = require('express');
const router = express.Router()
const expressJoi = require("@escook/express-joi")
const db = require('../db/index')
const multer = require("multer")
const path = require("path")
const productHandler = require("../router_handler/product")
const { searchPro_schema, addPro_schema } = require('../schema/product')

// multer配置
// 存入sql的路径
var fileSqlUrl = `http://localhost:8081/productImgs/`
// 存入sql的图片数组字符串用-分割
var fileArr = []
// 存入sql的图片名称
var fileSqlName = ''
var storage = multer.diskStorage({
    // 设置上传服务器位置
    destination: path.resolve(__dirname, `../public/productImgs`),
    // 设置图片名称
    filename: function (req, file, cb) {
        // 获取图片后缀扩展名(.jpg)
        let extName = file.originalname.slice(file.originalname.lastIndexOf('.'))
        // 获取名称(获取当前时间取名，防止重名)
        let fileName = (Date.now() % 1E5) + '-' + Math.round(Math.random() * 1E9)
        // 拼接图片名称以及后缀名，作为最终存入sql的名称
        fileSqlName = fileName + extName
        // 最终存入sql的字符串（路径+名称）
        fileSqlUrl += fileSqlName
        cb(null, fileName + extName)
        fileArr.push(fileSqlName)
        // http://localhost:8081/public/userAvatars/1658305285596.jpg
        // console.log(fileSqlUrl);
    }
})
var fileFilter = function (req, file, cb) {
    var acceptableMime = ["image/jpeg", "image/png", "image/jpg", "image/gif"]
    if (acceptableMime.indexOf(file.mimetype) !== -1) {
        // 通过上传
        cb(null, true)
    } else {
        // 否则不通过
        cb(null, false)
    }
}
var limits = {
    // 设置文件大小限制
    fileSize: "10MB"
}
const imageUploader = multer({
    fileFilter,
    storage,
    limits
})

// 添加商品
router.post('/addPro', imageUploader.array("productImgs", 5), expressJoi(addPro_schema), (req, res) => {
    // 拼接files名字，以‘@’隔开
    let filesUrl = ''
    for (let index = 0; index < fileArr.length; index++) {
        const element = fileArr[index];
        if (index === fileArr.length - 1) {
            filesUrl += element
        } else {
            filesUrl += element + '@'
        }
    }
    let productInfo = req.body
    const sql = `insert into product set cateId=?,proName=?,price=?,stock=?,subTitle=?,detail=?,productImgs=?,userId=?`
    db.query(sql, [productInfo.cateId, productInfo.proName, productInfo.price, productInfo.stock, productInfo.subTitle, productInfo.detail, filesUrl, req.auth.userId], (err, results) => {
        if (err) { res.cc(err) } 
        else if (results.affectedRows !== 1) { res.cc("添加商品失败！", 500) }
        else { 
            // 清空上一次文件残留信息
            fileArr = []
            fileSqlName = ''
            res.cc('添加商品成功！', 200)
         }
    })
})

// 根据分类cateid获取商品
router.post('/getPro', productHandler.getPro)

// 获取所有商品
router.get('/getAllPro', productHandler.getAllPro)

// 搜索商品
router.post('/searchPro', expressJoi(searchPro_schema), productHandler.searchPro)


module.exports = router

