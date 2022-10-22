const db = require("../db")
const getCurrentTime = require('../utils/index')

// 评价订单
exports.eval = (req, res) => {
    const commentInfo = req.body
    // 插入评论
    db.query(`insert into comment set ?`, { proId: commentInfo.proId, userId: req.auth.userId, orderId: commentInfo.orderId, content: commentInfo.content, rate:commentInfo.rate, createTime:getCurrentTime }, (err_2, result_2) => {
        if (err_2) return res.cc(err_2)
        if (result_2.affectedRows !== 1) return res.cc('评价失败！', 500)
        // 修改订单状态为已评价（status=50）
        db.query(`update orders set status=50,updateTime=? where userId=${req.auth.userId} and orderId=${commentInfo.orderId}`, getCurrentTime, (err_3, result_3) => {
            if (err_3) return res.cc(err_3)
            if (result_3.affectedRows !== 1) return res.cc('修改订单状态失败！', 500)
            res.cc('评价成功！', 200)
        })
    })
}
// 删除评价(本人才能删除)
exports.delComment = (req, res) => {
    db.query(`update comment set status=-1 where userId=${req.auth.userId} and commentId=${req.body.commentId}`, (err, result) => {
        if (err) return res.cc(err)
        if (result.affectedRows !== 1) return res.cc('删除评价失败！', 500)
        res.cc("删除评价成功！")
    })
}
// 获取评论（当前商品）
exports.getComment = (req, res) => {
    let promiseArr = []
    // 查评论
    db.query(`select * from comment where proId=${req.body.proId} and status=1 order by createTime desc`, (err_1, result_1) => {
        if (err_1) return res.cc(err_1)
        if (result_1.length < 1) return res.cc('获取评价失败！什么都没有呢~~', 201)
        // 根据userid查出用户信息
        result_1.map((item) => {
            promiseArr.push(new Promise((resolve, reject) => {
                // 查询用户信息
                db.query(`select userName,nickName,userImg from user where userId=${item.userId}`, (err_2, result_2) => {
                    // if (err_2 || result_2.length !== 1) throw err_2 ? err_2 : new Error("查询用户信息失败！")
                    if (err_2 || result_2.length !== 1) reject(err_2)
                    resolve(result_2)
                })
                // return item
            }).then((result_2) => {
                item.userName = result_2[0].userName
                item.nickName = result_2[0].nickName
                item.userImg = result_2[0].userImg
                return item
                // console.log(item);
            }, (err_2) => {
                console.info(err_2 ? err_2 : new Error("查询用户信息失败！"));
            }))
        });
        // 返回包含评论以及用户信息的最终结果
        Promise.all(promiseArr).then(() => {
            res.send({
                status: 200,
                message: '获取评价成功！',
                data: result_1
            })
        })
    })
}

