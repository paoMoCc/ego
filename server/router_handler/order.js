const createOrderNum = require('../utils/orderNum')
const getCurrentTime = require('../utils')
const getPayNum = require('../utils/payNum')
const db = require('../db')

// 取消订单
exports.cancelOrder = (req, res) => {
    const cancelOrderIds = req.body.cancelOrderIds
    let promiseArr = []
    // 循环取消订单orders（status=0），然后将订单内商品重新放回购物车cart（status=1）,最后改变库存量
    cancelOrderIds.forEach(item => {
        promiseArr.push(new Promise((resolve, reject) => {
            // 删除支付信息
            db.query(`update payinfo set payStatus=-1,updateTime=? where userId=${req.auth.userId} and orderId=${item}`, getCurrentTime, (delErr, delRes) => {
                if (delErr || delRes.affectedRows !== 1) return console.log(delErr ? delErr : new Error('删除支付信息失败！'))
                // 取消订单
                db.query(`update orders set ? where userId=${req.auth.userId} and orderId=${item}`, { status: 0, updateTime: getCurrentTime, closeTime: getCurrentTime }, (err_1, results_1) => {
                    if (err_1 || results_1.affectedRows !== 1) return console.log(err_1 ? err_1 : new Error('订单取消失败！')) 
                    // 获取对应的carid
                    db.query(`select carId from orders where userId=${req.auth.userId} and orderId=${item}`, (checkErr, checkRes) => {
                        if (checkErr || checkRes.length !== 1) return console.log(checkErr ? checkErr : new Error('获取对应的carid失败！'))
                        let carId = checkRes[0].carId
                        // 将订单内商品重新放回购物车（status=1）
                        db.query(`update cart set status=1 where userId=${req.auth.userId} and carId=${carId}`, (err_2, results_2) => {
                            if (err_2 || results_2.affectedRows !== 1) return console.log(err_2 ? err_2 : new Error('购物车商品状态更新失败！'))
                            //获取购物车内商品数量和proid
                            db.query(`select quantity,proId from cart where userId=${req.auth.userId} and carId=${carId}`, (err_3, results_3) => {
                                if (err_3 || results_3.length !== 1) return console.log(err_3 ? err_3 : new Error('获取购物车内商品数量和proid失败！')) 
                                let quantity = results_3[0].quantity
                                let proId = results_3[0].proId
                                // 查询库存
                                db.query(`select stock from product where proId=${proId}`, (err_4, results_4) => {
                                    if (err_4 || results_4.length !== 1) return console.log(err_4 ? err_4 : new Error('查询库存失败！'))
                                    let stock = results_4[0].stock
                                    // 修改库存
                                    db.query(`update product set stock=? where proId=${proId}`, stock + quantity, (err_5, results_5) => {
                                        if (err_5 || results_5.affectedRows !== 1) reject(err_5)
                                        resolve(results_3, results_4)
                                    })
                                })
                            })
                        })
                    })
                })
            })

        }))
    });
    Promise.all(promiseArr).then((results_3, results_4) => {
        res.cc("订单取消成功！", 200)
    }, (err_5) => {
        res.cc(err_5 ? err_5 : '库存更新失败！', 500)
    })
}
// 获取订单信息 订单状态:0-已取消-10-未付款，20-已付款（待发货），30-待收货（已发货），40-待评价（已收货）,50-已评价
exports.getOrder = (req, res) => {
    let type = req.body.type
    let sql1 = `select * from orders inner join product on (orders.proId = product.proId) where orders.userId=${req.auth.userId} and orders.status=${type}`
    let sql2 = `select * from orders inner join product on (orders.proId = product.proId) where orders.userId=${req.auth.userId}`
    db.query(type?sql1:sql2, (err, results) => {
        if (err) return res.cc(err, 500)
        if (results.length < 1) return res.cc('查询结果为空！', 201)
        res.send({
            status: 200,
            message: '获取订单成功！',
            data: results
        })
    })
}
// 发货
exports.sendPro = (req,res) =>{
    db.query(`update orders set status=30,sendTime=? where orderId=${req.body.orderId}`, getCurrentTime, (err,results)=>{
        if(err) return res.cc(err)
        if(results.affectedRows!==1) return res.cc("发货失败！",500)
        res.cc('发货成功！',200)
    })
}
// 收货
exports.receivePro = (req,res) =>{
    db.query(`update orders set status=40,endTime=? where userId=${req.auth.userId} and orderId=${req.body.orderId}`, getCurrentTime, (err,results)=>{
        if(err) return res.cc(err)
        if(results.affectedRows!==1) return res.cc("收货失败！",500)
        res.cc('收货成功！',200)
    })
}