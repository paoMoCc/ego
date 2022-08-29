const db = require("../db");
const getCurrentTime = require("../utils/index");
const getPayNum = require('../utils/payNum')
const createOrderNum = require('../utils/orderNum')

// 支付
exports.pay = (req, res) => {
    const orderInfo = req.body
    const cartIds = orderInfo.cartIds
    let promiseArr = []
    cartIds.forEach(item => {
        promiseArr.push(new Promise((resolve, reject) => {
            // 获取商品总价格
            db.query(`select price,proId,quantity from cart where userId=${req.auth.userId} and carId=${item}`, (selectErr_1, selectRes_1) => {
                if (selectErr_1 || selectRes_1.length !== 1) return console.info(selectErr_1 ? selectErr_1 : new Error('查询price失败！'));
                let quantity = selectRes_1[0].quantity
                let totalPrice = selectRes_1[0].price
                let proId = selectRes_1[0].proId
                // 查询库存
                db.query(`select stock,price from product where proId=${proId}`, (checkErr, checkRes) => {
                    if (checkErr || checkRes.length !== 1) return console.info(checkErr ? checkErr : new Error('订单数据插入失败！')); 
                    let stock = checkRes[0].stock
                    // 判断是否还有库存
                    if (stock > 0) {
                        // 判断库存量是否能满足订单数量
                        if (stock - quantity >= 0) {
                            // 如果有库存并且能满足订单数量，先改变库存数量
                            db.query(`update product set stock=? where proId=${proId}`, stock - quantity, (udErr, udRes) => {
                                if (udErr || udRes.affectedRows !== 1) return console.info(udErr ? udErr : new Error('库存数量修改失败！')); 
                                // 再循环创建已选商品订单并插入orders
                                db.query(`insert into orders set ?`, { userId: req.auth.userId, carId: item, proId:proId, addressId: orderInfo.addressId, orderNum: createOrderNum(), quantity: quantity, totalPrice: totalPrice, status: orderInfo.payStatus ? 20 : 10, payTime: orderInfo.payStatus ? getCurrentTime : null, createTime: getCurrentTime }, (err_1, results_1) => {
                                    if (err_1 || results_1.affectedRows !== 1) return console.info(err_1 ? err_1 : new Error('订单数据插入失败！')); 
                                    // 获取orderid
                                    db.query(`select orderId from orders where userId=${req.auth.userId} and carId=${item} and not status=0`, (selectErr, selectRes) => {
                                        if (selectErr || selectRes.length !== 1) return console.info(selectErr ? selectErr : new Error('查询orderid失败！')); 
                                        // 创建订单成功后,循环插入支付信息
                                        db.query(`insert into payinfo set ?`, { orderId: selectRes[0].orderId, userId: req.auth.userId, totalPrice: totalPrice, payForm: orderInfo.payForm, payNum: getPayNum(), payStatus: orderInfo.payStatus, createTime: getCurrentTime }, (err_2, results_2) => {
                                            if (err_2 || results_2.affectedRows !== 1) return console.info(err_2 ? err_2 : new Error('支付信息插入失败！'));
                                            // 插入支付信息成功后，将购物车内商品移除
                                            db.query(`update cart set status=-1 where userId=${req.auth.userId} and carId=${item}`, (err_3, results_3) => {
                                                if (err_3 || results_3.affectedRows !== 1) reject(err_3)
                                                resolve(results_1, results_2, results_3)
                                            })
                                        })
                                    })

                                })
                            })
                            // 如果库存满足不了订单数量，提示错误
                        } else {return console.info(new Error('下单失败！库存也是有底线哒~~')); } 
                        // 如果没有库存了提示错误
                    } else {return console.info(new Error('没有库存啦！'));}
                })

            })
        }))
    });
    Promise.all(promiseArr).then((results_1, results_2, results_3) => {
        if (orderInfo.payStatus) res.cc("支付成功！快去查看你的订单吧~~", 200)
        if (!orderInfo.payStatus) res.cc("支付失败！晚点付款也不迟^_^")
    }, (err_3) => {
        res.cc(err_3 ? err_3 : "购物车内商品移除失败！", 500)
    })
}

// 下单时支付失败后重新支付
exports.repay = (req, res) => {
    const orderInfo = req.body
    const orderIds = orderInfo.orderIds
    let promiseArr = []
    orderIds.forEach(item => {
        promiseArr.push(new Promise((resolve, reject) => {
            // 修改支付方式，支付状态
            db.query(`update payinfo set ? where userId=${req.auth.userId} and orderId=${item}`, { payForm: orderInfo.payForm ? orderInfo.payForm : 1, payStatus: orderInfo.payStatus, updateTime: getCurrentTime }, (err_1, results_1) => {
                if (err_1 || results_1.affectedRows !== 1) return console.info(err_1 ? err_1 : new Error('支付信息修改失败！')); 
                //修改订单状态
                db.query(`update orders set ? where userId=${req.auth.userId} and orderId=${item}`, { status: 20, payTime: getCurrentTime, updateTime: getCurrentTime }, (err_2, results_2) => {
                    if (err_2 || results_2.affectedRows !== 1) reject(err_2)
                    resolve()
                })
            })
        }))
    });
    Promise.all(promiseArr).then(() => {
        res.cc("支付成功！快去查看你的订单吧~~", 200)
    }, (err_2) => {
        res.cc(err_2 ? err_2 : "订单信息修改失败！", 500)
    })
}

// 获取支付信息
exports.getPayinfo = (req,res) => {
    const orderIds = req.body.orderIds
    let promiseArr = []
    let payinfoArr = []
    orderIds.forEach(item => {
        promiseArr.push(new Promise((resolve, reject) => {
            db.query(`select * from payinfo where userId=${req.auth.userId} and orderId=${item} and not payStatus=-1`,(err,results)=>{
                if(err || results.length < 1) reject(err)
                payinfoArr.push(results[0])
                resolve()
            })
        }))
    })
    Promise.all(promiseArr).then(()=>{
        res.send({
            status:200,
            message:'获取支付信息成功！',
            data:payinfoArr
        })
    },(err)=>{
        res.cc(err ? err : "获取订单信息失败！", err ? 500 : 201)
    })
}