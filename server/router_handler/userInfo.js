const db = require('../db/index')
const getCurrentTime = require("../utils")
const bcrypt = require('bcryptjs')

// 获取用户信息
exports.getUserInfo = (req, res) => {
    const sql = `select userId,userName,phone,role,userImg,state,nickName,introduce,sex,createTime,updateTime from user where userId=?`
    // 注意：req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
    // console.log(req.auth);
    db.query(sql, req.auth.userId, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc("获取用户信息失败！",500)
        res.send({
            status: 200,
            message: '获取用户基本信息成功！',
            data: results[0]
        })
    })
}

// 更新用户信息
exports.updateUserInfo = (req, res) => {
    const userInfo = req.body
    const sql = `update user set nickName=?,phone=?,introduce=?,sex=?,updateTime=? where userId=?`
    db.query(sql, [userInfo.nickName, userInfo.phone, userInfo.introduce?userInfo.introduce:'这个人很懒什么都没有留下~~', userInfo.sex, getCurrentTime, req.auth.userId], (err, results) => {
        if (err) res.cc(err)
        if (results.affectedRows !== 1) return res.cc("更新用户基本信息失败",500)
        res.cc("更新用户基本信息成功", 200)
    })
}

// 重置密码
exports.updatePassWord = (req,res)=>{
    // 判断用户是否存在
    const sql = `select * from user where userId=?`
    db.query(sql,req.auth.userId,(err,results)=>{
        // 查询sql执行错误
        if (err) return res.cc(err)
        if (results.length !== 1) res.cc("用户不存在")
        // 判断用户输入的旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPassWord,results[0].passWord)
        if (!compareResult) return res.cc('原密码错误！',500)
        // 定义重置密码sql语句
        const sql = `update user set passWord=?,updateTime=? where userId=?`
        // 给新密码加密
        const newPassWord = bcrypt.hashSync(req.body.newPassWord,10)
        db.query(sql,[newPassWord,getCurrentTime,req.auth.userId],(resetErr,resetResults)=>{
            // 重置密码sql执行错误
            if (resetErr) return res.cc(resetErr)
            // sql执行成功，但受影响的行数不唯一
            if (resetResults.affectedRows !== 1) return res.cc("修改密码失败！",500)
            res.cc('修改密码成功！',200)
        })
    })
}

// 更新用户头像，见../router/userInfo.js
