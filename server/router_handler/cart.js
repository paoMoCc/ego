const db = require("../db/index")

// 添加至购物车
exports.addToCart = (req, res) => {
    let info = req.body
    // 首先获取商品单价
    db.query(`select * from product where proId=${info.proId} and status=1`, (selectErr, selectRes) => {
        if (selectErr) return res.cc(selectErr)
        if (selectRes.length !== 1) return res.cc('获取商品单价失败！')

        const checksql = `select * from cart where userId=? and proId=? and status=1`
        db.query(checksql, [req.auth.userId, info.proId], (checkErr, checkRes) => {
            if (checkErr) return res.cc(checkErr)

            // 如果该商品已经加入购物车,购物车数量增加，并更新价格即可
            if (checkRes.length === 1) {
                // 使购物车数量增加，更新价格
                let updateQuantity = checkRes[0].quantity + (info.quantity ? info.quantity : 1)
                db.query(`update cart set quantity=?,price=? where userId=${req.auth.userId} and proId=${info.proId} and status=1`, [updateQuantity, selectRes[0].price * updateQuantity], (updateErr, updateRes) => {
                    if (updateErr) return res.cc(updateErr)
                    if (updateRes.affectedRows !== 1) return res.cc("添加至购物车失败！", 500)
                    res.cc(`添加至购物车成功！数量+${info.quantity ? info.quantity : 1}`, 200)
                })
                //如果该商品还没有加入购物车
            } else if (!checkRes.length) {
                // 直接加入购物车
                const sql = `insert into cart set userId=?,proId=?,price=?,quantity=?,productImgs=?`
                db.query(sql, [req.auth.userId, info.proId, selectRes[0].price * (info.quantity ? info.quantity : 1), info.quantity ? info.quantity : 1, info.productImgs], (err, results) => {
                    if (err) return res.cc(err)
                    if (results.affectedRows !== 1) return res.cc("添加至购物车失败！", 500)
                    res.cc('添加至购物车成功！', 200)
                })
            } else {
                res.cc("添加至购物车失败！未知错误。", 500)
            }
        })
    })
}
// 移出购物车
exports.removeFromCart = (req, res) => {
    let promiseArr = []
    let carId = req.body.carId
    let carIdArr = req.query.carId
    if (!isNaN(carId*1) || !isNaN(carIdArr*1)) {
        const sql = `update cart set status=-1 where carId=? and userId=?`
        db.query(sql, [carId?carId:carIdArr, req.auth.userId], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('移出购物车失败！', 500)
            res.cc('移出购物车成功！', 200)
        })
    }else if (carIdArr instanceof Array){
        carIdArr.forEach(item => {
            promiseArr.push(new Promise((resolve,reject)=>{
                db.query(`update cart set status=-1 where carId=${item*1} and userId=${req.auth.userId}`,(err,results)=>{
                    if (err || results.affectedRows !== 1) reject(err ? err : new Error('sql执行错误，移出购物车失败！')); 
                    resolve()
                })
            }))
        })
        Promise.all(promiseArr).then(()=>{
            res.cc('移出购物车成功！', 200)
        }).catch((err)=>{
            res.cc(err ? err : "购物车内商品移除失败！", 500)
        })
    }

}
// 修改购物车内商品的数量
exports.changeQuantity = (req, res) => {
    let info = req.body
    // 首先获取商品单价
    db.query(`select * from product where proId=${info.proId} and status=1`, (selectErr, selectRes) => {
        if (selectErr) return res.cc(selectErr)
        if (selectRes.length !== 1) return res.cc('获取商品单价失败！')
        // 修改商品数量，并更新价格
        const sql = `update cart set quantity=?,price=? where userId=? and proId=? and status=1`
        db.query(sql, [info.quantity, selectRes[0].price * info.quantity, req.auth.userId, info.proId], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc("修改商品数量失败！", 500)
            res.cc("修改商品数量成功！", 200)
        })
    })
}
// 获取购物车内商品
exports.getCartPro = (req, res) => {
    let promiseArr = []
    db.query(`select * from cart where userId=? and status=1`, req.auth.userId, (err_1, result_1) => {
        if (err_1) return res.cc(err_1)
        if (result_1.length < 1) return res.cc("购物车是空的哦，快去挑选你喜欢的宝贝吧！",201)
        // 根据proId查出商品信息
        result_1.map((item) => {
            promiseArr.push(new Promise((resolve, reject) => {
                // 查询用户信息
                db.query(`select * from product where proId=${item.proId} and status=1`, (err_2, result_2) => {
                    // if (err_2 || result_2.length !== 1) throw err_2 ? err_2 : new Error("查询用户信息失败！")
                    if (err_2 || result_2.length !== 1) reject(err_2)
                    resolve(result_2)
                })
                // return item
            }).then((result_2) => {
                item.proName = result_2[0].proName
                item.productImgs = result_2[0].productImgs
                item.stock = result_2[0].stock
                item.uniPrice = result_2[0].price

                item.detail = result_2[0].detail

                return item
                // console.log(item);
            }, (err_2) => { 
                console.info(err_2 ? err_2 : new Error("查询商品信息失败！"));
            }))
        });
        // 返回包含购物车以及商品信息的最终结果
        Promise.all(promiseArr).then(()=>{
            res.send({
                status: 200,
                message: '获取购物车内商品成功！',
                data: result_1
            })
        })
    })
}