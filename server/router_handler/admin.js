const db = require('../db')
const getCurrentTime = require('../utils/index')
const fs = require("fs")
const format = require('../utils/date')




// 首页

// 根据角色获取后台首页展示数据
exports.getData = (req, res) => {
    let isAdmin = req.body.isAdmin
    let isMechant = req.body.isMechant
    if (isAdmin) {
        db.query(`select orderId,totalPrice,status,endTime,createTime from orders where not status=-1`, (err1, result1) => {
            if (err1) res.cc(err1)
            db.query(`select proId,stock,status from product where not status=-1`, (err2, result2) => {
                if (err2) res.cc(err2)
                db.query(`select userId,role,sex,state,createTime from user where not state=-1`, (err3, result3) => {
                    if (err3) res.cc(err3)
                    res.send({
                        status: 200,
                        message: '获取展示数据成功！',
                        data: { users: result3, products: result2, orders: result1 }
                    })
                })
            })
        })
    } else if (isMechant) {
        db.query(`select o.orderId,o.totalPrice,o.status,o.endTime,o.createTime from orders o inner join product p on (o.proId = p.proId) and p.userId = ${req.auth.userId} where not o.status=-1`, (err1, result1) => {
            if (err1) res.cc(err1)
            db.query(`select proId,stock,status from product where userId=${req.auth.userId} and not status=-1`, (err2, result2) => {
                if (err2) res.cc(err2)
                db.query(`select userId,role,sex,state,createTime from user where not state=-1`, (err3, result3) => {
                    if (err3) res.cc(err3)
                    res.send({
                        status: 200,
                        message: '获取展示数据成功！',
                        data: { users: result3, products: result2, orders: result1 }
                    })
                })
            })
        })
    } else {
        res.cc('抱歉您没有权限获取数据')
    }
}

// 根据角色获取/筛选所有商品(带分页功能)
exports.fetchList = (req, res) => {
    // 页码
    const pageNum = req.body.pageNum
    // 每页数据量
    const pageSize = req.body.pageSize || 5
    const start = (pageNum - 1) * pageSize;
    // 筛选关键词
    const keyWord = req.body.keyWord
    // 筛选分类id
    const cateId = req.body.cateId
    // 筛选上架状态
    const status = req.body.status
    // 筛选审核状态
    const isPassed = req.body.isPassed
    let adminSql = `select * from product where not status=-1`
    let totalAdminSql = `select count(proId) as total from product where not status=-1`
    let shoperSql = `select * from product where not status=-1 and userId=${req.auth.userId}`
    let totalShoperSql = `select count(proId) as total from product where userId=${req.auth.userId} and not status=-1`
    // 管理员
    if (req.auth.role === 0) {
        if (keyWord) {
            adminSql += ` and proName like "%${keyWord}%"`
            totalAdminSql += ` and proName like "%${keyWord}%"`
        }
        if (cateId) {
            adminSql += ` and cateId=${cateId}`
            totalAdminSql += ` and cateId=${cateId}`
        }
        if (status != null) {
            adminSql += ` and status=${status}`
            totalAdminSql += ` and status=${status}`
        }

        if (isPassed != null) {
            adminSql += ` and isPassed=${isPassed}`
            totalAdminSql += ` and isPassed=${isPassed}`
        }

        adminSql += ` limit ${start},${pageSize}`
        db.query(adminSql, (err, result) => {
            if (err) res.cc(err)
            // 总数
            db.query(totalAdminSql, (err1, result2) => {
                if (err1) res.cc(err1)
                let total = result2[0].total;
                res.send({
                    status: 200,
                    message: '获取所有商品成功！',
                    total,
                    data: result
                })
            })

        })
        // 商家
    } else if (req.auth.role === 1) {
        if (keyWord) {
            shoperSql += ` and proName like "%${keyWord}%"`
            totalShoperSql += ` and proName like "%${keyWord}%"`
        }
        if (cateId) {
            shoperSql += ` and cateId=${cateId}`
            totalShoperSql += ` and cateId=${cateId}`
        }
        if (status != null) {
            shoperSql += ` and status=${status}`
            totalShoperSql += ` and status=${status}`
        }
        if (isPassed != null) {
            shoperSql += ` and isPassed=${isPassed}`
            totalShoperSql += ` and isPassed=${isPassed}`
        }
        shoperSql += ` limit ${start},${pageSize}`
        db.query(shoperSql, (err, result) => {
            if (err) res.cc(err)
            // 总数
            db.query(totalShoperSql, (err1, result2) => {
                if (err1) res.cc(err1)
                let total = result2[0].total;
                res.send({
                    status: 200,
                    message: '获取我的商品成功！',
                    total,
                    data: result
                })
            })
        })
    } else {
        res.cc('抱歉您没有权限获取数据!')
    }
}


// 下架或重新上架商品
exports.changeProStatus = (req, res) => {
    let promiseArr = []
    let proIds = req.body.proIds
    let status = req.body.status
    proIds.forEach(item => {
        promiseArr.push(new Promise((resolve, reject) => {
            db.query(`update product set status=? where proId=?`, [status, item], (err, results) => {
                if (err || results.affectedRows !== 1) reject(err ? err : new Error('sql执行错误，修改上架状态失败！'));
                resolve()
            })
        }))
    })
    Promise.all(promiseArr).then(() => {
        res.cc('修改上架状态成功！', 200)
    }).catch((err) => {
        res.cc(err ? err : "修改上架状态失败！", 500)
    })
}

// 删除商品
exports.delPro = (req, res) => {
    let promiseArr = []
    if (typeof (req.query.proIds) === 'string') {
        var proIds = [req.query.proIds]
    } else {
        var proIds = [...req.query.proIds]
    }
    proIds.forEach(item => {
        promiseArr.push(new Promise((resolve, reject) => {
            // 查出图片url，删除商品图片
            db.query(`select productImgs from product where proId=?`, item * 1, (err1, results1) => {
                if (err1 || results1.length !== 1) { reject(err1 ? err1 : new Error('sql执行错误，删除商品失败！')) }
                else {
                    let imgArr = results1[0].productImgs.split('@')
                    imgArr.map(img => {
                        img = './public/productImgs/./' + img;
                        fs.unlink(img, (err) => {
                            if (err) {
                                console.log("删除图片失败！")
                                throw err
                            }
                        })
                    })
                    resolve()
                }
            })
        }).then(() => {
            // 然后再改变状态
            db.query(`update product set status=-1 where proId=?`, item * 1, (err, results) => {
                if (err || results.affectedRows !== 1) throw (err ? err : new Error('sql执行错误，删除商品失败！'));
            })
        }))
    })
    Promise.all(promiseArr).then(() => {
        res.cc('删除商品成功！', 200)
    }).catch((err) => {
        res.cc(err ? err : "删除商品失败！", 500)
    })
}

// 修改库存
exports.changeProStock = (req, res) => {
    db.query(`update product set stock=? where proId=?`, [req.body.stock, req.body.proId], (err, result) => {
        if (err) res.cc(err)
        if (result.affectedRows !== 1) res.cc("修改库存失败！", 500)
        res.cc("修改库存成功！", 200)
    })
}



// 修改商品页面

// 根据商品id获取商品信息
exports.getProById = (req, res) => {
    const proId = req.body.proId
    db.query(`select p.cateId,p.proName,p.subTitle,p.detail,p.price,p.stock,c.rootId from product p inner join category c on (p.cateId = c.cateId) where p.proId=?`, proId, (err, result) => {
        if (err) res.cc(err)
        if (result.length !== 1) res.cc("获取商品基本信息失败！", 500)
        res.send({
            status: 200,
            message: '获取商品信息成功！',
            data: result[0]
        })
    })
}

// 修改商品信息
exports.updatePro = (req, res) => {
    const proId = req.body.proId
    const value = req.body.value
    delete value.rootId
    db.query(`update product set ? where proId=${proId}`, value, (err, result) => {
        if (err) res.cc(err)
        if (result.affectedRows !== 1) res.cc("修改商品基本信息失败！", 500)
        res.send({
            status: 200,
            message: '修改商品信息成功！',
            data: result[0]
        })
    })
}




// 商品分类页面

// 根据rootId获取分类信息
exports.getCateByRootId = (req, res) => {
    const rootId = req.body.rootId
    // 页码
    const pageNum = req.body.pageNum
    // 每页数据量
    const pageSize = req.body.pageSize || 5
    const start = (pageNum - 1) * pageSize;
    let sql = `select * from category where rootId=${rootId} and not status=-1 limit ${start},${pageSize}`
    let countSql = `select count(cateId) as total from category where rootId=${rootId} and not status=-1`
    let sumChildSql = `select rootId,cateId from category where not status=-1`
    let sumProSql = `select cateId,proId from product where not status=-1`
    // 根据rootId查分类
    db.query(sql, (err, result) => {
        if (err) {
            res.cc(err)
            throw err
        }
        // 数据总数
        db.query(countSql, (err1, result1) => {
            if (err1) {
                res.cc(err1)
                throw err1
            }
            if (rootId === 0) {
                // 如果是一级分类查子分类个数
                db.query(sumChildSql, (err2, result2) => {
                    if (err2) res.cc(err2)
                    let total = result1[0].total;
                    res.send({
                        status: 200,
                        message: '获取所有分类成功！',
                        total,
                        childList: result2,
                        data: result
                    })
                })
            } else {
                // 如果是二级分类查商品数量
                db.query(sumProSql, (err3, result3) => {
                    if (err3) {
                        res.cc(err3)
                        throw err3
                    }
                    let total = result1[0].total;
                    res.send({
                        status: 200,
                        message: '获取所有分类成功！',
                        total,
                        proList: result3,
                        data: result
                    })
                })
            }

        })

    })
}
// 删除分类
exports.delCate = (req, res) => {
    // 查找其是否有子分类
    db.query(`select * from category where rootId=${req.body.cateId} and not status=-1`, (err, result) => {
        if (err) {
            res.cc(err)
            throw err
        }
        if (result.length) { res.cc("删除失败！请先删除其子分类~", 500) }
        else {
            db.query(`update category set status=-1 where cateId=${req.body.cateId}`, (err1, result1) => {
                if (err1) {
                    res.cc(err1)
                    throw err1
                }
                if (result1.affectedRows !== 1) res.cc("删除分类失败", 500)
                res.cc("删除分类成功！", 200)
            })
        }

    })
}
// 根据id获取分类
exports.getCateByCateId = (req, res) => {
    let cateId = req.body.cateId
    db.query(`select rootId,cateName from category where cateId=${cateId}`, (err, result) => {
        if (err) { res.cc(err) }
        else if (result.length !== 1) { res.cc("获取分类信息失败！", 500) }
        else {
            res.send({
                status: 200,
                message: '获取分类信息成功！',
                data: result[0]
            })
        }
    })
}
// 修改分类
exports.updateCate = (req, res) => {
    let cateInfo = req.body
    const checkSql = `select * from category where cateName=?`
    db.query(checkSql, cateInfo.cateName, (checkErr, checkRes) => {
        // sql语句执行失败
        if (checkErr) return res.cc(checkErr, 300)
        // 分类已存在
        if (checkRes.length > 0) return res.cc("分类已存在，换个名字吧!", 500)
        db.query(`update category set ? where cateId=${cateInfo.cateId}`, cateInfo, (err, result) => {
            if (err) {
                res.cc(err)
                throw err
            }
            if (result.affectedRows !== 1) res.cc("修改分类失败！", 500)
            res.cc("修改分类成功！", 200)
        })
    })
}


// 订单管理页面

// 获取订单
exports.getOrderData = (req, res) => {
    // 页码
    const pageNum = req.body.pageNum
    // 每页数据量
    const pageSize = req.body.pageSize || 5
    const start = (pageNum - 1) * pageSize;
    // 筛选订单编号
    const orderNum = req.body.orderNum
    // 筛选收货人姓名
    const userName = req.body.userName
    // 筛选收货人电话
    const phone = req.body.phone
    // 筛选订单状态
    const status = req.body.status

    let adminSql = `select o.orderId,o.orderNum,o.totalPrice,o.status,o.createTime,u.userName,uu.userName as ownerName from orders o inner join user u on (o.userId = u.userId) inner join user uu on (o.ownerId = uu.userId) inner join address a on (o.addressId = a.addressId) where not o.status=-1`
    let totalAdminSql = `select count(orderId) as total from orders o inner join address a on (o.addressId = a.addressId) where not o.status=-1`
    let shoperSql = `select o.orderId,o.orderNum,o.totalPrice,o.status,o.createTime,u.userName,uu.userName as ownerName from orders o inner join user u on (o.userId = u.userId) inner join user uu on (o.ownerId = uu.userId) inner join product p on (o.proId = p.proId) inner join address a on (o.addressId = a.addressId) where not o.status=-1 and p.userId=${req.auth.userId}`
    let totalShoperSql = `select count(orderId) as total from orders o inner join product p on (o.proId = p.proId) inner join address a on (o.addressId = a.addressId) where not o.status=-1 and p.userId=${req.auth.userId}`
    // 管理员
    if (req.auth.role === 0) {
        if (orderNum) {
            adminSql += ` and o.orderNum=${orderNum}`
            totalAdminSql += ` and o.orderNum=${orderNum}`
        }
        if (userName) {
            adminSql += ` and a.name="${userName}"`
            totalAdminSql += ` and a.name="${userName}"`
        }
        if (phone) {
            adminSql += ` and a.phone="${phone}"`
            totalAdminSql += ` and a.phone="${phone}"`
        }

        if (status != null) {
            adminSql += ` and o.status=${status}`
            totalAdminSql += ` and o.status=${status}`
        }
        if (req.body.createTime) {
            // 筛选提交时间
            const time = format(req.body.createTime)
            adminSql += ` and o.createTime like "%${time}%"`
            totalAdminSql += ` and o.createTime like "%${time}%"`
        }
        adminSql += ` order by o.createTime desc limit ${start},${pageSize}`
        db.query(adminSql, (err, result) => {
            if (err) {
                res.cc(err)
                throw err
            }
            // 总数
            db.query(totalAdminSql, (err1, result2) => {
                if (err1) {
                    res.cc(err1)
                    throw err1
                }
                let total = result2[0].total;
                res.send({
                    status: 200,
                    message: '获取所有订单成功！',
                    total,
                    data: result
                })
            })

        })
        // 商家
    } else if (req.auth.role === 1) {
        if (orderNum) {
            shoperSql += ` and o.orderNum=${orderNum}`
            totalShoperSql += ` and o.orderNum=${orderNum}`
        }
        if (userName) {
            shoperSql += ` and a.name="${userName}"`
            totalShoperSql += ` and a.name="${userName}"`
        }
        if (phone) {
            shoperSql += ` and a.phone="${phone}"`
            totalShoperSql += ` and a.phone="${phone}"`
        }
        if (status != null) {
            shoperSql += ` and o.status=${status}`
            totalShoperSql += ` and o.status=${status}`
        }
        if (req.body.createTime) {
            // 筛选提交时间
            const time = format(req.body.createTime)
            shoperSql += ` and o.createTime like "%${time}%"`
            totalShoperSql += ` and o.createTime like "%${time}%"`
        }
        shoperSql += ` order by o.createTime desc limit ${start},${pageSize}`
        db.query(shoperSql, (err, result) => {
            if (err) {
                res.cc(err)
                throw err
            }
            // 总数
            db.query(totalShoperSql, (err1, result2) => {
                if (err1) {
                    res.cc(err1)
                    throw err1
                }
                let total = result2[0].total;
                res.send({
                    status: 200,
                    message: '获取我的订单成功！',
                    total,
                    data: result
                })
            })
        })
    } else {
        res.cc('抱歉您没有权限获取数据!')
    }
}
// 根据订单id获取订单信息
exports.getOrderById = (req, res) => {
    let sql = `select o.orderId,o.addressId,o.status,o.orderNum,o.quantity,o.totalPrice,o.payTime,o.sendTime,o.endTime,o.closeTime,o.createTime,o.updateTime,p.proId,p.proName,p.subTitle,p.productImgs,p.detail,p.price,p.stock,a.name,a.phone,a.area,a.detailAdd,f.payForm,f.payNum,f.payStatus from orders o inner join product p on (o.proId = p.proId) inner join address a on (o.addressId = a.addressId) inner join payinfo f on (o.orderId = f.orderId) where o.orderId=${req.body.orderId} and not o.status=-1`
    db.query(sql, (err, results) => {
        if (err) return res.cc(err, 500)
        if (results.length < 1) return res.cc('查询结果为空！', 201)
        res.send({
            status: 200,
            message: '获取订单成功！',
            data: results[0]
        })
    })
}



// 商品审核页面

// 获取未审核的商品
exports.getUncheckedPro = (req, res) => {
    // 页码
    const pageNum = req.body.pageNum
    // 每页数据量
    const pageSize = req.body.pageSize || 5
    const start = (pageNum - 1) * pageSize;
    // 筛选关键词
    const keyWord = req.body.keyWord
    // 筛选分类id
    const cateId = req.body.cateId
    // 筛选卖家用户名
    const userName = req.body.userName
    let adminSql = `select p.proId,p.proName,p.subTitle,p.productImgs,p.detail,p.price,p.stock,u.userName,c.cateName from product p inner join user u on (p.userId = u.userId) inner join category c on (p.cateId = c.cateId) where not p.status=-1 and p.isPassed=0`
    let totalAdminSql = `select count(proId) as total from product p inner join user u on (p.userId = u.userId) where not status=-1 and isPassed=0`
    if (keyWord) {
        adminSql += ` and p.proName like "%${keyWord}%"`
        totalAdminSql += ` and p.proName like "%${keyWord}%"`
    }
    if (cateId) {
        adminSql += ` and p.cateId=${cateId}`
        totalAdminSql += ` and p.cateId=${cateId}`
    }
    if (userName) {
        adminSql += ` and u.userName like "%${userName}%"`
        totalAdminSql += ` and u.userName like "%${userName}%"`
    }
    adminSql += ` limit ${start},${pageSize}`
    db.query(adminSql, (err, result) => {
        if (err) res.cc(err)
        // 总数
        db.query(totalAdminSql, (err1, result2) => {
            if (err1) res.cc(err1)
            let total = result2[0].total;
            res.send({
                status: 200,
                message: '获取所有待审核商品成功！',
                total,
                data: result
            })
        })

    })
}
// 审核商品
exports.checkPro = (req, res) => {
    let proIds = req.body.proIds
    let isPassed = req.body.isPassed
    let promiseArr = []
    proIds.forEach(item => {
        promiseArr.push(new Promise((resolve, reject) => {
            db.query(`update product set isPassed=? where proId=${item}`, isPassed, (err, result) => {
                if (err || result.affectedRows !== 1) reject(err ? err : new Error('改变商品状态失败！受影响的商品不唯一~~'));
                resolve()
            })
        }))
    })
    Promise.all(promiseArr).then((result) => {
        res.cc('改变商品审核状态成功！', 200)
    }).catch((err) => {
        res.cc(err)
    });
}



// 分类审核页面

// 获取未审核的分类
exports.getUncheckedCate = (req, res) => {
    // 页码
    const pageNum = req.body.pageNum
    // 每页数据量
    const pageSize = req.body.pageSize || 5
    const start = (pageNum - 1) * pageSize;
    // 筛选分类名称
    const cateName = req.body.cateName
    // 筛选分类级别
    const cateLv = req.body.cateLv
    let adminSql = `select cateId,rootId,cateName,status from category where not status=-1 and isPassed=0`
    let totalAdminSql = `select count(cateId) as total from category where not status=-1 and isPassed=0`
    if (cateName) {
        adminSql += ` and cateName="${cateName}"`
        totalAdminSql += ` and cateName="${cateName}"`
    }
    if (cateLv !== null && cateLv === 0) {
        adminSql += ` and rootId=0`
        totalAdminSql += ` and rootId=0`
    } else if (cateLv !== null && cateLv === 1) {
        adminSql += ` and not rootId=0`
        totalAdminSql += ` and not rootId=0`
    }
    adminSql += ` limit ${start},${pageSize}`
    db.query(adminSql, (err, result) => {
        if (err) res.cc(err)
        // 总数
        db.query(totalAdminSql, (err1, result2) => {
            if (err1) res.cc(err1)
            let total = result2[0].total;
            res.send({
                status: 200,
                message: '获取所有待审核分类成功！',
                total,
                data: result
            })
        })
    })
}
// 审核分类
exports.checkCate = (req, res) => {
    let cateIds = req.body.cateIds
    let isPassed = req.body.isPassed
    let promiseArr = []
    cateIds.forEach(item => {
        promiseArr.push(new Promise((resolve, reject) => {
            db.query(`update category set isPassed=? where cateId=${item}`, isPassed, (err, result) => {
                if (err || result.affectedRows !== 1) reject(err ? err : new Error('改变分类状态失败！受影响的分类不唯一~~'));
                resolve()
            })
        }))
    })
    Promise.all(promiseArr).then((result) => {
        res.cc('改变分类审核状态成功！', 200)
    }).catch((err) => {
        res.cc(err)
    });
}


// 用户权限管理页面

// 获取所有用户
exports.getAllUser = (req, res) => {
    // 页码
    const pageNum = req.body.pageNum
    // 每页数据量
    const pageSize = req.body.pageSize || 5
    const start = (pageNum - 1) * pageSize;
    // 筛选用户名
    const userName = req.body.userName
    // 筛选用户角色
    const role = req.body.role
    // 筛选性别
    const sex = req.body.sex
    // 筛选用户创建时间
    const createTime = req.body.createTime
    // 筛选用户状态
    const state = req.body.state
    let adminSql = `select userId,userName,sex,userImg,role,state,createTime from user where not state=-1`
    let totalAdminSql = `select count(userId) as total from user where not state=-1`
    if (userName) {
        adminSql += ` and userName="${userName}"`
        totalAdminSql += ` and userName="${userName}"`
    }
    if (role !== null) {
        adminSql += ` and role=${role}`
        totalAdminSql += ` and role=${role}`
    }
    if (sex !== null) {
        adminSql += ` and sex=${sex}`
        totalAdminSql += ` and sex=${sex}`
    }
    if (state !== null) {
        adminSql += ` and state=${state}`
        totalAdminSql += ` and state=${state}`
    }
    if (createTime) {
        // 筛选提交时间
        const time = format(createTime)
        adminSql += ` and createTime like "%${time}%"`
        totalAdminSql += ` and createTime like "%${time}%"`
    }
    adminSql += ` limit ${start},${pageSize}`
    db.query(adminSql, (err, result) => {
        if (err) res.cc(err)
        // 总数
        db.query(totalAdminSql, (err1, result2) => {
            if (err1) res.cc(err1)
            let total = result2[0].total;
            res.send({
                status: 200,
                message: '获取所有用户成功！',
                total,
                data: result
            })
        })
    })
}
// 删除用户
exports.delUser = (req, res) => {
    // db.query(`update user set state=-1,updateTime=? where userId=${req.body.userId}`, getCurrentTime, (err, result) => {
    //     if (err) return res.cc(err)
    //     if (result.affectedRows !== 1) return res.cc('删除用户失败！', 500)
    //     res.cc('删除用户成功！', 200)
    // })
    let promiseArr = []
    if (typeof (req.query.userIds) === 'string') {
        var userIds = [req.query.userIds]
    } else {
        var userIds = [...req.query.userIds]
    }
    userIds.forEach(item => {
        promiseArr.push(new Promise((resolve, reject) => {
            // 查出头像url，删除头像
            db.query(`select userImg from user where userId=?`, item * 1, (err1, results1) => {
                if (err1 || results1.length !== 1) { reject(err1 ? err1 : new Error('sql执行错误，获取头像失败！')) }
                else {
                    // 如果存在头像就删除
                    if (results1[0].userImg) {
                        let userImg = results1[0].userImg.replace('http://localhost:8081', './public/.')
                        fs.unlink(userImg, (err) => {
                            if (err) {
                                console.log("删除头像失败！")
                                throw err
                            }
                        })
                    }
                    resolve()
                }
            })
        }).then(() => {
            // 然后再改变状态
            db.query(`update user set state=-1 where userId=?`, item * 1, (err, results) => {
                if (err || results.affectedRows !== 1) throw (err ? err : new Error('sql执行错误，删除用户失败！'));
            })
        }))
    })
    Promise.all(promiseArr).then(() => {
        res.cc('删除用户成功！', 200)
    }).catch((err) => {
        res.cc(err ? err : "删除用户失败！", 500)
    })
}
// 封禁用户
exports.banUser = (req, res) => {
    let userIds = req.body.userIds
    let state = req.body.state
    let promiseArr = []
    userIds.forEach(item => {
        promiseArr.push(new Promise((resolve, reject) => {
            db.query(`update user set state=?,updateTime=? where userId=${item}`, [state, getCurrentTime], (err, result) => {
                if (err || result.affectedRows !== 1) reject(err ? err : new Error(state === 1 ? '封禁用户失败！' : '解封用户失败！'));
                resolve()
            })
        }))
    })
    Promise.all(promiseArr).then((result) => {
        res.cc(state === 1 ? '用户已封禁！' : '用户已解封！', 200)
    }).catch((err) => {
        res.cc(err)
    });
}
// 修改用户权限
exports.changeRole = (req,res) => {
    let userId = req.body.userId
    let role = req.body.role
    db.query(`update user set role=? where userId=${userId}`,role,(err,result)=>{
        if (err) {
            res.cc(err)
        }else if (result.affectedRows !== 1) {
            res.cc("更改用户角色失败！",500)
        }else{
            res.cc("更改用户角色成功！",200)
        }
    })
}