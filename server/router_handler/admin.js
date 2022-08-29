const db = require('../db')
const getCurrentTime = require('../utils/index')
// 审核商品
exports.checkPro = (req, res) => {
    const proInfo = req.body
    db.query(`update product set status=? where proId=${proInfo.proId}`, proInfo.status, (err, result) => {
        if (err) return res.cc(err)
        if (result.affectedRows !== 1) return res.cc("改变商品状态失败！受影响的商品不唯一~~", 500)
        res.cc("改变商品状态成功！")
    })
}
// 删除用户
exports.delUser = (req, res) => {
    db.query(`update user set state=-1,updateTime=? where userId=${req.body.userId}`, getCurrentTime, (err, result) => {
        if (err) return res.cc(err)
        if (result.affectedRows !== 1) return res.cc('删除用户失败！', 500)
        res.cc('删除用户成功！', 200)
    })
}
// 封禁用户
exports.bandUser = (req, res) => {
    db.query(`update user set state=1,updateTime=? where userId=${req.body.userId}`, getCurrentTime, (err, result) => {
        if (err) return res.cc(err)
        if (result.affectedRows !== 1) return res.cc('封禁用户失败！', 500)
        res.cc('封禁用户成功！', 200)
    })
}
// 获取所有用户
exports.getAllUser = (req, res) => {
    db.query(`select * from user where not userId=${req.auth.userId}`, (err, result) => {
        if (err) return res.cc(err)
        if (result.affectedRows < 1) return res.cc('获取用户失败！还没有用户哦~~', 201)
        new Promise((resolve, reject) => {
            result.map(item => {
                delete item.passWord
                return item
            })
            resolve(result)
        }).then(result => {
            res.send({
                status:200,
                message:'获取所有用户成功！',
                data:result
            })
        })
    })
}