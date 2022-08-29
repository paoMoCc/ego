const expressJoi = require('@escook/express-joi');
const express = require('express');
const fs = require("fs")
const db = require('../db/index')
const multer = require("multer")
const path = require("path")
const router = express.Router()
const userInfoHandler = require('../router_handler/userInfo')
const { updateUserInfo_schema, updatePassWord_schema } = require('../schema/user')


// multer配置
// 存入sql的路径
var fileSqlUrl = "http://localhost:8081/userAvatars/"
// 存入sql的图片名称
var fileSqlName = ""
var storage = multer.diskStorage({
    // 设置上传服务器位置
    destination: path.resolve(__dirname, "../public/userAvatars"),
    // 设置图片名称
    filename: function (req, file, cb) {
        fileSqlUrl = "http://localhost:8081/userAvatars/"
        // 获取图片后缀扩展名(.jpg)
        let extName = file.originalname.slice(file.originalname.lastIndexOf('.'))
        // 获取名称(获取当前时间取名，防止重名)
        let fileName = Date.now()
        // 拼接图片名称以及后缀名，作为最终存入sql的名称
        fileSqlName = fileName + extName
        // 最终存入sql的字符串（路径+名称）
        fileSqlUrl += fileSqlName
        cb(null, fileName + extName)
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
    //single(文件上传预设name),只允许单个图片
}).single("userImg")


// 获取用户信息
router.get('/userInfo', userInfoHandler.getUserInfo)
// 更新用户信息
router.post('/userInfo', expressJoi(updateUserInfo_schema), userInfoHandler.updateUserInfo)
// 重置密码
router.post('/updatePassWord', expressJoi(updatePassWord_schema), userInfoHandler.updatePassWord)
// 更新用户头像
router.post('/uploadAvatar', imageUploader, (req,res)=>{
    if (!req.file) return res.cc("上传的图片不能为空",400)
    // 删除本地原来的旧头像避免浪费服务器资源
    const checksql = `select userImg from user where userId=?`
    db.query(checksql,req.auth.userId,(checkErr,checkRes)=>{
        if (checkErr) return res.cc(checkErr)
        if (checkRes[0].userImg){
            let url = checkRes[0].userImg.replace('http://localhost:8081','./public/.')
            fs.unlink(url,(err)=>{
                if(err) throw err
                console.log("用户头像已替换！")
            })
        }
    })
    // 将新图片路径存入sql
    const sql = `update user set userImg=? where userId=?`
    db.query(sql,[fileSqlUrl,req.auth.userId],(err,results)=>{
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('更新头像失败！',500)
        // 更新用户头像成功
        return res.send({
            status:200,
            message:'更换头像成功！',
            imgUrl:fileSqlUrl
        })
    })
})

module.exports = router