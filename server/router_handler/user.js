// 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
const db = require("../db/index")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const getCurrentTime = require("../utils")
// 导入配置文件
const config = require('../config')
// 用户注册
exports.regUser = (req, res) => {
    // 接收表单数据
    const userInfo = req.body
    if (!userInfo.userName || !userInfo.passWord) return res.cc('用户名或密码不能为空！')
    const sql = `select * from user where userName=?`
    db.query(sql, [userInfo.userName], function (err, results) {
        // sql语句执行失败
        if (err) {
            // return res.send({ status: 100, message: err.message })
            return res.cc(err)
        }
        // 用户名被占用
        if (results.length > 0) {
            return res.cc("用户名已被占用，请更换其他用户名！", 500)
        }
        // 如果用户名可用，写入数据库......
        // 对用户的密码,进行 bcrypt 加密，返回值是加密之后的密码字符串
        userInfo.passWord = bcrypt.hashSync(userInfo.passWord, 10)
        // 定义插入用户的sql语句
        const sql = `insert into user set ?`
        db.query(sql, { userName: userInfo.userName, passWord: userInfo.passWord, role: userInfo.role, createTime: getCurrentTime, updateTime: getCurrentTime }, function (err, results) {
            if (err) {
                // return res.send({ status: 100, message: err.message })
                return res.cc(err)
            }
            // SQL 语句执行成功，但影响行数不为 1
            if (results.affectedRows !== 1) {
                // return res.send({status:500,message:'注册用户失败，请稍后再试！'})
                return res.cc('注册用户失败，请稍后再试！', 500)
            }
            // res.send({status:200,message:'注册成功！'})
            res.cc('注册成功！', 200)
        })
    })
}

// 用户登录
exports.login = (req, res) => {
    const userInfo = req.body
    const sql = `select * from user where userName=? and role=?`
    db.query(sql, [userInfo.userName, userInfo.role], function (err, results) {
        // sql语句执行失败
        if (err) res.cc(err)
        else {
            // 如果用户状态正常
            if (results[0].state === 0) {
                // 判断用户输入的密码是否与数据库密码一致
                const compareResult = bcrypt.compareSync(userInfo.passWord, results[0].passWord)
                // 如果对比结果为false，证明用户输入的密码错误
                if (!compareResult) res.cc('登录失败!')
                // 登录成功，生成token
                // 剔除掉不需要的值
                const user = { ...results[0], passWord: undefined }
                // 生成token字符串
                const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
                res.send({
                    status: 200,
                    message: '登陆成功！',
                    // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
                    token: 'Bearer ' + tokenStr
                })
                // 如果用户已被删除
            } else if (results[0].state === -1) {
                res.cc('账户不存在！')
                // 如果用户已被封禁
            } else if (results[0].state === 1) {
                res.cc("登陆失败，您的账户已被封禁！")
            }
        }


    })

}